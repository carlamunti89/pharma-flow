import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    // Usamos './src/setupTests.ts' para forzar a Vitest a buscarlo relativo a la raíz del proyecto
    setupFiles: "./setupTests.ts",
  },
});
