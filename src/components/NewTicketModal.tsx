"use client";

import React, { useState } from "react";
import { X, Plus, Wrench, Building2, User, AlertCircle } from "lucide-react";

interface NewTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTicketCreated: () => void;
}

export const NewTicketModal: React.FC<NewTicketModalProps> = ({
  isOpen,
  onClose,
  onTicketCreated,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Plumbing");
  const [priority, setPriority] = useState("HIGH");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get properties & tenants
      const propsRes = await fetch("/api/properties");
      const properties = await propsRes.json();
      const defaultProp = properties[0];
      const defaultTenant = defaultProp?.tenants?.[0];

      await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          category,
          priority,
          propertyId: defaultProp?.id,
          tenantId: defaultTenant?.id,
        }),
      });

      onTicketCreated();
      onClose();
    } catch (err) {
      console.error("Failed to create ticket", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/50 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Create Dispatch Ticket</h2>
              <p className="text-xs text-slate-400">CALL-E AI will handle triage and contractor calling</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm text-slate-300">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Issue Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Water Leak in Bathroom"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Trade Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="HVAC">HVAC</option>
                <option value="General">General Maintenance</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="EMERGENCY">EMERGENCY</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Detailed Description</label>
            <textarea
              rows={3}
              required
              placeholder="Provide symptoms, location details, and tenant reports..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-800 px-4 py-2 text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2 font-bold text-white shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all"
            >
              {isSubmitting ? "Creating..." : "Submit Ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
