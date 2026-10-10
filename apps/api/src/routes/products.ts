import { Router, Request, Response } from "express";
import { ProductModel } from "../models";
import { searchProducts, getProductDetails } from "../tools/catalogTools";

export const productsRouter = Router();

productsRouter.get("/", async (req: Request, res: Response) => {
  try {
    const { category, query, maxPricePaise, isHealthy, pincode, storeName, limit } = req.query;

    const products = await searchProducts({
      category: category ? (category as any) : undefined,
      query: query ? String(query) : undefined,
      maxPricePaise: maxPricePaise ? parseInt(String(maxPricePaise), 10) : undefined,
      isHealthy: isHealthy !== undefined ? isHealthy === "true" : undefined,
      pincode: pincode ? String(pincode) : undefined,
      storeName: storeName ? String(storeName) : undefined,
      limit: limit ? parseInt(String(limit), 10) : 100
    });

    res.json({
      count: products.length,
      products: products.map(p => ({
        id: (p as any)._id.toString(),
        name: p.name,
        category: p.category,
        pricePaise: p.pricePaise,
        unit: p.unit,
        stock: p.stock,
        tags: p.tags,
        isHealthy: p.isHealthy,
        image: p.image,
        storeName: p.storeName || "Bengaluru Central DarkStore",
        pincode: p.pincode || "560001",
        cityName: p.cityName || "Bengaluru",
        state: p.state || "Karnataka",
        lastPriceSyncAt: p.lastPriceSyncAt
      }))
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch products" });
  }
});

productsRouter.get("/stores", async (_req: Request, res: Response) => {
  try {
    const stores = await ProductModel.aggregate([
      {
        $group: {
          _id: { pincode: "$pincode", storeName: "$storeName", cityName: "$cityName", state: "$state" },
          itemCount: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          pincode: "$_id.pincode",
          storeName: "$_id.storeName",
          cityName: "$_id.cityName",
          state: "$_id.state",
          itemCount: 1
        }
      },
      { $sort: { cityName: 1, storeName: 1 } }
    ]);
    res.json({ stores });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch stores" });
  }
});

productsRouter.post("/sync", async (req: Request, res: Response) => {
  try {
    const { items, storeName, pincode } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: "items array is required" });
      return;
    }

    let updatedCount = 0;
    for (const item of items) {
      if (!item.name || !item.pricePaise) continue;
      const targetPincode = pincode || item.pincode || "560001";
      const targetStoreName = storeName || item.storeName || "Bengaluru Central DarkStore";

      await ProductModel.findOneAndUpdate(
        { name: item.name, pincode: targetPincode },
        {
          name: item.name,
          pricePaise: item.pricePaise,
          stock: item.stock !== undefined ? item.stock : 50,
          unit: item.unit || "unit",
          category: item.category || "staples",
          storeName: targetStoreName,
          pincode: targetPincode,
          lastPriceSyncAt: new Date()
        },
        { upsert: true, new: true }
      );
      updatedCount++;
    }

    res.json({
      message: `Successfully synchronized ${updatedCount} products with live store catalog!`,
      storeName: storeName || "Bengaluru Central DarkStore",
      pincode: pincode || "560001",
      syncedAt: new Date()
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to sync products" });
  }
});

productsRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const product = await getProductDetails(req.params.id);
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json({
      id: (product as any)._id.toString(),
      name: product.name,
      category: product.category,
      pricePaise: product.pricePaise,
      unit: product.unit,
      stock: product.stock,
      tags: product.tags,
      isHealthy: product.isHealthy,
      image: product.image
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch product" });
  }
});
