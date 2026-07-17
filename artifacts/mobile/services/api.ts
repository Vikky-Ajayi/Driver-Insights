import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Default to the Railway production backend so existing accounts keep working.
// Set EXPO_PUBLIC_API_BASE_URL to override (e.g. point to the local API server
// by setting it to https://$REPLIT_DEV_DOMAIN in the mobile dev workflow).
const BASE_URL =
  process.env['EXPO_PUBLIC_API_BASE_URL'] ??
  'https://ridespot-production-8e87.up.railway.app';

const TOKEN_KEY = 'ridespot_auth_token';

// ─── Token storage ────────────────────────────────────────────────────────────

export async function getToken(): Promise<string | null> {
  if (Platform.OS === 'web') return AsyncStorage.getItem(TOKEN_KEY);
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function setToken(token: string): Promise<void> {
  if (Platform.OS === 'web') {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    return;
  }
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function removeToken(): Promise<void> {
  if (Platform.OS === 'web') {
    await AsyncStorage.removeItem(TOKEN_KEY);
    return;
  }
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

// ─── Typed API error ──────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(public readonly code: string, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// ─── HTTP client ──────────────────────────────────────────────────────────────

// Backend response envelope: { success: true, data: T } or { success: false, error: { code, message } }
type ApiEnvelope<T> = { success: true; data: T; message?: string } | { success: false; error: { code: string; message: string; details?: { fieldErrors?: Record<string, string[]> } } };

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = await getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options?.headers as Record<string, string> | undefined),
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const body = (await res.json().catch(() => ({}))) as ApiEnvelope<T>;

  if (!res.ok || body.success === false) {
    if (body.success === false) {
      const err = body.error;
      // Surface field-level validation errors clearly
      if (err.details?.fieldErrors) {
        const fieldMsgs = Object.entries(err.details.fieldErrors)
          .map(([, msgs]) => msgs.join(', '))
          .join('\n');
        throw new ApiError(err.code, fieldMsgs || err.message);
      }
      throw new ApiError(err.code, err.message ?? `HTTP ${res.status}`);
    }
    const fallbackMsg = (body as unknown as { message?: string }).message;
    throw new ApiError('HTTP_ERROR', fallbackMsg ?? `HTTP ${res.status}`);
  }

  return body.data;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Driver {
  id: string;
  fullName: string;
  name?: string; // alias
  email: string;
  phone: string;
  country: string;
  subscription_status: 'free' | 'pro' | 'fleet';
  avatar_url?: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  password: string;
}

export interface Hotspot {
  id: string;
  name: string;
  cluster_center: { lat: number; lng: number };
  radius: number;
  intensity_score: number;
  active_events: HotspotEvent[];
  expiry_timestamp: string;
  drive_time_minutes: number;
  distance_km: number;
  driver_saturation: 'LOW' | 'MEDIUM' | 'HIGH';
  demand_requests: 'LOW' | 'MEDIUM' | 'HIGH';
  demand_label: string;
  time_start: string;
  time_end: string;
  category?: 'taxi' | 'delivery';
}

export interface HotspotEvent {
  id: string;
  name: string;
  venue: string;
  start_time: string;
  end_time: string;
  expected_attendance: number;
}

export interface DriverStats {
  total_trips: number;
  earnings_today: number;
  rating: number;
}

// ─── Auth API ─────────────────────────────────────────────────────────────────

export const authApi = {
  login: (email: string, password: string) =>
    request<{ token: string; user: Driver }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (data: RegisterData) =>
    request<Record<string, never>>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  verifyEmail: (email: string, code: string) =>
    request<Record<string, never>>('/api/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    }),

  resendVerification: (email: string) =>
    request<Record<string, never>>('/api/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ email, type: 'email_verification' }),
    }),

  forgotPassword: (email: string) =>
    request<Record<string, never>>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (email: string, code: string, newPassword: string) =>
    request<Record<string, never>>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, code, newPassword }),
    }),
};

// ─── Hotspot API ──────────────────────────────────────────────────────────────

export const hotspotApi = {
  getAll: () => request<Hotspot[]>('/api/hotspots'),
  getNearby: (lat: number, lng: number) =>
    request<Hotspot[]>(`/api/hotspots/nearby?lat=${lat}&lng=${lng}`),
};

// ─── Driver API ───────────────────────────────────────────────────────────────

export const driverApi = {
  getProfile: () => request<Driver>('/api/driver/profile'),
  updateLocation: (lat: number, lng: number) =>
    request<void>('/api/driver/location', {
      method: 'PATCH',
      body: JSON.stringify({ lat, lng }),
    }),
  getStats: () => request<DriverStats>('/api/driver/stats'),
};

// ─── Payment API ──────────────────────────────────────────────────────────────

export const paymentApi = {
  initialize: (planId: string) =>
    request<{ paymentUrl: string; reference: string }>(
      '/api/payments/initialize',
      { method: 'POST', body: JSON.stringify({ planId }) }
    ),
};

// ─── Notification API ─────────────────────────────────────────────────────────

export const notificationApi = {
  registerToken: (fcmToken: string) =>
    request<void>('/api/notifications/token', {
      method: 'POST',
      body: JSON.stringify({ token: fcmToken }),
    }),
  getAll: () => request<unknown[]>('/api/notifications'),
};
