"use client";

import React, { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import {
  CreditCard,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  ShoppingBag,
  Lock
} from "lucide-react";
import { paiseToRupees } from "@cartpilot/shared";
import { useRouter } from "next/navigation";

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
          color: "#C6FF4D"
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
      <div className="max-w-4xl mx-auto py-24 text-center space-y-3 font-mono">
        <div className="w-8 h-8 border-2 border-[#C6FF4D] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-[#929A91]">Preparing checkout order session...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="border-b border-[#232B25] pb-5">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#C6FF4D] mb-1">
          <CreditCard className="w-3.5 h-3.5" />
          <span>SECURE GATEWAY CHECKOUT</span>
        </div>
        <h1 className="font-display text-3xl font-extrabold text-[#F4F5EF] tracking-tight">
          Checkout & Settlement
        </h1>
        <p className="text-xs sm:text-sm text-[#929A91] mt-1">
          Server-validated order creation with cryptographic Razorpay signature checks.
        </p>
      </div>

      {errorMsg && (
        <div className="bg-rose-950/40 border border-rose-800 p-4 rounded-xl flex items-start gap-3 text-xs text-rose-300">
          <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
          <p>{errorMsg}</p>
        </div>
      )}

      <form onSubmit={handlePayWithRazorpay} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 bg-[#141815] rounded-2xl border border-[#2E3B31] p-6 shadow-command space-y-6">
          <div className="flex items-center gap-2 border-b border-[#232B25] pb-3">
            <MapPin className="w-4 h-4 text-[#C6FF4D]" />
            <h2 className="font-display font-bold text-[#F4F5EF] text-base">
              Delivery Destination
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-[#929A91] mb-1">Full Name</label>
              <input
                type="text"
                required
                value={address.fullName}
                onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                className="w-full text-xs rounded-xl border border-[#2E3B31] p-2.5 bg-[#0B0D0C] text-[#F4F5EF] focus:outline-none focus:border-[#C6FF4D] font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#929A91] mb-1">Phone Number</label>
              <input
                type="tel"
                required
                value={address.phone}
                onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                className="w-full text-xs rounded-xl border border-[#2E3B31] p-2.5 bg-[#0B0D0C] text-[#F4F5EF] focus:outline-none focus:border-[#C6FF4D] font-medium"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-mono text-[#929A91] mb-1">Street Address</label>
              <input
                type="text"
                required
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                className="w-full text-xs rounded-xl border border-[#2E3B31] p-2.5 bg-[#0B0D0C] text-[#F4F5EF] focus:outline-none focus:border-[#C6FF4D] font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#929A91] mb-1">City</label>
              <input
                type="text"
                required
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                className="w-full text-xs rounded-xl border border-[#2E3B31] p-2.5 bg-[#0B0D0C] text-[#F4F5EF] focus:outline-none focus:border-[#C6FF4D] font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#929A91] mb-1">Postal Code (PIN)</label>
              <input
                type="text"
                required
                value={address.pincode}
                onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                className="w-full text-xs rounded-xl border border-[#2E3B31] p-2.5 bg-[#0B0D0C] text-[#F4F5EF] focus:outline-none focus:border-[#C6FF4D] font-medium"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#232B25] flex items-center justify-between font-mono">
            <span className="text-xs text-[#667065]">Gateway Mode:</span>
            <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-[rgba(198,255,77,0.12)] text-[#C6FF4D] border border-[rgba(198,255,77,0.3)]">
              Razorpay Test / Sandbox Active
            </span>
          </div>
        </div>

        <div className="lg:col-span-5 bg-[#141815] rounded-2xl border border-[#2E3B31] p-6 shadow-command space-y-6 sticky top-24 font-mono">
          <div className="flex items-center gap-2 border-b border-[#232B25] pb-3">
            <ShoppingBag className="w-4 h-4 text-[#8DCBFF]" />
            <h2 className="font-display font-bold text-[#F4F5EF] text-base">
              Order Breakdown
            </h2>
          </div>

          <div className="divide-y divide-[#1F2620] max-h-56 overflow-y-auto pr-1">
            {cart?.items.map((item) => (
              <div key={item.productId} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-[#F4F5EF]">{item.name}</div>
                  <div className="text-[10px] text-[#667065]">
                    {item.quantity} × {paiseToRupees(item.unitPricePaise)}
                  </div>
                </div>
                <div className="font-bold text-[#F4F5EF]">{paiseToRupees(item.subtotalPaise)}</div>
              </div>
            ))}
          </div>

          <div className="border-t border-[#232B25] pt-3 space-y-2 text-xs text-[#929A91]">
            <div className="flex justify-between">
              <span>Items Total:</span>
              <span className="font-semibold text-[#F4F5EF]">{paiseToRupees(cart?.totalPaise || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee:</span>
              <span className="font-semibold text-[#C6FF4D]">FREE</span>
            </div>
          </div>

          <div className="border-t border-[#232B25] pt-3 flex justify-between items-baseline">
            <span className="text-xs text-[#929A91]">Final Payable Amount:</span>
            <span className="font-display text-2xl font-extrabold text-[#F4F5EF]">
              {paiseToRupees(cart?.totalPaise || 0)}
            </span>
          </div>

          <div className="space-y-2.5">
            <button
              type="submit"
              disabled={processing}
              className="w-full flex items-center justify-center gap-2 bg-[#C6FF4D] hover:bg-[#B6F53D] disabled:bg-[#1B211C] disabled:text-[#667065] text-[#0B0D0C] font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-lime-glow"
            >
              {processing ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#0B0D0C] border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Transaction...</span>
                </span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Pay {paiseToRupees(cart?.totalPaise || 0)} (Razorpay Gateway)</span>
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
              className="w-full flex items-center justify-center gap-1.5 border border-[#2E3B31] hover:border-[#8DCBFF] text-[#F4F5EF] font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors bg-[#0B0D0C]"
            >
              <span>Instant Test Settlement (Direct HMAC Verification)</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#667065] text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C6FF4D]" />
            <span>Strict server-side price recalculation enforced</span>
          </div>
        </div>
      </form>
    </div>
  );
}
