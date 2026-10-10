"use client";

import React, { useEffect, useState, Suspense } from "react";
import { apiFetch } from "@/lib/api";
import {
  Receipt,
  CheckCircle2,
  Package,
  Calendar,
  MapPin,
  ArrowRight,
  Terminal
} from "lucide-react";
import { paiseToRupees } from "@cartpilot/shared";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface OrderData {
  id: string;
  totalPaise: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  itemCount: number;
  items: Array<{
    name: string;
    unit: string;
    quantity: number;
    subtotalPaise: number;
  }>;
  deliveryAddress?: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  createdAt: string;
}

function OrdersContent() {
  const searchParams = useSearchParams();
  const successId = searchParams.get("successId");
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await apiFetch<{ orders: OrderData[] }>("/checkout/orders");
        setOrders(res.orders || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {successId && (
        <div className="bg-[#141815] border border-[rgba(198,255,77,0.3)] p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-command">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#C6FF4D] text-[#0B0D0C] flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display font-bold text-[#F4F5EF] text-base">
                Payment Confirmed & Order Created!
              </h2>
              <p className="text-xs font-mono text-[#929A91] mt-0.5">
                Razorpay signature verified. Order Ref: <span className="text-[#C6FF4D]">{successId}</span>
              </p>
            </div>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold bg-[#C6FF4D] hover:bg-[#B6F53D] text-[#0B0D0C] px-4 py-2 rounded-xl transition-all shadow-lime-glow"
          >
            <span>Plan Another Grocery Cart</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      <div className="border-b border-[#232B25] pb-5">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#C6FF4D] mb-1">
          <Receipt className="w-3.5 h-3.5" />
          <span>ACCOUNT SETTLEMENT RECORDS</span>
        </div>
        <h1 className="font-display text-3xl font-extrabold text-[#F4F5EF] tracking-tight">
          Confirmed Orders
        </h1>
        <p className="text-xs sm:text-sm text-[#929A91] mt-1">
          Idempotent order records persisted in MongoDB with verified payment confirmation.
        </p>
      </div>

      {loading ? (
        <div className="py-24 text-center space-y-3 font-mono">
          <div className="w-8 h-8 border-2 border-[#C6FF4D] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#929A91]">Loading order history...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-[#141815] rounded-2xl border border-[#232B25] p-16 text-center max-w-md mx-auto space-y-4 shadow-command">
          <Package className="w-10 h-10 text-[#667065] mx-auto" />
          <h2 className="font-display font-bold text-[#F4F5EF] text-base">No Orders Placed Yet</h2>
          <p className="text-xs text-[#929A91] leading-relaxed">
            When you complete checkout through our autonomous workflow, your confirmed orders will appear here.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-[#C6FF4D] hover:bg-[#B6F53D] text-[#0B0D0C] text-xs font-bold px-4 py-2.5 rounded-xl shadow-lime-glow transition-all"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Start Shopping Mission</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-[#141815] rounded-2xl border border-[#2E3B31] p-6 shadow-command space-y-4 font-mono"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#232B25] gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#F4F5EF]">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[rgba(198,255,77,0.1)] text-[#C6FF4D] border border-[rgba(198,255,77,0.25)] capitalize">
                      {order.status}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0B0D0C] text-[#8DCBFF] border border-[#232B25] capitalize">
                      Payment: {order.paymentStatus}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#667065]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-[#667065] block">Total Amount</span>
                  <span className="font-display font-extrabold text-lg text-[#F4F5EF]">
                    {paiseToRupees(order.totalPaise)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#667065] block">
                  Items ({order.items.length})
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between bg-[#0B0D0C] p-2.5 rounded-xl border border-[#232B25]">
                      <span className="text-[#929A91] truncate mr-2 font-sans">
                        {item.name} ({item.quantity} {item.unit})
                      </span>
                      <span className="font-bold text-[#F4F5EF] flex-shrink-0">
                        {paiseToRupees(item.subtotalPaise)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {order.deliveryAddress && (
                <div className="pt-3 border-t border-[#232B25] flex items-start gap-2 text-xs text-[#667065] font-sans">
                  <MapPin className="w-4 h-4 text-[#C6FF4D] flex-shrink-0 mt-0.5" />
                  <span>
                    Delivering to: <strong className="text-[#F4F5EF]">{order.deliveryAddress.fullName}</strong>,{" "}
                    {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state} -{" "}
                    {order.deliveryAddress.pincode}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-xs font-mono text-[#929A91]">Loading orders...</div>}>
      <OrdersContent />
    </Suspense>
  );
}
