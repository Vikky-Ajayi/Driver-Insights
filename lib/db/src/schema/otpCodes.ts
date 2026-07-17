import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const otpCodesTable = pgTable("otp_codes", {
  id: uuid("id").primaryKey().defaultRandom(),
  // Always keyed by email — never by phone or any other field
  email: text("email").notNull(),
  code: text("code").notNull(),
  type: text("type", {
    enum: ["email_verification", "password_reset"],
  }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type OtpCode = typeof otpCodesTable.$inferSelect;
