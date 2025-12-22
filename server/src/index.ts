import express, { Request, Response } from "express";
import cors from "cors";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { Medicamento } from "./types.js";
import fs from "fs";
import path from "path";

const app = express();

// --- CORRECCIÓN 1: CORS ---
// Al dejarlo vacío así, permites que cualquier origen (como tu Vercel) consulte la API.
app.use(cors());
app.use(express.json());

const DATA_PATH = path.join(process.cwd(), "inventario.json");

const leerDelDisco = (): Medicamento[] => {
  try {
    if (!fs.existsSync(DATA_PATH)) {
      // Si el archivo no existe en el servidor, lo creamos vacío para evitar el crash.
      fs.writeFileSync(DATA_PATH, JSON.stringify([]));
      return [];
    }
    const raw = fs.readFileSync(DATA_PATH, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
};

const guardarEnDisco = (data: Medicamento[]) => {
  try {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (e) {
    console.error("Error guardando datos:", e);
  }
};

const MedSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  cn: z.string().length(6, "El CN debe tener 6 dígitos"),
  lote: z.string().min(1, "El lote es obligatorio"),
  fechaCaducidad: z.string().min(1, "La fecha es obligatoria"),
  stock: z.coerce
    .number({
      invalid_type_error: "El stock debe ser un número válido",
      required_error: "El stock es obligatorio",
    })
    .int("El stock debe ser un número entero"),
  precio: z.coerce.number({
    invalid_type_error: "El precio debe ser un número válido",
    required_error: "El precio es obligatorio",
  }),
});

app.get("/api/medicamentos", (req: Request, res: Response) => {
  const inventario = leerDelDisco();
  res.status(200).json(inventario);
});

app.post("/api/medicamentos", (req: Request, res: Response) => {
  try {
    const data = MedSchema.parse(req.body);
    const inventario = leerDelDisco();
    const nuevoMed: Medicamento = { id: uuidv4(), ...data };
    inventario.push(nuevoMed);
    guardarEnDisco(inventario);
    res.status(201).json(nuevoMed);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    res.status(400).json({ error: "Datos no válidos" });
  }
});

app.delete("/api/medicamentos/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  let inventario = leerDelDisco();
  const nuevoInventario = inventario.filter((m) => m.id !== id);
  if (inventario.length === nuevoInventario.length) {
    return res.status(404).json({ error: "Medicamento no encontrado" });
  }
  guardarEnDisco(nuevoInventario);
  res.status(204).send();
});

app.put("/api/medicamentos/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const data = MedSchema.parse(req.body);
    let inventario = leerDelDisco();
    const index = inventario.findIndex((m) => m.id === id);
    if (index === -1) return res.status(404).json({ error: "No encontrado" });
    inventario[index] = { id, ...data };
    guardarEnDisco(inventario);
    res.json(inventario[index]);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    res.status(400).json({ error: "Datos de edición no válidos" });
  }
});

// --- CORRECCIÓN 2: PUERTO DINÁMICO ---
// Render inyecta un puerto automáticamente. Si dejas el 3001, el despliegue fallará.
const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`🚀 Server PharmaFlow en puerto ${PORT}`);
  });
}

export { app };
export default app;
