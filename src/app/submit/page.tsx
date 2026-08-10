"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Wrench, PhoneCall, CheckCircle2, ArrowLeft, Send, Sparkles, ShieldCheck } from "lucide-react";

export default function TenantSubmitPage() {
  const [tenantName, setTenantName] = useState("");
  const [tenantPhone, setTenantPhone] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Plumbing");
  const [priority, setPriority] = useState("HIGH");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/tickets/public", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantName,
          tenantPhone,
          propertyAddress,
          title,
          description,
          category,
          priority,
        }),
      });

      const data = await res.json();
      setSubmittedTicket(data);
    } catch (err) {
      console.error("Submission failed", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <header className="mx-auto w-full max-w-2xl flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-2 shadow-lg shadow-blue-500/20">
            <Wrench className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-white">
              FixIt<span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Flow</span>
            </span>
            <p className="text-[11px] font-medium text-slate-400">Tenant Maintenance Portal</p>
          </div>
        </div>

        <Link
          href="/"
          className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Manager Dashboard</span>
        </Link>
      </header>

      {/* Main Form Container */}
      <main className="mx-auto my-auto w-full max-w-2xl">
        {submittedTicket ? (
          <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/30 via-slate-900 to-slate-950 p-8 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-200">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Ticket Submitted Successfully!</h2>
              <p className="text-sm text-slate-300">
                Ticket ID: <span className="font-mono text-cyan-400 font-bold">{submittedTicket.id}</span>
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 text-left text-xs space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <PhoneCall className="h-4 w-4 animate-pulse" />
                <span>What happens next?</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Our <strong className="text-white">CALL-E AI Voice Agent</strong> will call your phone number (<strong className="text-white">{tenantPhone}</strong>) within 2 minutes to confirm access details and triage your request.
              </p>
            </div>

            <button
              onClick={() => {
                setSubmittedTicket(null);
                setTitle("");
                setDescription("");
              }}
              className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              Submit Another Maintenance Request
            </button>
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
                <Sparkles className="h-3.5 w-3.5" /> 24/7 AI Maintenance Dispatch
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">Report a Repair Issue</h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Fill out the form below. FixItFlow AI will automatically dispatch licensed contractors and call you to confirm appointment slots.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm text-slate-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={tenantName}
                    onChange={(e) => setTenantName(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Phone Number (For AI Call)</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +1 555 019 2834"
                    value={tenantPhone}
                    onChange={(e) => setTenantPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Property Address & Unit #</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 742 Evergreen Terrace, Apt 4B"
                  value={propertyAddress}
                  onChange={(e) => setPropertyAddress(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Repair Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Plumbing">Plumbing (Pipes, Leaks, Drains)</option>
                    <option value="Electrical">Electrical (Outlets, Breakers)</option>
                    <option value="HVAC">HVAC (Heating & Air Condition)</option>
                    <option value="General">General Repair</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Urgency Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="LOW">Low (Can wait a few days)</option>
                    <option value="MEDIUM">Medium (Normal priority)</option>
                    <option value="HIGH">High (Needs attention today)</option>
                    <option value="EMERGENCY">Emergency (Active flooding/danger)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Issue Summary</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kitchen sink pipe leaking rapidly"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Detailed Explanation</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe when it started, symptoms, water shutoff attempts, etc."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                <span>{isSubmitting ? "Submitting Ticket..." : "Submit Ticket for AI Dispatch"}</span>
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mx-auto w-full max-w-2xl text-center py-4 text-xs text-slate-500">
        Powered by CALL-E Autonomous Telephony Platform • FixItFlow AI
      </footer>
    </div>
  );
}
