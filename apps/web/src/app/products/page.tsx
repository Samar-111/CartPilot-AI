"use client";

import React, { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Search, Heart, Sparkles, ShoppingBag, Check, ArrowUpDown, Filter, AlertCircle } from "lucide-react";
import { paiseToRupees } from "@cartpilot/shared";

interface ProductItem {
  id: string;
  name: string;
  category: string;
  pricePaise: number;
  unit: string;
  stock: number;
  tags: string[];
  isHealthy: boolean;
  storeName?: string;
  pincode?: string;
  lastPriceSyncAt?: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [onlyHealthy, setOnlyHealthy] = useState(false);
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");
  const [selectedCity, setSelectedCity] = useState("560001");
  const [syncing, setSyncing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const stores = [
    { city: "Bengaluru Central (560001)", pincode: "560001", store: "Bengaluru Central DarkStore" },
    { city: "Mumbai Bandra (400050)", pincode: "400050", store: "Mumbai West Hub" },
    { city: "Delhi NCR (110001)", pincode: "110001", store: "Delhi North SuperStore" }
  ];

  const categories = [
    "fruits",
    "vegetables",
    "dairy",
    "grains",
    "protein",
    "bakery",
    "beverages",
    "snacks",
    "staples"
  ];

  const handleLivePriceSync = async () => {
    setSyncing(true);
    try {
      const activeStore = stores.find(s => s.pincode === selectedCity);
      const syncPayload = products.map(p => {
        const delta = Math.floor((Math.random() - 0.45) * 1000);
        const newPrice = Math.max(1000, p.pricePaise + delta);
        return {
          name: p.name,
          pricePaise: newPrice,
          category: p.category,
          unit: p.unit,
          stock: p.stock
        };
      });

      await apiFetch("/products/sync", {
        method: "POST",
        body: JSON.stringify({
          items: syncPayload,
          storeName: activeStore?.store,
          pincode: activeStore?.pincode
        })
      });

      const res = await apiFetch<{ products: ProductItem[] }>(`/products?pincode=${selectedCity}`);
      setProducts(res.products || []);
    } catch (err: any) {
      alert(`Sync failed: ${err.message}`);
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (search) queryParams.set("query", search);
        if (category) queryParams.set("category", category);
        if (onlyHealthy) queryParams.set("isHealthy", "true");
        if (selectedCity) queryParams.set("pincode", selectedCity);

        const res = await apiFetch<{ products: ProductItem[] }>(`/products?${queryParams.toString()}`);
        let items = res.products || [];

        if (sortBy === "price-asc") {
          items = [...items].sort((a, b) => a.pricePaise - b.pricePaise);
        } else if (sortBy === "price-desc") {
          items = [...items].sort((a, b) => b.pricePaise - a.pricePaise);
        }

        setProducts(items);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [search, category, onlyHealthy, sortBy]);

  const addToCart = async (productId: string) => {
    try {
      await apiFetch(`/cart/items/${productId}`, {
        method: "PATCH",
        body: JSON.stringify({ quantity: 1 })
      });
      setAddedIds((prev) => ({ ...prev, [productId]: true }));
      setTimeout(() => {
        setAddedIds((prev) => ({ ...prev, [productId]: false }));
      }, 1500);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-600 mb-1">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Ground-Truth Catalog</span>
          </div>
          <h1 className="font-display text-3xl font-extrabold text-slate-900 tracking-tight">
            Discover Verified Products
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse our catalog of items with real-time stock levels and verified server-side prices.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search products or tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="py-2 px-3 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
            >
              {stores.map((s) => (
                <option key={s.pincode} value={s.pincode}>
                  {s.city}
                </option>
              ))}
            </select>

            <button
              onClick={handleLivePriceSync}
              disabled={syncing}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-sm"
              title="Simulates real-time merchant price updates & inventory changes"
            >
              <ArrowUpDown className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
              <span>{syncing ? "Syncing..." : "Sync Live Prices"}</span>
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-2 px-3 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>

            <button
              onClick={() => setOnlyHealthy(!onlyHealthy)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-all shadow-sm ${
                onlyHealthy
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Healthy Only</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setCategory("")}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-all ${
            category === ""
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          All Categories
        </button>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c === category ? "" : c)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap capitalize transition-all ${
              category === c
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-1/3"></div>
              <div className="h-5 bg-slate-200 rounded w-3/4"></div>
              <div className="h-4 bg-slate-100 rounded w-1/2"></div>
              <div className="h-10 bg-slate-100 rounded-xl"></div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-16 text-center max-w-md mx-auto space-y-3">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="font-semibold text-slate-800 text-base">No Products Found</h3>
          <p className="text-xs text-slate-500">
            No items in our verified MongoDB catalog match your search or filter options.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setCategory("");
              setOnlyHealthy(false);
            }}
            className="text-xs text-emerald-600 font-semibold hover:underline"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => {
            const isAdded = addedIds[p.id];
            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 flex flex-col justify-between card-hover group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {p.category}
                    </span>
                    {p.isHealthy && (
                      <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <Heart className="w-3 h-3 fill-emerald-500 text-emerald-500" />
                        <span>Nutritious</span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-display font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors line-clamp-2">
                    {p.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
                    <span>{p.unit}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-medium truncate max-w-[140px]">
                      {p.storeName || "Central DarkStore"}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {p.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] bg-slate-50 text-slate-500 px-2 py-0.5 rounded-md border border-slate-100"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="font-display font-extrabold text-base text-slate-900">
                      {paiseToRupees(p.pricePaise)}
                    </span>
                    <div className="text-[10px] text-slate-400">
                      Stock: <span className="font-semibold text-slate-600">{p.stock} units</span>
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart(p.id)}
                    disabled={p.stock < 1}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all shadow-sm ${
                      isAdded
                        ? "bg-emerald-600 text-white"
                        : p.stock < 1
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "bg-slate-900 hover:bg-slate-800 text-white hover:shadow"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added</span>
                      </>
                    ) : p.stock < 1 ? (
                      <span>Sold Out</span>
                    ) : (
                      <>
                        <span>Add</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
