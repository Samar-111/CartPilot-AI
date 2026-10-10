"use client";

import React from "react";
import { Activity, CheckCircle2, Clock, AlertCircle, RefreshCw } from "lucide-react";
import { AgentEvent } from "@cartpilot/shared";

interface AgentTimelineProps {
  events: AgentEvent[];
  currentStatus: string;
}

const nodeLabels: Record<string, string> = {
  parse_request: "Request Parser",
  create_plan: "Agent 1: Shopping Planner",
  search_products: "Agent 2: Product Research",
  rank_products: "Agent 3: Recommendation",
  build_proposed_cart: "Agent 4: Cart Manager",
  validate_cart: "Agent 5: Budget & Policy Validator",
  revise_plan: "Workflow Replanner Loop",
  await_approval: "Human Approval Checkpoint",
  apply_approval: "Cart State Persisted"
};

export function AgentTimeline({ events, currentStatus }: AgentTimelineProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-slate-800">Agent Activity Timeline</h2>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full font-semibold uppercase bg-slate-100 text-slate-700">
          Status: {currentStatus}
        </span>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-10 text-slate-400 text-sm">
          Awaiting shopping task. Launch a workflow to inspect agent steps in real-time.
        </div>
      ) : (
        <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {events.map((event, idx) => {
            const isCompleted = event.status === "completed";
            const isFailed = event.status === "failed";
            const isRetrying = event.status === "retrying";

            return (
              <div key={event.id || idx} className="relative">
                <div
                  className={`absolute -left-[1.65rem] top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-white ${
                    isCompleted
                      ? "bg-emerald-500"
                      : isFailed
                      ? "bg-rose-500"
                      : isRetrying
                      ? "bg-amber-500"
                      : "bg-indigo-500"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : isFailed ? (
                    <AlertCircle className="w-3.5 h-3.5" />
                  ) : isRetrying ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Clock className="w-3.5 h-3.5" />
                  )}
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 text-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-800 text-xs">
                      {nodeLabels[event.node] || event.node}
                    </span>
                    {event.durationMs !== undefined && (
                      <span className="text-[11px] text-slate-400 font-mono">
                        {event.durationMs}ms
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600">{event.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
