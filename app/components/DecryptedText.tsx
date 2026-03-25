"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, type HTMLMotionProps } from "motion/react";

type RevealDirection = "start" | "end" | "center";
type AnimateOn = "mount" | "view" | "hover" | "inViewHover" | "click";
type ClickMode = "once" | "toggle";

interface DecryptedTextProps
  extends Omit<HTMLMotionProps<"span">, "children" | "className"> {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: RevealDirection;
  useOriginalCharsOnly?: boolean;
  characters?: string;
  className?: string;
  encryptedClassName?: string;
  parentClassName?: string;
  animateOn?: AnimateOn;
  clickMode?: ClickMode;
  onComplete?: () => void;
}

const DEFAULT_CHARACTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+";

function getAvailableCharacters(
  text: string,
  useOriginalCharsOnly: boolean,
  characters: string,
) {
  if (useOriginalCharsOnly) {
    const uniqueCharacters = Array.from(new Set(text.split(""))).filter(
      (character) => !/\s/.test(character),
    );

    if (uniqueCharacters.length > 0) {
      return uniqueCharacters;
    }
  }

  const customCharacters = characters.split("");
  return customCharacters.length > 0
    ? customCharacters
    : DEFAULT_CHARACTERS.split("");
}

function getVisibleIndices(text: string) {
  return text
    .split("")
    .map((character, index) => (!/\s/.test(character) ? index : null))
    .filter((index): index is number => index !== null);
}

function getRevealOrder(text: string, revealDirection: RevealDirection) {
  const visibleIndices = getVisibleIndices(text);

  if (revealDirection === "start") {
    return visibleIndices;
  }

  if (revealDirection === "end") {
    return [...visibleIndices].reverse();
  }

  const order: number[] = [];
  const middle = Math.floor(visibleIndices.length / 2);
  let left = middle - 1;
  let right = middle;

  if (visibleIndices.length % 2 === 1) {
    order.push(visibleIndices[middle]);
    right = middle + 1;
  }

  while (left >= 0 || right < visibleIndices.length) {
    if (right < visibleIndices.length) {
      order.push(visibleIndices[right]);
      right += 1;
    }

    if (left >= 0) {
      order.push(visibleIndices[left]);
      left -= 1;
    }
  }

  return order;
}

function getFullyRevealedSet(text: string) {
  return new Set(getVisibleIndices(text));
}

function removeRandomIndices(indices: Set<number>, count: number) {
  const next = Array.from(indices);

  for (let index = 0; index < count && next.length > 0; index += 1) {
    const randomIndex = Math.floor(Math.random() * next.length);
    next.splice(randomIndex, 1);
  }

  return new Set(next);
}

function scrambleText(text: string, revealedIndices: Set<number>, characters: string[]) {
  return text
    .split("")
    .map((character, index) => {
      if (/\s/.test(character) || revealedIndices.has(index)) {
        return character;
      }

      return characters[Math.floor(Math.random() * characters.length)] ?? character;
    })
    .join("");
}

