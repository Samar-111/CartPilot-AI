import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models";
import { config } from "../config";
import { z } from "zod";

export const authRouter = Router();

const AuthInputSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  dietaryPreferences: z.array(z.string()).optional()
});

authRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, name, dietaryPreferences } = AuthInputSchema.parse(req.body);

    let user = await UserModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      user = await UserModel.create({
        email: email.toLowerCase(),
        name: name || email.split("@")[0],
        passwordHash: "demo_hash",
        dietaryPreferences: (dietaryPreferences as any) || ["healthy", "vegetarian"]
      });
    }

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      config.jwtSecret,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        dietaryPreferences: user.dietaryPreferences
      }
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Login failed" });
  }
});

authRouter.get("/me", async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, config.jwtSecret) as { userId: string };
    const user = await UserModel.findById(decoded.userId).lean();
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json({
      id: (user as any)._id.toString(),
      email: user.email,
      name: user.name,
      dietaryPreferences: user.dietaryPreferences
    });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
});
