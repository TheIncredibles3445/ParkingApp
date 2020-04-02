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
});
//firebase.functions()
export default firebase.firestore();
