var admin = require('firebase-admin');
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://product-management-71e8a.firebaseio.com"
});

const firestore = admin.firestore();
firestore.settings({ timestampsInSnapshots: true });

module.exports = firestore;
