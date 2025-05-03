import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

type ExportFormat = "csv" | "xlsx" | "json";

interface ExportOptions {
  filename?: string;
  selectedCategories?: string[];
}

export function generateInventoryExport<T extends object>(
  data: T[],
  format: ExportFormat,
  options: ExportOptions = {}
) {
  if (!data || data.length === 0) {
    throw new Error("No data to export");
  }

  const filename = options.filename || `inventory-export-${new Date().toISOString().split("T")[0]}`;

  switch (format) {
    case "xlsx":
      exportToExcel(data, `${filename}.xlsx`);
      break;
    case "csv":
      exportToCsv(data, `${filename}.csv`);
      break;
    case "json":
      exportToJson(data, `${filename}.json`);
      break;
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}

function exportToExcel(data: any[], filename: string) {
  // Create a workbook
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");

  // Generate buffer
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

  // Save file
  saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), filename);
}

function exportToCsv(data: any[], filename: string) {
  // Convert to worksheet to get CSV
  const worksheet = XLSX.utils.json_to_sheet(data);
  const csvOutput = XLSX.utils.sheet_to_csv(worksheet);

  // Save file
  saveAs(new Blob([csvOutput], { type: "text/csv;charset=utf-8" }), filename);
}

function exportToJson(data: any[], filename: string) {
  // Convert to JSON string
  const jsonString = JSON.stringify(data, null, 2);

  // Save file
  saveAs(new Blob([jsonString], { type: "application/json" }), filename);
}
