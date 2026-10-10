"use client";

import React from "react";
import { Activity, CheckCircle2, Clock, AlertCircle, RefreshCw, Cpu, Check } from "lucide-react";
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
  search_products: { label: "Product Research", agentNum: "Agent 2", tag: "Grounding" },
  rank_products: { label: "Recommendation", agentNum: "Agent 3", tag: "Preference Match" },
  build_proposed_cart: { label: "Cart Manager", agentNum: "Agent 4", tag: "Calculation" },
  validate_cart: { label: "Budget & Policy Validator", agentNum: "Agent 5", tag: "Deterministic" },
  revise_plan: { label: "Replanning Loop", agentNum: "Supervisor", tag: "Feedback Loop" },
  await_approval: { label: "Human Approval Checkpoint", agentNum: "User", tag: "Checkpoint" },
  apply_approval: { label: "Cart State Persisted", agentNum: "Execution", tag: "Storage" }
};

export function AgentTimeline({ events, currentStatus }: AgentTimelineProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-display font-bold text-slate-900 text-base">
              Agent Activity Timeline
            </h2>
            <p className="text-[11px] text-slate-400">
              Live Server-Sent Events (SSE) from LangGraph Orchestrator
            </p>
          </div>
        </div>

        <span
          className={`text-[11px] px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
            currentStatus === "awaiting_approval"
              ? "bg-amber-100 text-amber-900 border border-amber-200"
              : currentStatus === "approved"
              ? "bg-emerald-100 text-emerald-900 border border-emerald-200"
              : currentStatus === "failed"
              ? "bg-rose-100 text-rose-900 border border-rose-200"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          {currentStatus}
        </span>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-16 px-4 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-700">Awaiting Shopping Task</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            Click &apos;Launch Autonomous Shopping Workflow&apos; to watch the 5 agents coordinate in real time.
          </p>
        </div>
      ) : (
        <div className="relative pl-7 space-y-5 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200/80">
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
                  className={`absolute -left-[1.85rem] top-1 w-6 h-6 rounded-full flex items-center justify-center text-white shadow-sm ${
                    isCompleted
                      ? "bg-emerald-500 shadow-emerald-500/20"
                      : isFailed
                      ? "bg-rose-500 shadow-rose-500/20"
                      : isRetrying
                      ? "bg-amber-500 shadow-amber-500/20"
                      : "bg-indigo-500 shadow-indigo-500/20"
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

                <div className="bg-slate-50/70 border border-slate-200/70 rounded-xl p-3.5 text-sm transition-all group-hover:bg-white group-hover:shadow-subtle">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                        {info.agentNum}
                      </span>
                      <span className="font-bold text-slate-900 text-xs">{info.label}</span>
                    </div>

                    {event.durationMs !== undefined && (
                      <span className="text-[10px] font-mono font-medium text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-100">
                        {event.durationMs}ms
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">{event.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
