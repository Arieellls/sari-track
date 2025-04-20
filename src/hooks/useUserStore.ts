// stores/useUserStore.ts
import { create } from "zustand";

export type UserType = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null;
};

type UserState = {
  user?: UserType;
  setUser: (user: UserType | undefined) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  user: undefined,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: undefined }),
}));
