import { ViewTransition } from "react";

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
      <Hero />
    </ViewTransition>
  );
}
