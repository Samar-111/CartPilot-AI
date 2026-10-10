import React from "react";
import Link from "next/link";
import { ShoppingBag, Bot, Store, ShoppingCart } from "lucide-react";

export function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-emerald-600">
          <ShoppingBag className="w-6 h-6" />
          <span>CartPilot AI</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-emerald-600">
            <Bot className="w-4 h-4" />
            <span>AI Assistant</span>
          </Link>
          <Link href="/products" className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-emerald-600">
            <Store className="w-4 h-4" />
            <span>Catalog</span>
          </Link>
          <Link href="/cart" className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-emerald-600">
            <ShoppingCart className="w-4 h-4" />
            <span>Cart</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
