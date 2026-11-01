import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { SoundProvider } from "@/components/sound/SoundEngine";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "PitchSense — Ball-by-Ball Win Probability Engine",
  description:
    "What are the real odds, right now? Predict T20 cricket chase probabilities powered by historical IPL data and an explainable scikit-learn Logistic Regression pipeline.",
  keywords: [
    "Cricket Analytics",
    "IPL Win Probability",
    "Machine Learning",
    "scikit-learn",
    "T20 Cricket",
    "Cricsheet Data",
    "Sports Analytics",
  ],
  authors: [{ name: "PitchSense Team" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="theme-stadium" suppressHydrationWarning>
      <body className="bg-pitch-forest text-pitch-ivory antialiased min-h-screen flex flex-col selection:bg-pitch-lime selection:text-pitch-charcoal">
        <ThemeProvider>
          <SoundProvider>
            <Navbar />
            <main className="flex-1 flex flex-col">{children}</main>
            <Footer />
          </SoundProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

