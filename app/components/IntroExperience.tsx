"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";

import DecryptedText from "./DecryptedText";
import LiquidEther from "./LiquidEther";

const TITLE = "Sean's Portfolio";
const ETHER_COLORS = ["#5227FF", "#FF9FFC", "#B19EEF"];

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

export default function IntroExperience() {
  const [progress, setProgress] = useState(0);
  const [isTitleResolved, setIsTitleResolved] = useState(false);

  const handleTitleResolved = useCallback(() => {
    setIsTitleResolved(true);
  }, []);

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

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-[#05010f] text-white">
      <div className="absolute inset-0 opacity-95">
        <LiquidEther
          colors={ETHER_COLORS}
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
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_36%),radial-gradient(circle_at_bottom,rgba(82,39,255,0.18),transparent_44%)]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-24 sm:px-10">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center text-center">
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="text-xs font-medium uppercase tracking-[0.42em] text-white/65 sm:text-sm"
          >
            Initialize
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 flex flex-wrap items-end justify-center gap-x-5 gap-y-3"
          >
            <h1 className="text-4xl font-semibold leading-none text-white text-balance sm:text-6xl lg:text-[5.5rem]">
              <DecryptedText
                text={TITLE}
                speed={24}
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
              className="text-base font-medium tabular-nums text-white/78 sm:mb-2 sm:text-2xl"
            >
              [{progress}%]
            </motion.span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
