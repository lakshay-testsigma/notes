import { create } from "zustand";

interface UIState {
  sidebarOpen: boolean;
  searchQuery: string;
  activeDomain: string | null;
  commandOpen: boolean;
  tocActiveId: string | null;
  setSidebarOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setActiveDomain: (domain: string | null) => void;
  setCommandOpen: (open: boolean) => void;
  toggleCommand: () => void;
  setTocActiveId: (id: string | null) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  sidebarOpen: false,
  searchQuery: "",
  activeDomain: null,
  commandOpen: false,
  tocActiveId: null,
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setActiveDomain: (activeDomain) => set({ activeDomain }),
  setCommandOpen: (commandOpen) => set({ commandOpen }),
  toggleCommand: () => set((s) => ({ commandOpen: !s.commandOpen })),
  setTocActiveId: (tocActiveId) => set({ tocActiveId }),
}));
