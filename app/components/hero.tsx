"use client";

import type { SVGProps } from "react";
import { motion } from "motion/react";
import LiquidChrome from "./LiquidChrome";
import SplitText from "./SplitText";

function FileTextIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z" />
      <path d="M14 2v5h5" />
      <path d="M9 13h6" />
      <path d="M9 17h6" />
      <path d="M9 9h1" />
    </svg>
  );
}

function MailIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
      <path d="m22 8-10 6L2 8" />
    </svg>
  );
}

export default function Hero() {
  return (
    <section
      id="home"
      className="relative isolate min-h-screen w-full overflow-hidden bg-[#05070b] text-white"
    >
      <motion.div
        initial={{ opacity: 0, scale: 1.12, filter: "blur(24px) saturate(1.35)" }}
        animate={{ opacity: 0.82, scale: 1, filter: "blur(0px) saturate(1)" }}
        transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0"
      >
        <LiquidChrome
          baseColor={[0.1, 0.1, 0.1]}
          speed={0.3}
          amplitude={0.3}
          interactive
        />
      </motion.div>

      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.48 }}
        transition={{ duration: 0.85, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="hero-grain pointer-events-none absolute inset-0"
      />

      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_22%,rgba(255,255,255,0.12),transparent_34%),linear-gradient(90deg,rgba(5,7,11,0.08),rgba(5,7,11,0.04)_48%,rgba(5,7,11,0.02))]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-[linear-gradient(180deg,rgba(5,7,11,0)_0%,rgba(5,7,11,0.72)_64%,#05070b_100%)]"
      />

      <motion.section
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: {
            transition: {
              delayChildren: 0.78,
              staggerChildren: 0.13,
            },
          },
        }}
        className="relative flex min-h-screen items-center justify-center px-8 py-20 sm:px-12 lg:px-24 xl:px-32 2xl:px-40"
      >
        <div className="mx-auto flex w-full max-w-5xl items-center justify-center text-center">
          <div className="flex max-w-5xl flex-col items-center">
            <div className="mt-5 max-w-4xl">
              <h1 className="hero-title text-6xl font-semibold leading-[1.02] text-balance sm:text-7xl lg:text-8xl">
                <SplitText
                  text="Hi! I'm Sean."
                  tag="span"
                  className="hero-reactive-title relative block"
                  delay={150}
                  duration={3}
                  ease="power3.out"
                  splitType="chars"
                  from={{ opacity: 0, y: 40 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.1}
                  rootMargin="-100px"
                  animateOn="load"
                  textAlign="center"
                />
              </h1>
            </div>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 24, filter: "blur(14px)" },
                show: {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  transition: { duration: 0.72, ease: [0.16, 1, 0.3, 1] },
                },
              }}
              className="mt-5 max-w-2xl text-base leading-7 text-white/72 sm:text-lg"
            >
              Developer Focused on Front-End, Mobile & UI/UX Excellence
            </motion.p>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 22, filter: "blur(12px)" },
                show: {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  transition: { duration: 0.66, ease: [0.16, 1, 0.3, 1] },
                },
              }}
              className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <a
                href="#cv"
                className="group inline-flex h-12 min-w-40 items-center justify-center gap-3 rounded-full border border-white/25 bg-white/10 px-6 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-[0_14px_36px_rgba(0,0,0,0.28)] backdrop-blur-xl transition duration-300 hover:border-white/45 hover:bg-white/18 hover:shadow-[0_18px_48px_rgba(255,255,255,0.12)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 hover:scale-105"
              >
                <FileTextIcon className="size-4 shrink-0 transition duration-300" />
                <span>View CV</span>
              </a>
              <a
                href="#contact"
                className="group inline-flex h-12 min-w-40 items-center justify-center gap-3 rounded-full border border-white/20 bg-white/[0.07] px-6 text-sm font-semibold uppercase tracking-[0.18em] text-white/92 shadow-[0_14px_36px_rgba(0,0,0,0.24)] backdrop-blur-xl transition duration-1000 hover:border-white/40 hover:bg-white/14 hover:text-white hover:shadow-[0_18px_48px_rgba(255,255,255,0.1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 hover:scale-105"
              >
                <MailIcon className="size-4 shrink-0 transition duration-300" />
                <span>Contact Me</span>
              </a>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20, filter: "blur(12px)" },
                show: {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  transition: { duration: 0.64, ease: [0.16, 1, 0.3, 1] },
                },
              }}
              className="mt-6 flex flex-wrap justify-center gap-2 text-[10px] font-medium uppercase leading-5 tracking-[0.14em] text-white/58 sm:mt-8 sm:gap-3 sm:text-[12px] sm:tracking-[0.22em]"
            >
              <a
                href="https://github.com/NganuuuMaaannn"
                target="_blank"
                rel="noreferrer"
                aria-label="Open Sean Doinog's GitHub profile"
                className="rounded-full transition duration-300 hover:text-white hover:shadow-[0_18px_48px_rgba(255,255,255,0.1)] focus:outline-none focus-visible:text-white focus-visible:ring-2 focus-visible:ring-white/60"
              >
                GitHub
              </a>
              <span className="text-white/25">/</span>
              <a
                href="https://www.linkedin.com/in/sean-michael-doinog-17a62b3b8"
                target="_blank"
                rel="noreferrer"
                aria-label="Open Sean Doinog's LinkedIn profile"
                className="rounded-full transition duration-300 hover:text-white hover:shadow-[0_18px_48px_rgba(255,255,255,0.1)] focus:outline-none focus-visible:text-white focus-visible:ring-2 focus-visible:ring-white/60"
              >
                LinkedIn
              </a>
              <span className="text-white/25">/</span>
              <a
                href="https://www.facebook.com/seanthesheepzx"
                target="_blank"
                rel="noreferrer"
                aria-label="Open Sean Doinog's Facebook profile"
                className="rounded-full transition duration-300 hover:text-white hover:shadow-[0_18px_48px_rgba(255,255,255,0.1)] focus:outline-none focus-visible:text-white focus-visible:ring-2 focus-visible:ring-white/60"
              >
                Facebook
              </a>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </section>
  );
}
