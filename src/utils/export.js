import { COLS_A, COLS_B } from "./columns.js";

function escXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function exportXLS(data) {
  if (!data.length) return;
  const allCols = [...COLS_A, ...COLS_B];

  const parts = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<?mso-application progid="Excel.Sheet"?>`,
    `<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">`,
    `<Worksheet ss:Name="NF-e Itens"><Table>`,
  ];

  // Header row
  parts.push("<Row>");
  allCols.forEach((c) => {
    parts.push(`<Cell><Data ss:Type="String">${escXml(c.label)}</Data></Cell>`);
  });
  parts.push("</Row>");

  // Data rows — all as String to prevent Excel auto-conversion
  data.forEach((r) => {
    parts.push("<Row>");
    allCols.forEach((c) => {
      let val = c.empty ? "" : r[c.key] !== undefined ? String(r[c.key]) : "";
      // Prefix with apostrophe to force text format for CHAVE only
      if (c.key === "chave" && val) {
        val = "'" + val;
      }
      parts.push(`<Cell><Data ss:Type="String">${escXml(val)}</Data></Cell>`);
    });
    parts.push("</Row>");
  });

  parts.push("</Table></Worksheet></Workbook>");

  const blob = new Blob([parts.join("")], { type: "application/vnd.ms-excel;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `nfe_itens_${new Date().toISOString().slice(0, 10)}.xls`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
