// Initialize Firebase
var config = {
  apiKey: "AIzaSyAIiumZ948BCUODYTITXGHXLfR2fAnQ-T4",
  authDomain: "product-management-71e8a.firebaseapp.com",
  databaseURL: "https://product-management-71e8a.firebaseio.com",
  projectId: "product-management-71e8a",
  storageBucket: "product-management-71e8a.appspot.com",
  messagingSenderId: "115364050083"
};

firebase.initializeApp(config);

const db = firebase.firestore();
db.settings({ timestampsInSnapshots: true });

var storageRef = firebase.storage().ref();
