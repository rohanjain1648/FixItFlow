"use client";

import React, { useState } from "react";
import { Zap, Play, CheckCircle2, Loader2, AlertCircle, Layers } from "lucide-react";

interface BatchDispatchPanelProps {
  openTicketsCount: number;
  onBatchComplete: () => void;
}

export const BatchDispatchPanel: React.FC<BatchDispatchPanelProps> = ({
  openTicketsCount,
  onBatchComplete,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [batchResult, setBatchResult] = useState<any>(null);

  if (openTicketsCount === 0 && !batchResult) return null;

  const handleRunBatch = async () => {
    setIsProcessing(true);
    setBatchResult(null);

    try {
      const res = await fetch("/api/dispatch/batch", {
        method: "POST",
      });
      const data = await res.json();
      setBatchResult(data);
      onBatchComplete();
    } catch (err) {
      console.error("Batch dispatch failed", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-blue-950/40 via-slate-900 to-cyan-950/40 p-6 backdrop-blur-md space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Batch Dispatch Engine</h3>
              <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-xs font-bold text-cyan-400 border border-cyan-500/20">
                Parallel Auto-Calling
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {openTicketsCount} open ticket{openTicketsCount !== 1 ? "s" : ""} waiting for automated CALL-E triage & sourcing
            </p>
          </div>
        </div>

        <button
          onClick={handleRunBatch}
          disabled={isProcessing || openTicketsCount === 0}
          className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
              <span>Processing Batch Calls...</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4 fill-slate-950" />
              <span>Dispatch All {openTicketsCount} Tickets</span>
            </>
          )}
        </button>
      </div>

      {batchResult && (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-4 text-xs space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center justify-between font-bold text-emerald-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> Batch Complete: {batchResult.succeeded} / {batchResult.totalProcessed} Succeeded
            </span>
            <span className="text-slate-400">Parallel Execution Complete</span>
          </div>

          <div className="space-y-1 pt-1 border-t border-emerald-500/20">
            {batchResult.items?.map((item: any) => (
              <div key={item.ticketId} className="flex items-center justify-between text-slate-300">
                <span className="truncate">• {item.title}</span>
                <span className={item.status === "SUCCESS" ? "text-emerald-400 font-bold" : "text-rose-400"}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
