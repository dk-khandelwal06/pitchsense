"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface SoundContextType {
  soundEnabled: boolean;
  toggleSound: () => void;
  playBatCrack: () => void;
  playBallWhoosh: () => void;
  playBoundaryFanfare: () => void;
  playWicket: () => void;
  playClick: () => void;
}

const SoundContext = createContext<SoundContextType>({
  soundEnabled: false,
  toggleSound: () => {},
  playBatCrack: () => {},
  playBallWhoosh: () => {},
  playBoundaryFanfare: () => {},
  playWicket: () => {},
  playClick: () => {},
});

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);

  useEffect(() => {
    // Sound is OFF by default as required
    const saved = localStorage.getItem("pitchsense_sound");
    if (saved === "true") {
      setSoundEnabled(true);
    }
  }, []);

  const getOrCreateContext = () => {
    if (!audioCtx) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioCtx(ctx);
      return ctx;
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    return audioCtx;
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    localStorage.setItem("pitchsense_sound", String(next));
    if (next) {
      getOrCreateContext();
    }
  };

  // Bat on ball crisp "CRACK"
  const playBatCrack = () => {
    if (!soundEnabled) return;
    try {
      const ctx = getOrCreateContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Sharp snap transient
      osc.type = "triangle";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.08);

      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1400, ctx.currentTime);
      filter.Q.setValueAtTime(3.0, ctx.currentTime);

      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch {}
  };

  // Ball through the air whoosh
  const playBallWhoosh = () => {
    if (!soundEnabled) return;
    try {
      const ctx = getOrCreateContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch {}
  };

  // Boundary celebration (cheerful stadium double-chime)
  const playBoundaryFanfare = () => {
    if (!soundEnabled) return;
    try {
      const ctx = getOrCreateContext();
      if (!ctx) return;

      const playTone = (freq: number, start: number, dur: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
        gain.gain.setValueAtTime(0.2, ctx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + dur);
      };

      playTone(523.25, 0.0, 0.2); // C5
      playTone(659.25, 0.12, 0.25); // E5
      playTone(783.99, 0.24, 0.4); // G5
    } catch {}
  };

  // Wicket dismissal (deep impact strike + bell chime)
  const playWicket = () => {
    if (!soundEnabled) return;
    try {
      const ctx = getOrCreateContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {}
  };

  // Subtle UI click feedback
  const playClick = () => {
    if (!soundEnabled) return;
    try {
      const ctx = getOrCreateContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {}
  };

  return (
    <SoundContext.Provider
      value={{
        soundEnabled,
        toggleSound,
        playBatCrack,
        playBallWhoosh,
        playBoundaryFanfare,
        playWicket,
        playClick,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  return useContext(SoundContext);
}

