import request from "supertest";
import { describe, it, expect, beforeAll } from "vitest";
import { app } from "../src/index.js"; // Asegúrate de que la ruta sea correcta
import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "inventario.json");

describe("PharmaFlow API Integration Tests", () => {
  // Limpiamos o preparamos el archivo antes de los tests si es necesario
  beforeAll(() => {
    if (!fs.existsSync(DATA_PATH)) {
      fs.writeFileSync(DATA_PATH, JSON.stringify([]));
    }
  });

  let idCreado: string;

  // 1. TEST GET (Lista vacía o con datos)
  it("GET /api/medicamentos - Debería retornar status 200 y un array", async () => {
    const res = await request(app).get("/api/medicamentos");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // 2. TEST POST (Creación exitosa)
  it("POST /api/medicamentos - Debería crear un medicamento válido", async () => {
    const nuevo = {
      nombre: "Ibuprofeno 600",
      cn: "123456",
      lote: "LOTE-01",
      fechaCaducidad: "2026-10-10",
      stock: 50,
      precio: 4.5,
    };
    const res = await request(app).post("/api/medicamentos").send(nuevo);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.nombre).toBe(nuevo.nombre);
    idCreado = res.body.id; // Guardamos el ID para usarlo en PUT y DELETE
  });

  // 3. TEST POST ERROR (Validación Zod)
  it("POST /api/medicamentos - Debería fallar si el CN no tiene 6 dígitos", async () => {
    const errorMed = {
      nombre: "Error",
      cn: "123", // Muy corto, Zod debería saltar
      lote: "T",
      fechaCaducidad: "2025-01-01",
      stock: 1,
      precio: 1,
    };
    const res = await request(app).post("/api/medicamentos").send(errorMed);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  // 4. TEST PUT (Edición)
  it("PUT /api/medicamentos/:id - Debería actualizar el stock", async () => {
    const actualizado = {
      nombre: "Ibuprofeno 600",
      cn: "123456",
      lote: "LOTE-01-EDIT",
      fechaCaducidad: "2026-10-10",
      stock: 100, // Cambiamos de 50 a 100
      precio: 4.5,
    };
    const res = await request(app)
      .put(`/api/medicamentos/${idCreado}`)
      .send(actualizado);

    expect(res.status).toBe(200);
    expect(res.body.stock).toBe(100);
  });

  // 5. TEST DELETE (Borrado)
  it("DELETE /api/medicamentos/:id - Debería eliminar el registro", async () => {
    const res = await request(app).delete(`/api/medicamentos/${idCreado}`);
    expect(res.status).toBe(204);
  });

  // 6. TEST DELETE ERROR (404)
  it("DELETE /api/medicamentos/:id - Debería dar 404 si el ID no existe", async () => {
    const res = await request(app).delete("/api/medicamentos/id-falso");
    expect(res.status).toBe(404);
  });
});
