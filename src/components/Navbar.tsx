"use client";

import React from "react";
import { PhoneCall, Wrench, ShieldCheck, Plus, Sparkles } from "lucide-react";

interface NavbarProps {
  onNewTicket: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNewTicket }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-2 shadow-lg shadow-blue-500/20">
            <Wrench className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-white">
                FixIt<span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Flow</span>
              </span>
              <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-semibold text-blue-400 border border-blue-500/20">
                CALL-E AI
              </span>
            </div>
            <p className="text-[10px] font-medium text-slate-400">Autonomous Telephony Dispatch Engine</p>
          </div>
        </div>

        {/* Center Live Indicator */}
        <div className="hidden md:flex items-center gap-3 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-400">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          <PhoneCall className="h-3.5 w-3.5 text-emerald-400" />
          <span>CALL-E SDK Connected & Ready</span>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onNewTicket}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            <span>New Dispatch Ticket</span>
          </button>
        </div>
      </div>
    </header>
  );
};
