import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Medicamento } from "../types";

export const reportService = {
  // Añadimos 'valorTotal' como segundo parámetro para que sea exacto al Dashboard
  downloadInventoryReport: (items: Medicamento[], valorTotal: number) => {
    const doc = new jsPDF();
    const hoy = new Date();
    const hoyStr = hoy.toLocaleDateString();

    // 1. Cabecera Corporativa
    doc.setFillColor(16, 185, 129);
    doc.rect(0, 0, 210, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("PHARMAFLOW", 14, 20);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("REPORTE COMPLETO DE INVENTARIO", 14, 30); // Actualizamos el título
    doc.text(`FECHA DE EMISIÓN: ${hoyStr}`, 155, 30);

    // 2. Quitamos el filtro de "enRiesgo" para que salga TODO (incluido Omeprazol)
    // Ordenamos por fecha de caducidad (FEFO) pero de todo el inventario
    const inventarioCompletoOrdenado = [...items].sort((a, b) =>
      a.fechaCaducidad.localeCompare(b.fechaCaducidad)
    );

    const body = inventarioCompletoOrdenado.map((m) => [
      m.cn,
      m.nombre.toUpperCase(),
      m.lote,
      m.fechaCaducidad,
      m.stock,
      `${Number(m.precio).toFixed(2)}€`,
      `${(Number(m.stock) * Number(m.precio)).toFixed(2)}€`,
    ]);

    // 3. Tabla con Lógica de Colores (Mantenemos los avisos visuales de caducidad)
    autoTable(doc, {
      startY: 45,
      head: [
        [
          "CN",
          "MEDICAMENTO",
          "LOTE",
          "VENCIMIENTO",
          "STOCK",
          "P.UNIT",
          "TOTAL",
        ],
      ],
      body: body,
      theme: "grid",
      headStyles: { fillColor: [30, 41, 59], halign: "center" },
      styles: { fontSize: 8, cellPadding: 3 },
      columnStyles: { 6: { halign: "right", fontStyle: "bold" } },

      didParseCell: (data) => {
        if (data.section === "body") {
          const fechaStr = data.row.cells[3].raw as string;
          const fechaCad = new Date(fechaStr);
          const hoyRef = new Date();
          hoyRef.setHours(0, 0, 0, 0);
          fechaCad.setHours(0, 0, 0, 0);

          const diffDias = Math.floor(
            (fechaCad.getTime() - hoyRef.getTime()) / (1000 * 60 * 60 * 24)
          );

          if (diffDias <= 0) {
            data.cell.styles.fillColor = [254, 226, 226];
            data.cell.styles.textColor = [185, 28, 28];
            data.cell.styles.fontStyle = "bold";
          } else if (diffDias <= 90) {
            data.cell.styles.fillColor = [255, 237, 213];
            data.cell.styles.textColor = [194, 65, 12];
            data.cell.styles.fontStyle = "bold";
          }
        }
      },
    });

    // 4. Pie de página con el Valor Total Global
    const finalY = (doc as any).lastAutoTable?.finalY || 60;

    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    // Usamos el valor que viene del Dashboard para que sea 714.00€ exactamente
    doc.text(
      `VALOR TOTAL DEL INVENTARIO: ${valorTotal.toFixed(2)}€`,
      14,
      finalY + 15
    );
    doc.setFontSize(9);
    doc.text(`Total de productos listados: ${items.length}`, 14, finalY + 22);

    doc.save(`Reporte_PharmaFlow_${hoyStr.replace(/\//g, "-")}.pdf`);
  },
};
