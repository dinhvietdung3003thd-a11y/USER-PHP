import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { AuthState, AuthUser } from '../types/auth.types';

const AUTH_STORAGE_KEY = 'aroma_auth_state';

interface AuthContextValue {
  token: string | null;
  user: AuthUser | null;
  isLoggedIn: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  hydrateFromStorage: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const getStoredAuthState = (): AuthState => {
  if (typeof window === 'undefined') {
    return { token: null, user: null };
  }

  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) {
    return { token: null, user: null };
  }

  try {
    const parsed = JSON.parse(raw) as AuthState;
    return {
      token: parsed.token ?? null,
      user: parsed.user ?? null
    };
  } catch {
    return { token: null, user: null };
  }
};

const persistAuthState = (state: AuthState) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({ token: null, user: null });

  const login = useCallback((token: string, user: AuthUser) => {
    const nextState = { token, user };
    setAuthState(nextState);
    persistAuthState(nextState);
  }, []);

  const logout = useCallback(() => {
    const nextState = { token: null, user: null };
    setAuthState(nextState);
    persistAuthState(nextState);
  }, []);

  const hydrateFromStorage = useCallback(() => {
    setAuthState(getStoredAuthState());
  }, []);

  const contextValue = useMemo(
    () => ({
      token: authState.token,
      user: authState.user,
      isLoggedIn: Boolean(authState.token && authState.user),
      login,
      logout,
      hydrateFromStorage
    }),
    [authState.token, authState.user, login, logout, hydrateFromStorage]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuthStore() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuthStore must be used within AuthProvider');
  }

  return context;
}
