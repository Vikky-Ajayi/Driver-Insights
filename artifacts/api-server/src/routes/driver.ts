import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import { requireAuth, type AuthRequest } from "../middlewares/auth";

const router = Router();

// All driver routes require a valid JWT
router.use(requireAuth);

// ─── GET /api/driver/profile ──────────────────────────────────────────────────

router.get("/profile", async (req: AuthRequest, res) => {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, req.userId!))
    .limit(1);

  if (!user) {
    res.status(404).json({
      success: false,
      error: { code: "NOT_FOUND", message: "User not found" },
    });
    return;
  }

  res.json({
    success: true,
    data: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      country: user.country,
      subscription_status: user.subscriptionStatus,
      avatar_url: user.avatarUrl ?? undefined,
    },
  });
});

// ─── PATCH /api/driver/location ───────────────────────────────────────────────

router.patch("/location", async (_req: AuthRequest, res) => {
  // Location updates acknowledged — store or forward to a real-time layer later
  res.json({ success: true, data: null });
});

// ─── GET /api/driver/stats ────────────────────────────────────────────────────

router.get("/stats", async (_req: AuthRequest, res) => {
  // Placeholder stats — wire to real trip/earnings data when available
  res.json({
    success: true,
    data: {
      total_trips: 0,
      earnings_today: 0,
      rating: 5.0,
    },
  });
});

export default router;
