"use client";

import React, { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Download, Clock, User, CheckCircle2, ChevronRight } from "lucide-react";

export const CalendarWidget: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCalendar = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/calendar");
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch calendar", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendar();
  }, []);

  if (events.length === 0 && !isLoading) return null;

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <CalendarIcon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Synced Repair Appointments</h3>
            <p className="text-xs text-slate-400">Google Calendar & ICS Integration</p>
          </div>
        </div>
        <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-400 border border-emerald-500/20">
          {events.length} Appointments Synced
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((t) => (
          <div
            key={t.id}
            className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3"
          >
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-400">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Scheduled
                </span>
                <span className="text-slate-400 font-mono text-[11px]">{t.scheduledAt || "2:00 PM Today"}</span>
              </div>
              <h4 className="mt-2 text-sm font-bold text-white truncate">{t.title}</h4>
              <p className="text-xs text-slate-400 truncate">{t.property.title}</p>
            </div>

            <div className="flex items-center justify-between border-t border-slate-800/80 pt-3">
              <span className="text-xs font-medium text-slate-300 truncate">
                {t.selectedContractor?.name || "Contractor"}
              </span>
              <a
                href={`/api/calendar/${t.id}/ics`}
                download
                className="flex items-center gap-1 rounded-lg bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-400 hover:bg-blue-500/20 transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                <span>ICS</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
