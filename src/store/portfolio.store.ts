import { create } from 'zustand';
import type { Portfolio } from '@/types/portfolio.types';

type PortfolioStore = {
  portfolio: Portfolio | null;
  activeSections: string[];
  setPortfolio: (portfolio: Portfolio | null) => void;
  setActiveSections: (sections: string[]) => void;
  toggleSection: (sectionKey: string) => void;
  clearPortfolio: () => void;
};

export const usePortfolioStore = create<PortfolioStore>((set, get) => ({
  portfolio: null,
  activeSections: [],
  setPortfolio: (portfolio) => set({ portfolio }),
  setActiveSections: (sections) => set({ activeSections: sections }),
  toggleSection: (sectionKey) => {
    const activeSections = get().activeSections;
    const exists = activeSections.includes(sectionKey);
    set({
      activeSections: exists
        ? activeSections.filter((s) => s !== sectionKey)
        : [...activeSections, sectionKey],
    });
  },
  clearPortfolio: () => set({ portfolio: null, activeSections: [] }),
}));

