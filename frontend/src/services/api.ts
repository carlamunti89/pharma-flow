import axios from "axios";
import type { Medicamento } from "../types/index";

const api = axios.create({
  // Si existe una variable de entorno la usa, si no, usa localhost (para cuando trabajes en casa)
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:3001/api",
});

export const apiService = {
  getMedicamentos: () => api.get<Medicamento[]>("/medicamentos"),
  saveMedicamento: (data: Omit<Medicamento, "id">) =>
    api.post<Medicamento>("/medicamentos", data),

  // --- SOLO AÑADIMOS ESTO MANTENIENDO TU ESTRUCTURA ---
  deleteMedicamento: (id: string) => api.delete(`/medicamentos/${id}`),

  updateMedicamento: (id: string, data: Omit<Medicamento, "id">) =>
    api.put<Medicamento>(`/medicamentos/${id}`, data),
};
