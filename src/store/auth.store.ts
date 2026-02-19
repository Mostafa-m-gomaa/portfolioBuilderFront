import { create } from 'zustand';
import { TOKEN_STORAGE_KEY } from '@/api/axios';
import type { AuthUser } from '@/types/auth.types';

const USER_STORAGE_KEY = 'auth_user';
const PENDING_EMAIL_STORAGE_KEY = 'pending_verify_email';

type AuthStore = {
  user: AuthUser | null;
  token: string | null;
  pendingEmail: string | null;
  isAuthenticated: boolean;
  setAuth: (payload: { token?: string; user?: AuthUser | null }) => void;
  setPendingEmail: (email: string | null) => void;
  login: (payload: { token: string; user?: AuthUser | null }) => void;
  logout: () => void;
};

const getInitialUser = (): AuthUser | null => {
  const raw = localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthStore>((set, get) => {
  const initialToken = localStorage.getItem(TOKEN_STORAGE_KEY);
  const initialUser = getInitialUser();
  const pendingEmail = localStorage.getItem(PENDING_EMAIL_STORAGE_KEY);

  return {
    user: initialUser,
    token: initialToken,
    pendingEmail,
    isAuthenticated: Boolean(initialToken),
    setAuth: ({ token, user }) => {
      const nextToken = token ?? get().token;
      const nextUser = user ?? get().user;

      if (nextToken) localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
      if (nextUser) localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));

      set({
        token: nextToken ?? null,
        user: nextUser ?? null,
        isAuthenticated: Boolean(nextToken),
      });
    },
    setPendingEmail: (email) => {
      if (email) {
        localStorage.setItem(PENDING_EMAIL_STORAGE_KEY, email);
      } else {
        localStorage.removeItem(PENDING_EMAIL_STORAGE_KEY);
      }
      set({ pendingEmail: email });
    },
    login: ({ token, user }) => {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      if (user) localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      set({
        token,
        user: user ?? null,
        isAuthenticated: true,
      });
    },
    logout: () => {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(PENDING_EMAIL_STORAGE_KEY);
      set({
        token: null,
        user: null,
        pendingEmail: null,
        isAuthenticated: false,
      });
    },
  };
});

