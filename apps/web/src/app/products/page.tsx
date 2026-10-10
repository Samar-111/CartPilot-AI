"use client";

import React, { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Search, Heart, ShoppingBag, Check, ArrowUpDown, Filter, AlertCircle, Sparkles } from "lucide-react";
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
  }, [search, category, onlyHealthy, sortBy, selectedCity]);

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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#232B25] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#C6FF4D] mb-1">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>GROUND-TRUTH CATALOG</span>
          </div>
          <h1 className="font-display text-3xl font-extrabold text-[#F4F5EF] tracking-tight">
            Discover Verified Products
          </h1>
          <p className="text-xs sm:text-sm text-[#929A91] mt-1">
            Real inventory with live stock levels and cryptographically verified integer-paise prices.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#667065]" />
            <input
              type="text"
              placeholder="Search catalog or tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-[#2E3B31] bg-[#0B0D0C] text-[#F4F5EF] focus:outline-none focus:border-[#C6FF4D] placeholder-[#667065]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="py-2 px-3 text-xs rounded-xl border border-[#2E3B31] bg-[#141815] text-[#F4F5EF] font-mono focus:outline-none focus:border-[#C6FF4D]"
            >
              {stores.map((s) => (
                <option key={s.pincode} value={s.pincode} className="bg-[#0B0D0C]">
                  {s.city}
                </option>
              ))}
            </select>

            <button
              onClick={handleLivePriceSync}
              disabled={syncing}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-semibold rounded-xl bg-[#1B211C] hover:bg-[#2E3B31] text-[#C6FF4D] border border-[#2E3B31] transition-all"
              title="Simulates live merchant catalog updates"
            >
              <ArrowUpDown className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
              <span>{syncing ? "Syncing..." : "Sync Live Prices"}</span>
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-2 px-3 text-xs rounded-xl border border-[#2E3B31] bg-[#141815] text-[#F4F5EF] font-mono focus:outline-none focus:border-[#C6FF4D]"
            >
              <option value="featured" className="bg-[#0B0D0C]">Featured First</option>
              <option value="price-asc" className="bg-[#0B0D0C]">Price: Low to High</option>
              <option value="price-desc" className="bg-[#0B0D0C]">Price: High to Low</option>
            </select>

            <button
              onClick={() => setOnlyHealthy(!onlyHealthy)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-semibold rounded-xl border transition-all ${
                onlyHealthy
                  ? "bg-[#C6FF4D] text-[#0B0D0C] border-[#C6FF4D] font-bold"
                  : "bg-[#141815] text-[#929A91] border-[#2E3B31] hover:text-[#F4F5EF]"
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
          className={`px-3.5 py-1.5 text-xs font-mono font-medium rounded-full whitespace-nowrap transition-all ${
            category === ""
              ? "bg-[#C6FF4D] text-[#0B0D0C] font-bold shadow-lime-glow"
              : "bg-[#141815] border border-[#232B25] text-[#929A91] hover:text-[#F4F5EF]"
          }`}
        >
          All Categories
        </button>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c === category ? "" : c)}
            className={`px-3.5 py-1.5 text-xs font-mono font-medium rounded-full whitespace-nowrap capitalize transition-all ${
              category === c
                ? "bg-[#C6FF4D] text-[#0B0D0C] font-bold shadow-lime-glow"
                : "bg-[#141815] border border-[#232B25] text-[#929A91] hover:text-[#F4F5EF]"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-[#141815] rounded-2xl border border-[#232B25] p-5 space-y-4 animate-pulse">
              <div className="h-4 bg-[#1F2620] rounded w-1/3" />
              <div className="h-5 bg-[#1F2620] rounded w-3/4" />
              <div className="h-4 bg-[#1F2620] rounded w-1/2" />
              <div className="h-10 bg-[#1F2620] rounded-xl" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-[#141815] rounded-2xl border border-[#232B25] p-16 text-center max-w-md mx-auto space-y-3">
          <AlertCircle className="w-8 h-8 text-[#667065] mx-auto" />
          <h3 className="font-mono font-bold text-[#F4F5EF] text-base">No Products Found</h3>
          <p className="text-xs text-[#929A91]">
            No items in our verified MongoDB catalog match your search or filter options.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setCategory("");
              setOnlyHealthy(false);
            }}
            className="text-xs font-mono text-[#C6FF4D] hover:underline"
          >
            Clear Active Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((p) => {
            const isAdded = addedIds[p.id];
            return (
              <div
                key={p.id}
                className="bg-[#141815] rounded-2xl border border-[#232B25] p-5 flex flex-col justify-between card-hover-command group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#0B0D0C] text-[#8DCBFF] border border-[#232B25]">
                      {p.category}
                    </span>
                    {p.isHealthy && (
                      <span className="flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[rgba(198,255,77,0.1)] text-[#C6FF4D] border border-[rgba(198,255,77,0.25)]">
                        <Heart className="w-3 h-3 fill-[#C6FF4D] text-[#C6FF4D]" />
                        <span>Nutritious</span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-display font-bold text-[#F4F5EF] text-sm group-hover:text-[#C6FF4D] transition-colors line-clamp-2">
                    {p.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#667065] mt-1">
                    <span>{p.unit}</span>
                    <span>•</span>
                    <span className="text-[#929A91] truncate max-w-[140px]">
                      {p.storeName || "Central DarkStore"}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {p.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[9px] font-mono bg-[#0B0D0C] text-[#929A91] px-1.5 py-0.5 rounded border border-[#1F2620]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-[#1F2620] flex items-center justify-between">
                  <div>
                    <span className="font-mono font-extrabold text-base text-[#F4F5EF]">
                      {paiseToRupees(p.pricePaise)}
                    </span>
                    <div className="text-[10px] font-mono text-[#667065]">
                      Stock: <span className="text-[#929A91]">{p.stock} units</span>
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart(p.id)}
                    disabled={p.stock < 1}
                    className={`flex items-center gap-1.5 text-xs font-mono font-semibold px-3 py-2 rounded-xl transition-all ${
                      isAdded
                        ? "bg-[#C6FF4D] text-[#0B0D0C] font-bold"
                        : p.stock < 1
                        ? "bg-[#1B211C] text-[#667065] cursor-not-allowed border border-[#232B25]"
                        : "bg-[#0B0D0C] hover:bg-[#C6FF4D] text-[#F4F5EF] hover:text-[#0B0D0C] border border-[#2E3B31] hover:border-[#C6FF4D] shadow-sm"
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
