"use client";

import React, { useState } from "react";
import { Terminal, Send, Users, Calendar, Compass, Shield } from "lucide-react";

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
    <div className="bg-[#141815] rounded-2xl border border-[#2E3B31] p-6 shadow-command space-y-6">
      <div className="flex items-center justify-between border-b border-[#232B25] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#1B211C] border border-[#2E3B31] flex items-center justify-center text-[#C6FF4D]">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-display font-bold text-[#F4F5EF] text-base">
              Shopping Mission Directives
            </h2>
            <p className="text-[11px] font-mono text-[#929A91]">
              Natural language input & parameter orchestration
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0B0D0C] border border-[#232B25] text-[10px] font-mono text-[#C6FF4D]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C6FF4D] animate-ping" />
          <span>PORT 5000: CONNECTED</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-[#929A91] mb-2">
            Shopping Prompt & Instructions
          </label>
          <div className="relative">
            <textarea
              value={request}
              onChange={(e) => setRequest(e.target.value)}
              rows={3}
              className="w-full text-xs sm:text-sm rounded-xl border border-[#2E3B31] p-3.5 focus:outline-none focus:border-[#C6FF4D] bg-[#0B0D0C] text-[#F4F5EF] leading-relaxed font-sans placeholder-[#667065]"
              placeholder="Describe your shopping requirements in plain English..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-[#0B0D0C] p-3 rounded-xl border border-[#232B25]">
            <label className="flex items-center gap-1.5 text-xs font-mono text-[#929A91] mb-1.5">
              <span className="text-[#C6FF4D]">₹</span> Budget Cap
            </label>
            <input
              type="number"
              value={budgetRupees}
              onChange={(e) => setBudgetRupees(Number(e.target.value))}
              min={100}
              step={50}
              className="w-full text-sm font-mono font-bold rounded-lg border border-[#2E3B31] bg-[#141815] text-[#F4F5EF] p-2 focus:outline-none focus:border-[#C6FF4D]"
            />
            <span className="text-[10px] font-mono text-[#667065] mt-1 block">Hard ceiling limit</span>
          </div>

          <div className="bg-[#0B0D0C] p-3 rounded-xl border border-[#232B25]">
            <label className="flex items-center gap-1.5 text-xs font-mono text-[#929A91] mb-1.5">
              <Users className="w-3.5 h-3.5 text-[#8DCBFF]" /> Household
            </label>
            <input
              type="number"
              value={peopleCount}
              onChange={(e) => setPeopleCount(Number(e.target.value))}
              min={1}
              max={10}
              className="w-full text-sm font-mono font-bold rounded-lg border border-[#2E3B31] bg-[#141815] text-[#F4F5EF] p-2 focus:outline-none focus:border-[#C6FF4D]"
            />
            <span className="text-[10px] font-mono text-[#667065] mt-1 block">Number of people</span>
          </div>

          <div className="bg-[#0B0D0C] p-3 rounded-xl border border-[#232B25]">
            <label className="flex items-center gap-1.5 text-xs font-mono text-[#929A91] mb-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#C6FF4D]" /> Duration
            </label>
            <input
              type="number"
              value={durationDays}
              onChange={(e) => setDurationDays(Number(e.target.value))}
              min={1}
              max={30}
              className="w-full text-sm font-mono font-bold rounded-lg border border-[#2E3B31] bg-[#141815] text-[#F4F5EF] p-2 focus:outline-none focus:border-[#C6FF4D]"
            />
            <span className="text-[10px] font-mono text-[#667065] mt-1 block">Days of supplies</span>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-[#929A91] mb-2">
            Nutritional & Dietary Constraints
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
                  className={`text-xs px-3 py-1.5 rounded-lg font-mono font-medium transition-all ${
                    active
                      ? "bg-[#C6FF4D] text-[#0B0D0C] font-bold shadow-lime-glow"
                      : "bg-[#0B0D0C] border border-[#232B25] text-[#929A91] hover:text-[#F4F5EF] hover:border-[#2E3B31]"
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#667065] mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Preset Shopping Scenarios</span>
          </div>
          <div className="space-y-1.5">
            {samplePrompts.map((p, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => setRequest(p.text)}
                className="w-full text-left p-2.5 rounded-lg bg-[#0B0D0C] hover:bg-[#1B211C] border border-[#232B25] hover:border-[#2E3B31] transition-all group"
              >
                <div className="text-xs font-mono font-bold text-[#F4F5EF] group-hover:text-[#C6FF4D]">
                  {p.title}
                </div>
                <div className="text-[11px] text-[#929A91] truncate font-sans">{p.text}</div>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-[#C6FF4D] hover:bg-[#B6F53D] disabled:bg-[#1B211C] disabled:text-[#667065] text-[#0B0D0C] font-bold py-3.5 px-6 rounded-xl transition-all shadow-lime-glow text-xs sm:text-sm"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-[#0B0D0C] border-t-transparent rounded-full animate-spin" />
              <span>Agents Coordinating Workflow...</span>
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
