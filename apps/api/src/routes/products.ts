import { Router, Request, Response } from "express";
import { ProductModel } from "../models";
import { searchProducts, getProductDetails } from "../tools/catalogTools";

export const productsRouter = Router();

productsRouter.get("/", async (req: Request, res: Response) => {
  try {
    const { category, query, maxPricePaise, isHealthy, limit } = req.query;

    const products = await searchProducts({
      category: category ? (category as any) : undefined,
      query: query ? String(query) : undefined,
      maxPricePaise: maxPricePaise ? parseInt(String(maxPricePaise), 10) : undefined,
      isHealthy: isHealthy !== undefined ? isHealthy === "true" : undefined,
      limit: limit ? parseInt(String(limit), 10) : 50
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
        image: p.image
      }))
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch products" });
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
