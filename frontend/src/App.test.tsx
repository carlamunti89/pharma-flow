import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App";

vi.mock("./services/api", () => ({
  apiService: {
    getMedicamentos: vi.fn(() => Promise.resolve({ data: [] })),
    saveMedicamento: vi.fn((med) =>
      Promise.resolve({ status: 201, data: { ...med, id: "123" } })
    ),
    deleteMedicamento: vi.fn(() => Promise.resolve()),
  },
}));

describe("PharmaFlow - Pruebas de UI", () => {
  it("debería mostrar el formulario de login al inicio", () => {
    render(<App />);
    // Usamos getAllByText porque el nombre aparece en el título y en el pie de página
    const titles = screen.getAllByText(/PHARMAFLOW/i);
    expect(titles.length).toBeGreaterThan(0);
    expect(screen.getByPlaceholderText(/ejemplo@farmacia.com/i)).toBeDefined();
  });

  it("debería permitir el acceso con credenciales correctas", async () => {
    render(<App />);

    const emailInput = screen.getByPlaceholderText(/ejemplo@farmacia.com/i);
    const passInput = screen.getByPlaceholderText(/••••••••/i);
    const loginBtn = screen.getByRole("button", { name: /Iniciar Sesión/i });

    fireEvent.change(emailInput, { target: { value: "admin@pharmaflow.com" } });
    fireEvent.change(passInput, { target: { value: "admin123" } });
    fireEvent.click(loginBtn);

    // Usamos waitFor para evitar el aviso de 'act(...)'
    await waitFor(() => {
      expect(screen.getByText(/FEFO System/i)).toBeDefined();
    });
  });
});
