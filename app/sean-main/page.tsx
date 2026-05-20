import { ViewTransition } from "react";

import AboutMe from "../components/AboutMe";
import Hero from "../components/hero";
import {
  INTRO_TO_HERO_TRANSITION,
  PORTFOLIO_STAGE_TRANSITION,
} from "../transitionConfig";

export default function HeroPage() {
  return (
    <ViewTransition
      name={PORTFOLIO_STAGE_TRANSITION}
      enter={{
        [INTRO_TO_HERO_TRANSITION]: "portfolio-hero-enter",
        default: "none",
      }}
      default="none"
    >
      <main className="bg-[#05070b] text-white">
        <Hero />
        <AboutMe />
      </main>
    </ViewTransition>
  );
}
