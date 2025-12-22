export interface Medicamento {
  id: string;
  nombre: string;
  cn: string;
  lote: string;
  fechaCaducidad: string;
  stock: number;
  precio: number; // <-- AÑADIR ESTA LÍNEA
}
