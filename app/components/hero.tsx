"use client";

import Image from "next/image";
import { motion } from "motion/react";

import CardSwap, { Card } from "./CardSwap";
import LiquidChrome from "./LiquidChrome";
import SplitText from "./SplitText";

export default function Hero() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#05070b] text-white">
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
        className="relative flex min-h-screen items-center px-8 py-20 sm:px-12 lg:px-24 xl:px-32 2xl:px-40"
      >
        <div className="mx-auto grid w-full max-w-410 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(560px,0.72fr)] xl:grid-cols-[minmax(0,1fr)_minmax(640px,0.78fr)]">
          <div className="max-w-5xl">

            <div className="mt-5 max-w-4xl">
              <h1 className="hero-title text-6xl font-semibold leading-[1.02] text-balance sm:text-7xl lg:text-8xl">
                <SplitText
                  text="Sean Doinog"
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
                  textAlign="left"
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
              className="mt-7 max-w-2xl text-base leading-7 text-white/72 sm:text-lg"
            >
              Front-End Developer skilled in React Native, React JS, Next.js, TypeScript, and JavaScript, with a passion for modern responsive design,
              smooth user experiences, and continuous learning in tech.
            </motion.p>

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
              className="mt-10 flex flex-wrap gap-3 text-sm font-medium uppercase tracking-[0.22em] text-white/58"
            >
              <span>Frontend</span>
              <span className="text-white/25">/</span>
              <span>Backend</span>
              <span className="text-white/25">/</span>
              <span>Interactive Web</span>
            </motion.div>
          </div>

          <motion.div
            variants={{
              hidden: { opacity: 0, x: 34, scale: 0.96, filter: "blur(18px)" },
              show: {
                opacity: 1,
                x: 0,
                scale: 1,
                filter: "blur(0px)",
                transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
              },
            }}
            className="relative hidden h-160 min-w-0 lg:block"
          >
            <CardSwap
              width={570}
              height={430}
              cardDistance={34}
              verticalDistance={26}
              delay={5000}
              pauseOnHover={false}
              skewAmount={2}
            >
              <Card customClass="overflow-hidden bg-black/42 p-0 text-white shadow-[0_24px_80px_rgba(0,0,0,0.46)] backdrop-blur-xl border-white/18">
                <Image
                  src="/images/bayadbox.png"
                  alt="BayadBox"
                  fill
                  className="object-cover"
                  sizes="670px"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <h3 className="mt-4 text-2xl font-semibold leading-tight text-white">
                    BayadBox
                  </h3>
                </div>
              </Card>
              <Card customClass="overflow-hidden bg-black/42 p-0 text-white shadow-[0_24px_80px_rgba(0,0,0,0.46)] backdrop-blur-xl border-white/18">
                <Image
                  src="/images/think-a-goal.png"
                  alt="Think A Goal"
                  fill
                  className="object-cover"
                  sizes="670px"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <h3 className="mt-4 text-2xl font-semibold leading-tight text-white">
                    Think A Goal
                  </h3>
                </div>
              </Card>
              <Card customClass="overflow-hidden bg-black/42 p-0 text-white shadow-[0_24px_80px_rgba(0,0,0,0.46)] backdrop-blur-xl border-white/18">
                <Image
                  src="/images/love-davao.png"
                  alt="Love Davao"
                  fill
                  className="object-cover"
                  sizes="670px"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <h3 className="mt-4 text-2xl font-semibold leading-tight text-white">
                    Love, Davao!
                  </h3>
                </div>
              </Card>
              <Card customClass="overflow-hidden bg-black/42 p-0 text-white shadow-[0_24px_80px_rgba(0,0,0,0.46)] backdrop-blur-xl border-white/18">
                <Image
                  src="/images/onlinememfee.png"
                  alt="HCDC ITS Online Membership Fee System"
                  fill
                  className="object-cover"
                  sizes="670px"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <h3 className="mt-4 text-2xl font-semibold leading-tight text-white">
                    HCDC ITS Online Membership Fee System
                  </h3>
                </div>
              </Card>
              <Card customClass="overflow-hidden bg-black/42 p-0 text-white shadow-[0_24px_80px_rgba(0,0,0,0.46)] backdrop-blur-xl border-white/18">
                <Image
                  src="/images/hcdc-comelec.png"
                  alt="HCDC Comelec Voting System"
                  fill
                  className="object-cover"
                  sizes="670px"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <h3 className="mt-4 text-2xl font-semibold leading-tight text-white">
                      HCDC Comelec Voting System
                    </h3>
                </div>
              </Card>
              <Card customClass="overflow-hidden bg-black/42 p-0 text-white shadow-[0_24px_80px_rgba(0,0,0,0.46)] backdrop-blur-xl border-white/18">
                <Image
                  src="/images/portfolio.png"
                  alt="My Portfolio"
                  fill
                  className="object-cover"
                  sizes="670px"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <h3 className="mt-4 text-2xl font-semibold leading-tight text-white">
                      My Portfolio
                    </h3>
                </div>
              </Card>
            </CardSwap>
          </motion.div>
        </div>
      </motion.section>
    </main>
  );
}
