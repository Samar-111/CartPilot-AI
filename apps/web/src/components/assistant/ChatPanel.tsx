"use client";

import React, { useState } from "react";
import { Sparkles, Send, IndianRupee, Users, Calendar, Lightbulb, Compass, MapPin } from "lucide-react";
import { INDIAN_CITIES } from "@cartpilot/shared";

interface ChatPanelProps {
  onSubmit: (data: {
    request: string;
    budgetPaise: number;
    peopleCount: number;
    durationDays: number;
    preferences: string[];
    pincode?: string;
    cityName?: string;
  }) => void;
  isLoading: boolean;
}

export function parsePromptConstraints(text: string) {
  const result: {
    budget?: number;
    people?: number;
    days?: number;
    preferences: string[];
  } = { preferences: [] };

  const budgetRegex = /(?:under|below|within|upto|cap|budget(?:\s*of)?|max)?\s*(?:₹|rs\.?|inr)?\s*([0-9]+(?:,[0-9]+)*)(?:\s*(?:rs|rupees|inr|₹|\/-))?/i;
  const explicitBudgetMatch = text.match(
    /(?:under|below|within|upto|cap|budget(?:\s*of)?|total(?:\s*under)?)\s*(?:₹|rs\.?|inr)?\s*([0-9]+(?:,[0-9]+)*)/i
  ) || text.match(/(?:₹|rs\.?|inr)\s*([0-9]+(?:,[0-9]+)*)/i);

  if (explicitBudgetMatch && explicitBudgetMatch[1]) {
    const rawNum = explicitBudgetMatch[1].replace(/,/g, "");
    const parsedNum = parseInt(rawNum, 10);
    if (!isNaN(parsedNum) && parsedNum >= 100 && parsedNum <= 100000) {
      result.budget = parsedNum;
    }
  }

  const peopleMatch = text.match(/([0-9]+)\s*(?:people|persons|members|adults|family(?:\s*of)?\s*([0-9]+))/i) ||
                      text.match(/(?:for)\s*([0-9]+)\s*(?:people|persons|members)?/i);
  if (peopleMatch) {
    const num = parseInt(peopleMatch[1] || peopleMatch[2], 10);
    if (!isNaN(num) && num >= 1 && num <= 50) {
      result.people = num;
    }
  } else {
    const wordNums: Record<string, number> = {
      one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10
    };
    const wordMatch = text.match(/\b(one|two|three|four|five|six|seven|eight|nine|ten)\s*(?:people|persons|members|family)/i);
    if (wordMatch && wordNums[wordMatch[1].toLowerCase()]) {
      result.people = wordNums[wordMatch[1].toLowerCase()];
    }
  }

  const weeksMatch = text.match(/([0-9]+)\s*(?:weeks?)/i);
  if (weeksMatch) {
    const w = parseInt(weeksMatch[1], 10);
    if (!isNaN(w) && w >= 1 && w <= 8) {
      result.days = w * 7;
    }
  } else {
    const wordWeeks: Record<string, number> = {
      one: 7, two: 14, three: 21, four: 28
    };
    const wordWeekMatch = text.match(/\b(one|two|three|four)\s*(?:weeks?)/i);
    if (wordWeekMatch && wordWeeks[wordWeekMatch[1].toLowerCase()]) {
      result.days = wordWeeks[wordWeekMatch[1].toLowerCase()];
    } else {
      const daysMatch = text.match(/([0-9]+)\s*(?:days?)/i);
      if (daysMatch) {
        const num = parseInt(daysMatch[1], 10);
        if (!isNaN(num) && num >= 1 && num <= 60) {
          result.days = num;
        }
      } else if (/monthly|month/i.test(text)) {
        result.days = 30;
      }
    }
  }

  const lower = text.toLowerCase();
  if (lower.includes("healthy") || lower.includes("nutritious")) result.preferences.push("healthy");
  if (lower.includes("vegetarian") || lower.includes("veg")) result.preferences.push("vegetarian");
  if (lower.includes("vegan") || lower.includes("plant-based")) result.preferences.push("vegan");
  if (lower.includes("protein") || lower.includes("high-protein")) result.preferences.push("high-protein");
  if (lower.includes("gluten-free") || lower.includes("gluten free")) result.preferences.push("gluten-free");

  return result;
}

export function ChatPanel({ onSubmit, isLoading }: ChatPanelProps) {
  const [request, setRequest] = useState(
    "I need groceries for one week for two people. Keep the total under ₹2,000, prioritize healthy options, and add everything to my cart."
  );
  const [budgetRupees, setBudgetRupees] = useState(2000);
  const [peopleCount, setPeopleCount] = useState(2);
  const [durationDays, setDurationDays] = useState(7);
  const [preferences, setPreferences] = useState<string[]>(["healthy", "vegetarian"]);
  const [selectedPincode, setSelectedPincode] = useState("560001");

  const handleRequestChange = (text: string) => {
    setRequest(text);
    const extracted = parsePromptConstraints(text);
    if (extracted.budget !== undefined) {
      setBudgetRupees(extracted.budget);
    }
    if (extracted.people !== undefined) {
      setPeopleCount(extracted.people);
    }
    if (extracted.days !== undefined) {
      setDurationDays(extracted.days);
    }
    if (extracted.preferences.length > 0) {
      setPreferences((prev) => Array.from(new Set([...prev, ...extracted.preferences])));
    }
  };

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

  const selectedCityObj = INDIAN_CITIES.find(c => c.pincode === selectedPincode) || INDIAN_CITIES[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!request.trim() || isLoading) return;

    const extracted = parsePromptConstraints(request);
    const finalBudgetRupees = extracted.budget !== undefined ? extracted.budget : budgetRupees;
    const finalPeople = extracted.people !== undefined ? extracted.people : peopleCount;
    const finalDays = extracted.days !== undefined ? extracted.days : durationDays;
    const finalPrefs = extracted.preferences.length > 0
      ? Array.from(new Set([...preferences, ...extracted.preferences]))
      : preferences;

    onSubmit({
      request,
      budgetPaise: finalBudgetRupees * 100,
      peopleCount: finalPeople,
      durationDays: finalDays,
      preferences: finalPrefs,
      pincode: selectedPincode,
      cityName: selectedCityObj.cityName
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
              onChange={(e) => handleRequestChange(e.target.value)}
              rows={3}
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 p-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50 leading-relaxed"
              placeholder="E.g. I need groceries for one week for two people under ₹2,000..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" /> City / DarkStore
            </label>
            <select
              value={selectedPincode}
              onChange={(e) => setSelectedPincode(e.target.value)}
              className="w-full text-xs font-semibold rounded-lg border border-slate-200 bg-white p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer text-slate-800"
            >
              {INDIAN_CITIES.map((c) => (
                <option key={c.pincode} value={c.pincode}>
                  {c.cityName} ({c.pincode})
                </option>
              ))}
            </select>
            <span className="text-[10px] text-slate-400 mt-1 block truncate">
              {selectedCityObj.storeName}
            </span>
          </div>

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
              onChange={(e) => setPeopleCount(Math.max(1, Number(e.target.value)))}
              min={1}
              max={25}
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
              onChange={(e) => setDurationDays(Math.max(1, Number(e.target.value)))}
              min={1}
              max={60}
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
                onClick={() => handleRequestChange(p.text)}
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
