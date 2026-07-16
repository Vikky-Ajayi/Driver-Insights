import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL =
  process.env['EXPO_PUBLIC_API_BASE_URL'] ??
  'https://ridespot-production.up.railway.app';

const TOKEN_KEY = 'ridespot_auth_token';

// SecureStore not available on web; fall back to AsyncStorage
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

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = await getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options?.headers as Record<string, string> | undefined),
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      (body as { message?: string }).message ?? `HTTP ${res.status}`
    );
  }
  return res.json() as Promise<T>;
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  subscription_status: 'free' | 'pro' | 'fleet';
  avatar_url?: string;
}

export interface RegisterData {
  name: string;
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
  intensity_score: number;        // 0–100
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
    request<{ token: string; user: Driver }>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (data: RegisterData) =>
    request<{ token: string; user: Driver }>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  verifyOtp: (email: string, otp: string) =>
    request<{ success: boolean }>('/api/v1/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    }),

  forgotPassword: (email: string) =>
    request<{ success: boolean }>('/api/v1/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (email: string, otp: string, password: string) =>
    request<{ success: boolean }>('/api/v1/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, otp, password }),
    }),
};

// ─── Hotspot API ──────────────────────────────────────────────────────────────

export const hotspotApi = {
  getAll: () => request<Hotspot[]>('/api/v1/hotspots'),
  getNearby: (lat: number, lng: number) =>
    request<Hotspot[]>(`/api/v1/hotspots/nearby?lat=${lat}&lng=${lng}`),
};

// ─── Driver API ───────────────────────────────────────────────────────────────

export const driverApi = {
  getProfile: () => request<Driver>('/api/v1/driver/profile'),
  updateLocation: (lat: number, lng: number) =>
    request<void>('/api/v1/driver/location', {
      method: 'PATCH',
      body: JSON.stringify({ lat, lng }),
    }),
  getStats: () => request<DriverStats>('/api/v1/driver/stats'),
};

// ─── Payment API ──────────────────────────────────────────────────────────────

export const paymentApi = {
  initialize: (planId: string) =>
    request<{ paymentUrl: string; reference: string }>(
      '/api/v1/payments/initialize',
      { method: 'POST', body: JSON.stringify({ planId }) }
    ),
};

// ─── Notification API ─────────────────────────────────────────────────────────

export const notificationApi = {
  registerToken: (fcmToken: string) =>
    request<void>('/api/v1/notifications/token', {
      method: 'POST',
      body: JSON.stringify({ token: fcmToken }),
    }),
  getAll: () => request<unknown[]>('/api/v1/notifications'),
};