export default function DecryptedText({
  text,
  speed = 50,
  maxIterations = 10,
  sequential = false,
  revealDirection = "start",
  useOriginalCharsOnly = false,
  characters = DEFAULT_CHARACTERS,
  className = "",
  encryptedClassName = "",
  parentClassName = "",
  animateOn = "hover",
  clickMode = "once",
  onComplete,
  onMouseEnter,
  onMouseLeave,
  onClick,
  ...props
}: DecryptedTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const intervalRef = useRef<number | null>(null);

  const [displayText, setDisplayText] = useState(text);
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(
    getFullyRevealedSet(text),
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isDecrypted, setIsDecrypted] = useState(animateOn !== "click");

  const stopAnimation = useCallback(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setIsAnimating(false);
  }, []);

  const resetToPlainText = useCallback(() => {
    stopAnimation();
    setDisplayText(text);
    setRevealedIndices(getFullyRevealedSet(text));
    setIsDecrypted(true);
  }, [stopAnimation, text]);

  const finishForwardAnimation = useCallback(() => {
    stopAnimation();
    setDisplayText(text);
    setRevealedIndices(getFullyRevealedSet(text));
    setIsDecrypted(true);
    onComplete?.();
  }, [onComplete, stopAnimation, text]);

  const startForwardAnimation = useCallback(() => {
    stopAnimation();

    const revealOrder = getRevealOrder(text, revealDirection);
    const availableCharacters = getAvailableCharacters(
      text,
      useOriginalCharsOnly,
      characters,
    );
    const totalVisibleCharacters = revealOrder.length;

    setHasAnimated(true);
    setIsAnimating(true);
    setIsDecrypted(false);

    if (totalVisibleCharacters === 0) {
      setDisplayText(text);
      setRevealedIndices(new Set());
      finishForwardAnimation();
      return;
    }

    if (sequential) {
      let pointer = 0;
      let nextRevealed = new Set<number>();

      setRevealedIndices(nextRevealed);
      setDisplayText(scrambleText(text, nextRevealed, availableCharacters));

      intervalRef.current = window.setInterval(() => {
        nextRevealed = new Set(nextRevealed);
        nextRevealed.add(revealOrder[pointer]);
        pointer += 1;

        if (pointer >= totalVisibleCharacters) {
          finishForwardAnimation();
          return;
        }

        setRevealedIndices(nextRevealed);
        setDisplayText(scrambleText(text, nextRevealed, availableCharacters));
      }, speed);

      return;
    }

    let currentIteration = 0;
    const emptySet = new Set<number>();

    setRevealedIndices(emptySet);
    setDisplayText(scrambleText(text, emptySet, availableCharacters));

    intervalRef.current = window.setInterval(() => {
      currentIteration += 1;
      setDisplayText(scrambleText(text, emptySet, availableCharacters));

      if (currentIteration >= Math.max(1, maxIterations)) {
        finishForwardAnimation();
      }
    }, speed);
  }, [
    characters,
    finishForwardAnimation,
    maxIterations,
    revealDirection,
    sequential,
    speed,
    stopAnimation,
    text,
    useOriginalCharsOnly,
  ]);

  const startReverseAnimation = useCallback(() => {
    stopAnimation();

    const revealOrder = getRevealOrder(text, revealDirection);
    const availableCharacters = getAvailableCharacters(
      text,
      useOriginalCharsOnly,
      characters,
    );
    const totalVisibleCharacters = revealOrder.length;

    setIsAnimating(true);

    if (totalVisibleCharacters === 0) {
      setDisplayText(text);
      setRevealedIndices(new Set());
      setIsDecrypted(false);
      setIsAnimating(false);
      return;
    }

    if (sequential) {
      const reverseOrder = [...revealOrder].reverse();
      let pointer = 0;
      let nextRevealed = getFullyRevealedSet(text);

      setDisplayText(text);
      setRevealedIndices(nextRevealed);

      intervalRef.current = window.setInterval(() => {
        nextRevealed = new Set(nextRevealed);
        nextRevealed.delete(reverseOrder[pointer]);
        pointer += 1;

        setRevealedIndices(nextRevealed);
        setDisplayText(scrambleText(text, nextRevealed, availableCharacters));

        if (pointer >= totalVisibleCharacters || nextRevealed.size === 0) {
          stopAnimation();
          setRevealedIndices(new Set());
          setDisplayText(scrambleText(text, new Set<number>(), availableCharacters));
          setIsDecrypted(false);
        }
      }, speed);

      return;
    }

    let currentIteration = 0;
    let nextRevealed = getFullyRevealedSet(text);
    const removeCount = Math.max(
      1,
      Math.ceil(totalVisibleCharacters / Math.max(1, maxIterations)),
    );

    setDisplayText(text);
    setRevealedIndices(nextRevealed);

    intervalRef.current = window.setInterval(() => {
      currentIteration += 1;
      nextRevealed = removeRandomIndices(nextRevealed, removeCount);

      setRevealedIndices(nextRevealed);
      setDisplayText(scrambleText(text, nextRevealed, availableCharacters));

      if (nextRevealed.size === 0 || currentIteration >= Math.max(1, maxIterations)) {
        stopAnimation();
        setRevealedIndices(new Set());
        setDisplayText(scrambleText(text, new Set<number>(), availableCharacters));
        setIsDecrypted(false);
      }
    }, speed);
  }, [
    characters,
    maxIterations,
    revealDirection,
    sequential,
    speed,
    stopAnimation,
    text,
    useOriginalCharsOnly,
  ]);

  useEffect(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const availableCharacters = getAvailableCharacters(
      text,
      useOriginalCharsOnly,
      characters,
    );
    const animationFrameId = window.requestAnimationFrame(() => {
      if (animateOn === "click" || animateOn === "mount") {
        const emptySet = new Set<number>();

        setDisplayText(scrambleText(text, emptySet, availableCharacters));
        setRevealedIndices(emptySet);
        setIsDecrypted(false);
      } else {
        setDisplayText(text);
        setRevealedIndices(getFullyRevealedSet(text));
        setIsDecrypted(true);
      }

      setIsAnimating(false);
      setHasAnimated(false);
    });

    return () => {
      window.cancelAnimationFrame(animationFrameId);

      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [animateOn, characters, text, useOriginalCharsOnly]);

  useEffect(() => {
    if (animateOn !== "mount") {
      return undefined;
    }

    const animationFrameId = window.requestAnimationFrame(() => {
      startForwardAnimation();
    });

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [animateOn, startForwardAnimation]);

  const handleViewEnter = useCallback(() => {
    if (!hasAnimated) {
      startForwardAnimation();
    }
  }, [hasAnimated, startForwardAnimation]);

  useEffect(() => {
    if (animateOn !== "view" && animateOn !== "inViewHover") {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (entry?.isIntersecting) {
          handleViewEnter();
        }
      },
      {
        threshold: 0.1,
      },
    );

    const currentElement = containerRef.current;

    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }

      observer.disconnect();
    };
  }, [animateOn, handleViewEnter]);

  return (
    <motion.span
      ref={containerRef}
      className={`inline-block whitespace-pre-wrap ${parentClassName}`}
      onMouseEnter={(event) => {
        onMouseEnter?.(event);

        if (animateOn === "hover" || animateOn === "inViewHover") {
          startForwardAnimation();
        }
      }}
      onMouseLeave={(event) => {
        onMouseLeave?.(event);

        if (animateOn === "hover" || animateOn === "inViewHover") {
          resetToPlainText();
        }
      }}
      onClick={(event) => {
        onClick?.(event);

        if (animateOn !== "click" || isAnimating) {
          return;
        }

        if (clickMode === "once") {
          if (!isDecrypted) {
            startForwardAnimation();
          }

          return;
        }

        if (isDecrypted) {
          startReverseAnimation();
          return;
        }

        startForwardAnimation();
      }}
      {...props}
    >
      <span className="sr-only">{text}</span>

      <span aria-hidden="true">
        {displayText.split("").map((character, index) => {
          const isRevealedCharacter =
            /\s/.test(character) || revealedIndices.has(index) || isDecrypted;

          return (
            <span
              key={`${character}-${index}`}
              className={isRevealedCharacter ? className : encryptedClassName}
            >
              {character}
            </span>
          );
        })}
      </span>
    </motion.span>
  );
}
