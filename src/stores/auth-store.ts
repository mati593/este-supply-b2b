import { create } from "zustand";

interface AuthUser {
  name: string;
  email: string;
  initials: string;
}

interface AuthState {
  user: AuthUser | null;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  login: (email: string) => void;
  logout: () => void;
}

function deriveInitials(email: string): string {
  const local = email.split("@")[0] ?? "U";
  const parts = local.split(/[._-]/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return local.slice(0, 2).toUpperCase();
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isModalOpen: false,

  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),

  login: (email) => {
    const trimmed = email.trim() || "usuario@empresa.com";
    set({
      user: {
        email: trimmed,
        name: trimmed.split("@")[0] ?? "Usuario",
        initials: deriveInitials(trimmed),
      },
      isModalOpen: false,
    });
  },

  logout: () => set({ user: null }),
}));
