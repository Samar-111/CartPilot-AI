"use client";

import React, { useEffect, useState, Suspense } from "react";
import { apiFetch } from "@/lib/api";
import {
  Receipt,
  CheckCircle2,
  Package,
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  ShoppingBag
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
        <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display font-bold text-slate-900 text-base">
                Payment Confirmed & Order Created!
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Razorpay signature verified. Order Reference: <span className="font-mono font-semibold">{successId}</span>
              </p>
            </div>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl transition-all shadow-sm"
          >
            <span>Plan Another Grocery Cart</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      <div className="border-b border-slate-200/80 pb-5">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-600 mb-1">
          <Receipt className="w-3.5 h-3.5" />
          <span>Account History</span>
        </div>
        <h1 className="font-display text-3xl font-extrabold text-slate-900 tracking-tight">
          Your Confirmed Orders
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Idempotent order records persisted in MongoDB with verified payment confirmation.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-400">Loading order history...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-16 text-center max-w-md mx-auto space-y-4 shadow-card">
          <Package className="w-10 h-10 text-slate-300 mx-auto" />
          <h2 className="font-display font-bold text-slate-800 text-base">No Orders Placed Yet</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            When you complete checkout through our autonomous workflow, your confirmed orders will appear here.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all"
          >
            <span>Start Shopping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-800">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 capitalize">
                      {order.status}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 capitalize">
                      Payment: {order.paymentStatus}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Total Amount</span>
                  <span className="font-display font-extrabold text-lg text-slate-900">
                    {paiseToRupees(order.totalPaise)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Items ({order.items.length})
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="font-medium text-slate-800 truncate mr-2">
                        {item.name} ({item.quantity} {item.unit})
                      </span>
                      <span className="font-bold text-slate-900 flex-shrink-0">
                        {paiseToRupees(item.subtotalPaise)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {order.deliveryAddress && (
                <div className="pt-3 border-t border-slate-100 flex items-start gap-2 text-xs text-slate-500">
                  <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                  <span>
                    Delivering to: <strong className="text-slate-800">{order.deliveryAddress.fullName}</strong>,{" "}
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
    <Suspense fallback={<div className="py-20 text-center text-xs text-slate-400">Loading orders...</div>}>
      <OrdersContent />
    </Suspense>
  );
}
