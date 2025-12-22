import { useState, useEffect } from "react";

export const useDarkMode = () => {
  const [isDark, setIsDark] = useState(() => {
    // 1. Mira si el usuario ya eligió oscuro antes
    return localStorage.getItem("pharma_theme") === "dark";
  });

  useEffect(() => {
    const root = window.document.documentElement; // Esto es la etiqueta <html>
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("pharma_theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("pharma_theme", "light");
    }
  }, [isDark]);

  return { isDark, toggle: () => setIsDark(!isDark) };
};
