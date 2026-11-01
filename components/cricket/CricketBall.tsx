"use client";

import React from "react";
import { motion } from "framer-motion";

interface CricketBallProps {
  size?: number;
  className?: string;
  animate?: boolean;
}

export function CricketBall({ size = 48, className = "", animate = true }: CricketBallProps) {
  return (
    <motion.div
      className={`relative rounded-full shadow-lg overflow-hidden flex items-center justify-center select-none ${className}`}
      style={{
        width: size,
        height: size,
        background: "radial-gradient(circle at 35% 35%, #D93838 0%, #A61C1C 60%, #6E0E0E 100%)",
        boxShadow: "0 6px 14px rgba(0, 0, 0, 0.4), inset -2px -2px 6px rgba(0,0,0,0.5), inset 2px 2px 5px rgba(255,255,255,0.3)",
      }}
      animate={animate ? { rotate: 360 } : undefined}
      transition={animate ? { duration: 10, repeat: Infinity, ease: "linear" } : undefined}
    >
      {/* Ball leather sheen */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%)",
        }}
      />

      {/* Main raised seam */}
      <div
        className="absolute w-full h-[3px] bg-[#E8DDD0] opacity-80"
        style={{
          boxShadow: "0 1px 2px rgba(0,0,0,0.6)",
        }}
      />

      {/* Seam stitches detail */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
      >
        <line
          x1="0"
          y1="50"
          x2="100"
          y2="50"
          stroke="#FAF7EE"
          strokeWidth="2.5"
          strokeDasharray="2.5, 2.5"
        />
        {/* Secondary stitch line */}
        <line
          x1="0"
          y1="48"
          x2="100"
          y2="48"
          stroke="#400A0A"
          strokeWidth="0.8"
        />
        <line
          x1="0"
          y1="52"
          x2="100"
          y2="52"
          stroke="#400A0A"
          strokeWidth="0.8"
        />
      </svg>
    </motion.div>
  );
}

