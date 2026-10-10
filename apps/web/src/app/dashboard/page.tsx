"use client";

import React, { useState, useEffect } from "react";
import { ChatPanel } from "@/components/assistant/ChatPanel";
import { AgentTimeline } from "@/components/assistant/AgentTimeline";
import { ApprovalCard } from "@/components/assistant/ApprovalCard";
import { apiFetch } from "@/lib/api";
import { AgentEvent, ShoppingSession } from "@cartpilot/shared";
import { useRouter } from "next/navigation";
import { Terminal, Shield, Activity, Sparkles } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [currentSession, setCurrentSession] = useState<ShoppingSession | null>(null);
  const [events, setEvents] = useState<AgentEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function initUser() {
      try {
        let token = localStorage.getItem("cartpilot_token");
        if (!token) {
          const res = await fetch("http://localhost:5000/api/v1/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "shopper@cartpilot.ai", name: "Shopper Demo" })
          });
          const data = await res.json();
          if (data.token) {
            localStorage.setItem("cartpilot_token", data.token);
          }
        }
      } catch (err) {
        console.error("Auth init err:", err);
      }
    }
    initUser();
  }, []);

  useEffect(() => {
    if (!currentSession?.id) return;

    let isMounted = true;
    const token = typeof window !== "undefined" ? localStorage.getItem("cartpilot_token") : null;
    const sseUrl = `http://localhost:5000/api/v1/shopping-sessions/${currentSession.id}/events?token=${token || ""}`;
    const eventSource = new EventSource(sseUrl);

    const updateSession = async () => {
      try {
        const sess = await apiFetch<ShoppingSession>(`/shopping-sessions/${currentSession.id}`);
        if (!isMounted) return;
        setCurrentSession(sess);
        if (
          sess.status === "awaiting_approval" ||
          sess.status === "approved" ||
          sess.status === "failed" ||
          sess.status === "rejected"
        ) {
          setIsLoading(false);
        }
      } catch (err) {}
    };

    eventSource.addEventListener("agent_event", (e) => {
      try {
        const ev: AgentEvent = JSON.parse(e.data);
        if (!isMounted) return;
        setEvents((prev) => {
          if (prev.some((p) => p.id === ev.id)) return prev;
          return [...prev, ev];
        });
        updateSession();
      } catch (err) {
        console.error("SSE parse error:", err);
      }
    });

    eventSource.onerror = () => {};

    const pollInterval = setInterval(() => {
      updateSession();
    }, 1200);

    return () => {
      isMounted = false;
      eventSource.close();
      clearInterval(pollInterval);
    };
  }, [currentSession?.id]);

  const handleLaunchWorkflow = async (data: {
    request: string;
    budgetPaise: number;
    peopleCount: number;
    durationDays: number;
    preferences: string[];
  }) => {
    setIsLoading(true);
    setEvents([]);
    try {
      const res = await apiFetch<{ sessionId: string }>("/shopping-sessions", {
        method: "POST",
        body: JSON.stringify(data)
      });

      const initialSession = await apiFetch<ShoppingSession>(`/shopping-sessions/${res.sessionId}`);
      setCurrentSession(initialSession);
    } catch (err: any) {
      alert(`Workflow error: ${err.message}`);
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!currentSession) return;
    setIsSubmitting(true);
    try {
      await apiFetch(`/shopping-sessions/${currentSession.id}/approval`, {
        method: "POST",
        body: JSON.stringify({
          approved: true,
          proposalVersion: currentSession.proposalVersion
        })
      });
      router.push("/cart");
    } catch (err: any) {
      alert(`Approval error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async (feedback: string) => {
    if (!currentSession) return;
    setIsSubmitting(true);
    try {
      await apiFetch(`/shopping-sessions/${currentSession.id}/revise`, {
        method: "POST",
        body: JSON.stringify({
          modification: feedback || "Please choose alternative cheaper items."
        })
      });
      const updated = await apiFetch<ShoppingSession>(`/shopping-sessions/${currentSession.id}`);
      setCurrentSession(updated);
      setIsLoading(true);
    } catch (err: any) {
      alert(`Rejection error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#232B25] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#C6FF4D] mb-1">
            <Terminal className="w-3.5 h-3.5" />
            <span>AI SHOPPING COMMAND CENTER</span>
          </div>
          <h1 className="font-display text-3xl font-extrabold text-[#F4F5EF] tracking-tight">
            Autonomous Workforce Console
          </h1>
          <p className="text-xs sm:text-sm text-[#929A91] mt-1 max-w-xl">
            Live multi-agent orchestration for constraint-based weekly grocery shopping. Coordinated graph state streamed via SSE.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-[#141815] border border-[#232B25] text-xs font-mono text-[#929A91] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C6FF4D] animate-ping" />
            <span>LangGraph Engine</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-[#141815] border border-[#232B25] text-xs font-mono text-[#8DCBFF] flex items-center gap-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Strict Guardrails</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 space-y-6">
          <ChatPanel onSubmit={handleLaunchWorkflow} isLoading={isLoading} />
          {currentSession && (
            <ApprovalCard
              proposedItems={currentSession.proposedItems}
              totalPaise={currentSession.totalPaise}
              budgetPaise={currentSession.budgetPaise}
              plan={currentSession.plan}
              proposalVersion={currentSession.proposalVersion}
              validationMessage={currentSession.validationMessage}
              onApprove={handleApprove}
              onReject={handleReject}
              isSubmitting={isSubmitting}
            />
          )}
        </div>

        <div className="lg:col-span-6 sticky top-24">
          <AgentTimeline
            events={events}
            currentStatus={currentSession?.status || "Ready for Mission"}
          />
        </div>
      </div>
    </div>
  );
}
