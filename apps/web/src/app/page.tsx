"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Layers,
  Scale,
  CheckCircle2,
  Lock,
  Cpu,
  ShoppingBag,
  TrendingUp,
  CreditCard
} from "lucide-react";
import { paiseToRupees } from "@cartpilot/shared";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<number>(0);

  const agents = [
    {
      title: "Agent 1 — Shopping Planner",
      role: "Planning & Requirement Decomposition",
      desc: "Translates natural language prompts into balanced nutritional plans with strict category and budget allocations.",
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: "Agent 2 — Product Research",
      role: "Ground-Truth Inventory Discovery",
      desc: "Directly queries MongoDB catalog filters for verified stock, unit measurements, and live prices without hallucination.",
      color: "from-emerald-500 to-teal-600"
    },
    {
      title: "Agent 3 — Recommendation",
      role: "Nutritional & Price Optimization",
      desc: "Ranks candidates against dietary preferences (high-protein, vegan, organic) and proposes cost-effective alternatives.",
      color: "from-amber-500 to-orange-600"
    },
    {
      title: "Agent 4 — Cart Manager",
      role: "Deterministic Line-Item Assembly",
      desc: "Merges duplicate items, formats units, and computes exact server-side line totals in integer paise.",
      color: "from-purple-500 to-violet-600"
    },
    {
      title: "Agent 5 — Budget & Policy Validator",
      role: "Deterministic Guardrail Checks",
      desc: "TypeScript verification logic that prevents overspending and triggers replanning loops if constraints are violated.",
      color: "from-rose-500 to-red-600"
    }
  ];

  return (
    <div className="space-y-24 pb-16">
      <section className="relative pt-12 md:pt-20 pb-16 hero-gradient overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold mb-6 shadow-subtle">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Autonomous Multi-Agent E-Commerce Workforce</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.12]">
            Your grocery shopping,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700">
              intelligently orchestrated.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Meet your AI shopping workforce. Discover verified products, optimize nutritional preferences, enforce strict budget limits, and checkout seamlessly.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-7 py-3.5 rounded-xl shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all text-sm"
            >
              <span>Start Smart Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/products"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-semibold px-6 py-3.5 rounded-xl border border-slate-200/80 shadow-sm transition-all text-sm"
            >
              <ShoppingBag className="w-4 h-4 text-slate-500" />
              <span>Explore Catalog</span>
            </Link>
          </div>

          <div className="mt-14 max-w-5xl mx-auto bg-white/90 rounded-2xl border border-slate-200/80 shadow-premium p-4 md:p-6 text-left backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400"></span>
                <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                <span className="ml-2 text-xs font-mono font-medium text-slate-400">
                  orchestrator.langgraph.runSession(&quot;weekly-groceries&quot;)
                </span>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Deterministic Financial Guardrails Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  1. User Goal
                </div>
                <p className="text-xs font-medium text-slate-800 leading-relaxed">
                  &quot;Groceries for one week for two people under ₹2,000, prioritize healthy & high-protein options.&quot;
                </p>
                <div className="mt-3 flex gap-1.5 flex-wrap">
                  <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200 font-semibold text-slate-600">
                    Budget: ₹2,000.00
                  </span>
                  <span className="text-[10px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold text-emerald-700">
                    High-Protein
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  2. Agent Orchestration
                </div>
                <div className="space-y-1.5 text-[11px] text-slate-600">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Planner formulated 5 categories
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Grounded catalog search (43 items)
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Budget validator enforced: ₹1,870.00
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    3. Final Cart Checkpoint
                  </div>
                  <div className="text-xs text-slate-700">
                    <span className="font-semibold text-slate-900">Total: ₹1,870.00</span>
                    <span className="text-emerald-600 block font-medium">₹130.00 under budget</span>
                  </div>
                </div>
                <div className="mt-3">
                  <Link
                    href="/dashboard"
                    className="w-full inline-flex items-center justify-center gap-1 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-semibold py-1.5 px-3 rounded-lg"
                  >
                    <span>Run In Assistant</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
            Why CartPilot AI is Built Differently
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Ordinary models hallucinate prices and totals. CartPilot coordinates AI reasoning with strict backend tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 text-base mb-1">Smarter Discovery</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Finds optimal items across categories tailored to user dietary profiles, family size, and schedule requirements.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 text-base mb-1">Budget Enforcement</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Never exceeds spending limits. Deterministic validator automatically triggers replanning if totals cross budget caps.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 text-base mb-1">Zero Hallucinations</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Prices, inventory counts, and units are strictly derived from real MongoDB records, never guessed by an LLM.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 text-base mb-1">Razorpay Checkout</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Cryptographically verified payment signature checks, idempotent order history, and simulated sandbox test mode.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-premium relative overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <Cpu className="w-3.5 h-3.5" />
              <span>Multi-Agent LangGraph Workflow</span>
            </div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight">
              The 5-Agent Workforce at Work
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Each agent has isolated responsibilities with explicit typed inputs and outputs, coordinated by conditional graph state transitions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mt-8 relative z-10">
            {agents.map((agent, i) => (
              <div
                key={i}
                className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 flex flex-col justify-between hover:bg-slate-800 transition-colors"
              >
                <div>
                  <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase mb-1">
                    Step {i + 1}
                  </div>
                  <h3 className="font-semibold text-slate-100 text-sm">{agent.title.split(" — ")[1]}</h3>
                  <div className="text-[11px] text-slate-400 font-medium mt-1">{agent.role}</div>
                  <p className="text-[11px] text-slate-400/90 mt-2 leading-relaxed">{agent.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
            <span>Graph Supervisor: Deterministic LangGraph state conditional edges</span>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              <span>Test the Live Assistant</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="font-display text-3xl font-bold text-slate-900">
          How It Works in 3 Steps
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mt-8">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-sm flex items-center justify-center mb-4">
              1
            </span>
            <h3 className="font-bold text-slate-900 text-base mb-1">Define Your Shopping Needs</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Enter your budget, dietary constraints, number of people, and duration in days using natural language.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-sm flex items-center justify-center mb-4">
              2
            </span>
            <h3 className="font-bold text-slate-900 text-base mb-1">Agents Research & Assemble</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Agents search verified inventory, compare costs, replace expensive options, and calculate exact totals.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-sm flex items-center justify-center mb-4">
              3
            </span>
            <h3 className="font-bold text-slate-900 text-base mb-1">Approve & Pay Seamlessly</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Review every item, approve the proposal version, and proceed to secure Razorpay checkout.
            </p>
          </div>
        </div>

        <div className="pt-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3.5 rounded-xl shadow-md transition-all text-sm"
          >
            <span>Launch CartPilot AI Assistant</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
