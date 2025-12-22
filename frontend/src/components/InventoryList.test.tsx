import { render, screen, fireEvent } from "@testing-library/react";
import { InventoryList } from "./InventoryList";
import { describe, it, expect, vi } from "vitest";
import type { Medicamento } from "../types";

describe("InventoryList Component", () => {
  // Datos de prueba reutilizables
  const mockItems: Medicamento[] = [
    {
      id: "1",
      nombre: "Ibuprofeno",
      cn: "123456",
      lote: "L-001",
      fechaCaducidad: "2025-12-12",
      stock: 10,
      precio: 5,
    },
    {
      id: "2",
      nombre: "Paracetamol",
      cn: "654321",
      lote: "P-500",
      fechaCaducidad: "2026-01-01",
      stock: 5,
      precio: 3,
    },
  ];

  it("debería renderizar la lista de medicamentos correctamente", () => {
    render(<InventoryList items={mockItems} onDelete={() => {}} />);

    // Verificamos que los nombres aparezcan en la tabla
    expect(screen.getByText("Ibuprofeno")).toBeInTheDocument();
    expect(screen.getByText("Paracetamol")).toBeInTheDocument();

    // Verificamos que el stock se muestre con el formato "u." que pusimos en el código
    expect(screen.getByText("10 u.")).toBeInTheDocument();
  });

  it("debería llamar a la función de borrar con el ID correcto al hacer clic", () => {
    const mockDelete = vi.fn();
    render(<InventoryList items={mockItems} onDelete={mockDelete} />);

    // Buscamos todos los botones de eliminar (hay dos en mockItems)
    const deleteButtons = screen.getAllByTitle(/Eliminar/i);

    // Simulamos clic en el primer botón (el de Ibuprofeno, ID '1')
    fireEvent.click(deleteButtons[0]);

    // Verificamos que la función fue llamada exactamente con el ID '1'
    expect(mockDelete).toHaveBeenCalledWith("1");
  });

  it("debería mostrar el estado vacío cuando no hay elementos", () => {
    render(<InventoryList items={[]} onDelete={() => {}} />);

    // Verificamos el mensaje y el emoji que pusimos en el componente
    expect(
      screen.getByText(/No hay medicamentos en el inventario/i)
    ).toBeInTheDocument();
    expect(screen.getByText("📦")).toBeInTheDocument();
  });

  it("debería aplicar el color de advertencia si la fecha está próxima", () => {
    // Creamos un item que caduca hoy mismo para forzar el color naranja/rojo
    const hoy = new Date().toISOString().split("T")[0];
    const itemCaducado: Medicamento[] = [
      {
        id: "99",
        nombre: "Caducado",
        cn: "000000",
        lote: "X",
        fechaCaducidad: hoy,
        stock: 1,
        precio: 1,
      },
    ];

    render(<InventoryList items={itemCaducado} onDelete={() => {}} />);

    const badge = screen.getByText(hoy);
    // Verificamos que tenga alguna de las clases de error/advertencia (Tailwind)
    expect(badge).toHaveClass("text-red-700");
  });
});
