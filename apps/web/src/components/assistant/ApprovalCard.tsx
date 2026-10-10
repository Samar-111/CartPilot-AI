"use client";

import React, { useState } from "react";
import {
  CheckCheck,
  XCircle,
  ShoppingBag,
  AlertTriangle,
  ShieldCheck,
  TrendingDown
} from "lucide-react";
import { ProposedCartItem, ShoppingPlan, paiseToRupees } from "@cartpilot/shared";

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
  const percentageSpent = Math.min(100, Math.round((totalPaise / budgetPaise) * 100));

  return (
    <div className="bg-[#141815] rounded-2xl border border-[#2E3B31] p-6 shadow-command space-y-6">
      <div className="flex items-center justify-between border-b border-[#232B25] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#1B211C] border border-[#2E3B31] flex items-center justify-center text-[#C6FF4D]">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-display font-bold text-[#F4F5EF] text-base">
              Proposed Cart Assembly
            </h2>
            <p className="text-[11px] font-mono text-[#929A91]">
              Deterministic line-item calculations verified by Agent 5
            </p>
          </div>
        </div>
        <span className="text-xs font-mono bg-[#0B0D0C] text-[#C6FF4D] border border-[rgba(198,255,77,0.3)] px-2.5 py-0.5 rounded-full font-bold">
          Proposal v{proposalVersion}
        </span>
      </div>

      <div className="bg-[#0B0D0C] rounded-xl p-4 border border-[#232B25] space-y-2 font-mono">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#929A91]">Budget Ceiling Allocation</span>
          <span className="font-bold text-[#F4F5EF]">
            {paiseToRupees(totalPaise)} / {paiseToRupees(budgetPaise)} ({percentageSpent}%)
          </span>
        </div>
        <div className="w-full bg-[#141815] h-2 rounded-full overflow-hidden border border-[#1F2620]">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              isOverBudget ? "bg-rose-500" : "bg-[#C6FF4D]"
            }`}
            style={{ width: `${percentageSpent}%` }}
          />
        </div>
      </div>

      {plan && (
        <div className="bg-[#0B0D0C] border border-[#232B25] rounded-xl p-3.5 text-xs text-[#929A91] space-y-1 font-sans">
          <span className="font-mono font-bold text-[10px] uppercase tracking-wider text-[#8DCBFF] block">
            Planner Strategic Rationale
          </span>
          <p className="leading-relaxed">{plan.rationale}</p>
        </div>
      )}

      {validationMessage && (
        <div
          className={`flex items-start gap-2.5 p-3.5 rounded-xl text-xs border ${
            isOverBudget
              ? "bg-rose-950/30 text-rose-300 border-rose-800"
              : "bg-[rgba(198,255,77,0.06)] text-[#F4F5EF] border-[rgba(198,255,77,0.25)]"
          }`}
        >
          {isOverBudget ? (
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
          ) : (
            <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#C6FF4D]" />
          )}
          <span className="leading-relaxed font-medium">{validationMessage}</span>
        </div>
      )}

      <div className="divide-y divide-[#1F2620] max-h-80 overflow-y-auto pr-1">
        {proposedItems.map((item) => (
          <div key={item.productId} className="py-3 flex items-start justify-between text-sm gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#F4F5EF] text-xs sm:text-sm">{item.name}</span>
                <span className="text-[11px] font-mono text-[#667065]">({item.unit})</span>
              </div>
              <p className="text-[11px] text-[#929A91] mt-0.5 leading-relaxed font-sans">{item.reason}</p>
            </div>
            <div className="text-right flex-shrink-0 font-mono">
              <div className="text-[10px] text-[#667065]">
                {item.quantity} × {paiseToRupees(item.unitPricePaise)}
              </div>
              <div className="font-bold text-[#F4F5EF] text-xs sm:text-sm">
                {paiseToRupees(item.subtotalPaise)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-[#232B25] pt-4 flex items-center justify-between text-sm font-mono">
        <div>
          <span className="text-[#667065] text-xs block">Verified Subtotal</span>
          <div className="font-display text-xl font-extrabold text-[#F4F5EF]">
            {paiseToRupees(totalPaise)}
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-[#667065] block">Ceiling Margin</span>
          <div
            className={`text-xs font-bold inline-flex items-center gap-1 ${
              isOverBudget ? "text-rose-400" : "text-[#C6FF4D]"
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
        <div className="space-y-3 pt-2 border-t border-[#232B25]">
          <textarea
            value={rejectFeedback}
            onChange={(e) => setRejectFeedback(e.target.value)}
            placeholder="Instruct the agents on what to alter (e.g. choose cheaper oats, swap tofu with lentils)..."
            rows={2}
            className="w-full text-xs rounded-xl border border-[#2E3B31] p-3 focus:outline-none focus:border-[#C6FF4D] bg-[#0B0D0C] text-[#F4F5EF]"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onReject(rejectFeedback)}
              disabled={isSubmitting}
              className="flex-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold py-2.5 rounded-xl transition-all"
            >
              Trigger Replanning Loop
            </button>
            <button
              type="button"
              onClick={() => setShowRejectForm(false)}
              className="px-4 text-xs font-medium text-[#929A91] hover:text-[#F4F5EF] rounded-xl"
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
            className="flex-1 flex items-center justify-center gap-2 bg-[#C6FF4D] hover:bg-[#B6F53D] disabled:bg-[#1B211C] disabled:text-[#667065] text-[#0B0D0C] font-bold py-3 rounded-xl text-xs sm:text-sm transition-all shadow-lime-glow"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Approve Proposal & Add to Cart</span>
          </button>
          <button
            type="button"
            onClick={() => setShowRejectForm(true)}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-1.5 border border-[#2E3B31] hover:border-[#8DCBFF] text-[#F4F5EF] font-semibold py-3 px-4 rounded-xl text-xs sm:text-sm transition-colors bg-[#0B0D0C]"
          >
            <XCircle className="w-4 h-4 text-rose-400" />
            <span>Request Revision</span>
          </button>
        </div>
      )}
    </div>
  );
}
