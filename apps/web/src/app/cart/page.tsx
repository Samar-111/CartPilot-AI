"use client";

import React, { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { ShoppingCart, Trash2, CheckCircle2 } from "lucide-react";

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
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

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

  const handleSimulateCheckout = async () => {
    setCheckingOut(true);
    try {
      await new Promise(r => setTimeout(r, 1000));
      setOrderConfirmed(true);
      fetchCart();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setCheckingOut(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-400 text-sm">Loading your cart...</div>;
  }

  if (orderConfirmed) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4 bg-white p-8 rounded-xl border border-slate-200">
        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Order Simulated Successfully!</h2>
        <p className="text-xs text-slate-500">
          Your items have been recorded in the database order history. Real-payment checkpoints will execute idempotently here.
        </p>
        <button
          onClick={() => setOrderConfirmed(false)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          Back to Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <ShoppingCart className="w-6 h-6 text-emerald-600" />
        <h1 className="text-2xl font-bold text-slate-900">Active Shopping Cart</h1>
      </div>

      {!cart || cart.items.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
          <p className="text-sm">Your shopping cart is currently empty.</p>
          <p className="text-xs text-slate-400 mt-1">
            Use the CartPilot AI Workforce on the Dashboard or browse the catalog.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 p-4">
            {cart.items.map((item) => (
              <div key={item.productId} className="py-4 flex items-center justify-between text-sm">
                <div>
                  <h3 className="font-semibold text-slate-800">{item.name}</h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {item.unit} • ₹{(item.unitPricePaise / 100).toFixed(2)} each
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-slate-200 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 rounded-l-lg"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 rounded-r-lg"
                    >
                      +
                    </button>
                  </div>

                  <span className="font-bold text-slate-900 min-w-16 text-right">
                    ₹{(item.subtotalPaise / 100).toFixed(2)}
                  </span>

                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 h-fit space-y-4">
            <h2 className="font-semibold text-slate-900 text-base">Summary</h2>
            <div className="space-y-2 text-xs text-slate-600 border-b border-slate-100 pb-3">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-medium text-slate-900">
                  ₹{(cart.totalPaise / 100).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Delivery:</span>
                <span className="text-emerald-600 font-semibold">FREE</span>
              </div>
            </div>

            <div className="flex justify-between text-base font-bold text-slate-900">
              <span>Total Payable:</span>
              <span>₹{(cart.totalPaise / 100).toFixed(2)}</span>
            </div>

            <button
              onClick={handleSimulateCheckout}
              disabled={checkingOut}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors shadow-sm"
            >
              {checkingOut ? "Processing Checkout..." : "Simulate Checkout"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
