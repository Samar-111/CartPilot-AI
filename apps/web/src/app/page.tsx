"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Cpu,
  ShoppingBag,
  Terminal,
  Activity,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Sliders,
  DollarSign,
  ChevronRight
} from "lucide-react";
import { paiseToRupees } from "@cartpilot/shared";

export default function HomePage() {
  const router = useRouter();
  const [missionInput, setMissionInput] = useState(
    "Stock my pantry for 7 days, 2 adults, vegetarian high-protein, max ₹2,000"
  );
  const [targetBudget, setTargetBudget] = useState(2000);

  const sampleProducts = [
    {
      name: "Organic Rolled Oats (1kg)",
      category: "Grains",
      price: "₹180",
      reason: "High complex carbohydrates & fiber for breakfasts",
      status: "Verified Stock"
    },
    {
      name: "Fresh Soya Paneer Tofu (400g)",
      category: "Protein",
      price: "₹140",
      reason: "Optimal cost-to-protein ratio (52g protein)",
      status: "Verified Stock"
    },
    {
      name: "Greek Style Natural Yogurt (800g)",
      category: "Dairy",
      price: "₹220",
      reason: "Probiotics & clean calcium source",
      status: "Verified Stock"
    },
    {
      name: "Farm Fresh Green Spinach (500g)",
      category: "Vegetables",
      price: "₹65",
      reason: "Micronutrient density & dietary iron",
      status: "Verified Stock"
    }
  ];

  const workflowSteps = [
    {
      num: "01",
      agent: "Agent 1: Shopping Planner",
      title: "Decomposition & Strategy",
      desc: "Translates high-level natural language instructions into concrete macro targets, dietary filters, and category budget splits."
    },
    {
      num: "02",
      agent: "Agent 2: Catalog Research",
      title: "Ground-Truth Querying",
      desc: "Directly queries MongoDB fulfillment center inventory for live stock levels, units, and verified prices without guessing."
    },
    {
      num: "03",
      agent: "Agent 3: Recommendation",
      title: "Nutritional & Price Optimization",
      desc: "Scores candidates against dietary constraints and automatically substitutes expensive options with nutrient-dense alternatives."
    },
    {
      num: "04",
      agent: "Agent 4 & 5: Assembly & Validator",
      title: "Deterministic Validation",
      desc: "Computes integer-paise line totals and triggers automatic replanning loops if any hard spending caps are crossed."
    }
  ];

  const handleLaunchMission = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div className="space-y-28 pb-20">
      <section className="relative pt-12 md:pt-20 pb-16 overflow-hidden command-grid ambient-lime">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141815] border border-[#232B25] text-[11px] font-mono text-[#929A91]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C6FF4D] animate-ping" />
                <span className="text-[#C6FF4D]">AGENTIC COMMERCE ENGINE</span>
                <span>•</span>
                <span>Deterministic Guardrails</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#F4F5EF] leading-[1.08]">
                Shopping, <br />
                <span className="text-[#C6FF4D]">on autopilot.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#929A91] leading-relaxed max-w-xl">
                Tell CartPilot what you need. Intelligent agents find the right products, balance your budget, and prepare your cart for your approval.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 bg-[#C6FF4D] hover:bg-[#B6F53D] text-[#0B0D0C] font-semibold px-6 py-3.5 rounded-xl transition-all shadow-lime-glow text-sm"
                >
                  <Terminal className="w-4 h-4" />
                  <span>Build my cart</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 bg-[#141815] hover:bg-[#1B211C] text-[#F4F5EF] font-medium px-5 py-3.5 rounded-xl border border-[#232B25] hover:border-[#2E3B31] transition-all text-sm"
                >
                  <ShoppingBag className="w-4 h-4 text-[#929A91]" />
                  <span>Explore the experience</span>
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#1B211C] font-mono text-xs">
                <div>
                  <div className="text-[#F4F5EF] font-bold text-lg">5 Agents</div>
                  <div className="text-[#667065] text-[11px]">Coordinated Graph</div>
                </div>
                <div>
                  <div className="text-[#C6FF4D] font-bold text-lg">₹0 Overspend</div>
                  <div className="text-[#667065] text-[11px]">Hard Cap Enforced</div>
                </div>
                <div>
                  <div className="text-[#8DCBFF] font-bold text-lg">Zero LLM Hallucinations</div>
                  <div className="text-[#667065] text-[11px]">Ground-Truth Catalog</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative bg-[#141815] border border-[#2E3B31] rounded-2xl p-5 shadow-command">
                <div className="flex items-center justify-between pb-3.5 border-b border-[#232B25] text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2E3B31]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2E3B31]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2E3B31]" />
                    <span className="font-mono text-[11px] text-[#929A91] ml-1">
                      session.active_workspace_preview
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[rgba(198,255,77,0.12)] border border-[rgba(198,255,77,0.25)] text-[#C6FF4D] font-mono text-[10px]">
                    <Activity className="w-3 h-3" />
                    <span>ORCHESTRATING</span>
                  </div>
                </div>

                <div className="mt-4 p-3.5 rounded-xl bg-[#0B0D0C] border border-[#1F2620]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[10px] text-[#667065] uppercase tracking-wider">
                      Target Shopping Mission
                    </span>
                    <span className="font-mono text-[11px] text-[#8DCBFF]">7 Days • 2 Adults</span>
                  </div>
                  <p className="text-xs text-[#F4F5EF] mt-1 font-medium leading-relaxed">
                    &quot;Weekly high-protein pantry staples under ₹2,000. Prioritize eggs, lentils, oats, and seasonal greens.&quot;
                  </p>
                </div>

                <div className="mt-4 p-3.5 rounded-xl bg-[#1B211C] border border-[#2E3B31] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[#929A91] text-[11px]">Budget Limit & Estimated Spend</span>
                    <span className="font-mono font-bold text-[#C6FF4D]">
                      ₹1,845 / ₹2,000 (92%)
                    </span>
                  </div>
                  <div className="w-full bg-[#0B0D0C] h-2 rounded-full overflow-hidden border border-[#232B25]">
                    <div className="bg-[#C6FF4D] h-full rounded-full transition-all duration-700" style={{ width: "92%" }} />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#667065]">
                    <span>Enforced by Agent 5 Validator</span>
                    <span className="text-[#C6FF4D]">₹155 remaining margin</span>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="text-[10px] font-mono text-[#667065] uppercase tracking-wider">
                    Assembled Catalog Candidates (Live Preview)
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {sampleProducts.slice(0, 2).map((item, idx) => (
                      <div key={idx} className="bg-[#0B0D0C] border border-[#232B25] rounded-lg p-2.5">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-mono text-[#8DCBFF] uppercase">{item.category}</span>
                          <span className="text-xs font-mono font-bold text-[#F4F5EF]">{item.price}</span>
                        </div>
                        <div className="text-xs font-medium text-[#F4F5EF] mt-1 truncate">{item.name}</div>
                        <div className="text-[9px] font-mono text-[#C6FF4D] mt-1 flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>{item.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#232B25] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] font-mono text-[#929A91]">
                    <Clock className="w-3 h-3 text-[#C6FF4D]" />
                    <span>Agent 4: Cart proposals locked for user review</span>
                  </div>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-1 text-xs font-mono text-[#C6FF4D] hover:underline"
                  >
                    <span>Inspect</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#141815] border border-[#2E3B31] rounded-2xl p-6 sm:p-8 relative shadow-command">
          <div className="flex items-center gap-2 mb-3">
            <Terminal className="w-4 h-4 text-[#C6FF4D]" />
            <span className="font-mono text-xs uppercase tracking-wider text-[#929A91]">
              Mission Directive 01
            </span>
          </div>
          <h2 className="font-display text-2xl font-bold text-[#F4F5EF]">
            Launch a Shopping Mission
          </h2>
          <p className="text-xs text-[#929A91] mt-1 max-w-xl">
            Describe your household requirements in plain English. Our 5-agent team breaks it down, discovers items from real catalog records, and validates constraints.
          </p>

          <form onSubmit={handleLaunchMission} className="mt-6 space-y-4">
            <div className="relative">
              <textarea
                value={missionInput}
                onChange={(e) => setMissionInput(e.target.value)}
                rows={3}
                className="w-full text-xs sm:text-sm rounded-xl border border-[#2E3B31] p-4 focus:outline-none focus:border-[#C6FF4D] bg-[#0B0D0C] text-[#F4F5EF] leading-relaxed font-sans placeholder-[#667065]"
                placeholder="What do you need for your shopping mission? E.g., Groceries for 7 days under ₹2,000..."
              />
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#929A91]">Budget Cap:</span>
                <div className="flex items-center bg-[#0B0D0C] border border-[#232B25] rounded-lg px-2.5 py-1">
                  <span className="text-xs font-mono text-[#C6FF4D] mr-1">₹</span>
                  <input
                    type="number"
                    value={targetBudget}
                    onChange={(e) => setTargetBudget(Number(e.target.value))}
                    className="w-20 bg-transparent text-xs font-mono text-[#F4F5EF] focus:outline-none"
                    step={100}
                    min={500}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 bg-[#C6FF4D] hover:bg-[#B6F53D] text-[#0B0D0C] text-xs font-bold py-3 px-6 rounded-xl transition-all shadow-lime-glow"
              >
                <Terminal className="w-4 h-4" />
                <span>Initialize Mission in AI Console</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </section>

      <section id="workflow" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#232B25] pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-[#C6FF4D] mb-1">
              <Activity className="w-3.5 h-3.5" />
              <span>LangGraph Architecture</span>
            </div>
            <h2 className="font-display text-3xl font-extrabold text-[#F4F5EF] tracking-tight">
              Intelligence at Work
            </h2>
          </div>
          <p className="text-xs font-mono text-[#929A91] max-w-sm">
            Deterministic state graph orchestrating 5 specialized nodes with automated replanning loops.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {workflowSteps.map((step, idx) => (
            <div
              key={idx}
              className="bg-[#141815] border border-[#232B25] rounded-xl p-5 flex flex-col justify-between hover:border-[#2E3B31] transition-all relative group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#C6FF4D]">{step.num}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2E3B31] group-hover:bg-[#C6FF4D] transition-colors" />
                </div>
                <div className="text-[10px] font-mono text-[#8DCBFF] uppercase tracking-wider">
                  {step.agent}
                </div>
                <h3 className="font-display font-bold text-sm text-[#F4F5EF]">{step.title}</h3>
                <p className="text-xs text-[#929A91] leading-relaxed">{step.desc}</p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#1F2620] flex items-center justify-between text-[10px] font-mono text-[#667065]">
                <span>Stage Verified</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C6FF4D]" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#232B25] pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-[#8DCBFF] mb-1">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Ground Truth Catalog</span>
            </div>
            <h2 className="font-display text-3xl font-extrabold text-[#F4F5EF] tracking-tight">
              Picked for Your Mission
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-xs font-mono text-[#C6FF4D] hover:underline"
          >
            <span>View all catalog items</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sampleProducts.map((p, idx) => (
            <div
              key={idx}
              className="bg-[#141815] border border-[#232B25] rounded-xl p-5 flex flex-col justify-between card-hover-command"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                  <span className="text-[#8DCBFF] uppercase">{p.category}</span>
                  <span className="text-[#C6FF4D] bg-[rgba(198,255,77,0.1)] px-1.5 py-0.5 rounded">
                    {p.status}
                  </span>
                </div>
                <h3 className="font-display font-bold text-sm text-[#F4F5EF] mt-1">{p.name}</h3>
                <p className="text-xs text-[#929A91] mt-2 leading-relaxed">{p.reason}</p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#1F2620] flex items-center justify-between">
                <span className="font-mono font-bold text-base text-[#F4F5EF]">{p.price}</span>
                <Link
                  href="/products"
                  className="text-xs font-mono text-[#C6FF4D] hover:underline flex items-center gap-1"
                >
                  <span>Select</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#141815] border border-[#2E3B31] rounded-2xl p-8 sm:p-12 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1B211C] border border-[#2E3B31] text-[10px] font-mono text-[#C6FF4D]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Deterministic Financial Guardrails</span>
              </div>
              <h2 className="font-display text-3xl font-extrabold text-[#F4F5EF]">
                Budget Intelligence You Can Trust
              </h2>
              <p className="text-xs sm:text-sm text-[#929A91] leading-relaxed max-w-xl">
                Unlike generic LLMs that generate arbitrary amounts, CartPilot recalculates cart totals in server-side integer paise. If an agent proposes items exceeding your budget cap, Agent 5 immediately blocks progress and triggers an automated replanning loop.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 font-mono text-xs">
                <div className="bg-[#0B0D0C] p-3 rounded-lg border border-[#232B25]">
                  <div className="text-[#667065] text-[10px]">VERIFICATION</div>
                  <div className="text-[#F4F5EF] font-bold mt-0.5">Strict Integer Paise</div>
                </div>
                <div className="bg-[#0B0D0C] p-3 rounded-lg border border-[#232B25]">
                  <div className="text-[#667065] text-[10px]">GUARDRAILS</div>
                  <div className="text-[#C6FF4D] font-bold mt-0.5">Zero Price Guessing</div>
                </div>
                <div className="bg-[#0B0D0C] p-3 rounded-lg border border-[#232B25] col-span-2 sm:col-span-1">
                  <div className="text-[#667065] text-[10px]">PAYMENT</div>
                  <div className="text-[#8DCBFF] font-bold mt-0.5">Razorpay HMAC</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#0B0D0C] rounded-xl border border-[#232B25] p-5 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-[#667065] text-[10px] pb-2 border-b border-[#1F2620]">
                <span>BUDGET COMPLIANCE AUDIT</span>
                <span className="text-[#C6FF4D]">100% PASSED</span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between text-[#929A91]">
                  <span>User Hard Spending Cap:</span>
                  <span className="text-[#F4F5EF] font-bold">₹2,000.00</span>
                </div>
                <div className="flex justify-between text-[#929A91]">
                  <span>Calculated Proposed Total:</span>
                  <span className="text-[#C6FF4D] font-bold">₹1,845.00</span>
                </div>
                <div className="flex justify-between text-[#929A91]">
                  <span>Remaining Safety Margin:</span>
                  <span className="text-[#8DCBFF] font-bold">₹155.00</span>
                </div>
              </div>
              <div className="pt-2 border-t border-[#1F2620]">
                <div className="text-[10px] text-[#667065]">Status: Approved for human checkpoint</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#141815] border border-[#232B25] text-[10px] font-mono text-[#929A91]">
          <span>READY TO TEST THE WORKFORCE?</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#F4F5EF]">
          Start your autonomous shopping mission today.
        </h2>
        <p className="text-xs sm:text-sm text-[#929A91] max-w-lg mx-auto">
          Experience AI shopping as a command center. No more manually hunting down items or wrestling with budget math.
        </p>
        <div className="pt-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-[#C6FF4D] hover:bg-[#B6F53D] text-[#0B0D0C] font-bold px-8 py-3.5 rounded-xl transition-all shadow-lime-glow text-sm"
          >
            <Terminal className="w-4 h-4" />
            <span>Launch AI Shopping Assistant</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
