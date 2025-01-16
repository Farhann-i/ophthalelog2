import { create } from 'zustand';
import type { Case } from '../types';

interface CaseStore {
  cases: Case[];
  totalCases: number;
  addCase: (newCase: Case) => void;
  searchCases: (query: string) => Case[];
}

export const useCaseStore = create<CaseStore>((set, get) => ({
  cases: [],
  totalCases: 0,
  addCase: (newCase) => {
    set((state) => ({
      cases: [newCase, ...state.cases],
      totalCases: state.totalCases + 1,
    }));
  },
  searchCases: (query) => {
    const { cases } = get();
    const lowercaseQuery = query.toLowerCase();
    return cases.filter(
      (case_) =>
        case_.summary.toLowerCase().includes(lowercaseQuery) ||
        case_.clinicalFindings.toLowerCase().includes(lowercaseQuery) ||
        case_.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
    );
  },
}));