import firebase from "firebase/app";
import "firebase/firestore";

// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
  apiKey: "AIzaSyAipzJN8DJ_GIae8963KsLJ0U2goa4VL34",
  authDomain: "parking-assistant-d2d25.firebaseapp.com",
  databaseURL: "https://parking-assistant-d2d25.firebaseio.com",
  projectId: "parking-assistant-d2d25",
  storageBucket: "parking-assistant-d2d25.appspot.com",
  messagingSenderId: "312947533833",
  appId: "1:312947533833:web:850e4a0de0950af12830d8",
  measurementId: "G-7ZEZD60X58",
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
