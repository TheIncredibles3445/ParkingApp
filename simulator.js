// must use require for node
// also must do the following to fix firebase bug:
// - yarn install base-64 package to fix bug
// - modify firebase version in package.json to "7.11.0"
// - do a yarn install
// - change App.js to fix bug (see top of file)
var firebase = require("firebase/app");
require("firebase/firestore");
var moment = require("moment");
var fetch = require("node-fetch");
// Initialize Cloud Firestore through Firebase
// replace with your own config
firebase.initializeApp({
  apiKey: "AIzaSyAipzJN8DJ_GIae8963KsLJ0U2goa4VL34",
  authDomain: "parking-assistant-d2d25.firebaseapp.com",
  databaseURL: "https://parking-assistant-d2d25.firebaseio.com",
  projectId: "parking-assistant-d2d25",
  storageBucket: "parking-assistant-d2d25.appspot.com",
  messagingSenderId: "312947533833",
  appId: "1:312947533833:web:850e4a0de0950af12830d8",
  measurementId: "G-7ZEZD60X58",
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
const waitingListArr = [];

const init = async () => {
  // do once only, not a listener
  const querySnapshot = await db.collection("block").get();
  for (let block of querySnapshot.docs) {
    let parking = await db
      .collection("block")
      .doc(block.id)
      .collection("parking")
      .get();
    for (let park of parking.docs) {
      parkings.push({ id: park.id, ...park.data(), blockId: block.id });
    }

    let waitingList = await db
      .collection("block")
      .doc(block.id)
      .collection("waitingList")
      .get();

    for (let waiting of waitingList.docs) {
      waitingListArr.push({ id: waiting.id, ...waiting.data() });
    }
  }
  console.log("done init: ", parkings);
  console.log("done init: ", waitingListArr);
};

const handleSend = async (uid) => {
  console.log("uid ", uid);
  const userRef = await db.collection("users").doc(uid).get();
  const user = userRef.data();

  const message = {
    to: user.token,
    sound: "default",
    title: "Free Parking",
    body: "A Parking Spot has been cleared",
    data: { data: "No data" },
    _displayInForeground: true,
  };
  const response = await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
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
    // console.log("parking before changing line 67 => ", parkingSpot);
    console.log("rnd  ", rnd);
    // - use percentages to decide what to do
    // - change to suit your own needs
    if (rnd < 0.6666) {
      parkingSpot.isParked = true;
    } else {
      parkingSpot.isBooked = false;
      parkingSpot.isParked = false;

      if (waitingListArr.length !== 0) {
        waitingListArr.map(async (item) => {
          if (
            item.blockId === parkingSpot.blockId &&
            item.date === moment().format("YYYY-MM-DD")
          ) {
            await handleSend(item.userId);
          }
        });
      }
    }
    // console.log("parking before changing line 75 => ", parkingSpot);
    // console.log("Parking Object in the array => ", parkings[i]);

    // update the db
    const { id, ...parking } = parkings[i];
    await db
      .collection("block")
      .doc(parking.blockId)
      .collection("parking")
      .doc(id)
      .set(parking);
    console.log("simulated with item[", i, "]: ", id);
    console.log("simulated with item[", i, "]: ", parking);
  }, DELAY * 1000);
};

// start simulation
// - don't let it run all day and night or google will limit you
simulate();
