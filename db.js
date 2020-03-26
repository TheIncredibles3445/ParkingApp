import firebase from "firebase/app";
import "firebase/firestore";

// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
  apiKey: "AIzaSyDGgtzrlim1Kl2yE_jHGnQLRBNebJ_Iof4",
  authDomain: "messages-851c3.firebaseapp.com",
  databaseURL: "https://messages-851c3.firebaseio.com",
  projectId: "messages-851c3",
  storageBucket: "messages-851c3.appspot.com",
  messagingSenderId: "1005906669400",
  appId: "1:1005906669400:web:10adb8c8c839cc104f3f2d",
  measurementId: "G-P04SXFMXD5"
});
//firebase.functions()
export default firebase.firestore();
