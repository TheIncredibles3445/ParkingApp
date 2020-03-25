import firebase from "firebase/app";
import "firebase/firestore";

// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
  apiKey: "AIzaSyCNs3ICBXqvnOHf9SP05LwfxZnXM2CXFrg",
  authDomain: "parking-app-3b592.firebaseapp.com",
  databaseURL: "https://parking-app-3b592.firebaseio.com",
  projectId: "parking-app-3b592",
  storageBucket: "parking-app-3b592.appspot.com",
  messagingSenderId: "167019920679",
  appId: "1:167019920679:web:848574c0f0a6bc3772bd02",
  measurementId: "G-TYS24KVHHM"
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
