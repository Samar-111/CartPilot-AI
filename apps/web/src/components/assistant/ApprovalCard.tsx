"use client";

import React, { useState } from "react";
import {
  CheckCheck,
  XCircle,
  ShoppingBag,
  AlertTriangle,
  ShieldCheck,
  TrendingDown,
  Layers,
  ArrowRight
} from "lucide-react";
import { ProposedCartItem, ShoppingPlan, paiseToRupees } from "@cartpilot/shared";
import Link from "next/link";

interface ApprovalCardProps {
  proposedItems: ProposedCartItem[];
  totalPaise: number;
  budgetPaise: number;
  plan?: ShoppingPlan;
  proposalVersion: number;
  validationMessage?: string;
  durationDays?: number;
  peopleCount?: number;
  onApprove: () => void;
  onReject: (feedback: string) => void;
  isSubmitting: boolean;
}

export function ApprovalCard({
  proposedItems,
  totalPaise,
  budgetPaise,
  plan,
  proposalVersion,
  validationMessage,
  durationDays,
  peopleCount,
  onApprove,
  onReject,
  isSubmitting
}: ApprovalCardProps) {
  const [rejectFeedback, setRejectFeedback] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  const isOverBudget = totalPaise > budgetPaise;
  const percentageSpent = Math.min(100, Math.round((totalPaise / budgetPaise) * 100));

  const daysDisplay = durationDays || plan?.durationDays;
  const peopleDisplay = peopleCount || plan?.peopleCount;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-display font-bold text-slate-900 text-base">
              Proposed Cart Assembly
            </h2>
            <p className="text-[11px] text-slate-400">
              {daysDisplay ? `${daysDisplay} Days (${Math.round(daysDisplay / 7)} wks)` : "Custom"} • {peopleDisplay ? `${peopleDisplay} Persons` : "Household"} • Verified by Agent 5
            </p>
          </div>
        </div>
        <span className="text-xs font-mono bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2.5 py-0.5 rounded-full font-bold">
          Proposal v{proposalVersion}
        </span>
      </div>

      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-600">Budget Consumption</span>
          <span className="font-bold text-slate-900">
            {paiseToRupees(totalPaise)} / {paiseToRupees(budgetPaise)} ({percentageSpent}%)
          </span>
        </div>
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              isOverBudget ? "bg-rose-500" : "bg-emerald-500"
            }`}
            style={{ width: `${percentageSpent}%` }}
          />
        </div>
      </div>

      {plan && (
        <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3.5 text-xs text-slate-600 space-y-1">
          <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider text-slate-400">
            Planner Rationale
          </span>
          <p className="leading-relaxed">{plan.rationale}</p>
        </div>
      )}

      {validationMessage && (
        <div
          className={`flex items-start gap-2.5 p-3.5 rounded-xl text-xs ${
            isOverBudget
              ? "bg-rose-50 text-rose-800 border border-rose-200"
              : "bg-emerald-50 text-emerald-800 border border-emerald-200"
          }`}
        >
          {isOverBudget ? (
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
          ) : (
            <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-600" />
          )}
          <span className="leading-relaxed font-medium">{validationMessage}</span>
        </div>
      )}

      <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto pr-1">
        {proposedItems.map((item) => (
          <div key={item.productId} className="py-3 flex items-start justify-between text-sm gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-xs sm:text-sm">{item.name}</span>
                <span className="text-[11px] text-slate-400">({item.unit})</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{item.reason}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-[11px] text-slate-400">
                {item.quantity} × {paiseToRupees(item.unitPricePaise)}
              </div>
              <div className="font-display font-bold text-slate-900 text-xs sm:text-sm">
                {paiseToRupees(item.subtotalPaise)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-200/80 pt-4 flex items-center justify-between text-sm">
        <div>
          <span className="text-slate-400 text-xs block">Verified Subtotal</span>
          <div className="font-display text-lg font-extrabold text-slate-900">
            {paiseToRupees(totalPaise)}
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 block">Variance</span>
          <div
            className={`text-xs font-bold inline-flex items-center gap-1 ${
              isOverBudget ? "text-rose-600" : "text-emerald-600"
            }`}
          >
            {!isOverBudget && <TrendingDown className="w-3.5 h-3.5" />}
            <span>
              {isOverBudget
                ? `+${paiseToRupees(totalPaise - budgetPaise)} over limit`
                : `${paiseToRupees(budgetPaise - totalPaise)} remaining under cap`}
            </span>
          </div>
        </div>
      </div>

      {showRejectForm ? (
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <textarea
            value={rejectFeedback}
            onChange={(e) => setRejectFeedback(e.target.value)}
            placeholder="Tell the agents what to revise (e.g. swap tofu with paneer, reduce oats quantity)..."
            rows={2}
            className="w-full text-xs rounded-xl border border-slate-200 p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onReject(rejectFeedback)}
              disabled={isSubmitting}
              className="flex-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold py-2.5 rounded-xl transition-all shadow-sm"
            >
              Trigger Replanning Loop
            </button>
            <button
              type="button"
              onClick={() => setShowRejectForm(false)}
              className="px-4 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={onApprove}
            disabled={isSubmitting || proposedItems.length === 0}
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-semibold py-3 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/30"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Approve Proposal & Add to Cart</span>
          </button>
          <button
            type="button"
            onClick={() => setShowRejectForm(true)}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-3 px-4 rounded-xl text-xs sm:text-sm transition-colors"
          >
            <XCircle className="w-4 h-4 text-rose-500" />
            <span>Request Revision</span>
          </button>
        </div>
      )}
    </div>
  );
}
