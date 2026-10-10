"use client";

import React from "react";
import { Activity, Check, AlertCircle, RefreshCw, Clock, Cpu } from "lucide-react";
import { AgentEvent } from "@cartpilot/shared";

interface AgentTimelineProps {
  events: AgentEvent[];
  currentStatus: string;
}

const nodeDetails: Record<
  string,
  { label: string; agentNum: string; tag: string }
> = {
  parse_request: { label: "Request Parser", agentNum: "Core", tag: "Decomposition" },
  create_plan: { label: "Shopping Planner", agentNum: "Agent 1", tag: "Strategy" },
  search_products: { label: "Product Research", agentNum: "Agent 2", tag: "Catalog Query" },
  rank_products: { label: "Recommendation", agentNum: "Agent 3", tag: "Optimization" },
  build_proposed_cart: { label: "Cart Manager", agentNum: "Agent 4", tag: "Assembly" },
  validate_cart: { label: "Budget & Policy Validator", agentNum: "Agent 5", tag: "Guardrails" },
  revise_plan: { label: "Replanning Loop", agentNum: "Supervisor", tag: "Correction" },
  await_approval: { label: "Human Approval Checkpoint", agentNum: "User", tag: "Decision" },
  apply_approval: { label: "Cart State Persisted", agentNum: "Execution", tag: "Database" }
};

export function AgentTimeline({ events, currentStatus }: AgentTimelineProps) {
  return (
    <div className="bg-[#141815] rounded-2xl border border-[#2E3B31] p-6 shadow-command space-y-6">
      <div className="flex items-center justify-between border-b border-[#232B25] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#1B211C] border border-[#2E3B31] flex items-center justify-center text-[#8DCBFF]">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-display font-bold text-[#F4F5EF] text-base">
              Agent Activity Timeline
            </h2>
            <p className="text-[11px] font-mono text-[#929A91]">
              Live Server-Sent Events (SSE) from LangGraph Orchestrator
            </p>
          </div>
        </div>

        <span
          className={`text-[10px] font-mono px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold border ${
            currentStatus === "awaiting_approval"
              ? "bg-[rgba(198,255,77,0.12)] text-[#C6FF4D] border-[rgba(198,255,77,0.3)]"
              : currentStatus === "approved"
              ? "bg-[rgba(141,203,255,0.12)] text-[#8DCBFF] border-[rgba(141,203,255,0.3)]"
              : currentStatus === "failed"
              ? "bg-rose-950/40 text-rose-400 border-rose-800"
              : "bg-[#0B0D0C] text-[#929A91] border-[#232B25]"
          }`}
        >
          {currentStatus}
        </span>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-20 px-4 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[#0B0D0C] border border-[#232B25] flex items-center justify-center mx-auto text-[#667065]">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-xs font-mono font-bold text-[#F4F5EF]">Agent Graph Standby</h3>
          <p className="text-[11px] text-[#929A91] max-w-xs mx-auto leading-relaxed">
            Submit a shopping prompt to stream real-time LangGraph execution events and deterministic budget verification steps.
          </p>
        </div>
      ) : (
        <div className="relative pl-7 space-y-4 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-px before:bg-[#232B25]">
          {events.map((event, idx) => {
            const isCompleted = event.status === "completed";
            const isFailed = event.status === "failed";
            const isRetrying = event.status === "retrying";
            const info = nodeDetails[event.node] || {
              label: event.node,
              agentNum: "Worker",
              tag: "Graph Node"
            };

            return (
              <div key={event.id || idx} className="relative group">
                <div
                  className={`absolute -left-[1.85rem] top-1 w-6 h-6 rounded-full flex items-center justify-center text-[#0B0D0C] font-bold text-xs shadow-sm ${
                    isCompleted
                      ? "bg-[#C6FF4D]"
                      : isFailed
                      ? "bg-rose-500 text-white"
                      : isRetrying
                      ? "bg-amber-400"
                      : "bg-[#8DCBFF]"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : isFailed ? (
                    <AlertCircle className="w-3.5 h-3.5" />
                  ) : isRetrying ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Clock className="w-3.5 h-3.5" />
                  )}
                </div>

                <div className="bg-[#0B0D0C] border border-[#232B25] rounded-xl p-3.5 text-xs transition-all hover:border-[#2E3B31]">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#141815] text-[#8DCBFF] border border-[#232B25]">
                        {info.agentNum}
                      </span>
                      <span className="font-mono font-bold text-[#F4F5EF] text-xs">{info.label}</span>
                    </div>

                    {event.durationMs !== undefined && (
                      <span className="text-[10px] font-mono text-[#667065]">
                        {event.durationMs}ms
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#929A91] leading-relaxed font-sans">{event.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
