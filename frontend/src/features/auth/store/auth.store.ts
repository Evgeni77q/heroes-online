import { create } from "zustand";
import { Account, AuthResponse } from "../types/auth.types";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const ACCOUNT_KEY = "account";

interface AuthState {
  account: Account | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setSession: (response: AuthResponse) => void;
  clearSession: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  account: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isHydrated: false,

  setSession: (response: AuthResponse) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, response.tokens.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, response.tokens.refreshToken);
    localStorage.setItem(ACCOUNT_KEY, JSON.stringify(response.account));

    set({
      account: response.account,
      accessToken: response.tokens.accessToken,
      refreshToken: response.tokens.refreshToken,
      isAuthenticated: true,
    });
  },

  clearSession: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(ACCOUNT_KEY);

    set({
      account: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  },

  hydrate: () => {
    if (typeof window === "undefined") {
      return;
    }

    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    const accountRaw = localStorage.getItem(ACCOUNT_KEY);

    if (!accessToken || !refreshToken || !accountRaw) {
      set({ isHydrated: true });
      return;
    }

    try {
      const account = JSON.parse(accountRaw) as Account;

      set({
        account,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        isHydrated: true,
      });
    } catch {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(ACCOUNT_KEY);

      set({
        account: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isHydrated: true,
      });
    }
  },
}));
