import { create } from "zustand";
import { getFromLocalStorage, setToLocalStorage } from "../utils";

interface AuthStore {
  isAuthenticated: boolean;
  token: string;
  setAuthenticated: (token: string) => void;
  setUnauthenticated: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: getFromLocalStorage("isAuthenticated") || false,
  token: getFromLocalStorage("token") || "",
  setAuthenticated: (token: string) => {
    set({ isAuthenticated: true, token });
    setToLocalStorage("isAuthenticated", true);
    setToLocalStorage("token", token);
  },
  setUnauthenticated: () => {
    set({ isAuthenticated: false, token: "" });
    setToLocalStorage("isAuthenticated", false);
    setToLocalStorage("token", "");
  }
}));