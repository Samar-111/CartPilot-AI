"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, ShieldCheck, ArrowRight, Sparkles, LogOut, Terminal } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [dietary, setDietary] = useState<string[]>(["healthy", "vegetarian"]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("cartpilot_token");
    if (token) {
      fetch("http://localhost:5000/api/v1/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) setCurrentUser(data);
        })
        .catch(() => {});
    }
  }, []);

  const toggleDiet = (pref: string) => {
    if (dietary.includes(pref)) {
      setDietary(dietary.filter((d) => d !== pref));
    } else {
      setDietary([...dietary, pref]);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("http://localhost:5000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          name: name.trim() || undefined,
          dietaryPreferences: dietary
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Authentication failed");

      if (data.token) {
        localStorage.setItem("cartpilot_token", data.token);
        setCurrentUser(data.user);
        setMessage("Account session saved! Redirecting to Command Center...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 800);
      }
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("cartpilot_token");
    setCurrentUser(null);
    setMessage("Logged out. You can still shop or use default sessions without restriction.");
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-[#141815] border border-[#2E3B31] text-[#C6FF4D] flex items-center justify-center mx-auto shadow-sm">
          <User className="w-5 h-5" />
        </div>
        <h1 className="font-display text-2xl font-extrabold text-[#F4F5EF] tracking-tight">
          {currentUser ? "User Profile" : "Account Access"}
        </h1>
        <p className="text-xs text-[#929A91] max-w-sm mx-auto leading-relaxed">
          Optional user profile for remembering custom diet allocations. All commands work in guest mode.
        </p>
      </div>

      {message && (
        <div className="bg-[#141815] border border-[rgba(198,255,77,0.3)] text-[#C6FF4D] text-xs p-3.5 rounded-xl font-mono text-center">
          {message}
        </div>
      )}

      {currentUser ? (
        <div className="bg-[#141815] rounded-2xl border border-[#2E3B31] p-6 shadow-command space-y-5 font-mono">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#667065] block">
              Active User Identity
            </span>
            <div className="font-display font-bold text-[#F4F5EF] text-base">
              {currentUser.name}
            </div>
            <div className="text-xs text-[#929A91]">{currentUser.email}</div>
          </div>

          <div className="border-t border-[#232B25] pt-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#667065] block mb-2">
              Saved Dietary Constraints
            </span>
            <div className="flex flex-wrap gap-1.5">
              {currentUser.dietaryPreferences?.map((pref: string) => (
                <span
                  key={pref}
                  className="text-[10px] bg-[#0B0D0C] text-[#C6FF4D] px-2.5 py-0.5 rounded-full border border-[rgba(198,255,77,0.3)] capitalize font-semibold"
                >
                  {pref}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/dashboard"
              className="w-full flex items-center justify-center gap-2 bg-[#C6FF4D] hover:bg-[#B6F53D] text-[#0B0D0C] font-bold py-2.5 rounded-xl text-xs transition-colors shadow-lime-glow"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Launch AI Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 text-rose-400 hover:bg-rose-950/30 border border-rose-800 font-semibold py-2.5 rounded-xl text-xs transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleAuthSubmit} className="bg-[#141815] rounded-2xl border border-[#2E3B31] p-6 shadow-command space-y-4 font-mono">
          <div>
            <label className="block text-xs text-[#929A91] mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#667065] absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-[#2E3B31] bg-[#0B0D0C] text-[#F4F5EF] focus:outline-none focus:border-[#C6FF4D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-[#929A91] mb-1">
              Display Name <span className="text-[#667065]">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#2E3B31] bg-[#0B0D0C] text-[#F4F5EF] focus:outline-none focus:border-[#C6FF4D]"
            />
          </div>

          <div>
            <label className="block text-xs text-[#929A91] mb-1.5">
              Default Dietary Profile
            </label>
            <div className="flex flex-wrap gap-1.5">
              {["healthy", "vegetarian", "vegan", "high-protein", "gluten-free"].map((pref) => {
                const active = dietary.includes(pref);
                return (
                  <button
                    type="button"
                    key={pref}
                    onClick={() => toggleDiet(pref)}
                    className={`text-[10px] px-2.5 py-1 rounded-lg font-semibold transition-all ${
                      active
                        ? "bg-[#C6FF4D] text-[#0B0D0C] font-bold"
                        : "bg-[#0B0D0C] text-[#929A91] border border-[#232B25] hover:border-[#2E3B31]"
                    }`}
                  >
                    {pref}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#C6FF4D] hover:bg-[#B6F53D] disabled:bg-[#1B211C] text-[#0B0D0C] font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-lime-glow mt-2"
          >
            {loading ? (
              <span>Saving Session...</span>
            ) : (
              <>
                <Terminal className="w-3.5 h-3.5" />
                <span>Save Profile & Continue</span>
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <Link
              href="/dashboard"
              className="text-[11px] text-[#667065] hover:text-[#C6FF4D] underline font-medium"
            >
              Skip and continue in Guest Mode
            </Link>
          </div>
        </form>
      )}

      <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-[#667065] text-center">
        <ShieldCheck className="w-3.5 h-3.5 text-[#C6FF4D]" />
        <span>No compulsory passwords or email verification required</span>
      </div>
    </div>
  );
}
