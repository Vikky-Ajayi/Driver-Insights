import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { authApi, Driver, driverApi, getToken, RegisterData, removeToken, setToken } from '@/services/api';

interface AuthState {
  token: string | null;
  user: Driver | null;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: Driver) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    token: null,
    user: null,
    isLoading: true,
  });

  // Restore token on mount and try to fetch profile
  useEffect(() => {
    getToken()
      .then(async (token) => {
        if (token) {
          // Try to restore user profile from the stored token
          try {
            const user = await driverApi.getProfile();
            setState({ token, user, isLoading: false });
          } catch {
            // Token may be expired — clear it
            await removeToken();
            setState({ token: null, user: null, isLoading: false });
          }
        } else {
          setState((s) => ({ ...s, token: null, isLoading: false }));
        }
      })
      .catch(() => {
        setState((s) => ({ ...s, isLoading: false }));
      });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { token, user } = await authApi.login(email, password);
    await setToken(token);
    setState((s) => ({ ...s, token, user }));
  }, []);

  // Register only creates the account — no token is returned.
  // The caller is responsible for navigating to verify-email.
  const register = useCallback(async (data: RegisterData) => {
    await authApi.register(data);
  }, []);

  const logout = useCallback(async () => {
    await removeToken();
    setState({ token: null, user: null, isLoading: false });
  }, []);

  const updateUser = useCallback((user: Driver) => {
    setState((s) => ({ ...s, user }));
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const user = await driverApi.getProfile();
      setState((s) => ({ ...s, user }));
    } catch {
      // ignore
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
