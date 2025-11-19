"use client";
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useEffect } from 'react';

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);

  // Aplicar clase CSS cuando cambie el tema
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <button 
      onClick={() => setDarkMode(!darkMode)}
      className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg transition-colors duration-200 hover:bg-gray-300 dark:hover:bg-gray-600"
      aria-label={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      {darkMode ? '🌙 Modo Oscuro' : '☀️ Modo Claro'}
    </button>
  );
}