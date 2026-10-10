"use client";

import React, { useState } from "react";
import { Sparkles, Send, IndianRupee, Users, Calendar } from "lucide-react";

interface ChatPanelProps {
  onSubmit: (data: { request: string; budgetPaise: number; peopleCount: number; durationDays: number; preferences: string[] }) => void;
  isLoading: boolean;
}

export function ChatPanel({ onSubmit, isLoading }: ChatPanelProps) {
  const [request, setRequest] = useState("I need groceries for one week for two people. Keep the total under ₹2,000, prioritize healthy options, and add everything to my cart.");
  const [budgetRupees, setBudgetRupees] = useState(2000);
  const [peopleCount, setPeopleCount] = useState(2);
  const [durationDays, setDurationDays] = useState(7);
  const [preferences, setPreferences] = useState<string[]>(["healthy", "vegetarian"]);

  const samplePrompts = [
    "I need groceries for one week for two people under ₹2,000, prioritize healthy options.",
    "High protein vegan meal prep groceries for 5 days under ₹1,500.",
    "Healthy fruit and breakfast staples for one person under ₹1,000."
  ];

  const togglePref = (pref: string) => {
    if (preferences.includes(pref)) {
      setPreferences(preferences.filter(p => p !== pref));
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
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-emerald-600" />
        <h2 className="text-lg font-semibold text-slate-800">AI Shopping Assistant</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
            Shopping Goal & Instructions
          </label>
          <textarea
            value={request}
            onChange={(e) => setRequest(e.target.value)}
            rows={3}
            className="w-full text-sm rounded-lg border border-slate-200 p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="E.g. I need groceries for one week for two people under ₹2,000..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="flex items-center gap-1 text-xs font-medium text-slate-600 mb-1">
              <IndianRupee className="w-3.5 h-3.5" /> Budget (INR)
            </label>
            <input
              type="number"
              value={budgetRupees}
              onChange={(e) => setBudgetRupees(Number(e.target.value))}
              min={100}
              step={50}
              className="w-full text-sm rounded-lg border border-slate-200 p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="flex items-center gap-1 text-xs font-medium text-slate-600 mb-1">
              <Users className="w-3.5 h-3.5" /> People
            </label>
            <input
              type="number"
              value={peopleCount}
              onChange={(e) => setPeopleCount(Number(e.target.value))}
              min={1}
              max={10}
              className="w-full text-sm rounded-lg border border-slate-200 p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="flex items-center gap-1 text-xs font-medium text-slate-600 mb-1">
              <Calendar className="w-3.5 h-3.5" /> Days
            </label>
            <input
              type="number"
              value={durationDays}
              onChange={(e) => setDurationDays(Number(e.target.value))}
              min={1}
              max={30}
              className="w-full text-sm rounded-lg border border-slate-200 p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">Dietary & Health Filters</label>
          <div className="flex flex-wrap gap-2">
            {["healthy", "vegetarian", "vegan", "gluten-free", "high-protein"].map(pref => {
              const active = preferences.includes(pref);
              return (
                <button
                  type="button"
                  key={pref}
                  onClick={() => togglePref(pref)}
                  className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                    active ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {pref}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">Suggested prompts:</label>
          <div className="space-y-1">
            {samplePrompts.map((p, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => setRequest(p)}
                className="block text-left text-xs text-emerald-600 hover:underline truncate w-full"
              >
                • {p}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm"
        >
          {isLoading ? (
            <span>Workforce Orchestrating Plan...</span>
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
