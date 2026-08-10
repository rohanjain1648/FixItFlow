"use client";

import React from "react";
import { Globe } from "lucide-react";

interface LanguageBadgeProps {
  language: string;
}

export const LanguageBadge: React.FC<LanguageBadgeProps> = ({ language }) => {
  const getLanguageDetails = (lang: string) => {
    switch (lang.toLowerCase()) {
      case "es":
        return { label: "Spanish (ES)", flag: "🇪🇸", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" };
      case "fr":
        return { label: "French (FR)", flag: "🇫🇷", color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" };
      case "hi":
        return { label: "Hindi (HI)", flag: "🇮🇳", color: "bg-orange-500/10 text-orange-400 border-orange-500/20" };
      case "zh":
        return { label: "Chinese (ZH)", flag: "🇨🇳", color: "bg-red-500/10 text-red-400 border-red-500/20" };
      case "pt":
        return { label: "Portuguese (PT)", flag: "🇧🇷", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" };
      default:
        return { label: "English (US)", flag: "🇺🇸", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" };
    }
  };

  const details = getLanguageDetails(language);

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${details.color}`}>
      <span>{details.flag}</span>
      <span>{details.label}</span>
    </span>
  );
};
