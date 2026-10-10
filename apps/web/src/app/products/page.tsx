"use client";

import React, { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Search, Heart, Sparkles, Filter } from "lucide-react";

interface ProductItem {
  id: string;
  name: string;
  category: string;
  pricePaise: number;
  unit: string;
  stock: number;
  tags: string[];
  isHealthy: boolean;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [onlyHealthy, setOnlyHealthy] = useState(false);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (search) queryParams.set("query", search);
        if (category) queryParams.set("category", category);
        if (onlyHealthy) queryParams.set("isHealthy", "true");

        const res = await apiFetch<{ products: ProductItem[] }>(`/products?${queryParams.toString()}`);
        setProducts(res.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [search, category, onlyHealthy]);

  const addToCart = async (productId: string) => {
    try {
      await apiFetch(`/cart/items/${productId}`, {
        method: "PATCH",
        body: JSON.stringify({ quantity: 1 })
      });
      alert("Added to cart!");
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Verified Product Catalog</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Real catalog ground-truth sourced from MongoDB.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button
            onClick={() => setOnlyHealthy(!onlyHealthy)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-colors ${
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

      <div className="flex flex-wrap gap-2 pb-2">
        <button
          onClick={() => setCategory("")}
          className={`px-3 py-1.5 text-xs font-medium rounded-full capitalize transition-colors ${
            category === ""
              ? "bg-slate-900 text-white"
              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
          }`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c === category ? "" : c)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full capitalize transition-colors ${
              category === c
                ? "bg-slate-900 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400 text-sm">Loading catalog items...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-slate-400 text-sm">No products found matching filters.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <div key={p.id} className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {p.category}
                  </span>
                  {p.isHealthy && (
                    <span className="flex items-center gap-0.5 text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <Heart className="w-3 h-3 fill-emerald-500 text-emerald-500" />
                      <span>Healthy</span>
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-slate-900 text-sm line-clamp-2">{p.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{p.unit}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {p.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-[10px] bg-slate-50 text-slate-500 px-1.5 py-0.5 rounded border border-slate-100">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-base font-bold text-slate-900">
                    ₹{(p.pricePaise / 100).toFixed(2)}
                  </span>
                  <div className="text-[10px] text-slate-400">Stock: {p.stock}</div>
                </div>
                <button
                  onClick={() => addToCart(p.id)}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
