"use client";

import { useCallback } from "react";
import { useAuthStore } from "../store/auth.store";

export function useAuth() {
  const account = useAuthStore((state) => state.account);
  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  return {
    account,
    accessToken,
    isAuthenticated,
    isHydrated,
    setSession,
    logout,
  };
}
