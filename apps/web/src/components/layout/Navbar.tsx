"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  ShoppingBag,
  Store,
  ShoppingCart,
  Receipt,
  Menu,
  X,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { apiFetch } from "@/lib/api";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState<number>(0);

  useEffect(() => {
    async function loadCartCount() {
      try {
        const token = localStorage.getItem("cartpilot_token");
        if (!token) return;
        const res = await apiFetch<{ items: Array<{ quantity: number }> }>("/cart");
        if (res && res.items) {
          const totalQty = res.items.reduce((sum, item) => sum + item.quantity, 0);
          setCartCount(totalQty);
        }
      } catch (err) {
        // silently fallback
      }
    }
    loadCartCount();
    const interval = setInterval(loadCartCount, 6000);
    return () => clearInterval(interval);
  }, [pathname]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "AI Assistant", href: "/dashboard", badge: "Live Graph" },
    { label: "Catalog", href: "/products" },
    { label: "Orders", href: "/orders" }
  ];

  return (
    <header className="sticky top-0 z-50 glass-nav border-b border-slate-200/70 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-500 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-lg text-slate-900 tracking-tight leading-tight">
              CartPilot <span className="text-emerald-600">AI</span>
            </span>
            <span className="text-[10px] font-medium text-slate-400 tracking-widest uppercase">
              Autonomous Workforce
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1 bg-slate-100/70 p-1 rounded-full border border-slate-200/50">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.2 rounded-full font-bold bg-emerald-100 text-emerald-800">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="relative p-2 rounded-xl text-slate-700 hover:text-emerald-600 hover:bg-slate-100/80 transition-colors"
            aria-label="Shopping Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-600 text-white font-bold text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          <Link
            href="/dashboard"
            className="hidden sm:inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Launch Workforce</span>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2 text-sm font-medium text-slate-700 hover:text-emerald-600 border-b border-slate-50"
            >
              <span>{link.label}</span>
              {link.badge && (
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white text-sm font-semibold py-2.5 rounded-xl mt-3"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch AI Assistant</span>
          </Link>
        </div>
      )}
    </header>
  );
}
