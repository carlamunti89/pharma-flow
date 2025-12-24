import axios from "axios";
import type { Medicamento } from "../types/index";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001/api",
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
