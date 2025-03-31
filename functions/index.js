const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp();

// Function to format data for Google Sheets
const formatDataForSheets = async (data) => {
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

  // Format coordinates properly
  let coordinates = "";
  if (typeof data.coordinates === "string") {
    coordinates = data.coordinates;
  } else if (data.coordinates && typeof data.coordinates === "object") {
    coordinates = `${data.coordinates.lat},${data.coordinates.lng}`;
  }

  return {
    timestamp: data.timestamp
      ? new Date(data.timestamp.seconds * 1000).toLocaleString("en-US")
      : "",
    location: data.location || "",
    pattern: data.crackPattern || "",
    width: data.crackWidth || "",
    coordinates: coordinates,
    imageUrl: imageUrl,
    assessment: data.riskLevel || "",
    dataConsent: data.dataConsent ? "TRUE" : "FALSE",
    contactName: data.contactInfo?.name || "",
    contactPhone: data.contactInfo?.phone || "",
  };
};

// Function to send data to Google Sheets
const sendToGoogleSheets = async (data, shouldClear = false) => {
  const GOOGLE_SCRIPT_URL = functions.config().google.script_url;
  if (!GOOGLE_SCRIPT_URL) {
    console.error("Google Script URL not configured in Firebase environment");
    return null;
  }

  try {
    await axios.post(GOOGLE_SCRIPT_URL, { ...data, shouldClear });
    console.log("Data successfully sent to Google Sheets");
    return null;
  } catch (error) {
    console.error("Error sending data to Google Sheets:", error);
    return null;
  }
};

// Function to sync all existing data to Google Sheets
exports.syncAllToGoogleSheets = functions
  .runWith({
    timeoutSeconds: 540,
    memory: "1GB",
  })
  .https.onRequest(async (req, res) => {
    try {
      const snapshot = await admin.firestore().collection("assessments").get();
      console.log(`Found ${snapshot.size} documents to sync`);

      const batchSize = 10;
      const docs = snapshot.docs;
      const batches = [];

      // Split documents into batches
      for (let i = 0; i < docs.length; i += batchSize) {
        batches.push(docs.slice(i, i + batchSize));
      }

      let successCount = 0;
      let errorCount = 0;
      const errors = [];

      // Send clear signal first
      await sendToGoogleSheets({ command: "clear" }, true);

      // Process each batch
      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        console.log(`Processing batch ${i + 1} of ${batches.length}`);

        // Process documents in the current batch
        const batchPromises = batch.map(async (doc) => {
          try {
            const data = doc.data();
            const formattedData = await formatDataForSheets(data);
            await sendToGoogleSheets(formattedData);
            successCount++;
            return { success: true, id: doc.id };
          } catch (error) {
            errorCount++;
            errors.push({ id: doc.id, error: error.message });
            return { success: false, id: doc.id, error: error.message };
          }
        });

        await Promise.all(batchPromises);

        // Add delay between batches to avoid rate limiting
        if (i < batches.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }

      res.json({
        success: true,
        totalDocuments: snapshot.size,
        successfulSyncs: successCount,
        failedSyncs: errorCount,
        errors: errors,
      });
    } catch (error) {
      console.error("Error syncing all data:", error);
      res.status(500).json({
        success: false,
        error: error.message,
        stack: error.stack,
      });
    }
  });

// Function to handle new and updated documents
exports.syncToGoogleSheets = functions.firestore
  .document("assessments/{assessmentId}")
  .onWrite(async (change, context) => {
    const data = change.after.data();
    if (!data) return null; // Document was deleted

    const formattedData = await formatDataForSheets(data);
    return sendToGoogleSheets(formattedData);
  });
