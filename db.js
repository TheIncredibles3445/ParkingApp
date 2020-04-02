import firebase from "firebase/app";
import "firebase/firestore";

// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
  apiKey: "AIzaSyBe9tI4xIee_swg9hU6MX29CARfIQNn2GE",
  authDomain: "parkingapp-a8d89.firebaseapp.com",
  databaseURL: "https://parkingapp-a8d89.firebaseio.com",
  projectId: "parkingapp-a8d89",
  storageBucket: "parkingapp-a8d89.appspot.com",
  messagingSenderId: "683974531069",
  appId: "1:683974531069:web:9453d0463e8c4f53cceb94",
  measurementId: "G-EEWDWG338L"
});
//firebase.functions()
export default firebase.firestore();
