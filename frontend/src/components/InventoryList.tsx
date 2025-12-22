import React, { useState } from "react";
import type { Medicamento } from "../types";
// Importamos differenceInDays para asegurar la sincronía total con Analytics y App
import { differenceInDays } from "date-fns";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";

interface InventoryListProps {
  items: Medicamento[];
  onDelete: (id: string) => void;
}

export const InventoryList: React.FC<InventoryListProps> = ({
  items,
  onDelete,
}) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const resultadosPorPagina = 10;

  const totalPaginas = Math.ceil(items.length / resultadosPorPagina);
  const indiceUltimo = paginaActual * resultadosPorPagina;
  const indicePrimero = indiceUltimo - resultadosPorPagina;
  const itemsPaginados = items.slice(indicePrimero, indiceUltimo);

  // Función de color unificada con los umbrales del sistema (0 y 90 días)
  const getStatusColor = (fecha: string) => {
    // Usamos new Date() sin horas para evitar saltos extraños durante el día
    const hoy = new Date();
    const dias = differenceInDays(new Date(fecha), hoy);

    if (dias <= 0)
      return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
    if (dias <= 90)
      return "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800";

    return "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800";
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700 transition-colors">
      <table className="w-full text-left table-fixed">
        <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-500 text-xs font-bold uppercase">
          <tr>
            {/* Ajuste de anchos y alineaciones para uniformidad visual */}
            <th className="p-4 w-[30%] text-left">Medicamento / CN</th>
            <th className="p-4 w-[15%] text-center">Lote</th>
            <th className="p-4 w-[25%] text-center">Estado / Fecha</th>
            <th className="p-4 w-[15%] text-center">Stock</th>
            <th className="p-4 w-[15%] text-center">Acción</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
          {itemsPaginados.map((item) => (
            <tr
              key={item.id}
              className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <td className="p-4 text-left">
                <div className="font-bold text-slate-700 dark:text-slate-200 truncate">
                  {item.nombre}
                </div>
                <div className="text-xs text-slate-400 dark:text-slate-500">
                  CN: {item.cn}
                </div>
              </td>
              {/* Centrado para eliminar huecos laterales */}
              <td className="p-4 text-center font-mono text-sm text-slate-600 dark:text-slate-400">
                {item.lote}
              </td>
              {/* Centrado para el distintivo de fecha */}
              <td className="p-4 text-center">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors inline-block whitespace-nowrap ${getStatusColor(
                    item.fechaCaducidad
                  )}`}
                >
                  {item.fechaCaducidad}
                </span>
              </td>
              {/* Stock centrado para equilibrio visual */}
              <td className="p-4 text-center font-black text-slate-700 dark:text-slate-200">
                {item.stock} u.
              </td>
              <td className="p-4 text-center">
                <button
                  onClick={() => onDelete(item.id)}
                  className="p-2 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                  title="Eliminar"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {items.length === 0 ? (
        <div className="p-20 text-center text-slate-400 dark:text-slate-500 flex flex-col items-center gap-2">
          <span className="text-4xl">📦</span>
          <p className="italic">No hay medicamentos en el inventario.</p>
        </div>
      ) : (
        totalPaginas > 1 && (
          <div className="bg-slate-50/50 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-700 px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => setPaginaActual((p) => Math.max(1, p - 1))}
              disabled={paginaActual === 1}
              className="flex items-center gap-1 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 disabled:opacity-20 transition-colors"
            >
              <ChevronLeft size={20} />
              Anterior
            </button>

            <div className="text-xs tracking-widest uppercase font-bold text-slate-400 dark:text-slate-500">
              Página{" "}
              <span className="text-slate-900 dark:text-white">
                {paginaActual}
              </span>{" "}
              / {totalPaginas}
            </div>

            <button
              onClick={() =>
                setPaginaActual((p) => Math.min(totalPaginas, p + 1))
              }
              disabled={paginaActual === totalPaginas}
              className="flex items-center gap-1 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 disabled:opacity-20 transition-colors"
            >
              Siguiente
              <ChevronRight size={20} />
            </button>
          </div>
        )
      )}
    </div>
  );
};
