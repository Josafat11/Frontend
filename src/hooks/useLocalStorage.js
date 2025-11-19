"use client";
import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(initialValue);

  // Leer del localStorage cuando el componente se monta
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.log(`Error reading localStorage key "${key}":`, error);
    }
  }, [key]);

  // Función para guardar en localStorage
  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}