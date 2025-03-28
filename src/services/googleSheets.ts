import { CrackAssessment } from "../types";

interface SheetRow {
  timestamp: string;
  pattern: string;
  width: string;
  location: string;
  isNew: string;
  isGrowing: string;
  coordinates: string;
  riskLevel: string;
  message: string;
}

export async function appendToSheet(
  data: CrackAssessment & { risk: string; message: string }
) {
  try {
    const row: SheetRow = {
      timestamp: new Date().toISOString(),
      pattern: data.pattern,
      width: data.width.toString(),
      location: data.location,
      isNew: data.isNew ? "ใช่" : "ไม่ใช่",
      isGrowing: data.isGrowing ? "ใช่" : "ไม่ใช่",
      coordinates: data.coordinates
        ? `${data.coordinates.lat},${data.coordinates.lng}`
        : "",
      riskLevel: data.risk,
      message: data.message,
    };

    const response = await fetch("/api/sheets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(row),
    });

    if (!response.ok) {
      throw new Error("Failed to save data");
    }

    return true;
  } catch (error) {
    console.error("Error saving to Google Sheets:", error);
    throw error;
  }
}
