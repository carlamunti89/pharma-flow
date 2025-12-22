import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { InventoryForm } from "./InventoryForm";

describe("InventoryForm - Pruebas de Unidad", () => {
  // TEST 1: Carga de Demo (Este ya funcionaba)
  it("debería cargar los datos demo al hacer clic en el botón Database", async () => {
    const mockOnAdd = vi.fn();
    render(<InventoryForm onAdd={mockOnAdd} />);
    const btnDemo = screen.getByTitle(/Cargar datos de prueba/i);
    await act(async () => {
      fireEvent.click(btnDemo);
    });
    expect(mockOnAdd).toHaveBeenCalledTimes(5);
  });

  // TEST 2: Validación de campos vacíos (Corregido)
  it("debería intentar enviar y fallar si los campos están vacíos", async () => {
    const mockOnAdd = vi.fn();
    render(<InventoryForm onAdd={mockOnAdd} />);
    const submitBtn = screen.getByRole("button", { name: /Añadir/i });

    await act(async () => {
      fireEvent.click(submitBtn);
    });

    // En lugar de buscar iconos, verificamos que onAdd NO se haya llamado
    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  // TEST 3: Integridad de tipos (Corregido con selectores por placeholder únicos)
  it("debería convertir correctamente el precio de string a number al enviar", async () => {
    const mockOnAdd = vi.fn();
    render(<InventoryForm onAdd={mockOnAdd} />);

    // Usamos los placeholders exactos que vemos en tu HTML de error
    fireEvent.change(screen.getByPlaceholderText(/Nombre del fármaco/i), {
      target: { value: "Paracetamol Test" },
    });

    fireEvent.change(screen.getByPlaceholderText("000000"), {
      target: { value: "111222" },
    });

    fireEvent.change(screen.getByPlaceholderText("A-1"), {
      target: { value: "L-99" },
    });

    // Para la fecha usamos el tipo de input
    const dateInput = screen.getByLabelText(/Caducidad/i) as HTMLInputElement;
    fireEvent.change(dateInput, { target: { value: "2026-05-10" } });

    // Para el precio usamos el placeholder "0.00" pero asegurándonos de coger el correcto
    const priceInputs = screen.getAllByPlaceholderText("0.00");
    fireEvent.change(priceInputs[0], {
      target: { value: "12.50" },
    });

    const submitBtn = screen.getByRole("button", { name: /Añadir/i });

    await act(async () => {
      fireEvent.click(submitBtn);
    });

    expect(mockOnAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        nombre: "Paracetamol Test",
        precio: 12.5,
        stock: 1,
      })
    );
  });
});
