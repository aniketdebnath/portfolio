"use client";
import React, { useRef, ReactNode, ElementType } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
  MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

// Button Props Interface
interface ButtonProps {
  borderRadius?: string;
  children: ReactNode;
  as?: ElementType;
  containerClassName?: string;
  borderClassName?: string;
  duration?: number;
  className?: string;
  [key: string]: unknown; // Fixed: Changed to 'unknown' for safer prop typing
}

// Button Component
export function Button({
  borderRadius = "1.75rem",
  children,
  as: Component = "button",
  containerClassName,
  borderClassName,
  duration,
  className,
  ...otherProps
}: ButtonProps) {
  return (
    <Component
      className={cn(
        "bg-transparent relative text-xl md:col-span-2 p-[1px] overflow-hidden",
        containerClassName
      )}
      style={{
        borderRadius: borderRadius,
      }}
      {...otherProps}>
      <div
        className="absolute inset-0"
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}>
        <MovingBorder duration={duration} rx="30%" ry="30%">
          <div
            className={cn(
              "h-20 w-20 opacity-[0.8] bg-[radial-gradient(var(--sky-500)_40%,transparent_60%)]",
              borderClassName
            )}
          />
        </MovingBorder>
      </div>

      <div
        className={cn(
          "relative bg-slate-900/[0.8] border border-slate-800 backdrop-blur-xl text-white flex items-center justify-center w-full h-full text-sm antialiased",
          className
        )}
        style={{
          borderRadius: `calc(${borderRadius} * 0.96)`,
        }}>
        {children}
      </div>
    </Component>
  );
}

// Moving Border Props Interface
interface MovingBorderProps {
  children: ReactNode;
  duration?: number;
  rx?: string;
  ry?: string;
  [key: string]: unknown; // Fixed: Changed to 'unknown' for safer prop typing
}

// Moving Border Component
export const MovingBorder = ({
  children,
  duration = 2000,
  rx,
  ry,
  ...otherProps
}: MovingBorderProps) => {
  // Type-safe useRef for SVGRectElement
  const pathRef = useRef<SVGRectElement | null>(null);

  // Properly typed MotionValue for progress
  const progress: MotionValue<number> = useMotionValue(0);

  // Animation Frame Logic
  useAnimationFrame((time) => {
    const length = pathRef.current?.getTotalLength();
    if (length) {
      const pxPerMillisecond = length / duration;
      progress.set((time * pxPerMillisecond) % length);
    }
  });

  // Motion Transform Values
  const x = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val)?.x || 0
  );
  const y = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val)?.y || 0
  );

  // Motion Template for Animation
  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <>
      {/* SVG Path for Animation */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full"
        width="100%"
        height="100%"
        {...otherProps}>
        <rect
          fill="none"
          width="100%"
          height="100%"
          rx={rx}
          ry={ry}
          ref={pathRef} // Type-safe useRef
        />
      </svg>

      {/* Animated Motion Div */}
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "inline-block",
          transform,
        }}>
        {children}
      </motion.div>
    </>
  );
};
