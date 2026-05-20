"use client";

import Image from "next/image";
import { motion } from "motion/react";

const ABOUT_IMAGE_SRC = "/images/sean-pic.jpg";

export default function AboutMe() {
  return (
    <section
      id="about"
      className="relative isolate flex min-h-screen items-center overflow-hidden bg-[#05070b] px-6 py-20 text-white sm:px-10 lg:px-24 xl:px-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_24%,rgba(255,255,255,0.11),transparent_30%),radial-gradient(circle_at_84%_72%,rgba(255,255,255,0.08),transparent_30%)]" />
      <div className="hero-grain pointer-events-none absolute inset-0 opacity-35" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[linear-gradient(180deg,#05070b_0%,rgba(5,7,11,0.78)_42%,rgba(5,7,11,0)_100%)]"
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <motion.figure
          initial={{ opacity: 0, x: -34, scale: 0.96, filter: "blur(18px)" }}
          whileInView={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.82, ease: [0.16, 1, 0.3, 1] }}
          className="group relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[2rem] border border-white/14 bg-white/[0.06] shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:max-w-md lg:mx-0 lg:max-w-none"
        >
          <Image
            src={ABOUT_IMAGE_SRC}
            alt="Portrait of Sean Doinog"
            fill
            loading="eager"
            sizes="(max-width: 1024px) 90vw, 42vw"
            className="object-cover opacity-90 grayscale-[18%] contrast-110 transition duration-1000 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,11,0.02),rgba(5,7,11,0.42)),radial-gradient(circle_at_50%_18%,transparent_24%,rgba(5,7,11,0.4)_100%)]" />
          <figcaption className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/14 bg-black/35 px-5 py-4 backdrop-blur-xl">
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-300">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
                <span className="relative inline-flex size-2.5 rounded-full bg-emerald-300" />
              </span>
              <span>Online</span>
            </p>
          </figcaption>
        </motion.figure>

        <motion.div
          initial={{ opacity: 0, x: 34, filter: "blur(18px)" }}
          whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.32 }}
          transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl text-center lg:text-left"
        >
          <p className="text-xs font-medium uppercase tracking-[0.32em] text-white/45">
            About Me
          </p>
          <h2 className="mt-4 text-4xl font-semibold leading-tight text-balance text-white sm:text-5xl lg:text-6xl">
            I build modern interfaces with a creative edge.
          </h2>

          <div className="mt-6 space-y-5 text-base leading-8 text-white/70 sm:text-lg">
            <p>
              Hi! I&apos;m Sean, a 23-year-old front-end developer who enjoys
              creating responsive, smooth, and visually polished user experiences.
            </p>
            <p>
              My main focus is front-end and mobile development, but I also
              understand basic back-end concepts. I&apos;ve worked with React
              Native, React JS, Next.js, TypeScript, and JavaScript.
            </p>
            <p>
              I also bring photo and video editing skills into my work, which
              helps me add a more creative touch to the products I build.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
