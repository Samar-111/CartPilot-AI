import React from "react";
import Link from "next/link";
import { Sparkles, Shield, Cpu, RefreshCw, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white/60 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                CP
              </div>
              <span className="font-display font-bold text-lg text-slate-900 tracking-tight">
                CartPilot <span className="text-emerald-600">AI</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              Autonomous multi-agent shopping workforce coordinating budget planning, product research, recommendations, and cart management under strict deterministic constraints.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-600" /> Server-side Price Verification
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-emerald-600" /> LangGraph Orchestrated
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-900 mb-3">Navigation</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/" className="hover:text-emerald-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-emerald-600 transition-colors">
                  AI Shopping Assistant
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-emerald-600 transition-colors">
                  Discover Catalog
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-emerald-600 transition-colors">
                  My Cart
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-emerald-600 transition-colors">
                  Order History
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-900 mb-3">AI Workforce</h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>Agent 1 — Shopping Planner</li>
              <li>Agent 2 — Product Research</li>
              <li>Agent 3 — Recommendation</li>
              <li>Agent 4 — Cart Manager</li>
              <li>Agent 5 — Budget & Policy Validator</li>
              <li className="pt-2 text-emerald-600 font-medium">Razorpay Payment Integration</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} CartPilot AI. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Strictly deterministic financial validation</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
