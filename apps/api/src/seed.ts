import { connectDB, disconnectDB } from "./config/db";
import { ProductModel, UserModel } from "./models";

export const sampleProducts = [
  { name: "Rolled Oats (Gluten Free)", category: "grains", pricePaise: 18000, unit: "500g", stock: 50, tags: ["healthy", "gluten-free", "breakfast"], isHealthy: true },
  { name: "Organic Brown Rice", category: "grains", pricePaise: 16000, unit: "1kg", stock: 40, tags: ["healthy", "organic", "grains"], isHealthy: true },
  { name: "Whole Wheat Atta", category: "grains", pricePaise: 24000, unit: "5kg", stock: 35, tags: ["staples", "vegetarian"], isHealthy: true },
  { name: "Quinoa Organic", category: "grains", pricePaise: 29000, unit: "500g", stock: 25, tags: ["healthy", "superfood", "gluten-free"], isHealthy: true },
  { name: "Multigrain Bread", category: "bakery", pricePaise: 5500, unit: "400g", stock: 30, tags: ["healthy", "breakfast"], isHealthy: true },
  { name: "White Bread", category: "bakery", pricePaise: 4000, unit: "400g", stock: 45, tags: ["breakfast"], isHealthy: false },

  { name: "Fresh Spinach (Palak)", category: "vegetables", pricePaise: 4000, unit: "250g", stock: 60, tags: ["healthy", "organic", "greens"], isHealthy: true },
  { name: "Broccoli Fresh", category: "vegetables", pricePaise: 8000, unit: "500g", stock: 30, tags: ["healthy", "greens", "low-calorie"], isHealthy: true },
  { name: "Carrots Fresh", category: "vegetables", pricePaise: 5000, unit: "1kg", stock: 45, tags: ["healthy", "vegetables"], isHealthy: true },
  { name: "Tomatoes Hybrid", category: "vegetables", pricePaise: 4500, unit: "1kg", stock: 70, tags: ["vegetables", "staples"], isHealthy: true },
  { name: "Onions Fresh", category: "vegetables", pricePaise: 4000, unit: "1kg", stock: 80, tags: ["vegetables", "staples"], isHealthy: true },
  { name: "Potatoes Premium", category: "vegetables", pricePaise: 3500, unit: "1kg", stock: 90, tags: ["vegetables", "staples"], isHealthy: false },
  { name: "Bell Peppers (Capsicum)", category: "vegetables", pricePaise: 6500, unit: "500g", stock: 40, tags: ["healthy", "salad"], isHealthy: true },

  { name: "Shimla Apples (Royal Delicious)", category: "fruits", pricePaise: 18000, unit: "1kg", stock: 40, tags: ["healthy", "fruits"], isHealthy: true },
  { name: "Bananas Robusta", category: "fruits", pricePaise: 6000, unit: "1 dozen", stock: 85, tags: ["healthy", "fruits", "potassium"], isHealthy: true },
  { name: "Papaya Fresh", category: "fruits", pricePaise: 7500, unit: "1 piece (approx 1kg)", stock: 30, tags: ["healthy", "digestive"], isHealthy: true },
  { name: "Valencia Oranges", category: "fruits", pricePaise: 12000, unit: "1kg", stock: 35, tags: ["healthy", "vitamin-c"], isHealthy: true },
  { name: "Pomegranates (Anaar)", category: "fruits", pricePaise: 21000, unit: "1kg", stock: 25, tags: ["healthy", "antioxidant"], isHealthy: true },

  { name: "Fresh Malai Paneer", category: "dairy", pricePaise: 11000, unit: "200g", stock: 50, tags: ["high-protein", "vegetarian"], isHealthy: true },
  { name: "Greek Yogurt Natural (Unsweetened)", category: "dairy", pricePaise: 9500, unit: "400g", stock: 35, tags: ["healthy", "high-protein", "probiotic"], isHealthy: true },
  { name: "Toned Milk Cow Fresh", category: "dairy", pricePaise: 6800, unit: "1L", stock: 100, tags: ["dairy", "daily"], isHealthy: true },
  { name: "Amul Salted Butter", category: "dairy", pricePaise: 5800, unit: "100g", stock: 60, tags: ["dairy"], isHealthy: false },
  { name: "Cheddar Cheese Slices", category: "dairy", pricePaise: 14500, unit: "200g (10 slices)", stock: 30, tags: ["dairy"], isHealthy: false },

  { name: "Farm Fresh Brown Eggs (Pack of 12)", category: "protein", pricePaise: 13000, unit: "12 pcs", stock: 50, tags: ["high-protein", "healthy"], isHealthy: true },
  { name: "Organic Tofu Natural", category: "protein", pricePaise: 10500, unit: "200g", stock: 40, tags: ["high-protein", "vegan", "healthy"], isHealthy: true },
  { name: "Yellow Moong Dal Unpolished", category: "protein", pricePaise: 14500, unit: "1kg", stock: 45, tags: ["healthy", "protein", "staples"], isHealthy: true },
  { name: "Green Toor Dal", category: "protein", pricePaise: 16500, unit: "1kg", stock: 40, tags: ["healthy", "protein", "staples"], isHealthy: true },
  { name: "Kabuli Chana (Chickpeas)", category: "protein", pricePaise: 15500, unit: "1kg", stock: 35, tags: ["healthy", "protein", "fiber"], isHealthy: true },
  { name: "Soya Chunks High Protein", category: "protein", pricePaise: 6500, unit: "200g", stock: 55, tags: ["high-protein", "vegan"], isHealthy: true },

  { name: "Cold Pressed Virgin Olive Oil", category: "staples", pricePaise: 58000, unit: "500ml", stock: 20, tags: ["healthy", "cooking-oil"], isHealthy: true },
  { name: "Cold Pressed Mustard Oil", category: "staples", pricePaise: 21000, unit: "1L", stock: 30, tags: ["staples", "healthy"], isHealthy: true },
  { name: "Himalayan Pink Rock Salt", category: "staples", pricePaise: 9500, unit: "1kg", stock: 50, tags: ["healthy", "staples"], isHealthy: true },
  { name: "Tata Salt Iodized", category: "staples", pricePaise: 2800, unit: "1kg", stock: 100, tags: ["staples"], isHealthy: true },
  { name: "Turmeric Powder Organic (Haldi)", category: "staples", pricePaise: 7500, unit: "200g", stock: 40, tags: ["healthy", "spices"], isHealthy: true },

  { name: "Green Tea Organic Whole Leaf", category: "beverages", pricePaise: 22000, unit: "100g", stock: 30, tags: ["healthy", "antioxidant", "beverages"], isHealthy: true },
  { name: "Tender Coconut Water (Fresh Pack)", category: "beverages", pricePaise: 6000, unit: "200ml", stock: 45, tags: ["healthy", "hydration"], isHealthy: true },
  { name: "Almond Milk Unsweetened", category: "beverages", pricePaise: 28000, unit: "1L", stock: 25, tags: ["healthy", "vegan", "dairy-free"], isHealthy: true },
  { name: "Artisanal Filter Coffee Powder", category: "beverages", pricePaise: 19500, unit: "200g", stock: 35, tags: ["beverages"], isHealthy: false },

  { name: "California Almonds (Badam)", category: "snacks", pricePaise: 38000, unit: "500g", stock: 30, tags: ["healthy", "nuts", "protein"], isHealthy: true },
  { name: "Roasted Pumpkin Seeds", category: "snacks", pricePaise: 17500, unit: "200g", stock: 25, tags: ["healthy", "superfood"], isHealthy: true },
  { name: "Roasted Makhana (Foxnuts)", category: "snacks", pricePaise: 15000, unit: "100g", stock: 40, tags: ["healthy", "low-calorie", "snacks"], isHealthy: true },
  { name: "Dark Chocolate 70%", category: "snacks", pricePaise: 16000, unit: "100g", stock: 35, tags: ["antioxidant", "snacks"], isHealthy: true },
  { name: "Potato Chips Salted", category: "snacks", pricePaise: 3000, unit: "60g", stock: 50, tags: ["snacks"], isHealthy: false }
];

