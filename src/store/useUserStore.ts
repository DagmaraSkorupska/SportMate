import { create } from "zustand";
import { User } from "@supabase/supabase-js";

type UserStore = {
  user: User | null;
  isLoaded: boolean;
  setUser: (user: User | null) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isLoaded: false,
  setUser: (user) => set({ user, isLoaded: true }),
}));
