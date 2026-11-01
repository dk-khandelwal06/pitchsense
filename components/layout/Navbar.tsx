"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CricketBall } from "@/components/cricket/CricketBall";
import { useTheme, Theme } from "@/components/theme/ThemeProvider";
import { useSound } from "@/components/sound/SoundEngine";
import {
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Shield,
  Menu,
  X,
  Sparkles,
} from "lucide-react";

const NAV_LINKS = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Matches", href: "/matches" },
  { name: "Match Center", href: "/match-center" },
  { name: "Probability Lab", href: "/probability-lab" },
  { name: "Model Intelligence", href: "/model-intelligence" },
  { name: "Methodology", href: "/methodology" },
  { name: "Data", href: "/data-sources" },
  { name: "Security", href: "/security" },
  { name: "About", href: "/about" },
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { soundEnabled, toggleSound, playClick } = useSound();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cycleTheme = () => {
    playClick();
    if (theme === "stadium") setTheme("light");
    else if (theme === "light") setTheme("dark");
    else setTheme("stadium");
  };

  const getThemeIcon = () => {
    if (theme === "stadium") {
      return (
        <span className="flex items-center space-x-1 text-pitch-lime" title="Theme: Stadium Mode">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-semibold hidden md:inline">Stadium</span>
        </span>
      );
    }
    if (theme === "light") {
      return (
        <span className="flex items-center space-x-1 text-amber-500" title="Theme: Light Mode">
          <Sun className="w-4 h-4" />
          <span className="text-xs font-semibold hidden md:inline">Light</span>
        </span>
      );
    }
    return (
      <span className="flex items-center space-x-1 text-pitch-secondary" title="Theme: Dark Mode">
        <Moon className="w-4 h-4" />
        <span className="text-xs font-semibold hidden md:inline">Dark</span>
      </span>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-pitch-secondary/90 backdrop-blur-md border-b border-pitch-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            onClick={playClick}
            className="flex items-center space-x-3 group"
          >
            <CricketBall size={32} animate={false} />
            <div className="flex flex-col">
              <span className="font-extrabold text-lg text-pitch-ivory font-display tracking-tight group-hover:text-pitch-lime transition-colors">
                Pitch<span className="text-pitch-lime">Sense</span>
              </span>
              <span className="text-[10px] text-pitch-muted -mt-1 hidden sm:block tracking-wider uppercase font-mono">
                Win Probability Engine
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={playClick}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-pitch-card text-pitch-lime font-bold border border-pitch-border shadow-sm"
                      : "text-pitch-secondary hover:text-pitch-ivory hover:bg-pitch-card/50"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Controls: Sound Toggle & Theme Switcher */}
          <div className="flex items-center space-x-2">
            {/* Sound Toggle */}
            <button
              onClick={() => {
                toggleSound();
                playClick();
              }}
              className={`p-2 rounded-lg border transition-colors flex items-center space-x-1 text-xs ${
                soundEnabled
                  ? "bg-pitch-card border-pitch-lime/60 text-pitch-lime"
                  : "bg-pitch-secondary border-pitch-border text-pitch-muted hover:text-pitch-ivory"
              }`}
              title={soundEnabled ? "Sound Effects Enabled" : "Sound Effects Muted (Click to enable)"}
              aria-label="Toggle Sound Effects"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span className="text-[10px] font-bold hidden sm:inline">SFX</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span className="text-[10px] hidden sm:inline">MUTED</span>
                </>
              )}
            </button>

            {/* Theme Switcher */}
            <button
              onClick={cycleTheme}
              className="p-2 rounded-lg bg-pitch-secondary border border-pitch-border hover:bg-pitch-card transition-colors flex items-center space-x-1"
              aria-label="Switch Theme (Stadium / Light / Dark)"
            >
              {getThemeIcon()}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-pitch-secondary border border-pitch-border text-pitch-secondary hover:text-pitch-ivory"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-pitch-secondary border-b border-pitch-border px-4 pt-2 pb-4 space-y-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => {
                  playClick();
                  setMobileMenuOpen(false);
                }}
                className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive
                    ? "bg-pitch-card text-pitch-lime font-bold border border-pitch-border"
                    : "text-pitch-secondary hover:text-pitch-ivory hover:bg-pitch-card/50"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}

