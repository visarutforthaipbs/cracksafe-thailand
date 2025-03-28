import { google } from "googleapis";

// Initialize Google Sheets API
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
const SHEET_NAME = "CrackSafe Data";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const row = req.body;
    const values = [
      [
        row.timestamp,
        row.pattern,
        row.width,
        row.location,
        row.isNew,
        row.isGrowing,
        row.coordinates,
        row.riskLevel,
        row.message,
      ],
    ];

    // Append row to sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:I`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values,
      },
    });

    res.status(200).json({ message: "Data saved successfully" });
  } catch (error) {
    console.error("Error saving to Google Sheets:", error);
    res
      .status(500)
      .json({ message: "Failed to save data", error: error.message });
  }
}
