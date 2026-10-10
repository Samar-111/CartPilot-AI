"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, ShieldCheck, ArrowRight, Sparkles, LogOut, Check } from "lucide-react";

import { apiFetch } from "@/lib/api";

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
      apiFetch<any>("/auth/me")
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
      const data = await apiFetch<{ token: string; user: any }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          name: name.trim() || undefined,
          dietaryPreferences: dietary
        })
      });

      if (data.token) {
        localStorage.setItem("cartpilot_token", data.token);
        setCurrentUser(data.user);
        setMessage("Account session saved! Redirecting...");
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
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
          <User className="w-6 h-6" />
        </div>
        <h1 className="font-display text-2xl font-extrabold text-slate-900 tracking-tight">
          {currentUser ? "Your Account Profile" : "Sign In or Register"}
        </h1>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          Optional account creation. You can browse, use the AI Assistant, and checkout even without logging in.
        </p>
      </div>

      {message && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3.5 rounded-xl font-medium text-center">
          {message}
        </div>
      )}

      {currentUser ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card space-y-5">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Active User
            </span>
            <div className="font-display font-bold text-slate-900 text-base">
              {currentUser.name}
            </div>
            <div className="text-xs text-slate-500">{currentUser.email}</div>
          </div>

          <div className="border-t border-slate-100 pt-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Saved Dietary Preferences
            </span>
            <div className="flex flex-wrap gap-1.5">
              {currentUser.dietaryPreferences?.map((pref: string) => (
                <span
                  key={pref}
                  className="text-[11px] bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200 font-semibold capitalize"
                >
                  {pref}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/dashboard"
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl text-xs transition-colors"
            >
              <span>Go to AI Assistant</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 text-rose-600 hover:bg-rose-50 border border-rose-200 font-semibold py-2.5 rounded-xl text-xs transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleAuthSubmit} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
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
                    className={`text-[11px] px-2.5 py-1 rounded-full font-semibold transition-all ${
                      active
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
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
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-semibold py-3 px-4 rounded-xl text-xs transition-all shadow-md shadow-emerald-600/20 mt-2"
          >
            {loading ? (
              <span>Saving Session...</span>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Save Profile & Continue</span>
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <Link
              href="/dashboard"
              className="text-[11px] text-slate-500 hover:text-emerald-600 underline font-medium"
            >
              Skip and continue as Guest
            </Link>
          </div>
        </form>
      )}

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>No compulsory passwords or email verification required</span>
      </div>
    </div>
  );
}
