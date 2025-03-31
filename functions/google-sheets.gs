function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);

  // If shouldClear is true, clear all data except headers
  if (data.shouldClear) {
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clear();
    }
    return ContentService.createTextOutput(
      JSON.stringify({ success: true, message: "Sheet cleared successfully" })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  // If no data to append, return success
  if (!data.data || data.data.length === 0) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: true, message: "No data to append" })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  // Get headers
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  // Prepare data for appending
  const values = data.data.map((row) => {
    return headers.map((header) => {
      // Map the header to the corresponding data field
      switch (header) {
        case "Timestamp":
          return row.timestamp || "";
        case "Location":
          return row.location || "";
        case "Pattern":
          return row.pattern || "";
        case "Width":
          return row.width || "";
        case "Coordinates":
          return row.coordinates || "";
        case "Image URL":
          return row.imageUrl || "";
        case "Assessment":
          return row.assessment || "";
        case "Data Consent":
          return row.dataConsent || "";
        case "Contact Name":
          return row.contactName || "";
        case "Contact Phone":
          return row.contactPhone || "";
        default:
          return "";
      }
    });
  });

  // Append data
  if (values.length > 0) {
    sheet
      .getRange(sheet.getLastRow() + 1, 1, values.length, values[0].length)
      .setValues(values);
  }

  return ContentService.createTextOutput(
    JSON.stringify({ success: true, message: "Data appended successfully" })
  ).setMimeType(ContentService.MimeType.JSON);
}
