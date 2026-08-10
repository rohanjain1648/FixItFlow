"use client";

import React, { useState } from "react";
import { TicketData } from "./TicketCard";
import { X, PhoneCall, CheckCircle2, User, Building2, Calendar, FileText, Sparkles, Volume2, ShieldCheck, Play } from "lucide-react";

interface TicketDetailModalProps {
  ticket: TicketData | null;
  onClose: () => void;
  onDispatch: (ticketId: string) => void;
}

export const TicketDetailModal: React.FC<TicketDetailModalProps> = ({ ticket, onClose, onDispatch }) => {
  const [activeTab, setActiveTab] = useState<"transcripts" | "details">("transcripts");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);

  if (!ticket) return null;

  const handleDispatch = async () => {
    setIsDispatching(true);
    await onDispatch(ticket.id);
    setIsDispatching(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl shadow-blue-500/10">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/50 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <PhoneCall className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">{ticket.title}</h2>
                <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-bold text-blue-400 border border-blue-500/20">
                  {ticket.category}
                </span>
              </div>
              <p className="text-xs text-slate-400">{ticket.property.title} • {ticket.tenant.name}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/30 px-6">
          <button
            onClick={() => setActiveTab("transcripts")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
              activeTab === "transcripts"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>CALL-E Call Logs & Transcripts ({ticket.callLogs?.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveTab("details")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
              activeTab === "details"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>Ticket Overview</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === "transcripts" ? (
            <div className="space-y-6">
              {/* Call Audio Simulator Banner */}
              <div className="flex items-center justify-between rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-cyan-950/30 via-slate-900 to-blue-950/30 p-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500 text-slate-950 shadow-md hover:scale-105 active:scale-95 transition-all"
                  >
                    <Play className="h-5 w-5 fill-slate-950" />
                  </button>
                  <div>
                    <h4 className="text-sm font-bold text-white">Listen to AI Voice Recording</h4>
                    <p className="text-xs text-slate-400">CALL-E Natural Voice Agent Synthesis</p>
                  </div>
                </div>

                {/* Animated Audio Wave Simulator */}
                <div className="flex items-center gap-1">
                  {[40, 75, 30, 90, 50, 80, 45, 95, 60, 30, 70, 40].map((h, i) => (
                    <div
                      key={i}
                      style={{ height: isPlayingAudio ? `${h}%` : "30%" }}
                      className={`w-1 rounded-full bg-cyan-400 transition-all duration-300 ${
                        isPlayingAudio ? "animate-pulse" : "opacity-40"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Call Logs Stream */}
              {ticket.callLogs && ticket.callLogs.length > 0 ? (
                ticket.callLogs.map((log) => (
                  <div
                    key={log.id}
                    className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-bold text-blue-400 border border-blue-500/20">
                          {log.callType} CALL
                        </span>
                        <span className="text-sm font-bold text-white">To: {log.targetName}</span>
                      </div>
                      <span className="text-xs text-emerald-400 font-semibold">{log.status}</span>
                    </div>

                    {log.summary && (
                      <div className="rounded-xl bg-slate-950/60 p-3 text-xs text-slate-300 border border-slate-800">
                        <strong className="text-cyan-400">AI Summary: </strong>
                        {log.summary}
                      </div>
                    )}

                    {log.transcript && (
                      <div className="rounded-xl bg-slate-950/90 p-4 text-xs font-mono text-slate-300 space-y-2 whitespace-pre-wrap border border-slate-800">
                        <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-sans pb-1 border-b border-slate-800">
                          <Volume2 className="h-3.5 w-3.5" /> Transcript Log
                        </div>
                        {log.transcript}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-slate-500">
                  <PhoneCall className="mx-auto h-12 w-12 text-slate-700" />
                  <p className="mt-2 text-sm">No call logs generated yet for this ticket.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6 text-sm text-slate-300">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-3">
                <h4 className="font-bold text-white">Description</h4>
                <p className="text-slate-400">{ticket.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 space-y-1">
                  <span className="text-xs text-slate-500 font-semibold">Tenant Contact</span>
                  <p className="font-bold text-white">{ticket.tenant.name}</p>
                  <p className="text-xs text-blue-400">{ticket.tenant.phone}</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 space-y-1">
                  <span className="text-xs text-slate-500 font-semibold">Property Address</span>
                  <p className="font-bold text-white">{ticket.property.title}</p>
                  <p className="text-xs text-slate-400">{ticket.property.address}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950/60 px-6 py-4">
          <span className="text-xs text-slate-500">FixItFlow • CALL-E Telephony Engine</span>
          {ticket.status !== "CONFIRMED" && (
            <button
              onClick={handleDispatch}
              disabled={isDispatching}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all"
            >
              <Sparkles className="h-4 w-4" />
              <span>Run AI Dispatch Call</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
