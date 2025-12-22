import type { Medicamento } from "../types";
import { differenceInDays } from "date-fns";

export interface InventoryStats {
  stockTotal: number;
  enRiesgoCritico: number; // Unidades totales en riesgo
  valorEstimado: number; // Valor económico en riesgo
  valorTotalGlobal: number; // Valor de todo el inventario
}

export const calculateStats = (inventario: Medicamento[]): InventoryStats => {
  const stats: InventoryStats = {
    stockTotal: 0,
    enRiesgoCritico: 0,
    valorEstimado: 0,
    valorTotalGlobal: 0,
  };

  const hoy = new Date();

  inventario.forEach((m) => {
    // 1. Sumamos el stock total general de unidades
    stats.stockTotal += m.stock;

    // 2. Valor del lote actual
    const valorLote = (m.precio || 0) * m.stock;
    stats.valorTotalGlobal += valorLote;

    // 3. Diferencia de días estandarizada
    const diasRestantes = differenceInDays(new Date(m.fechaCaducidad), hoy);

    // 4. Lógica de Riesgo (90 días o menos)
    if (diasRestantes <= 90) {
      // Sumamos las UNIDADES del lote al riesgo
      stats.enRiesgoCritico += m.stock;
      // Sumamos el VALOR del lote al riesgo
      stats.valorEstimado += valorLote;
    }
  });

  // 5. Redondeos para evitar problemas de coma flotante (ej: 10.000000004)
  stats.valorEstimado = Number(stats.valorEstimado.toFixed(2));
  stats.valorTotalGlobal = Number(stats.valorTotalGlobal.toFixed(2));

  return stats;
};
