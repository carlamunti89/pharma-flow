import React, { useState } from "react";
import { MedicamentoSchema } from "../core/medicamento.schema";
import { PlusCircle, Database, AlertCircle } from "lucide-react";
// Importamos el tipo Medicamento para poder usar Omit
import type { Medicamento } from "../types";

interface Props {
  // CAMBIO: Sustituimos (med: any) por (med: Omit<Medicamento, "id">)
  onAdd: (med: Omit<Medicamento, "id">) => void;
}

// 1. Definimos la interfaz para el estado del formulario
interface FormState {
  nombre: string;
  cn: string;
  lote: string;
  fechaCaducidad: string;
  stock: number;
  precio: number | "";
}

export const InventoryForm: React.FC<Props> = ({ onAdd }) => {
  // 2. Aplicamos la interfaz al useState
  const [form, setForm] = useState<FormState>({
    nombre: "",
    cn: "",
    lote: "",
    fechaCaducidad: "",
    stock: 1,
    precio: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const datosParaValidar = {
      ...form,
      stock: Number(form.stock),
      precio: form.precio === "" ? undefined : Number(form.precio),
    };

    const result = MedicamentoSchema.safeParse(datosParaValidar);

    if (result.success) {
      // Ahora onAdd recibe datos validados y con el tipo correcto (sin el ID)
      onAdd(result.data);
      setForm({
        nombre: "",
        cn: "",
        lote: "",
        fechaCaducidad: "",
        stock: 1,
        precio: "",
      });
    } else {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        newErrors[String(issue.path[0])] = issue.message;
      });
      setErrors(newErrors);
    }
  };

  const loadDemo = () => {
    // CAMBIO: Tipamos el array de demo para asegurar consistencia
    const demoItems: Omit<Medicamento, "id">[] = [
      {
        nombre: "Ibuprofeno 600mg",
        cn: "742315",
        lote: "L-102",
        fechaCaducidad: "2026-05-20",
        stock: 24,
        precio: 4.5,
      },
      {
        nombre: "Amoxicilina 500mg",
        cn: "654123",
        lote: "B-990",
        fechaCaducidad: "2025-01-10",
        stock: 12,
        precio: 8.25,
      },
      {
        nombre: "Paracetamol 1g",
        cn: "882147",
        lote: "K-505",
        fechaCaducidad: "2025-03-15",
        stock: 50,
        precio: 3.1,
      },
      {
        nombre: "Omeprazol 20mg",
        cn: "921334",
        lote: "J-303",
        fechaCaducidad: "2027-10-12",
        stock: 100,
        precio: 2.9,
      },
      {
        nombre: "Betadine 50ml",
        cn: "112233",
        lote: "T-001",
        fechaCaducidad: "2025-02-28",
        stock: 5,
        precio: 12.4,
      },
    ];
    demoItems.forEach((item) => onAdd(item));
  };

  const ErrorLabel = ({ field }: { field: string }) =>
    errors[field] ? (
      <span className="text-[9px] text-red-500 font-bold mt-1 flex items-center gap-1">
        <AlertCircle size={10} /> {errors[field]}
      </span>
    ) : null;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-md mb-8 border-t-4 border-emerald-500 transition-colors"
    >
      <div className="flex flex-col lg:flex-row gap-4 items-start w-full">
        {/* Lote */}
        <div className="w-full lg:w-28">
          <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
            Lote
          </label>
          <input
            type="text"
            placeholder="A-1"
            className={`w-full mt-1 p-2 border rounded text-sm outline-none focus:ring-2 ${
              errors.lote
                ? "border-red-500 ring-red-200"
                : "border-slate-200 dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-emerald-500"
            }`}
            value={form.lote}
            onChange={(e) => setForm({ ...form, lote: e.target.value })}
          />
          <ErrorLabel field="lote" />
        </div>

        {/* Nombre Comercial */}
        <div className="w-full lg:flex-1">
          <label
            htmlFor="nombre"
            className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase"
          >
            Nombre Comercial
          </label>
          <input
            id="nombre"
            type="text"
            placeholder="Nombre del fármaco..."
            className={`w-full mt-1 p-2 border rounded text-sm outline-none focus:ring-2 ${
              errors.nombre
                ? "border-red-500 ring-red-200"
                : "border-slate-200 dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-emerald-500"
            }`}
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />
          <ErrorLabel field="nombre" />
        </div>

        {/* Código Nacional (CN) */}
        <div className="w-full lg:w-28">
          <label
            htmlFor="cn"
            className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase"
          >
            CN
          </label>
          <input
            id="cn"
            type="text"
            placeholder="000000"
            className={`w-full mt-1 p-2 border rounded text-sm outline-none focus:ring-2 ${
              errors.cn
                ? "border-red-500 ring-red-200"
                : "border-slate-200 dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-emerald-500"
            }`}
            value={form.cn}
            onChange={(e) => setForm({ ...form, cn: e.target.value })}
          />
          <ErrorLabel field="cn" />
        </div>

        {/* Fecha de Caducidad */}
        <div className="w-full lg:w-40">
          <label
            htmlFor="caducidad"
            className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase"
          >
            Caducidad
          </label>
          <input
            id="caducidad"
            type="date"
            className={`w-full mt-1 p-2 border rounded text-sm outline-none focus:ring-2 ${
              errors.fechaCaducidad
                ? "border-red-500 ring-red-200"
                : "border-slate-200 dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-emerald-500"
            }`}
            value={form.fechaCaducidad}
            onChange={(e) =>
              setForm({ ...form, fechaCaducidad: e.target.value })
            }
          />
          <ErrorLabel field="fechaCaducidad" />
        </div>

        {/* Precio */}
        <div className="w-full lg:w-24">
          <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
            Precio (€)
          </label>
          <input
            type="number"
            step="0.01"
            placeholder="0.00"
            className={`w-full mt-1 p-2 border rounded text-sm outline-none focus:ring-2 ${
              errors.precio
                ? "border-red-500 ring-red-200"
                : "border-slate-200 dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-emerald-500"
            }`}
            value={form.precio}
            onChange={(e) =>
              setForm({
                ...form,
                precio: e.target.value === "" ? "" : Number(e.target.value),
              })
            }
          />
          <ErrorLabel field="precio" />
        </div>

        {/* Acciones */}
        <div className="flex gap-2 w-full lg:w-auto mt-5">
          <button
            type="submit"
            className="flex-1 lg:w-auto h-10 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex justify-center items-center gap-2 shadow-md transition-all active:scale-95 whitespace-nowrap"
          >
            <PlusCircle size={18} />
            <span>Añadir</span>
          </button>
          <button
            type="button"
            onClick={loadDemo}
            className="h-10 px-3 border-2 border-slate-200 dark:border-slate-600 text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-all"
            title="Cargar datos de prueba"
          >
            <Database size={18} />
          </button>
        </div>
      </div>
    </form>
  );
};
