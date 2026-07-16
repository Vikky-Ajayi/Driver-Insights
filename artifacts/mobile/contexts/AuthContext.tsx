import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { authApi, Driver, getToken, RegisterData, removeToken, setToken } from '@/services/api';

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
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    token: null,
    user: null,
    isLoading: true,
  });

  // Restore token on mount
  useEffect(() => {
    getToken()
      .then((token) => {
        setState((s) => ({ ...s, token: token ?? null, isLoading: false }));
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

  const register = useCallback(async (data: RegisterData) => {
    const { token, user } = await authApi.register(data);
    await setToken(token);
    setState((s) => ({ ...s, token, user }));
  }, []);

  const logout = useCallback(async () => {
    await removeToken();
    setState({ token: null, user: null, isLoading: false });
  }, []);

  const updateUser = useCallback((user: Driver) => {
    setState((s) => ({ ...s, user }));
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
