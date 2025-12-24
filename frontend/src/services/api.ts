import axios from "axios";
import type { Medicamento } from "../types/index";

const api = axios.create({
  // SUSTITUYE ESTA URL por la de tu backend en Render
  baseURL: "https://pharma-flow-4.onrender.com",
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
