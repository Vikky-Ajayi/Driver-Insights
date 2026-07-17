import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
}

const JWT_SECRET = process.env["SESSION_SECRET"];
if (!JWT_SECRET) throw new Error("SESSION_SECRET env var is required");

export function signToken(payload: { userId: string; email: string }): string {
  return jwt.sign(payload, JWT_SECRET!, { expiresIn: "30d" });
}

export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res
      .status(401)
      .json({ success: false, error: { code: "UNAUTHORIZED", message: "Missing token" } });
    return;
  }
  const token = header.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET!) as {
      userId: string;
      email: string;
    };
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    next();
  } catch {
    res
      .status(401)
      .json({ success: false, error: { code: "UNAUTHORIZED", message: "Invalid or expired token" } });
  }
}
