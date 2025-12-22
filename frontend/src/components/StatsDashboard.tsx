import React from "react";
import type { InventoryStats } from "../core/analytics";
import { Package, AlertTriangle, Euro, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Props {
  stats: InventoryStats;
}

const colorMap = {
  blue: {
    border: "border-blue-500",
    iconColor: "text-blue-500",
    darkBorder: "dark:border-blue-700",
  },
  red: {
    border: "border-red-500",
    iconColor: "text-red-500",
    darkBorder: "dark:border-red-700",
  },
  emerald: {
    border: "border-emerald-500",
    iconColor: "text-emerald-500",
    darkBorder: "dark:border-emerald-700",
  },
  // NUEVO COLOR PARA LA CUARTA TARJETA
  orange: {
    border: "border-orange-500",
    iconColor: "text-orange-500",
    darkBorder: "dark:border-orange-700",
  },
};

export const StatsDashboard: React.FC<Props> = ({ stats }) => {
  const cards: {
    label: string;
    value: string | number;
    Icon: LucideIcon;
    color: keyof typeof colorMap;
  }[] = [
    {
      label: "Stock Total",
      value: stats.stockTotal,
      Icon: Package,
      color: "blue",
    },
    {
      label: "Riesgo Crítico",
      value: stats.enRiesgoCritico,
      Icon: AlertTriangle,
      color: "red",
    },
    {
      label: "Valor en Riesgo",
      value: `${stats.valorEstimado}€`,
      Icon: Euro,
      color: "emerald",
    },
    // CUARTA TARJETA AÑADIDA
    {
      label: "Valor Inventario",
      value: `${stats.valorTotalGlobal.toLocaleString("es-ES", {
        minimumFractionDigits: 2,
      })}€`,
      Icon: TrendingUp,
      color: "orange",
    },
  ];

  return (
    // He cambiado lg:grid-cols-3 a lg:grid-cols-4 para que quepan las 4 tarjetas
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
      {cards.map(({ label, value, Icon, color }) => {
        const styles = colorMap[color];

        return (
          <div
            key={label}
            className={`bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border-b-4 transition-all ${styles.border} ${styles.darkBorder}`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {label}
                </p>
                <p className="text-2xl font-black text-slate-800 dark:text-white">
                  {value}
                </p>
              </div>
              <div className={styles.iconColor}>
                <Icon size={24} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
