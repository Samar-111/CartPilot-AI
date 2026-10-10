"use client";

import React, { useState } from "react";
import { Sparkles, Send, IndianRupee, Users, Calendar, Lightbulb, Compass } from "lucide-react";

interface ChatPanelProps {
  onSubmit: (data: {
    request: string;
    budgetPaise: number;
    peopleCount: number;
    durationDays: number;
    preferences: string[];
  }) => void;
  isLoading: boolean;
}

export function ChatPanel({ onSubmit, isLoading }: ChatPanelProps) {
  const [request, setRequest] = useState(
    "I need groceries for one week for two people. Keep the total under ₹2,000, prioritize healthy options, and add everything to my cart."
  );
  const [budgetRupees, setBudgetRupees] = useState(2000);
  const [peopleCount, setPeopleCount] = useState(2);
  const [durationDays, setDurationDays] = useState(7);
  const [preferences, setPreferences] = useState<string[]>(["healthy", "vegetarian"]);

  const samplePrompts = [
    {
      title: "Balanced Weekly Household",
      text: "Groceries for one week for two people under ₹2,000, prioritize healthy options and pantry essentials."
    },
    {
      title: "High Protein Fitness Plan",
      text: "High-protein meal groceries for 5 days under ₹1,500 with eggs, tofu, oats, and dairy."
    },
    {
      title: "Clean Vegan Living",
      text: "Nutritious 100% plant-based vegan grocery essentials for 7 days under ₹1,800."
    }
  ];

  const togglePref = (pref: string) => {
    if (preferences.includes(pref)) {
      setPreferences(preferences.filter((p) => p !== pref));
    } else {
      setPreferences([...preferences, pref]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!request.trim() || isLoading) return;
    onSubmit({
      request,
      budgetPaise: budgetRupees * 100,
      peopleCount,
      durationDays,
      preferences
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-display font-bold text-slate-900 text-base">
              Autonomous Shopping Workforce
            </h2>
            <p className="text-[11px] text-slate-400">
              Coordinated LangGraph agents executing planning, discovery, & verification
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Shopping Prompt & Instructions
          </label>
          <div className="relative">
            <textarea
              value={request}
              onChange={(e) => setRequest(e.target.value)}
              rows={3}
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 p-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50 leading-relaxed"
              placeholder="E.g. I need groceries for one week for two people under ₹2,000..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-1.5">
              <IndianRupee className="w-3.5 h-3.5 text-emerald-600" /> Budget Cap
            </label>
            <input
              type="number"
              value={budgetRupees}
              onChange={(e) => setBudgetRupees(Number(e.target.value))}
              min={100}
              step={50}
              className="w-full text-sm font-semibold rounded-lg border border-slate-200 bg-white p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Maximum spend limit</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-600" /> People
            </label>
            <input
              type="number"
              value={peopleCount}
              onChange={(e) => setPeopleCount(Number(e.target.value))}
              min={1}
              max={10}
              className="w-full text-sm font-semibold rounded-lg border border-slate-200 bg-white p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Household size</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-600" /> Duration
            </label>
            <input
              type="number"
              value={durationDays}
              onChange={(e) => setDurationDays(Number(e.target.value))}
              min={1}
              max={30}
              className="w-full text-sm font-semibold rounded-lg border border-slate-200 bg-white p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Days of groceries</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-2">
            Nutritional & Dietary Filters
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: "healthy", label: "Nutritious Choice" },
              { id: "vegetarian", label: "Vegetarian" },
              { id: "vegan", label: "100% Vegan" },
              { id: "high-protein", label: "High Protein" },
              { id: "gluten-free", label: "Gluten Free" }
            ].map((p) => {
              const active = preferences.includes(p.id);
              return (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => togglePref(p.id)}
                  className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all ${
                    active
                      ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/20"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Suggested Prompts</span>
          </div>
          <div className="space-y-1.5">
            {samplePrompts.map((p, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => setRequest(p.text)}
                className="w-full text-left p-2.5 rounded-xl hover:bg-emerald-50/50 border border-transparent hover:border-emerald-200/60 transition-colors group"
              >
                <div className="text-xs font-semibold text-slate-800 group-hover:text-emerald-700">
                  {p.title}
                </div>
                <div className="text-[11px] text-slate-500 truncate">{p.text}</div>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-semibold py-3.5 px-6 rounded-xl transition-all shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/30 text-sm"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Workforce Co-Ordinating Execution...</span>
            </span>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Launch Autonomous Shopping Workflow</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
