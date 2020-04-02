import firebase from "firebase/app";
import "firebase/firestore";

// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
  apiKey: "AIzaSyAxgkqz46PpA_pT9beQphwB_B55kurYVa8",
  authDomain: "parkingapp-38277.firebaseapp.com",
  databaseURL: "https://parkingapp-38277.firebaseio.com",
  projectId: "parkingapp-38277",
  storageBucket: "parkingapp-38277.appspot.com",
  messagingSenderId: "657425654700",
  appId: "1:657425654700:web:4b07f82307f20539c81009",
  measurementId: "G-DWVWXL4E8P"
  // apiKey: "AIzaSyAQTaHbGrvP6mEMLiTBVzmDL6QOYs0IHFE",
  // authDomain: "messages-c612c.firebaseapp.com",
  // databaseURL: "https://messages-c612c.firebaseio.com",
  // projectId: "messages-c612c",
  // storageBucket: "messages-c612c.appspot.com",
  // messagingSenderId: "537953148662",
  // appId: "1:537953148662:web:db97903171c3a2e9e996d7",
  // measurementId: "G-FXFQQRS54D"
});
//firebase.functions()
export default firebase.firestore();
