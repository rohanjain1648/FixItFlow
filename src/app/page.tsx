"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { MetricsHeader } from "@/components/MetricsHeader";
import { TicketCard, TicketData } from "@/components/TicketCard";
import { TicketDetailModal } from "@/components/TicketDetailModal";
import { NewTicketModal } from "@/components/NewTicketModal";
import { Filter, Sparkles, RefreshCw, Layers } from "lucide-react";

export default function Dashboard() {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/tickets");
      const data = await res.json();
      setTickets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch tickets", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleDispatchTicket = async (ticketId: string) => {
    try {
      await fetch(`/api/tickets/${ticketId}/dispatch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "auto" }),
      });
      await fetchTickets();
      if (selectedTicket?.id === ticketId) {
        const updatedRes = await fetch(`/api/tickets/${ticketId}`);
        const updatedData = await updatedRes.json();
        setSelectedTicket(updatedData);
      }
    } catch (err) {
      console.error("Dispatch error", err);
    }
  };

  const filteredTickets = tickets.filter((t) => {
    const matchCategory = filterCategory === "ALL" || t.category === filterCategory;
    const matchStatus =
      filterStatus === "ALL" ||
      (filterStatus === "CONFIRMED" && (t.status === "CONFIRMED" || t.status === "COMPLETED")) ||
      (filterStatus === "OPEN" && t.status === "OPEN") ||
      (filterStatus === "COORDINATING" && (t.status === "TRIAGING" || t.status === "SOURCING"));
    return matchCategory && matchStatus;
  });

  const confirmedCount = tickets.filter((t) => t.status === "CONFIRMED" || t.status === "COMPLETED").length;
  const totalCallsCount = tickets.reduce((acc, t) => acc + (t.callLogs?.length || 0), 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white">
      {/* Navbar */}
      <Navbar onNewTicket={() => setIsNewTicketModalOpen(true)} />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Hero Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-blue-950/40 via-slate-900 to-cyan-950/40 p-8 shadow-2xl">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400">
              <Sparkles className="h-3.5 w-3.5" /> Hackathon Submission Engine
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Autonomous Phone Call Dispatch for Property Maintenance
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              FixItFlow uses <strong className="text-cyan-400">CALL-E AI</strong> to automatically triage tenant repair tickets, call local contractors for quotes, negotiate availability, and confirm appointments over real phone calls.
            </p>
          </div>
        </div>

        {/* Top Metrics Grid */}
        <MetricsHeader
          totalTickets={tickets.length}
          confirmedTickets={confirmedCount}
          totalCalls={totalCallsCount}
        />

        {/* Filter Controls Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mr-2">
              <Filter className="h-3.5 w-3.5 text-blue-400" /> Filter Status:
            </span>
            {["ALL", "OPEN", "COORDINATING", "CONFIRMED"].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  filterStatus === st
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/20"
                    : "border border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-1.5 text-xs font-semibold text-slate-300 focus:border-blue-500 focus:outline-none"
            >
              <option value="ALL">All Trade Categories</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Electrical">Electrical</option>
              <option value="HVAC">HVAC</option>
            </select>

            <button
              onClick={fetchTickets}
              className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Tickets Grid */}
        {isLoading ? (
          <div className="py-20 text-center text-slate-500">
            <RefreshCw className="mx-auto h-8 w-8 animate-spin text-blue-400" />
            <p className="mt-3 text-sm font-medium">Loading CALL-E dispatch tickets...</p>
          </div>
        ) : filteredTickets.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onSelect={(t) => setSelectedTicket(t)}
                onDispatch={handleDispatchTicket}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-800 p-12 text-center text-slate-500">
            <Layers className="mx-auto h-12 w-12 text-slate-700" />
            <p className="mt-3 text-base font-bold text-slate-300">No dispatch tickets found</p>
            <p className="text-xs text-slate-500 mt-1">Try resetting filters or creating a new ticket.</p>
          </div>
        )}
      </main>

      {/* Detail Modal */}
      <TicketDetailModal
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
        onDispatch={handleDispatchTicket}
      />

      {/* New Ticket Modal */}
      <NewTicketModal
        isOpen={isNewTicketModalOpen}
        onClose={() => setIsNewTicketModalOpen(false)}
        onTicketCreated={fetchTickets}
      />
    </div>
  );
}
