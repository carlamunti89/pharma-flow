import { render, screen } from "@testing-library/react";
import { StatsDashboard } from "./StatsDashboard";
import { describe, it, expect } from "vitest";

describe("StatsDashboard Component", () => {
  it("debería mostrar el Stock Total en pantalla", () => {
    const fakeStats = {
      stockTotal: 500,
      enRiesgoCritico: 10,
      valorEstimado: 100,
      valorTotalGlobal: 1000,
    };

    render(<StatsDashboard stats={fakeStats} />);

    // Buscamos si el número 500 aparece en el documento
    expect(screen.getByText("500")).toBeInTheDocument();
    expect(screen.getByText(/Stock Total/i)).toBeInTheDocument();
  });
});
