const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp();

exports.syncToGoogleSheets = functions.firestore
  .document("cracks/{crackId}")
  .onCreate(async (snap, context) => {
    const data = snap.data();

    // Get the image download URL
    let imageUrl = "";
    if (data.imageUrl) {
      try {
        const bucket = admin.storage().bucket();
        const file = bucket.file(data.imageUrl);
        const [url] = await file.getSignedUrl({
          action: "read",
          expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
        });
        imageUrl = url;
      } catch (error) {
        console.error("Error getting image URL:", error);
      }
    }

    // Format data for Google Sheets
    const rowData = {
      timestamp: data.timestamp
        ? new Date(data.timestamp).toISOString()
        : new Date().toISOString(),
      location: data.location || "",
      pattern: data.pattern || "",
      width: data.width || "",
      coordinates: data.coordinates
        ? `${data.coordinates.lat},${data.coordinates.lng}`
        : "",
      imageUrl: imageUrl,
      assessment: data.assessment || "",
      dataConsent: data.dataConsent || false,
    };

    // Get the Google Script URL from Firebase environment configuration
    const GOOGLE_SCRIPT_URL = functions.config().google.script_url;
    if (!GOOGLE_SCRIPT_URL) {
      console.error("Google Script URL not configured in Firebase environment");
      return null;
    }

    try {
      await axios.post(GOOGLE_SCRIPT_URL, rowData);
      console.log("Data successfully sent to Google Sheets");
      return null;
    } catch (error) {
      console.error("Error sending data to Google Sheets:", error);
      return null;
    }
  });
