"use client";

import React, { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import {
  ShoppingCart,
  Trash2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  ShoppingBag
} from "lucide-react";
import { paiseToRupees } from "@cartpilot/shared";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface CartItemData {
  productId: string;
  name: string;
  unit: string;
  unitPricePaise: number;
  quantity: number;
  subtotalPaise: number;
}

interface CartResponse {
  id: string;
  items: CartItemData[];
  totalPaise: number;
}

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const res = await apiFetch<CartResponse>("/cart");
      setCart(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      const res = await apiFetch<CartResponse>(`/cart/items/${productId}`, {
        method: "PATCH",
        body: JSON.stringify({ quantity })
      });
      setCart(res);
    } catch (err: any) {
      alert(`Error updating quantity: ${err.message}`);
    }
  };

  const removeItem = async (productId: string) => {
    try {
      const res = await apiFetch<CartResponse>(`/cart/items/${productId}`, {
        method: "DELETE"
      });
      setCart(res);
    } catch (err: any) {
      alert(`Error removing item: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-400">Loading verified active cart...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="border-b border-slate-200/80 pb-5">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-600 mb-1">
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>Verified Cart</span>
        </div>
        <h1 className="font-display text-3xl font-extrabold text-slate-900 tracking-tight">
          Your Shopping Cart
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Persisted items with real-time stock allocation and server-validated pricing.
        </p>
      </div>

      {!cart || cart.items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-16 text-center max-w-lg mx-auto space-y-4 shadow-card">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h2 className="font-display font-bold text-lg text-slate-900">Your Cart is Empty</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Let the CartPilot AI Workforce assemble your grocery plan, or pick individual items directly from the catalog.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-all"
            >
              <span>Launch AI Assistant</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center text-slate-700 hover:bg-slate-100 font-semibold text-xs px-5 py-2.5 rounded-xl border border-slate-200 transition-colors"
            >
              Browse Catalog
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card divide-y divide-slate-100">
            {cart.items.map((item) => (
              <div key={item.productId} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-display font-bold text-slate-900 text-sm sm:text-base">
                    {item.name}
                  </h3>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Unit: {item.unit} • {paiseToRupees(item.unitPricePaise)} each
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6">
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="px-3 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 rounded-l-xl transition-colors font-bold text-xs"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-3.5 py-1.5 text-xs font-bold text-slate-900 bg-white border-x border-slate-200">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="px-3 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 rounded-r-xl transition-colors font-bold text-xs"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <span className="font-display font-extrabold text-slate-900 text-sm sm:text-base min-w-20 text-right">
                    {paiseToRupees(item.subtotalPaise)}
                  </span>

                  <button
                    onClick={() => removeItem(item.productId)}
                    className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card space-y-6 sticky top-24">
            <h2 className="font-display font-bold text-slate-900 text-lg">Order Summary</h2>

            <div className="space-y-3 text-xs text-slate-600 border-b border-slate-100 pb-4">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-bold text-slate-900">
                  {paiseToRupees(cart.totalPaise)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges:</span>
                <span className="font-bold text-emerald-600">FREE</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Verification:</span>
                <span className="text-slate-500 font-medium">Razorpay Secured</span>
              </div>
            </div>

            <div className="flex justify-between items-baseline">
              <span className="text-xs font-semibold text-slate-500">Payable Total:</span>
              <span className="font-display text-2xl font-extrabold text-slate-900">
                {paiseToRupees(cart.totalPaise)}
              </span>
            </div>

            <button
              onClick={() => router.push("/checkout")}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 px-4 rounded-xl text-sm transition-all shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/30"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Prices verified directly from MongoDB source of truth</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
