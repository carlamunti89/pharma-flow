import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SearchBar } from "./SearchBar";

describe("SearchBar - Pruebas de Filtro con Debounce", () => {
  it("debería comunicar el texto de búsqueda al componente padre tras el debounce", async () => {
    // Usamos fakes timers para no tener que esperar 300ms reales en el test
    vi.useFakeTimers();
    const mockOnSearch = vi.fn();

    render(<SearchBar value="" onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText(/Buscar por nombre/i);

    // El usuario escribe
    fireEvent.change(input, { target: { value: "Ibuprofeno" } });

    // En este punto, onSearch NO debería haberse llamado aún (por el debounce de 300ms)
    expect(mockOnSearch).not.toHaveBeenCalled();

    // Adelantamos el tiempo 300ms manualmente
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Ahora sí debería haberse llamado
    expect(mockOnSearch).toHaveBeenCalledWith("Ibuprofeno");

    vi.useRealTimers();
  });

  it("debería borrar el texto al hacer clic en el botón X", () => {
    const mockOnSearch = vi.fn();
    render(<SearchBar value="Test" onSearch={mockOnSearch} />);

    // Buscamos el botón (que renderiza el icono X)
    const clearButton = screen.getByRole("button");
    fireEvent.click(clearButton);

    const input = screen.getByPlaceholderText(
      /Buscar por nombre/i
    ) as HTMLInputElement;
    expect(input.value).toBe("");
  });
});
