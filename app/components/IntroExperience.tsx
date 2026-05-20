"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";

import DecryptedText from "./DecryptedText";
import LiquidEther from "./LiquidEther";
import { INTRO_TO_HERO_TRANSITION } from "../transitionConfig";

const TITLE = "Sean's Portfolio";
const TITLE_DECRYPT_CONFIG = {
  durationMs: 1500,
  speedMsPerCharacter: null as number | null,
};
const INTRO_ETHER_COLORS = ["#FFFFFF", "#FFFFFF", "#FFFFFF"];
const HERO_ROUTE = "/sean-main";
const REDIRECT_DELAY_MS = 1250;

type ProgressPhase =
  | {
      kind: "pause";
      duration: number;
    }
  | {
      kind: "move";
      duration: number;
      from: number;
      to: number;
    };

function randomInt(min: number, max: number) {
  const normalizedMin = Math.ceil(min);
  const normalizedMax = Math.floor(max);
  return Math.floor(Math.random() * (normalizedMax - normalizedMin + 1)) + normalizedMin;
}

function getTitleDecryptSpeed(text: string) {
  if (TITLE_DECRYPT_CONFIG.speedMsPerCharacter !== null) {
    return TITLE_DECRYPT_CONFIG.speedMsPerCharacter;
  }

  const visibleCharacterCount = Math.max(1, text.replace(/\s/g, "").length);
  return Math.max(1, Math.round(TITLE_DECRYPT_CONFIG.durationMs / visibleCharacterCount));
}

function easeInOutCubic(progress: number) {
  if (progress < 0.5) {
    return 4 * progress ** 3;
  }

  return 1 - ((-2 * progress + 2) ** 3) / 2;
}

function buildProgressPhases() {
  const firstStop = randomInt(18, 24);
  const secondStop = randomInt(64, 76);

  return [
    {
      kind: "move",
      duration: randomInt(500, 850),
      from: 0,
      to: firstStop,
    },
    {
      kind: "pause",
      duration: randomInt(450, 900),
    },
    {
      kind: "move",
      duration: randomInt(900, 1400),
      from: firstStop,
      to: secondStop,
    },
    {
      kind: "pause",
      duration: randomInt(1700, 2300),
    },
    {
      kind: "move",
      duration: randomInt(700, 1150),
      from: secondStop,
      to: 100,
    },
  ] satisfies ProgressPhase[];
}

function getProgressDigits(progress: number) {
  return Math.min(100, Math.max(0, progress)).toString().padStart(3, " ").split("");
}

