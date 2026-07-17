---
name: RideSpot API Contract
description: Correct backend URL, route paths, field names, and response envelope for the Railway backend.
---

## Backend URL
`https://ridespot-production-8e87.up.railway.app`

## Response envelope
ALL responses wrap data: `{ success: true, data: T, message?: string }` or `{ success: false, error: { code, message } }`.
The `request()` helper in `services/api.ts` unwraps `data` and throws on `success: false`.

## Auth routes (no `/v1` prefix)
| Method | Path | Body fields | Notes |
|--------|------|------------|-------|
| POST | `/api/auth/register` | `fullName, email, phone, country, password` | Returns NO token — sends verification email. Field is `fullName` not `name`. |
| POST | `/api/auth/login` | `email, password` | Returns `{ token, user }` inside `data`. Fails with `EMAIL_NOT_VERIFIED` if not verified. |
| POST | `/api/auth/verify-email` | `email, code` | Verifies email. Field is `code` not `otp`. After success → navigate to login. |
| POST | `/api/auth/forgot-password` | `email` | Sends reset code |
| POST | `/api/auth/reset-password` | `email, code, newPassword` | Fields: `code` (not `otp`), `newPassword` (not `password`) |
| POST | `/api/auth/resend-otp` | `email, type` | type must be `'email_verification'` or `'password_reset'`. Used for resend verification and resend password reset. |

## Other routes
| Method | Path | Notes |
|--------|------|-------|
| GET | `/api/hotspots` | Requires Bearer token |
| GET | `/api/driver/profile` | Requires Bearer token; returns `Driver` with `fullName` field |
| PATCH | `/api/driver/location` | Body: `{ lat, lng }` |
| GET | `/api/notifications` | Requires Bearer token |
| GET/HEAD | `/health` | No auth, returns `{ success: true, data: { status: "ok" } }` |

## Driver type
Backend returns `fullName` (not `name`). Code uses `user?.fullName ?? user?.name` as fallback.

## Register flow
1. POST `/api/auth/register` → success (no token)
2. Navigate to `/(auth)/verify-email?email=...`
3. User enters code from email → POST `/api/auth/verify-email`
4. Alert + navigate to `/(auth)/login`
5. POST `/api/auth/login` → get token → navigate to `/(tabs)/`

**Why:** Backend is email-verified-first auth. `AuthContext.register()` does NOT set token/user state.
