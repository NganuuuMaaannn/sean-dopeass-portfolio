"use client";

import { useEffect, useRef, useState, type CSSProperties, type ElementType } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText as GSAPSplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, GSAPSplitText, useGSAP);

export interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string | ((progress: number) => number);
  splitType?: "chars" | "words" | "lines" | "words, chars";
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  animateOn?: "load" | "scroll";
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  textAlign?: CSSProperties["textAlign"];
  onLetterAnimationComplete?: () => void;
}

export default function SplitText({
  text,
  className = "",
  delay = 50,
  duration = 1.25,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  animateOn = "load",
  tag = "p",
  textAlign = "center",
  onLetterAnimationComplete,
}: SplitTextProps) {
  const ref = useRef<HTMLElement | null>(null);
  const animationCompletedRef = useRef(false);
  const onCompleteRef = useRef(onLetterAnimationComplete);
  const [fontsLoaded, setFontsLoaded] = useState(
    () => typeof document !== "undefined" && document.fonts.status === "loaded",
  );

  useEffect(() => {
    onCompleteRef.current = onLetterAnimationComplete;
  }, [onLetterAnimationComplete]);

  useEffect(() => {
    if (fontsLoaded) {
      return undefined;
    }

    let isMounted = true;

    document.fonts.ready.then(() => {
      if (isMounted) {
        setFontsLoaded(true);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [fontsLoaded]);

  useGSAP(
    () => {
      if (!ref.current || !text || !fontsLoaded || animationCompletedRef.current) {
        return undefined;
      }

      const el = ref.current as HTMLElement & {
        _rbsplitInstance?: GSAPSplitText;
      };

      if (el._rbsplitInstance) {
        el._rbsplitInstance.revert();
        el._rbsplitInstance = undefined;
      }

      const startPct = (1 - threshold) * 100;
      const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
      const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
      const marginUnit = marginMatch ? marginMatch[2] || "px" : "px";
      const sign =
        marginValue === 0
          ? ""
          : marginValue < 0
            ? `-=${Math.abs(marginValue)}${marginUnit}`
            : `+=${marginValue}${marginUnit}`;
      const start = `top ${startPct}%${sign}`;
      let targets: Element[] = [];

      const assignTargets = (self: GSAPSplitText) => {
        if (splitType.includes("chars") && self.chars.length) {
          targets = self.chars;
        }
        if (!targets.length && splitType.includes("words") && self.words.length) {
          targets = self.words;
        }
        if (!targets.length && splitType.includes("lines") && self.lines.length) {
          targets = self.lines;
        }
        if (!targets.length) {
          targets = self.chars || self.words || self.lines;
        }
      };

      const splitInstance = new GSAPSplitText(el, {
        type: splitType,
        smartWrap: true,
        autoSplit: splitType === "lines",
        linesClass: "split-line",
        wordsClass: "split-word",
        charsClass: "split-char",
        reduceWhiteSpace: false,
        onSplit: (self) => {
          assignTargets(self);

          const tweenVars: gsap.TweenVars = {
            ...to,
            duration,
            ease,
            stagger: delay / 1000,
            onComplete: () => {
              animationCompletedRef.current = true;
              onCompleteRef.current?.();
            },
            willChange: "transform, opacity",
            force3D: true,
          };

          if (animateOn === "scroll") {
            tweenVars.scrollTrigger = {
              trigger: el,
              start,
              once: true,
              fastScrollEnd: true,
              anticipatePin: 0.4,
            };
          }

          return gsap.fromTo(targets, { ...from }, tweenVars);
        },
      });

      el._rbsplitInstance = splitInstance;

      return () => {
        ScrollTrigger.getAll().forEach((scrollTrigger) => {
          if (scrollTrigger.trigger === el) {
            scrollTrigger.kill();
          }
        });
        splitInstance.revert();
        el._rbsplitInstance = undefined;
      };
    },
    {
      dependencies: [
        text,
        delay,
        duration,
        ease,
        splitType,
        JSON.stringify(from),
        JSON.stringify(to),
        threshold,
        rootMargin,
        animateOn,
        fontsLoaded,
      ],
      scope: ref,
    },
  );

  const Tag = tag as ElementType;

  return (
    <Tag
      ref={ref}
      style={{
        textAlign,
        wordWrap: "break-word",
        willChange: "transform, opacity",
      }}
      className={`split-parent inline-block overflow-hidden whitespace-normal ${className}`}
    >
      {text}
    </Tag>
  );
}
