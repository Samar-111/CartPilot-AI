import React from "react";
import Link from "next/link";
import { Terminal, Shield, Cpu, ExternalLink, Activity } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#232B25] bg-[#0B0D0C] mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded bg-[#141815] border border-[#2E3B31] flex items-center justify-center">
                <div className="w-2 h-2 bg-[#C6FF4D] rotate-45" />
              </div>
              <span className="font-display font-bold text-base text-[#F4F5EF] tracking-tight">
                CARTPILOT <span className="text-[#C6FF4D]">AI</span>
              </span>
            </div>
            <p className="text-xs text-[#929A91] max-w-sm leading-relaxed">
              Autonomous multi-agent shopping command center. Coordinated LLM reasoning paired with deterministic financial guardrails and server-verified inventory.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-[#667065] pt-1">
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-[#C6FF4D]" /> Server-Side Verification
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-[#8DCBFF]" /> LangGraph State Graph
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-[#C6FF4D]" /> Real-time SSE
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-[#F4F5EF] mb-3">Navigation</h4>
            <ul className="space-y-2 text-xs text-[#929A91]">
              <li>
                <Link href="/" className="hover:text-[#C6FF4D] transition-colors">
                  System Overview
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[#C6FF4D] transition-colors">
                  AI Assistant Console
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-[#C6FF4D] transition-colors">
                  Live Catalog Discovery
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-[#C6FF4D] transition-colors">
                  Active Cart State
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-[#C6FF4D] transition-colors">
                  Order Invoices & History
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-[#F4F5EF] mb-3">Agent Topology</h4>
            <ul className="space-y-1.5 text-[11px] font-mono text-[#929A91]">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C6FF4D]" /> Agent 1: Shopping Planner
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8DCBFF]" /> Agent 2: Catalog Research
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C6FF4D]" /> Agent 3: Recommendation
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8DCBFF]" /> Agent 4: Cart Assembly
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C6FF4D]" /> Agent 5: Budget Guardrail
              </li>
              <li className="pt-1.5 text-[#C6FF4D]">Razorpay HMAC Verified</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#1B211C] pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#667065] gap-4">
          <p>© {new Date().getFullYear()} CartPilot AI. Autonomous commerce infrastructure.</p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C6FF4D]" />
            <span className="text-[#929A91]">Status: All Nodes Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
