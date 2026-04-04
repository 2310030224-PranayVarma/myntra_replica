import { create } from "zustand";

interface AdminAuthState {
  token: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  login: (token: string) => void;
  logout: () => void;
  initializeAuth: () => void;
}

export const useAdminStore = create<AdminAuthState>((set) => ({
  token: null,
  isAuthenticated: false,
  isHydrated: false,

  login: (token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("admin_token", token);
    }
    set({ token, isAuthenticated: true });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_token");
    }
    set({ token: null, isAuthenticated: false });
  },

  initializeAuth: () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("admin_token");
      if (token) {
        set({ token, isAuthenticated: true, isHydrated: true });
        return;
      }
    }
    set({ token: null, isAuthenticated: false, isHydrated: true });
  },
}));
