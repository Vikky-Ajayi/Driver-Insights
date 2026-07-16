---
name: RideSpot Maps Web Stub
description: react-native-maps crashes web bundling; requires a platform split wrapper component
---

**Rule:** Never import from `react-native-maps` directly in screen files. Always import through `@/components/MapView` which is a platform split.

**Why:** `react-native-maps@1.18.0` (and all versions) use `react-native/Libraries/Utilities/codegenNativeCommands` which is not available on web. The Expo web bundler crashes with a 500 error.

**How to apply:**
- `components/MapView.tsx` — re-exports everything from `react-native-maps` (native)
- `components/MapView.web.tsx` — stubs all exports with no-op components + a grey placeholder View

The version is pinned to 1.18.0 per user decision (Expo Go compatibility). Expo 54 expects 1.20.1 but shows only a warning, not an error, on native.
