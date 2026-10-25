import { create } from 'zustand';
import api from '../services/api';

export const useMenuStore = create((set) => ({
  categories: [],
  items: [],
  loading: false,
  error: null,
  activeCat: 'all',

  setActiveCat: (id) => set({ activeCat: id }),

  fetchMenu: async () => {
    set({ loading: true, error: null });
    try {
      const [catRes, itemRes] = await Promise.all([
        api.get('/menu/categories'),
        api.get('/menu')
      ]);
      set({ categories: catRes.data, items: itemRes.data.filter(i => i.isAvailable), loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  }
}));
