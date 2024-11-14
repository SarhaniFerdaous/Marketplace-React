const admin = require("firebase-admin");
const dotenv = require("dotenv");

dotenv.config(); 

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
    //databaseURL: process.env.FIREBASE_DATABASE_URL, // Uncomment if using Realtime Database
  });
}

const db = admin.firestore();
module.exports = db;
