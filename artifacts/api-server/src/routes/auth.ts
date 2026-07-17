import { Router } from "express";
import bcrypt from "bcryptjs";
import { eq, and, gt, isNull } from "drizzle-orm";
import { db, usersTable, otpCodesTable } from "@workspace/db";
import { signToken } from "../middlewares/auth";
import { logger } from "../lib/logger";

const router = Router();

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function otpExpiresAt(): Date {
  return new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
}

/**
 * Creates a new OTP record keyed ONLY on email — never phone.
 * Invalidates any previous unused OTPs of the same type for that email.
 */
async function issueOtp(
  email: string,
  type: "email_verification" | "password_reset",
): Promise<string> {
  const code = generateOtp();

  // Soft-invalidate previous unused codes for this email+type by marking them used
  await db
    .update(otpCodesTable)
    .set({ usedAt: new Date() })
    .where(
      and(
        eq(otpCodesTable.email, email),
        eq(otpCodesTable.type, type),
        isNull(otpCodesTable.usedAt),
      ),
    );

  await db.insert(otpCodesTable).values({
    email,
    code,
    type,
    expiresAt: otpExpiresAt(),
  });

  // Log to console — replace this with a real email call when ready
  logger.info(
    { email, type, code },
    `[OTP] ${type} code for ${email}: ${code}`,
  );

  return code;
}

// ─── POST /api/auth/register ──────────────────────────────────────────────────

router.post("/register", async (req, res) => {
  const { fullName, email, phone, country, password } = req.body as {
    fullName?: string;
    email?: string;
    phone?: string;
    country?: string;
    password?: string;
  };

  if (!fullName || !email || !phone || !country || !password) {
    res.status(400).json({
      success: false,
      error: { code: "MISSING_FIELDS", message: "All fields are required" },
    });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Check for existing account with that email
  const existing = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.email, normalizedEmail))
    .limit(1);

  if (existing.length > 0) {
    res.status(409).json({
      success: false,
      error: { code: "EMAIL_TAKEN", message: "An account with that email already exists" },
    });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await db.insert(usersTable).values({
    fullName: fullName.trim(),
    email: normalizedEmail,
    phone: phone.trim(),
    country: country.trim(),
    passwordHash,
  });

  // OTP is always created and sent to the registering email — never to any other account
  await issueOtp(normalizedEmail, "email_verification");

  res.status(201).json({ success: true, data: {} });
});

// ─── POST /api/auth/verify-email ──────────────────────────────────────────────

router.post("/verify-email", async (req, res) => {
  const { email, code } = req.body as { email?: string; code?: string };

  if (!email || !code) {
    res.status(400).json({
      success: false,
      error: { code: "MISSING_FIELDS", message: "Email and code are required" },
    });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const now = new Date();

  const [otp] = await db
    .select()
    .from(otpCodesTable)
    .where(
      and(
        eq(otpCodesTable.email, normalizedEmail),
        eq(otpCodesTable.code, code.trim()),
        eq(otpCodesTable.type, "email_verification"),
        isNull(otpCodesTable.usedAt),
        gt(otpCodesTable.expiresAt, now),
      ),
    )
    .limit(1);

  if (!otp) {
    res.status(400).json({
      success: false,
      error: { code: "INVALID_CODE", message: "The code is incorrect or has expired" },
    });
    return;
  }

  await db
    .update(otpCodesTable)
    .set({ usedAt: now })
    .where(eq(otpCodesTable.id, otp.id));

  await db
    .update(usersTable)
    .set({ emailVerified: true })
    .where(eq(usersTable.email, normalizedEmail));

  res.json({ success: true, data: {} });
});

// ─── POST /api/auth/resend-otp ────────────────────────────────────────────────

router.post("/resend-otp", async (req, res) => {
  const { email, type } = req.body as {
    email?: string;
    type?: string;
  };

  if (!email) {
    res.status(400).json({
      success: false,
      error: { code: "MISSING_FIELDS", message: "Email is required" },
    });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const otpType =
    type === "password_reset" ? "password_reset" : "email_verification";

  const [user] = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.email, normalizedEmail))
    .limit(1);

  if (!user) {
    // Don't leak whether the account exists
    res.json({ success: true, data: {} });
    return;
  }

  await issueOtp(normalizedEmail, otpType);
  res.json({ success: true, data: {} });
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────

router.post("/login", async (req, res) => {
  const { email, password } = req.body as {
    email?: string;
    password?: string;
  };

  if (!email || !password) {
    res.status(400).json({
      success: false,
      error: { code: "MISSING_FIELDS", message: "Email and password are required" },
    });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, normalizedEmail))
    .limit(1);

  if (!user) {
    res.status(401).json({
      success: false,
      error: { code: "INVALID_CREDENTIALS", message: "Incorrect email or password" },
    });
    return;
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatch) {
    res.status(401).json({
      success: false,
      error: { code: "INVALID_CREDENTIALS", message: "Incorrect email or password" },
    });
    return;
  }

  if (!user.emailVerified) {
    // The mobile client explicitly calls resendVerification when it gets this
    // error — don't issue a second OTP here or it would invalidate the first.
    res.status(403).json({
      success: false,
      error: {
        code: "EMAIL_NOT_VERIFIED",
        message: "Please verify your email before logging in",
      },
    });
    return;
  }

  const token = signToken({ userId: user.id, email: user.email });

  res.json({
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        country: user.country,
        subscription_status: user.subscriptionStatus,
        avatar_url: user.avatarUrl ?? undefined,
      },
    },
  });
});

// ─── POST /api/auth/forgot-password ───────────────────────────────────────────

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body as { email?: string };

  if (!email) {
    res.status(400).json({
      success: false,
      error: { code: "MISSING_FIELDS", message: "Email is required" },
    });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();

  const [user] = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.email, normalizedEmail))
    .limit(1);

  // Always respond success to avoid leaking account existence
  if (user) {
    await issueOtp(normalizedEmail, "password_reset");
  }

  res.json({ success: true, data: {} });
});

// ─── POST /api/auth/reset-password ────────────────────────────────────────────

router.post("/reset-password", async (req, res) => {
  const { email, code, newPassword } = req.body as {
    email?: string;
    code?: string;
    newPassword?: string;
  };

  if (!email || !code || !newPassword) {
    res.status(400).json({
      success: false,
      error: { code: "MISSING_FIELDS", message: "Email, code, and new password are required" },
    });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const now = new Date();

  const [otp] = await db
    .select()
    .from(otpCodesTable)
    .where(
      and(
        eq(otpCodesTable.email, normalizedEmail),
        eq(otpCodesTable.code, code.trim()),
        eq(otpCodesTable.type, "password_reset"),
        isNull(otpCodesTable.usedAt),
        gt(otpCodesTable.expiresAt, now),
      ),
    )
    .limit(1);

  if (!otp) {
    res.status(400).json({
      success: false,
      error: { code: "INVALID_CODE", message: "The code is incorrect or has expired" },
    });
    return;
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  await db
    .update(otpCodesTable)
    .set({ usedAt: now })
    .where(eq(otpCodesTable.id, otp.id));

  await db
    .update(usersTable)
    .set({ passwordHash, updatedAt: now })
    .where(eq(usersTable.email, normalizedEmail));

  res.json({ success: true, data: {} });
});

export default router;
