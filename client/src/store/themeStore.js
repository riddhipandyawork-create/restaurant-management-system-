import { create } from 'zustand';

const initialTheme = typeof window !== 'undefined' ? (localStorage.getItem('rms_theme') || 'light') : 'light';

export const useThemeStore = create((set) => ({
  theme: initialTheme,
  toggleTheme: () => {
    set((state) => {
      const nextTheme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('rms_theme', nextTheme);
      document.documentElement.setAttribute('data-theme', nextTheme);
      return { theme: nextTheme };
    });
  },
  setTheme: (newTheme) => {
    localStorage.setItem('rms_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    set({ theme: newTheme });
  },
}));
