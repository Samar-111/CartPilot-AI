"use client";

import React, { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import {
  ShoppingCart,
  Trash2,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Terminal
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
      <div className="max-w-4xl mx-auto py-24 text-center space-y-3 font-mono">
        <div className="w-8 h-8 border-2 border-[#C6FF4D] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-[#929A91]">Loading active cart state from server...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="border-b border-[#232B25] pb-5">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#C6FF4D] mb-1">
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>VERIFIED CART STATE</span>
        </div>
        <h1 className="font-display text-3xl font-extrabold text-[#F4F5EF] tracking-tight">
          Active Shopping Cart
        </h1>
        <p className="text-xs sm:text-sm text-[#929A91] mt-1">
          Persisted items with real-time stock allocation and server-validated integer-paise pricing.
        </p>
      </div>

      {!cart || cart.items.length === 0 ? (
        <div className="bg-[#141815] rounded-2xl border border-[#232B25] p-16 text-center max-w-lg mx-auto space-y-4 shadow-command">
          <div className="w-14 h-14 rounded-2xl bg-[#1B211C] border border-[#2E3B31] text-[#C6FF4D] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h2 className="font-display font-bold text-lg text-[#F4F5EF]">Your Cart is Empty</h2>
          <p className="text-xs text-[#929A91] max-w-sm mx-auto leading-relaxed">
            Let the CartPilot AI Workforce assemble your grocery plan, or pick individual items directly from the catalog.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#C6FF4D] hover:bg-[#B6F53D] text-[#0B0D0C] font-bold text-xs px-5 py-2.5 rounded-xl shadow-lime-glow transition-all"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Launch AI Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center text-[#929A91] hover:text-[#F4F5EF] font-semibold text-xs px-5 py-2.5 rounded-xl border border-[#232B25] hover:border-[#2E3B31] transition-colors"
            >
              Browse Catalog
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 bg-[#141815] rounded-2xl border border-[#2E3B31] p-6 shadow-command divide-y divide-[#1F2620]">
            {cart.items.map((item) => (
              <div key={item.productId} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-display font-bold text-[#F4F5EF] text-sm sm:text-base">
                    {item.name}
                  </h3>
                  <div className="text-xs font-mono text-[#667065] mt-0.5">
                    Unit: {item.unit} • {paiseToRupees(item.unitPricePaise)} each
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6">
                  <div className="flex items-center border border-[#2E3B31] rounded-xl bg-[#0B0D0C] font-mono">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="px-3 py-1.5 text-[#929A91] hover:text-[#F4F5EF] hover:bg-[#1B211C] rounded-l-xl transition-colors font-bold text-xs"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-3.5 py-1.5 text-xs font-bold text-[#F4F5EF] bg-[#141815] border-x border-[#2E3B31]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="px-3 py-1.5 text-[#929A91] hover:text-[#F4F5EF] hover:bg-[#1B211C] rounded-r-xl transition-colors font-bold text-xs"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <span className="font-mono font-extrabold text-[#F4F5EF] text-sm sm:text-base min-w-20 text-right">
                    {paiseToRupees(item.subtotalPaise)}
                  </span>

                  <button
                    onClick={() => removeItem(item.productId)}
                    className="p-2 text-[#667065] hover:text-rose-400 rounded-lg hover:bg-[#1B211C] transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-4 bg-[#141815] rounded-2xl border border-[#2E3B31] p-6 shadow-command space-y-6 sticky top-24">
            <h2 className="font-display font-bold text-[#F4F5EF] text-lg">Order Summary</h2>

            <div className="space-y-3 text-xs font-mono text-[#929A91] border-b border-[#232B25] pb-4">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-bold text-[#F4F5EF]">
                  {paiseToRupees(cart.totalPaise)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges:</span>
                <span className="font-bold text-[#C6FF4D]">FREE</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Verification:</span>
                <span className="text-[#8DCBFF] font-medium">Razorpay HMAC</span>
              </div>
            </div>

            <div className="flex justify-between items-baseline font-mono">
              <span className="text-xs text-[#929A91]">Payable Total:</span>
              <span className="font-display text-2xl font-extrabold text-[#F4F5EF]">
                {paiseToRupees(cart.totalPaise)}
              </span>
            </div>

            <button
              onClick={() => router.push("/checkout")}
              className="w-full flex items-center justify-center gap-2 bg-[#C6FF4D] hover:bg-[#B6F53D] text-[#0B0D0C] font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-lime-glow"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-[#667065] text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C6FF4D]" />
              <span>Cryptographic server-side price verification enforced</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
