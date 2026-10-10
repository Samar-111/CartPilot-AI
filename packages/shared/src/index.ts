import { z } from "zod";

export const DietaryPreferenceSchema = z.enum([
  "vegetarian",
  "vegan",
  "gluten-free",
  "dairy-free",
  "healthy",
  "high-protein",
  "organic",
  "low-sugar"
]);
export type DietaryPreference = z.infer<typeof DietaryPreferenceSchema>;

export const ProductCategorySchema = z.enum([
  "fruits",
  "vegetables",
  "dairy",
  "grains",
  "protein",
  "bakery",
  "beverages",
  "snacks",
  "staples"
]);
export type ProductCategory = z.infer<typeof ProductCategorySchema>;

export const UserSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  email: z.string().email(),
  dietaryPreferences: z.array(DietaryPreferenceSchema).default([]),
  createdAt: z.string().or(z.date())
});
export type User = z.infer<typeof UserSchema>;

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: ProductCategorySchema,
  pricePaise: z.number().int().positive(),
  unit: z.string(),
  stock: z.number().int().nonnegative(),
  tags: z.array(z.string()).default([]),
  isHealthy: z.boolean().default(false),
  isActive: z.boolean().default(true),
  image: z.string().optional(),
  storeName: z.string().default("Bengaluru Central DarkStore"),
  pincode: z.string().default("560001"),
  cityName: z.string().optional(),
  state: z.string().optional()
});
export type Product = z.infer<typeof ProductSchema>;

export interface CityStore {
  cityName: string;
  state: string;
  pincode: string;
  storeName: string;
}

export const INDIAN_CITIES: CityStore[] = [
  { cityName: "Bengaluru", state: "Karnataka", pincode: "560001", storeName: "Bengaluru Central DarkStore" },
  { cityName: "Mumbai", state: "Maharashtra", pincode: "400050", storeName: "Mumbai West Hub (Bandra)" },
  { cityName: "Delhi NCR", state: "Delhi", pincode: "110001", storeName: "Delhi Connaught Place Hub" },
  { cityName: "Hyderabad", state: "Telangana", pincode: "500081", storeName: "Hyderabad Hitec City Hub" },
  { cityName: "Chennai", state: "Tamil Nadu", pincode: "600017", storeName: "Chennai T Nagar Store" },
  { cityName: "Kolkata", state: "West Bengal", pincode: "700016", storeName: "Kolkata Park Street Hub" },
  { cityName: "Pune", state: "Maharashtra", pincode: "411005", storeName: "Pune Shivaji Nagar Mart" },
  { cityName: "Ahmedabad", state: "Gujarat", pincode: "380015", storeName: "Ahmedabad SG Highway Store" },
  { cityName: "Jaipur", state: "Rajasthan", pincode: "302017", storeName: "Jaipur Malviya Nagar Hub" },
  { cityName: "Lucknow", state: "Uttar Pradesh", pincode: "226001", storeName: "Lucknow Hazratganj Store" },
  { cityName: "Chandigarh", state: "Punjab/Haryana", pincode: "160017", storeName: "Chandigarh Sector 17 Hub" },
  { cityName: "Indore", state: "Madhya Pradesh", pincode: "452010", storeName: "Indore Vijay Nagar Mart" },
  { cityName: "Kochi", state: "Kerala", pincode: "682031", storeName: "Kochi Marine Drive Hub" },
  { cityName: "Bhopal", state: "Madhya Pradesh", pincode: "462011", storeName: "Bhopal MP Nagar Store" },
  { cityName: "Patna", state: "Bihar", pincode: "800001", storeName: "Patna Fraser Road Hub" },
  { cityName: "Surat", state: "Gujarat", pincode: "395009", storeName: "Surat Adajan Mart" },
  { cityName: "Nagpur", state: "Maharashtra", pincode: "440012", storeName: "Nagpur Sitabuldi Hub" },
  { cityName: "Coimbatore", state: "Tamil Nadu", pincode: "641002", storeName: "Coimbatore RS Puram Store" },
  { cityName: "Visakhapatnam", state: "Andhra Pradesh", pincode: "530002", storeName: "Vizag Beach Road Hub" },
  { cityName: "Guwahati", state: "Assam", pincode: "781005", storeName: "Guwahati GS Road Hub" }
];

export const CartItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  unit: z.string(),
  unitPricePaise: z.number().int().positive(),
  quantity: z.number().int().positive(),
  subtotalPaise: z.number().int().positive()
});
export type CartItem = z.infer<typeof CartItemSchema>;

export const CartSchema = z.object({
  id: z.string(),
  userId: z.string(),
  items: z.array(CartItemSchema).default([]),
  totalPaise: z.number().int().nonnegative(),
  status: z.enum(["active", "converted", "abandoned"]).default("active"),
  updatedAt: z.string().or(z.date())
});
export type Cart = z.infer<typeof CartSchema>;

export const ProposedCartItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  category: ProductCategorySchema,
  unit: z.string(),
  unitPricePaise: z.number().int().positive(),
  quantity: z.number().int().positive(),
  subtotalPaise: z.number().int().positive(),
  reason: z.string()
});
export type ProposedCartItem = z.infer<typeof ProposedCartItemSchema>;