export const storeLocations = [
  { cityName: "Bengaluru", state: "Karnataka", storeName: "Bengaluru Central DarkStore", pincode: "560001", multiplier: 1.0 },
  { cityName: "Mumbai", state: "Maharashtra", storeName: "Mumbai West Hub (Bandra)", pincode: "400050", multiplier: 1.06 },
  { cityName: "Delhi NCR", state: "Delhi", storeName: "Delhi Connaught Place Hub", pincode: "110001", multiplier: 0.98 },
  { cityName: "Hyderabad", state: "Telangana", storeName: "Hyderabad Hitec City Hub", pincode: "500081", multiplier: 0.96 },
  { cityName: "Chennai", state: "Tamil Nadu", storeName: "Chennai T Nagar Store", pincode: "600017", multiplier: 0.97 },
  { cityName: "Kolkata", state: "West Bengal", storeName: "Kolkata Park Street Hub", pincode: "700016", multiplier: 0.92 },
  { cityName: "Pune", state: "Maharashtra", storeName: "Pune Shivaji Nagar Mart", pincode: "411005", multiplier: 1.01 },
  { cityName: "Ahmedabad", state: "Gujarat", storeName: "Ahmedabad SG Highway Store", pincode: "380015", multiplier: 0.94 },
  { cityName: "Jaipur", state: "Rajasthan", storeName: "Jaipur Malviya Nagar Hub", pincode: "302017", multiplier: 0.93 },
  { cityName: "Lucknow", state: "Uttar Pradesh", storeName: "Lucknow Hazratganj Store", pincode: "226001", multiplier: 0.91 },
  { cityName: "Chandigarh", state: "Punjab/Haryana", storeName: "Chandigarh Sector 17 Hub", pincode: "160017", multiplier: 0.99 },
  { cityName: "Indore", state: "Madhya Pradesh", storeName: "Indore Vijay Nagar Mart", pincode: "452010", multiplier: 0.90 },
  { cityName: "Kochi", state: "Kerala", storeName: "Kochi Marine Drive Hub", pincode: "682031", multiplier: 1.02 },
  { cityName: "Bhopal", state: "Madhya Pradesh", storeName: "Bhopal MP Nagar Store", pincode: "462011", multiplier: 0.89 },
  { cityName: "Patna", state: "Bihar", storeName: "Patna Fraser Road Hub", pincode: "800001", multiplier: 0.88 },
  { cityName: "Surat", state: "Gujarat", storeName: "Surat Adajan Mart", pincode: "395009", multiplier: 0.93 },
  { cityName: "Nagpur", state: "Maharashtra", storeName: "Nagpur Sitabuldi Hub", pincode: "440012", multiplier: 0.92 },
  { cityName: "Coimbatore", state: "Tamil Nadu", storeName: "Coimbatore RS Puram Store", pincode: "641002", multiplier: 0.95 },
  { cityName: "Visakhapatnam", state: "Andhra Pradesh", storeName: "Vizag Beach Road Hub", pincode: "530002", multiplier: 0.94 },
  { cityName: "Guwahati", state: "Assam", storeName: "Guwahati GS Road Hub", pincode: "781005", multiplier: 1.04 }
];

