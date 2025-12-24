import axios from "axios";
import type { Medicamento } from "../types/index";

const api = axios.create({
  // Asegúrate de que termine en /api
  baseURL: "https://pharma-flow-4.onrender.com/api",
});

export const apiService = {
  // QUITA la barra diagonal "/" antes de medicamentos
  getMedicamentos: () => api.get<Medicamento[]>("medicamentos"),

  saveMedicamento: (data: Omit<Medicamento, "id">) =>
    api.post<Medicamento>("medicamentos", data),

  deleteMedicamento: (id: string) => api.delete(`medicamentos/${id}`),

  updateMedicamento: (id: string, data: Omit<Medicamento, "id">) =>
    api.put<Medicamento>(`medicamentos/${id}`, data),
};
