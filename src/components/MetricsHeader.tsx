"use client";

import React from "react";
import { Phone, CheckCircle2, Clock, Zap, TrendingUp } from "lucide-react";

interface MetricsHeaderProps {
  totalTickets: number;
  confirmedTickets: number;
  totalCalls: number;
}

export const MetricsHeader: React.FC<MetricsHeaderProps> = ({
  totalTickets,
  confirmedTickets,
  totalCalls,
}) => {
  const autoRate = totalTickets > 0 ? Math.round((confirmedTickets / totalTickets) * 100) : 100;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Metric 1 */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Dispatch Tickets</span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
            <Clock className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-3xl font-black text-white">{totalTickets}</span>
          <span className="flex items-center text-xs font-semibold text-emerald-400">
            <TrendingUp className="mr-1 h-3.5 w-3.5" /> +12% this week
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-500">Managed by AI Engine</p>
      </div>

      {/* Metric 2 */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Confirmed Repairs</span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-3xl font-black text-white">{confirmedTickets}</span>
          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-400">
            {autoRate}% Scheduled
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-500">Contractors locked & scheduled</p>
      </div>

      {/* Metric 3 */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">CALL-E Calls Placed</span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
            <Phone className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-3xl font-black text-white">{totalCalls}</span>
          <span className="text-xs font-medium text-cyan-400">0 Human Phone Calls</span>
        </div>
        <p className="mt-1 text-xs text-slate-500">Natural voice conversations</p>
      </div>

      {/* Metric 4 */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Avg Resolution Speed</span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
            <Zap className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-3xl font-black text-white">4.2 min</span>
          <span className="text-xs font-bold text-indigo-400">vs 45 min manual</span>
        </div>
        <p className="mt-1 text-xs text-slate-500">From ticket to confirmed quote</p>
      </div>
    </div>
  );
};