export const ShoppingPlanCategorySchema = z.object({
  category: ProductCategorySchema,
  targetItemCount: z.number().int().positive(),
  budgetSharePaise: z.number().int().positive(),
  notes: z.string().optional()
});
export type ShoppingPlanCategory = z.infer<typeof ShoppingPlanCategorySchema>;

export const ShoppingPlanSchema = z.object({
  peopleCount: z.number().int().positive(),
  durationDays: z.number().int().positive(),
  targetBudgetPaise: z.number().int().positive(),
  preferences: z.array(DietaryPreferenceSchema),
  categories: z.array(ShoppingPlanCategorySchema),
  rationale: z.string()
});
export type ShoppingPlan = z.infer<typeof ShoppingPlanSchema>;

export const AgentEventSchema = z.object({
  id: z.string().optional(),
  sessionId: z.string(),
  node: z.enum([
    "parse_request",
    "create_plan",
    "search_products",
    "rank_products",
    "build_proposed_cart",
    "validate_cart",
    "revise_plan",
    "await_approval",
    "apply_approval",
    "system"
  ]),
  status: z.enum(["started", "in_progress", "completed", "failed", "retrying"]),
  message: z.string(),
  durationMs: z.number().int().nonnegative().optional(),
  createdAt: z.string().or(z.date())
});
export type AgentEvent = z.infer<typeof AgentEventSchema>;

export const ShoppingSessionStatusSchema = z.enum([
  "initializing",
  "planning",
  "searching",
  "optimizing",
  "awaiting_approval",
  "approved",
  "rejected",
  "failed"
]);
export type ShoppingSessionStatus = z.infer<typeof ShoppingSessionStatusSchema>;

export const ShoppingSessionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  request: z.string(),
  budgetPaise: z.number().int().positive(),
  preferences: z.array(DietaryPreferenceSchema).default([]),
  durationDays: z.number().int().positive().default(7),
  peopleCount: z.number().int().positive().default(2),
  status: ShoppingSessionStatusSchema,
  plan: ShoppingPlanSchema.optional(),
  proposedItems: z.array(ProposedCartItemSchema).default([]),
  totalPaise: z.number().int().nonnegative().default(0),
  retryCount: z.number().int().nonnegative().default(0),
  proposalVersion: z.number().int().positive().default(1),
  validationMessage: z.string().optional(),
  pincode: z.string().optional(),
  cityName: z.string().optional(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date())
});
export type ShoppingSession = z.infer<typeof ShoppingSessionSchema>;

export const CreateShoppingSessionInputSchema = z.object({
  request: z.string().min(5),
  budgetPaise: z.number().int().positive().default(200000),
  preferences: z.array(DietaryPreferenceSchema).optional().default([]),
  durationDays: z.number().int().positive().default(7),
  peopleCount: z.number().int().positive().default(2),
  pincode: z.string().optional(),
  cityName: z.string().optional()
});
export type CreateShoppingSessionInput = z.infer<typeof CreateShoppingSessionInputSchema>;

export const ApprovalInputSchema = z.object({
  approved: z.boolean(),
  proposalVersion: z.number().int().positive(),
  feedback: z.string().optional()
});
export type ApprovalInput = z.infer<typeof ApprovalInputSchema>;

export const ReviseInputSchema = z.object({
  modification: z.string().min(3),
  adjustedBudgetPaise: z.number().int().positive().optional()
});
export type ReviseInput = z.infer<typeof ReviseInputSchema>;

export const ProductSearchInputSchema = z.object({
  query: z.string().optional(),
  category: ProductCategorySchema.optional(),
  maxPricePaise: z.number().int().positive().optional(),
  tags: z.array(z.string()).optional(),
  isHealthy: z.boolean().optional(),
  pincode: z.string().optional(),
  storeName: z.string().optional(),
  limit: z.number().int().min(1).max(200).default(60)
});
export type ProductSearchInput = z.infer<typeof ProductSearchInputSchema>;

export const DeliveryAddressSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(10),
  street: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().min(6)
});
export type DeliveryAddress = z.infer<typeof DeliveryAddressSchema>;

export const OrderSchema = z.object({
  id: z.string(),
  userId: z.string(),
  sessionId: z.string().optional(),
  items: z.array(CartItemSchema),
  totalPaise: z.number().int().positive(),
  status: z.enum(["pending_payment", "confirmed", "dispatched", "delivered", "failed"]).default("confirmed"),
  paymentMethod: z.enum(["razorpay", "simulated", "cod"]).default("razorpay"),
  paymentStatus: z.enum(["pending", "paid", "failed"]).default("pending"),
  razorpayOrderId: z.string().optional(),
  razorpayPaymentId: z.string().optional(),
  deliveryAddress: DeliveryAddressSchema.optional(),
  createdAt: z.string().or(z.date())
});
export type Order = z.infer<typeof OrderSchema>;

export function paiseToRupees(paise: number): string {
  const rupees = paise / 100;
  return `₹${rupees.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}
