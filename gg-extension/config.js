// Initialize Firebase
var config = {
  apiKey: "AIzaSyDfXBT42Mqz4k_UE69I3nc5xMAHiVHkudU",
  authDomain: "fbaccman.firebaseapp.com",
  databaseURL: "https://fbaccman.firebaseio.com",
  projectId: "fbaccman",
  storageBucket: "fbaccman.appspot.com",
  messagingSenderId: "873225991526"
};

firebase.initializeApp(config);

const db = firebase.firestore();
db.settings({ timestampsInSnapshots: true });
