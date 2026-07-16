---
name: RideSpot Auth Routing
description: How auth-gated routing is wired in the RideSpot Expo Router app
---

**Rule:** A root `app/index.tsx` is required to redirect users based on token presence. expo-router will not auto-redirect without it.

**Why:** The `_layout.tsx` renders only a Stack navigator. Without a root index that checks `useAuth().token`, the app lands on a blank screen — expo-router has no default route to fall back to when `(auth)` and `(tabs)` are the only route groups.

**How to apply:**
- `app/index.tsx` — reads `useAuth().token`, shows a black loading spinner while `isLoading`, then `<Redirect href="/(auth)/onboarding" />` or `<Redirect href="/(tabs)/" />`.
- AuthProvider is at the root of the component tree in `_layout.tsx` wrapping `<RootLayoutNav />`.
