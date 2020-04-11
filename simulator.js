// must use require for node
// also must do the following to fix firebase bug:
// - yarn install base-64 package to fix bug
// - modify firebase version in package.json to "7.11.0"
// - do a yarn install
// - change App.js to fix bug (see top of file)
var firebase = require("firebase/app");
require("firebase/firestore");

// Initialize Cloud Firestore through Firebase
// replace with your own config
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
const db = firebase.firestore();

// simulate activity in firestore db
// change as necessary for your own db schema and needs

// delay between simulations (sec)
// - do not make too small or google will limit you
const DELAY = 10;

// an array to be filled from db
// - change to suit your own db schema and simulation needs
const parkings = [];

const init = async () => {
  // do once only, not a listener
  const querySnapshot = await db.collection("Block").get();
  for (let block of querySnapshot.docs) {
    let parking = await db
      .collection("Block")
      .doc(block.id)
      .collection("Parking")
      .get();
    for (let park of parking.docs) {
      parkings.push({ id: park.id, ...park.data(), blockId: block.id });
    }
  }
  console.log("done init: ", parkings);
};

const simulate = async () => {
  // get necessary data from db for simulation to start
  await init();

  // // simulate something (e.g. db update) every DELAY seconds
  setInterval(async () => {
    // select a random item
    const i = Math.floor(Math.random() * parkings.length);

    // change it somehow
    // - must modify local copy of db data
    //   to avoid reloading from db
    const rnd = Math.random();
    let choice = "";

    let parkingSpot = parkings[i];
    console.log("parking before changing line 67 => ", parkingSpot);
    
    // - use percentages to decide what to do
    // - change to suit your own needs
    if (rnd < 0.6666) {
      parking.isParked = true;
    } else {
      parking.isParked = false;
    }
    console.log("parking before changing line 75 => ", parkingSpot);
    console.log("Parking Object in the array => ", parkings[i]);
    
    // update the db
    const { id, ...parking } = parkings[i];
    // await db
    //   .collection("Block").doc(parking.blockId).c
    //   .doc(id)
    //   .set(message);

    console.log("simulated with item[", i, "]: ", parking);
  }, DELAY * 1000);
};

// start simulation
// - don't let it run all day and night or google will limit you
simulate();