export async function seed(): Promise<void> {
  await connectDB();
  console.log("Seeding database across multi-store locations...");

  await ProductModel.deleteMany({});
  
  const allStoreProducts: any[] = [];
  for (const store of storeLocations) {
    for (const base of sampleProducts) {
      allStoreProducts.push({
        ...base,
        pricePaise: Math.round(base.pricePaise * store.multiplier),
        storeName: store.storeName,
        pincode: store.pincode,
        cityName: store.cityName,
        state: store.state,
        lastPriceSyncAt: new Date()
      });
    }
  }

  const inserted = await ProductModel.insertMany(allStoreProducts);
  console.log(`Seeded ${inserted.length} products across ${storeLocations.length} Indian cities/stores successfully.`);

  const testUser = await UserModel.findOneAndUpdate(
    { email: "user@cartpilot.ai" },
    {
      name: "Demo Shopper",
      email: "user@cartpilot.ai",
      passwordHash: "demo_hash",
      dietaryPreferences: ["healthy", "vegetarian"]
    },
    { upsert: true, new: true }
  );
  console.log(`Demo user created: ${testUser._id} (${testUser.email})`);

  await disconnectDB();
  console.log("Seeding completed.");
}

if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch(err => {
      console.error("Seed error:", err);
      process.exit(1);
    });
}
