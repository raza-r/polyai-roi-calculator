import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  full_name?: string;
  organization_id: string;
  role: string;
}

interface Organization {
  id: string;
  name: string;
  slug: string;
  subscription_tier: string;
}

interface AuthState {
  user: User | null;
  organization: Organization | null;
  accessToken: string | null;
  refreshToken: string | null;
  setAuth: (user: User, organization: Organization, accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      organization: null,
      accessToken: null,
      refreshToken: null,
      setAuth: (user, organization, accessToken, refreshToken) =>
        set({ user, organization, accessToken, refreshToken }),
      clearAuth: () => set({ user: null, organization: null, accessToken: null, refreshToken: null }),
      isAuthenticated: () => !!get().accessToken,
    }),
    {
      name: 'calcforge-auth',
    }
  )
);
