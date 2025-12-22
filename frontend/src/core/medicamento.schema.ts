import { z } from "zod";

export const MedicamentoSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  cn: z
    .string()
    .length(6, "El CN debe tener exactamente 6 dígitos")
    .regex(/^\d+$/, "El CN solo puede contener números"),
  lote: z.string().min(1, "El lote es obligatorio"),
  fechaCaducidad: z.string().min(1, "La fecha es obligatoria"),

  // STOCK: Aceptamos cualquier entrada y validamos manualmente
  stock: z.any().refine(
    (val) => {
      const n = Number(val);
      return !isNaN(n) && val !== "";
    },
    { message: "El stock debe ser un número" }
  ),

  // PRECIO: Validamos manualmente que sea número y mayor a 0
  precio: z.any().refine(
    (val) => {
      const n = Number(val);
      return !isNaN(n) && n > 0 && val !== "";
    },
    { message: "El precio es obligatorio y debe ser mayor a 0" }
  ),
});