function FlipDigit({ digit }: { digit: string }) {
  const isBlank = digit === " ";

  return (
    <span className="relative inline-flex h-[1.2em] w-[0.68em] items-center justify-center overflow-hidden [perspective:8em]">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={digit}
          initial={{ opacity: 0, rotateX: -90, y: "-32%" }}
          animate={{ opacity: isBlank ? 0 : 1, rotateX: 0, y: "0%" }}
          exit={{ opacity: 0, rotateX: 90, y: "32%" }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 flex items-center justify-center [backface-visibility:hidden]"
        >
          {isBlank ? "0" : digit}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function FlipProgress({ progress }: { progress: number }) {
  const digits = getProgressDigits(progress);

  return (
    <span className="inline-flex items-center gap-[0.06em] -ml-5">
      <span className="sr-only">[{progress}%]</span>
      <span
        aria-hidden="true"
        className="inline-flex items-center px-1.5 py-0.5 [transform-style:preserve-3d]"
      >
        {digits.map((digit, index) => (
          <FlipDigit key={index} digit={digit} />
        ))}
        <span className="ml-[0.06em]">%</span>
      </span>
    </span>
  );
}

export default function IntroExperience() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [isTitleResolved, setIsTitleResolved] = useState(false);
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  const isTransitioning = isIntroComplete;

  const handleTitleResolved = useCallback(() => {
    setIsTitleResolved(true);
  }, []);

  useEffect(() => {
    router.prefetch(HERO_ROUTE);
  }, [router]);

  useEffect(() => {
    if (!isTitleResolved) {
      return undefined;
    }

    const phases = buildProgressPhases();
    let animationFrameId = 0;
    let phaseIndex = 0;
    let phaseStartTime: number | null = null;
    let currentValue = 0;
    let lastValue = -1;

    const updateProgress = (timestamp: number) => {
      const currentPhase = phases[phaseIndex];

      if (!currentPhase) {
        if (lastValue !== 100) {
          lastValue = 100;
          setProgress(100);
        }
        setIsIntroComplete(true);
        return;
      }

      if (phaseStartTime === null) {
        phaseStartTime = timestamp;
      }

      const elapsed = timestamp - phaseStartTime;
      const phaseProgress = Math.min(1, elapsed / currentPhase.duration);

      if (currentPhase.kind === "move") {
        currentValue = Math.round(
          currentPhase.from +
            (currentPhase.to - currentPhase.from) * easeInOutCubic(phaseProgress),
        );
      }

      if (currentValue !== lastValue) {
        lastValue = currentValue;
        setProgress(currentValue);
      }

      if (phaseProgress >= 1) {
        if (currentPhase.kind === "move") {
          currentValue = currentPhase.to;

          if (currentValue !== lastValue) {
            lastValue = currentValue;
            setProgress(currentValue);
          }
        }

        phaseIndex += 1;
        phaseStartTime = null;
      }

      animationFrameId = window.requestAnimationFrame(updateProgress);
    };

    animationFrameId = window.requestAnimationFrame(updateProgress);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [isTitleResolved]);

  useEffect(() => {
    if (!isIntroComplete) {
      return undefined;
    }

    const redirectTimeoutId = window.setTimeout(() => {
      router.replace(HERO_ROUTE, {
        scroll: false,
        transitionTypes: [INTRO_TO_HERO_TRANSITION],
      });
    }, REDIRECT_DELAY_MS);

    return () => {
      window.clearTimeout(redirectTimeoutId);
    };
  }, [isIntroComplete, router]);

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-[#141414] text-white">
      <motion.div
        initial={false}
        animate={
          isTransitioning
            ? { opacity: 0, scale: 1.12, filter: "blur(26px) saturate(1.65)" }
            : { opacity: 0.95, scale: 1, filter: "blur(0px) saturate(1)" }
        }
        transition={
          isTransitioning
            ? { duration: 0.82, delay: 0.34, ease: [0.22, 1, 0.36, 1] }
            : { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
        }
        className="absolute inset-0"
      >
        <LiquidEther
          colors={INTRO_ETHER_COLORS}
          mouseForce={20}
          cursorSize={100}
          isViscous
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={0}
          autoRampDuration={0.2}
        />
      </motion.div>

      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={isTransitioning ? { opacity: 0.18 } : { opacity: 0.5 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        className="hero-grain pointer-events-none absolute inset-0"
      />

      <div className="pointer-events-none absolute inset-0 " />

      <AnimatePresence>
        {isTransitioning ? (
          <>
            <motion.div
              aria-hidden="true"
              initial={{ opacity: 0, scale: 1.08, filter: "blur(34px) saturate(1.5)" }}
              animate={{ opacity: [0, 0.9, 1], scale: [1.08, 1.03, 1] }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.34,
                times: [0, 0.56, 1],
                ease: [0.16, 1, 0.3, 1],
              }}
              className="pointer-events-none absolute inset-0 z-10"
            />
            <motion.div
              aria-hidden="true"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: [0, 1, 0.42], scaleX: [0, 1, 1.15] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.72, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-none absolute left-1/2 top-1/2 z-30 h-px w-[120vw] origin-center -translate-x-1/2 "
            />
            <motion.div
              aria-hidden="true"
              initial={{ x: "-125%", opacity: 0 }}
              animate={{ x: "125%", opacity: [0, 0.9, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.92, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-none absolute inset-y-0 z-20 w-1/2"
            />
          </>
        ) : null}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={
          isTransitioning
            ? {
                opacity: [1, 0.82, 0],
                y: [0, -8, -28],
                scale: [1, 0.98, 0.72],
                rotateX: [0, -24, -82],
                filter: ["blur(0px)", "blur(3px)", "blur(18px)"],
              }
            : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
        }
        transition={
          isTransitioning
            ? { duration: 0.68, times: [0, 0.46, 1], ease: [0.22, 1, 0.36, 1] }
            : { duration: 0.58, ease: [0.22, 1, 0.36, 1] }
        }
        className="relative z-20 flex min-h-screen origin-center items-center justify-center px-6 py-24 [perspective:900px] [transform-style:preserve-3d] sm:px-10"
      >
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center text-center">
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="text-xs font-medium uppercase tracking-[0.42em] text-white/65 sm:text-sm"
          >
            Initializing
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 flex flex-wrap items-end justify-center gap-x-5 gap-y-3"
          >
            <h1 className="text-6xl font-semibold leading-none text-white text-balance">
              <DecryptedText
                text={TITLE}
                speed={getTitleDecryptSpeed(TITLE)}
                sequential
                revealDirection="start"
                animateOn="mount"
                onComplete={handleTitleResolved}
                className="text-white"
                encryptedClassName="text-white/30"
                parentClassName="inline-block tracking-[0.08em] sm:tracking-[0.12em]"
              />
            </h1>

            <motion.span
              initial={false}
              animate={
                isTitleResolved
                  ? { opacity: 1, y: 0, filter: "blur(0px)" }
                  : { opacity: 0, y: 12, filter: "blur(10px)" }
              }
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="text-base font-medium tabular-nums text-white/78 sm:mb-2 sm:text-xl"
            >
              <FlipProgress progress={progress} />
            </motion.span>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
