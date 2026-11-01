"use client";

import React from "react";

interface DeliveryBadgeProps {
  event: string;
  runs: number;
  isWicket: boolean;
  size?: "sm" | "md" | "lg";
}

export function DeliveryBadge({ event, runs, isWicket, size = "md" }: DeliveryBadgeProps) {
  let bg = "bg-pitch-forest text-pitch-ivory border-pitch-border";
  let label = String(runs);

  if (isWicket) {
    bg = "bg-red-600 text-white font-bold border-red-400 shadow-md";
    label = "W";
  } else if (runs === 6) {
    bg = "bg-amber-500 text-black font-extrabold border-amber-300 shadow-md";
    label = "6";
  } else if (runs === 4) {
    bg = "bg-pitch-lime text-pitch-charcoal font-bold border-lime-400 shadow-sm";
    label = "4";
  } else if (event === "wide") {
    bg = "bg-blue-600 text-white border-blue-400";
    label = "Wd";
  } else if (event === "noball") {
    bg = "bg-orange-600 text-white border-orange-400";
    label = "Nb";
  } else if (runs === 0) {
    bg = "bg-pitch-secondary text-pitch-muted border-pitch-border";
    label = "•";
  } else {
    bg = "bg-pitch-stadium text-pitch-charcoal font-semibold border-pitch-mint";
    label = String(runs);
  }

  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-base font-bold",
  }[size];

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full border transition-transform hover:scale-110 select-none ${sizeClasses} ${bg}`}
    >
      {label}
    </div>
  );
}

