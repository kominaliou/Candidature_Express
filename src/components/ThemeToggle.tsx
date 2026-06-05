"use client";

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Determine initial theme on mount
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
    } else {
      // Default to system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(systemPrefersDark ? 'dark' : 'light');
    }
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  // Render a skeleton/placeholder during SSR to prevent layout shifting
  if (!mounted) {
    return (
      <div className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full border bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 opacity-0" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 rounded-full border shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 cursor-pointer print:hidden group"
      aria-label="Changer de thème"
      id="theme-toggle-btn"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
      ) : (
        <Sun className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
      )}
    </button>
  );
}
