import { describe, it, expect } from "vitest";
import { calculateStats } from "./analytics";
import type { Medicamento } from "../types";

describe("Pruebas de Analytics - PharmaFlow", () => {
  it("debería calcular el valor total correctamente", () => {
    const mockMedicamentos: Medicamento[] = [
      {
        id: "1",
        nombre: "Test A",
        precio: 10,
        stock: 2,
        cn: "123456",
        lote: "A",
        fechaCaducidad: "2030-01-01",
      },
      {
        id: "2",
        nombre: "Test B",
        precio: 5,
        stock: 4,
        cn: "654321",
        lote: "B",
        fechaCaducidad: "2030-01-01",
      },
    ];

    const stats = calculateStats(mockMedicamentos);

    // 10*2 + 5*4 = 40
    expect(stats.valorTotalGlobal).toBe(40);
  });

  it("debería detectar productos en riesgo (menos de 90 días)", () => {
    const hoy = new Date();
    const fechaEnRiesgo = new Date(hoy);
    fechaEnRiesgo.setDate(hoy.getDate() + 10); // Caduca en 10 días

    const medEnRiesgo: Medicamento[] = [
      {
        id: "1",
        nombre: "Caduca Pronto",
        precio: 10,
        stock: 1,
        cn: "111111",
        lote: "L1",
        fechaCaducidad: fechaEnRiesgo.toISOString().split("T")[0],
      },
    ];

    const stats = calculateStats(medEnRiesgo);
    expect(stats.enRiesgoCritico).toBe(1);
  });
});
