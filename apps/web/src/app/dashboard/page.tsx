"use client";

import React, { useState, useEffect } from "react";
import { ChatPanel } from "@/components/assistant/ChatPanel";
import { AgentTimeline } from "@/components/assistant/AgentTimeline";
import { ApprovalCard } from "@/components/assistant/ApprovalCard";
import { apiFetch, API_BASE } from "@/lib/api";
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
          const res = await apiFetch<{ token: string }>("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email: "shopper@cartpilot.ai", name: "Shopper Demo" })
          });
          if (res?.token) {
            localStorage.setItem("cartpilot_token", res.token);
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
    const sseUrl = `${API_BASE}/shopping-sessions/${currentSession.id}/events?token=${token || ""}`;
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
      } catch (err) {
        // ignore
      }
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

    eventSource.onerror = () => {
      // If SSE errors, polling below guarantees updates
    };

    const pollInterval = setInterval(() => {
      updateSession();
    }, 1200);

    return () => {
      isMounted = false;
      eventSource.close();
      clearInterval(pollInterval);
    };
  }, [currentSession?.id]);

  const ensureToken = async (): Promise<string> => {
    let token = typeof window !== "undefined" ? localStorage.getItem("cartpilot_token") : null;
    if (!token) {
      try {
        const res = await apiFetch<{ token: string }>("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email: "shopper@cartpilot.ai", name: "Shopper Demo" })
        });
        if (res?.token) {
          localStorage.setItem("cartpilot_token", res.token);
          return res.token;
        }
      } catch (err) {
        console.error("Auth login err:", err);
      }
    }
    return token || "";
  };

  const handleLaunchWorkflow = async (data: {
    request: string;
    budgetPaise: number;
    peopleCount: number;
    durationDays: number;
    preferences: string[];
    pincode?: string;
    cityName?: string;
  }) => {
    setIsLoading(true);
    setEvents([]);
    try {
      await ensureToken();
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
          {isLoading && (!currentSession || currentSession.proposedItems.length === 0) && (
            <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-card space-y-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <span className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 text-sm">Agents Assembling Proposal</h3>
                  <p className="text-xs text-slate-400">Verifying live prices, stock levels, and nutritional match...</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-slate-100 rounded-md w-3/4" />
                <div className="h-4 bg-slate-100 rounded-md w-1/2" />
              </div>
            </div>
          )}
          {currentSession && currentSession.proposedItems && currentSession.proposedItems.length > 0 && (
            <ApprovalCard
              proposedItems={currentSession.proposedItems}
              totalPaise={currentSession.totalPaise}
              budgetPaise={currentSession.budgetPaise}
              plan={currentSession.plan}
              proposalVersion={currentSession.proposalVersion}
              validationMessage={currentSession.validationMessage}
              durationDays={currentSession.durationDays}
              peopleCount={currentSession.peopleCount}
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
