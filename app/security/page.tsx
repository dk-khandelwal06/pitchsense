"use client";

import React from "react";
import {
  ShieldCheck,
  Lock,
  Key,
  EyeOff,
  Server,
  FileCheck,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function SecurityPage() {
  const securityPillars = [
    {
      title: "Zero Credential Architecture (v1)",
      desc: "PitchSense v1 operates without user accounts, authentication tokens, or third-party paid API keys. No passwords, emails, or personal identifiers are stored anywhere.",
      icon: Key,
      status: "Verified",
    },
    {
      title: "Strict Request Schema Validation",
      desc: "All incoming prediction requests pass through rigorous Pydantic schemas. Inputs are bound by physical cricket invariants (e.g., runs 0–400, balls 0–120, wickets 0–10).",
      icon: Server,
      status: "Enforced",
    },
    {
      title: "Sanitized Error Responses",
      desc: "The API never exposes system internals, stack traces, local filesystem paths, or Python environment variables in production error responses.",
      icon: Lock,
      status: "Active",
    },
    {
      title: "Zero Analytics Tracking & No Cookies",
      desc: "No third-party trackers, telemetry beacons, or advertising cookies are embedded. Theme preferences are persisted solely in the user's browser localStorage.",
      icon: EyeOff,
      status: "Compliant",
    },
    {
      title: "Server-Side Model Execution",
      desc: "Model parameters and inference logic execute on the backend. Raw datasets and precomputed lookups are protected behind read-only interfaces.",
      icon: ShieldCheck,
      status: "Protected",
    },
    {
      title: "Secure Dependency Hygiene",
      desc: "All Python and Node.js packages were installed via verified package registries (PyPI, npm). The repository maintains clean .gitignore practices.",
      icon: FileCheck,
      status: "Audited",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header */}
      <div className="pb-4 border-b border-pitch-border">
        <span className="text-xs font-mono uppercase tracking-widest text-pitch-lime font-bold">
          Platform Security & Privacy Notice
        </span>
        <h1 className="text-3xl font-extrabold text-pitch-ivory font-display mt-0.5">
          Security, Privacy & Data Protection
        </h1>
        <p className="text-xs text-pitch-muted">
          Transparent disclosure of our security boundaries, input sanitization rules, and privacy commitments.
        </p>
      </div>

      {/* Security Status Banner */}
      <div className="bg-gradient-to-r from-pitch-secondary via-pitch-card to-pitch-secondary rounded-3xl p-6 sm:p-8 border border-pitch-border shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-pitch-lime">
            <ShieldCheck className="w-4 h-4" />
            <span>Security Review Status</span>
          </div>
          <h2 className="text-2xl font-bold text-pitch-ivory font-display">
            Built Secure by Design
          </h2>
          <p className="text-xs sm:text-sm text-pitch-secondary max-w-2xl leading-relaxed">
            PitchSense was engineered with security-first principles. Because v1 has no user database, no authentication session state, and no third-party API dependencies, attack surfaces are minimized by design.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-pitch-forest border border-pitch-border text-center shrink-0">
          <span className="text-[10px] text-pitch-muted font-mono uppercase block">Security Rating</span>
          <span className="text-2xl font-mono font-black text-pitch-lime block">PASSED</span>
          <span className="text-[10px] text-pitch-secondary block">Zero Secrets Exposed</span>
        </div>
      </div>

      {/* Security Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {securityPillars.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.title}
              className="bg-pitch-secondary/70 rounded-2xl p-6 border border-pitch-border hover:border-pitch-lime/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-pitch-forest text-pitch-lime border border-pitch-border">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono text-pitch-lime bg-pitch-forest px-2 py-0.5 rounded border border-pitch-border">
                    {p.status}
                  </span>
                </div>
                <h3 className="font-bold text-pitch-ivory text-base mb-2">
                  {p.title}
                </h3>
                <p className="text-xs text-pitch-muted leading-relaxed">
                  {p.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Sanitization & Validation Technical Table */}
      <div className="bg-pitch-secondary/70 rounded-3xl p-6 border border-pitch-border space-y-4">
        <h3 className="text-lg font-bold text-pitch-ivory font-display">
          Backend Input Bounds & Validation Invariants
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="border-b border-pitch-border text-pitch-muted uppercase text-[10px]">
              <tr>
                <th className="pb-2">Field</th>
                <th className="pb-2">Type</th>
                <th className="pb-2">Range Limit</th>
                <th className="pb-2">Validation Rule</th>
                <th className="pb-2 text-right">Failure Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pitch-border/30">
              <tr className="hover:bg-pitch-card/40">
                <td className="py-2.5 text-pitch-lime font-bold">runs_needed</td>
                <td className="py-2.5 text-pitch-secondary">Float / Int</td>
                <td className="py-2.5 text-pitch-ivory">0.0 to 400.0</td>
                <td className="py-2.5 text-pitch-muted">ge=0, le=400</td>
                <td className="py-2.5 text-right text-red-400">HTTP 422 Unprocessable</td>
              </tr>
              <tr className="hover:bg-pitch-card/40">
                <td className="py-2.5 text-pitch-lime font-bold">balls_remaining</td>
                <td className="py-2.5 text-pitch-secondary">Integer</td>
                <td className="py-2.5 text-pitch-ivory">0 to 120</td>
                <td className="py-2.5 text-pitch-muted">ge=0, le=120</td>
                <td className="py-2.5 text-right text-red-400">HTTP 422 Unprocessable</td>
              </tr>
              <tr className="hover:bg-pitch-card/40">
                <td className="py-2.5 text-pitch-lime font-bold">wickets_in_hand</td>
                <td className="py-2.5 text-pitch-secondary">Integer</td>
                <td className="py-2.5 text-pitch-ivory">0 to 10</td>
                <td className="py-2.5 text-pitch-muted">ge=0, le=10</td>
                <td className="py-2.5 text-right text-red-400">HTTP 422 Unprocessable</td>
              </tr>
              <tr className="hover:bg-pitch-card/40">
                <td className="py-2.5 text-pitch-lime font-bold">current_run_rate</td>
                <td className="py-2.5 text-pitch-secondary">Float</td>
                <td className="py-2.5 text-pitch-ivory">0.0 to 36.0</td>
                <td className="py-2.5 text-pitch-muted">ge=0.0, le=36.0</td>
                <td className="py-2.5 text-right text-red-400">HTTP 422 Unprocessable</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

