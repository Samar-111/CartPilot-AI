"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  ArrowUpRight,
  Terminal,
  Activity
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
      } catch (err) {}
    }
    loadCartCount();
    const interval = setInterval(loadCartCount, 6000);
    return () => clearInterval(interval);
  }, [pathname]);

  const navLinks = [
    { label: "Shop", href: "/products" },
    { label: "AI Assistant", href: "/dashboard", badge: "Agent Graph" },
    { label: "How It Works", href: "/#workflow" },
    { label: "Orders", href: "/orders" }
  ];

  return (
    <header className="sticky top-0 z-50 glass-command-nav border-b border-[#232B25] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8 rounded-lg bg-[#141815] border border-[#2E3B31] flex items-center justify-center group-hover:border-[#C6FF4D] transition-colors">
            <div className="w-2.5 h-2.5 bg-[#C6FF4D] rotate-45 transform transition-transform group-hover:scale-110" />
            <div className="absolute -bottom-0.5 -right-0.5 w-1 h-1 bg-[#8DCBFF]" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-base text-[#F4F5EF] tracking-tight flex items-center gap-1.5">
              CARTPILOT <span className="text-[#C6FF4D] text-xs font-mono font-normal">v2.4</span>
            </span>
            <span className="text-[9px] font-mono tracking-widest text-[#929A91] uppercase">
              Command Center
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1 bg-[#141815] p-1 rounded-full border border-[#232B25]">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-150 flex items-center gap-1.5 ${
                  isActive
                    ? "bg-[#1B211C] text-[#C6FF4D] border border-[#2E3B31] shadow-sm"
                    : "text-[#929A91] hover:text-[#F4F5EF] hover:bg-[#1B211C]/50"
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[9px] font-mono tracking-wider px-1.5 py-0.2 rounded-full font-semibold bg-[rgba(198,255,77,0.12)] text-[#C6FF4D] border border-[rgba(198,255,77,0.25)]">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#141815] border border-[#232B25] text-[10px] font-mono text-[#929A91]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C6FF4D] animate-ping" />
            <span>Orchestrator: ACTIVE</span>
          </div>

          <Link
            href="/cart"
            className="relative p-2 rounded-lg text-[#929A91] hover:text-[#F4F5EF] hover:bg-[#141815] border border-transparent hover:border-[#232B25] transition-all"
            aria-label="Cart"
          >
            <ShoppingCart className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#C6FF4D] text-[#0B0D0C] font-mono font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          <Link
            href="/login"
            className="flex items-center gap-1 text-xs font-medium text-[#929A91] hover:text-[#F4F5EF] px-2.5 py-1.5 rounded-lg hover:bg-[#141815] transition-colors"
          >
            <User className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Account</span>
          </Link>

          <Link
            href="/dashboard"
            className="hidden sm:inline-flex items-center gap-1.5 bg-[#C6FF4D] hover:bg-[#B6F53D] text-[#0B0D0C] text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-all shadow-lime-glow hover:brightness-105"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>AI Console</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#929A91] hover:text-[#F4F5EF] hover:bg-[#141815]"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B0D0C] border-b border-[#232B25] px-4 pt-3 pb-5 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2 text-sm font-medium text-[#929A91] hover:text-[#C6FF4D] border-b border-[#141815]"
            >
              <span>{link.label}</span>
              {link.badge && (
                <span className="text-[10px] bg-[rgba(198,255,77,0.12)] text-[#C6FF4D] font-mono px-2 py-0.5 rounded border border-[rgba(198,255,77,0.25)]">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full flex items-center justify-center gap-2 bg-[#C6FF4D] text-[#0B0D0C] text-xs font-bold py-2.5 rounded-lg mt-3"
          >
            <Terminal className="w-4 h-4" />
            <span>Launch AI Shopping Command Center</span>
          </Link>
        </div>
      )}
    </header>
  );
}
