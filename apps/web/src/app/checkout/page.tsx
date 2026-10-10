"use client";

import React, { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import {
  CreditCard,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShoppingBag,
  Lock
} from "lucide-react";
import { paiseToRupees } from "@cartpilot/shared";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface CartData {
  id: string;
  items: Array<{
    productId: string;
    name: string;
    unit: string;
    unitPricePaise: number;
    quantity: number;
    subtotalPaise: number;
  }>;
  totalPaise: number;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [address, setAddress] = useState({
    fullName: "Samar Anand",
    phone: "9876543210",
    street: "Flat 402, Green Valley Apartments, Indiranagar",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560038"
  });

  useEffect(() => {
    async function loadCart() {
      try {
        const res = await apiFetch<CartData>("/cart");
        if (!res || !res.items || res.items.length === 0) {
          router.push("/cart");
          return;
        }
        setCart(res);
      } catch (err: any) {
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadCart();
  }, [router]);

  const handlePayWithRazorpay = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setErrorMsg(null);

    try {
      const orderRes = await apiFetch<{
        orderId: string;
        razorpayOrderId: string;
        keyId: string;
        amountPaise: number;
        currency: string;
      }>("/checkout/create-order", {
        method: "POST",
        body: JSON.stringify({
          deliveryAddress: address
        })
      });

      const options = {
        key: orderRes.keyId,
        amount: orderRes.amountPaise,
        currency: orderRes.currency,
        name: "CartPilot AI",
        description: "Autonomous Grocery Order Payment",
        order_id: orderRes.razorpayOrderId,
        prefill: {
          name: address.fullName,
          contact: address.phone
        },
        theme: {
          color: "#059669"
        },
        handler: async function (response: any) {
          try {
            await apiFetch("/checkout/verify-payment", {
              method: "POST",
              body: JSON.stringify({
                orderId: orderRes.orderId,
                razorpayOrderId: response.razorpay_order_id || orderRes.razorpayOrderId,
                razorpayPaymentId: response.razorpay_payment_id || `pay_${Date.now()}`,
                razorpaySignature: response.razorpay_signature || "simulated_valid_signature"
              })
            });
            router.push(`/orders?successId=${orderRes.orderId}`);
          } catch (err: any) {
            setErrorMsg(`Signature verification failed: ${err.message}`);
            setProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
          }
        }
      };

      if (typeof window !== "undefined" && window.Razorpay && !orderRes.razorpayOrderId.startsWith("rzp_sim_")) {
        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (response: any) {
          setErrorMsg(`Payment Failed: ${response.error.description || "Transaction declined"}`);
          setProcessing(false);
        });
        rzp.open();
      } else {
        setTimeout(async () => {
          try {
            await apiFetch("/checkout/verify-payment", {
              method: "POST",
              body: JSON.stringify({
                orderId: orderRes.orderId,
                razorpayOrderId: orderRes.razorpayOrderId,
                razorpayPaymentId: `pay_test_${Date.now()}`,
                razorpaySignature: "simulated_valid_signature"
              })
            });
            router.push(`/orders?successId=${orderRes.orderId}`);
          } catch (verifyErr: any) {
            setErrorMsg(`Payment verification failed: ${verifyErr.message}`);
            setProcessing(false);
          }
        }, 800);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Checkout failed");
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-400">Preparing checkout order...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="border-b border-slate-200/80 pb-5">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-600 mb-1">
          <CreditCard className="w-3.5 h-3.5" />
          <span>Secure Gateway</span>
        </div>
        <h1 className="font-display text-3xl font-extrabold text-slate-900 tracking-tight">
          Checkout & Payment
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Server-validated order creation with cryptographic Razorpay signature checks.
        </p>
      </div>

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl flex items-start gap-3 text-xs text-rose-800">
          <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
          <p>{errorMsg}</p>
        </div>
      )}

      <form onSubmit={handlePayWithRazorpay} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <h2 className="font-display font-bold text-slate-900 text-base">
              Delivery Destination
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={address.fullName}
                onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number</label>
              <input
                type="tel"
                required
                value={address.phone}
                onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Street Address</label>
              <input
                type="text"
                required
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">City</label>
              <input
                type="text"
                required
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Postal Code (PIN)</label>
              <input
                type="text"
                required
                value={address.pincode}
                onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Gateway Mode:</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              Razorpay Test / Sandbox Active
            </span>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card space-y-6 sticky top-24">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
            <h2 className="font-display font-bold text-slate-900 text-base">
              Order Breakdown
            </h2>
          </div>

          <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto pr-1">
            {cart?.items.map((item) => (
              <div key={item.productId} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-slate-900">{item.name}</div>
                  <div className="text-[10px] text-slate-400">
                    {item.quantity} × {paiseToRupees(item.unitPricePaise)}
                  </div>
                </div>
                <div className="font-bold text-slate-900">{paiseToRupees(item.subtotalPaise)}</div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Items Total:</span>
              <span className="font-semibold text-slate-900">{paiseToRupees(cart?.totalPaise || 0)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Delivery Fee:</span>
              <span className="font-semibold text-emerald-600">FREE</span>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline">
            <span className="text-xs font-semibold text-slate-500">Final Amount Payable:</span>
            <span className="font-display text-2xl font-extrabold text-slate-900">
              {paiseToRupees(cart?.totalPaise || 0)}
            </span>
          </div>

          <div className="space-y-2.5">
            <button
              type="submit"
              disabled={processing}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-semibold py-3.5 px-4 rounded-xl text-sm transition-all shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/30"
            >
              {processing ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Verifying Transaction...</span>
                </span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Pay {paiseToRupees(cart?.totalPaise || 0)} (Razorpay Test Gateway)</span>
                </>
              )}
            </button>

            <button
              type="button"
              disabled={processing}
              onClick={async () => {
                setProcessing(true);
                setErrorMsg(null);
                try {
                  const orderRes = await apiFetch<{
                    orderId: string;
                    razorpayOrderId: string;
                  }>("/checkout/create-order", {
                    method: "POST",
                    body: JSON.stringify({ deliveryAddress: address })
                  });

                  await apiFetch("/checkout/verify-payment", {
                    method: "POST",
                    body: JSON.stringify({
                      orderId: orderRes.orderId,
                      razorpayOrderId: orderRes.razorpayOrderId,
                      razorpayPaymentId: `pay_sim_${Date.now()}`,
                      razorpaySignature: "simulated_valid_signature"
                    })
                  });
                  router.push(`/orders?successId=${orderRes.orderId}`);
                } catch (simErr: any) {
                  setErrorMsg(simErr.message);
                  setProcessing(false);
                }
              }}
              className="w-full flex items-center justify-center gap-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors"
            >
              <span>Instant Test Payment (Direct Signature Verification)</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Strict server-side price recalculation enforced</span>
          </div>
        </div>
      </form>
    </div>
  );
}
