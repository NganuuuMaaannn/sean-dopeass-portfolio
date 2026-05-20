"use client";

import gsap from "gsap";
import {
  Children,
  cloneElement,
  createRef,
  forwardRef,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  type HTMLAttributes,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type RefObject,
} from "react";

export interface CardSwapProps {
  width?: number | string;
  height?: number | string;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  onCardClick?: (idx: number) => void;
  skewAmount?: number;
  easing?: "linear" | "elastic";
  children: ReactNode;
}

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  customClass?: string;
}

interface Slot {
  x: number;
  y: number;
  z: number;
  zIndex: number;
}

type CardRef = RefObject<HTMLDivElement | null>;

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ customClass, className = "", ...rest }, ref) => (
    <div
      ref={ref}
      {...rest}
      className={`absolute left-1/2 top-1/2 rounded-lg border border-white bg-black [backface-visibility:hidden] [transform-style:preserve-3d] [will-change:transform] ${customClass ?? ""} ${className}`.trim()}
    />
  ),
);
Card.displayName = "Card";

const makeSlot = (i: number, distX: number, distY: number, total: number): Slot => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i,
});

const placeNow = (el: HTMLElement, slot: Slot, skew: number) => {
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: "center center",
    zIndex: slot.zIndex,
    force3D: true,
  });
};

export default function CardSwap({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  pauseOnHover = false,
  onCardClick,
  skewAmount = 6,
  easing = "elastic",
  children,
}: CardSwapProps) {
  const config = useMemo(
    () =>
      easing === "elastic"
        ? {
            ease: "elastic.out(0.6,0.9)",
            durDrop: 2,
            durMove: 2,
            durReturn: 2,
            promoteOverlap: 0.9,
            returnDelay: 0.05,
          }
        : {
            ease: "power1.inOut",
            durDrop: 0.8,
            durMove: 0.8,
            durReturn: 0.8,
            promoteOverlap: 0.45,
            returnDelay: 0.2,
          },
    [easing],
  );
  const childArr = useMemo(
    () => Children.toArray(children) as ReactElement<CardProps>[],
    [children],
  );
  const refs = useMemo<CardRef[]>(
    () => childArr.map(() => createRef<HTMLDivElement>()),
    [childArr],
  );

  const order = useRef<number[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const intervalRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const total = refs.length;
    order.current = Array.from({ length: total }, (_, i) => i);
    refs.forEach((ref, i) => {
      if (ref.current) {
        placeNow(ref.current, makeSlot(i, cardDistance, verticalDistance, total), skewAmount);
      }
    });

    const swap = () => {
      if (order.current.length < 2) return;

      const [front, ...rest] = order.current;
      const elFront = refs[front]?.current;
      if (!elFront) return;

      timelineRef.current?.kill();
      const timeline = gsap.timeline();
      timelineRef.current = timeline;

      timeline.to(elFront, {
        y: "+=500",
        duration: config.durDrop,
        ease: config.ease,
      });

      timeline.addLabel("promote", `-=${config.durDrop * config.promoteOverlap}`);
      rest.forEach((idx, i) => {
        const el = refs[idx]?.current;
        if (!el) return;

        const slot = makeSlot(i, cardDistance, verticalDistance, total);
        timeline.set(el, { zIndex: slot.zIndex }, "promote");
        timeline.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: config.durMove,
            ease: config.ease,
          },
          `promote+=${i * 0.15}`,
        );
      });

      const backSlot = makeSlot(total - 1, cardDistance, verticalDistance, total);
      timeline.addLabel("return", `promote+=${config.durMove * config.returnDelay}`);
      timeline.call(
        () => {
          gsap.set(elFront, { zIndex: backSlot.zIndex });
        },
        undefined,
        "return",
      );
      timeline.to(
        elFront,
        {
          x: backSlot.x,
          y: backSlot.y,
          z: backSlot.z,
          duration: config.durReturn,
          ease: config.ease,
        },
        "return",
      );

      timeline.call(() => {
        order.current = [...rest, front];
      });
    };

    swap();
    intervalRef.current = window.setInterval(swap, delay);

    if (!pauseOnHover) {
      return () => {
        timelineRef.current?.kill();
        window.clearInterval(intervalRef.current);
      };
    }

    const node = containerRef.current;
    if (!node) {
      return () => {
        timelineRef.current?.kill();
        window.clearInterval(intervalRef.current);
      };
    }

    const pause = () => {
      timelineRef.current?.pause();
      window.clearInterval(intervalRef.current);
    };
    const resume = () => {
      timelineRef.current?.play();
      window.clearInterval(intervalRef.current);
      intervalRef.current = window.setInterval(swap, delay);
    };

    node.addEventListener("mouseenter", pause);
    node.addEventListener("mouseleave", resume);

    return () => {
      node.removeEventListener("mouseenter", pause);
      node.removeEventListener("mouseleave", resume);
      timelineRef.current?.kill();
      window.clearInterval(intervalRef.current);
    };
  }, [cardDistance, config, delay, pauseOnHover, refs, skewAmount, verticalDistance]);

  const rendered = childArr.map((child, i) =>
    isValidElement<CardProps>(child)
      ? cloneElement(child, {
          key: i,
          ref: refs[i],
          style: { width, height, ...(child.props.style ?? {}) },
          onClick: (event: MouseEvent<HTMLDivElement>) => {
            child.props.onClick?.(event);
            onCardClick?.(i);
          },
        } as CardProps & React.RefAttributes<HTMLDivElement>)
      : child,
  );

  return (
    <div
      ref={containerRef}
      className="absolute left-1/2 top-1/2 origin-center -translate-x-1/2 -translate-y-1/2 overflow-visible perspective-[1000px]"
      style={{ width, height }}
    >
      {rendered}
    </div>
  );
}
