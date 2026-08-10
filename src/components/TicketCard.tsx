"use client";

import React, { useState } from "react";
import { Phone, Calendar, User, Building2, Play, CheckCircle, Loader2, Sparkles } from "lucide-react";
import { LanguageBadge } from "./LanguageBadge";

export interface TicketData {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "EMERGENCY";
  status: "OPEN" | "TRIAGING" | "TRIAGED" | "SOURCING" | "MATCHED" | "CONFIRMED" | "COMPLETED";
  agreedPrice?: number | null;
  scheduledAt?: string | null;
  triageNotes?: string | null;
  property: {
    title: string;
    address: string;
    unit?: string | null;
  };
  tenant: {
    name: string;
    phone: string;
  };
  selectedContractor?: {
    name: string;
    phone: string;
    rating: number;
    language?: string;
  } | null;
  callLogs?: Array<{
    id: string;
    callType: string;
    targetName: string;
    status: string;
    transcript?: string | null;
    summary?: string | null;
  }>;
}

interface TicketCardProps {
  ticket: TicketData;
  onSelect: (ticket: TicketData) => void;
  onDispatch: (ticketId: string) => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket, onSelect, onDispatch }) => {
  const [isDispatching, setIsDispatching] = useState(false);

  const handleDispatchClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDispatching(true);
    await onDispatch(ticket.id);
    setIsDispatching(false);
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "EMERGENCY":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse";
      case "HIGH":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "MEDIUM":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/30";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
      case "COMPLETED":
        return (
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
            <CheckCircle className="h-3.5 w-3.5" /> Confirmed
          </span>
        );
      case "TRIAGING":
      case "SOURCING":
        return (
          <span className="flex items-center gap-1.5 rounded-full bg-cyan-500/15 px-3 py-1 text-xs font-semibold text-cyan-400 border border-cyan-500/30 animate-pulse">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Calling & Coordinating
          </span>
        );
      default:
        return (
          <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300 border border-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div
      onClick={() => onSelect(ticket)}
      className="group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md transition-all hover:border-slate-700 hover:bg-slate-900/90 hover:shadow-xl hover:shadow-blue-500/5 cursor-pointer"
    >
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${getPriorityStyle(ticket.priority)}`}>
              {ticket.priority}
            </span>
            <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-300">
              {ticket.category}
            </span>
          </div>
          {getStatusBadge(ticket.status)}
        </div>

        {/* Title & Desc */}
        <h3 className="mt-4 text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
          {ticket.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs text-slate-400 leading-relaxed">
          {ticket.description}
        </p>

        {/* Location & Tenant Info */}
        <div className="mt-4 space-y-2 border-t border-slate-800/80 pt-4 text-xs text-slate-300">
          <div className="flex items-center gap-2 text-slate-400">
            <Building2 className="h-4 w-4 shrink-0 text-blue-400" />
            <span className="truncate font-medium">{ticket.property.title} • {ticket.property.unit || "Main Unit"}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <User className="h-4 w-4 shrink-0 text-cyan-400" />
            <span className="font-medium text-slate-200">{ticket.tenant.name} ({ticket.tenant.phone})</span>
          </div>
        </div>

        {/* Matched Contractor Info if available */}
        {ticket.selectedContractor && (
          <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-3 text-xs">
            <div className="flex items-center justify-between font-semibold text-emerald-400">
              <span className="truncate">Matched: {ticket.selectedContractor.name}</span>
              <span className="font-bold text-white">${ticket.agreedPrice}</span>
            </div>
            <div className="mt-2 flex items-center justify-between gap-2 text-emerald-300/80 text-[11px]">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-emerald-400" />
                <span>Scheduled for {ticket.scheduledAt || "Today"}</span>
              </div>
              <LanguageBadge language={ticket.selectedContractor.language || "en"} />
            </div>
          </div>
        )}
      </div>

      {/* Footer & Dispatch Action */}
      <div className="mt-6 flex items-center justify-between border-t border-slate-800/80 pt-4">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
          <Phone className="h-3.5 w-3.5 text-cyan-400" />
          <span>{ticket.callLogs?.length || 0} CALL-E Calls</span>
        </div>

        {ticket.status !== "CONFIRMED" && ticket.status !== "COMPLETED" && (
          <button
            onClick={handleDispatchClick}
            disabled={isDispatching}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:from-blue-500 hover:to-cyan-500 active:scale-95 disabled:opacity-50"
          >
            {isDispatching ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Calling...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 text-cyan-200" />
                <span>Trigger AI Call Dispatch</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
