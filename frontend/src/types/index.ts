export interface Medicamento {
  id: string;
  nombre: string;
  cn: string;
  lote: string;
  fechaCaducidad: string;
  stock: number;
  precio: number; // <--- ESTA ES LA LÍNEA QUE FALTA
}

export interface InventoryStats {
  stockTotal: number;
  enRiesgoCritico: number; // Unidades físicas en riesgo
  valorEstimado: number; // Valor en € (precio * stock) en riesgo
}
