"use client";

import React, { useState, useEffect } from "react";
import { ChatPanel } from "@/components/assistant/ChatPanel";
import { AgentTimeline } from "@/components/assistant/AgentTimeline";
import { ApprovalCard } from "@/components/assistant/ApprovalCard";
import { apiFetch } from "@/lib/api";
import { AgentEvent, ShoppingSession } from "@cartpilot/shared";
import { useRouter } from "next/navigation";

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

    const token = localStorage.getItem("cartpilot_token");
    const eventSource = new EventSource(
      `http://localhost:5000/api/v1/shopping-sessions/${currentSession.id}/events?token=${token || ""}`
    );

    eventSource.addEventListener("agent_event", (e) => {
      try {
        const ev: AgentEvent = JSON.parse(e.data);
        setEvents((prev) => {
          if (prev.some((p) => p.id === ev.id)) return prev;
          return [...prev, ev];
        });

        apiFetch<ShoppingSession>(`/shopping-sessions/${currentSession.id}`).then((sess) => {
          setCurrentSession(sess);
          if (sess.status === "awaiting_approval" || sess.status === "approved" || sess.status === "failed") {
            setIsLoading(false);
          }
        });
      } catch (err) {
        console.error("SSE parse error:", err);
      }
    });

    return () => {
      eventSource.close();
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">CartPilot AI Workforce</h1>
        <p className="text-sm text-slate-500 mt-1">
          Autonomous multi-agent orchestration for constraint-based weekly grocery shopping.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
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

        <div className="lg:col-span-6">
          <AgentTimeline
            events={events}
            currentStatus={currentSession?.status || "Idle"}
          />
        </div>
      </div>
    </div>
  );
}
