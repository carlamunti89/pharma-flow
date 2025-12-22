import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

interface Props {
  value: string; // Añadimos esta prop para sincronizar con App.tsx
  onSearch: (term: string) => void;
}

export const SearchBar: React.FC<Props> = ({ value, onSearch }) => {
  // Inicializamos el estado interno con el valor que viene de fuera
  const [term, setTerm] = useState(value);

  // EFECTO 1: Sincroniza el cuadrito de texto si borramos los filtros desde fuera
  useEffect(() => {
    setTerm(value);
  }, [value]);

  // EFECTO 2: Tu lógica original de búsqueda con retraso (debounce)
  useEffect(() => {
    const handler = setTimeout(() => onSearch(term), 300);
    return () => clearTimeout(handler);
  }, [term, onSearch]);

  return (
    <div className="relative mb-6 group">
      <Search
        className="absolute left-3 top-3 text-slate-400 group-focus-within:text-blue-500 transition-colors"
        size={20}
      />
      <input
        type="text"
        value={term} // Vinculamos el valor al estado interno
        placeholder="Buscar por nombre, CN, lote o fecha (YYYY-MM)..."
        className="w-full pl-10 pr-10 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        onChange={(e) => setTerm(e.target.value)}
      />
      {/* Añadimos un botón de X para borrar rápido (UX extra) */}
      {term && (
        <button
          onClick={() => setTerm("")}
          className="absolute right-3 top-3 text-slate-400 hover:text-red-500 transition-colors"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};
