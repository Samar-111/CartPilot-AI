"use client";

import React, { useState } from "react";
import { CheckCheck, XCircle, ShoppingBag, AlertTriangle, ShieldCheck } from "lucide-react";
import { ProposedCartItem, ShoppingPlan } from "@cartpilot/shared";

interface ApprovalCardProps {
  proposedItems: ProposedCartItem[];
  totalPaise: number;
  budgetPaise: number;
  plan?: ShoppingPlan;
  proposalVersion: number;
  validationMessage?: string;
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
  onApprove,
  onReject,
  isSubmitting
}: ApprovalCardProps) {
  const [rejectFeedback, setRejectFeedback] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  const isOverBudget = totalPaise > budgetPaise;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-semibold text-slate-800">Proposed Grocery Cart</h2>
        </div>
        <span className="text-xs font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full">
          Proposal v{proposalVersion}
        </span>
      </div>

      {plan && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600">
          <span className="font-semibold text-slate-800">Plan Rationale:</span> {plan.rationale}
        </div>
      )}

      {validationMessage && (
        <div
          className={`flex items-start gap-2 p-3 rounded-lg text-xs ${
            isOverBudget
              ? "bg-rose-50 text-rose-700 border border-rose-200"
              : "bg-emerald-50 text-emerald-800 border border-emerald-200"
          }`}
        >
          {isOverBudget ? (
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          ) : (
            <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
          )}
          <span>{validationMessage}</span>
        </div>
      )}

      <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
        {proposedItems.map((item) => (
          <div key={item.productId} className="py-2.5 flex items-center justify-between text-sm">
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-800">{item.name}</span>
                <span className="text-xs text-slate-400">({item.unit})</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{item.reason}</p>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500">
                {item.quantity} × ₹{(item.unitPricePaise / 100).toFixed(2)}
              </div>
              <div className="font-semibold text-slate-800">
                ₹{(item.subtotalPaise / 100).toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-sm">
        <div>
          <span className="text-slate-500 text-xs">Total / Budget Limit:</span>
          <div className="text-base font-bold text-slate-800">
            ₹{(totalPaise / 100).toFixed(2)}{" "}
            <span className="text-xs font-normal text-slate-500">/ ₹{(budgetPaise / 100).toFixed(2)}</span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-500">Difference:</span>
          <div className={`text-xs font-semibold ${isOverBudget ? "text-rose-600" : "text-emerald-600"}`}>
            {isOverBudget
              ? `+₹${((totalPaise - budgetPaise) / 100).toFixed(2)} over`
              : `₹${((budgetPaise - totalPaise) / 100).toFixed(2)} saved`}
          </div>
        </div>
      </div>

      {showRejectForm ? (
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <textarea
            value={rejectFeedback}
            onChange={(e) => setRejectFeedback(e.target.value)}
            placeholder="Tell the agent what to adjust (e.g., replace tofu with paneer, reduce oats)..."
            rows={2}
            className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onReject(rejectFeedback)}
              disabled={isSubmitting}
              className="flex-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium py-2 rounded-lg transition-colors"
            >
              Confirm Rejection & Replan
            </button>
            <button
              type="button"
              onClick={() => setShowRejectForm(false)}
              className="px-3 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onApprove}
            disabled={isSubmitting || proposedItems.length === 0}
            className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-medium py-2.5 rounded-lg text-sm transition-colors shadow-sm"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Approve & Add to Cart</span>
          </button>
          <button
            type="button"
            onClick={() => setShowRejectForm(true)}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium py-2.5 px-4 rounded-lg text-sm transition-colors"
          >
            <XCircle className="w-4 h-4 text-rose-500" />
            <span>Reject / Edit</span>
          </button>
        </div>
      )}
    </div>
  );
}
