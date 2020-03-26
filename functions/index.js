const functions = require("firebase-functions");
const admin = require("firebase-admin");
// const nodemailer = require("nodemailer");
// const cors = require("cors")({ origin: true });
admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

exports.updateUser = functions.https.onCall(async (data, context) => {
  console.log("updateUser data", data);
  const result = await admin.auth().updateUser(data.uid, {
    displayName: data.displayName,
    phoneNumber: data.phoneNumber
  });
  console.log("after set", result);
});

exports.updateDisplayName = functions.https.onCall(async (data, context) => {
  console.log("updateDisplayName data", data);
  const result = await admin.auth().updateUser(data.uid, {
    displayName: data.displayName
  });
  console.log("after set", result);
});

exports.updatePhoto = functions.https.onCall(async (data, context) => {
  console.log("updatePhoto data", data);
  const result = await admin.auth().updateUser(data.uid, {
    // displayName: data.displayName,
    photoURL: data.photoURL
  });
  console.log("after set", result);
});

exports.addVehicle = functions.https.onCall(async (data, context) => {
  console.log("addVehicle data", data);
  db.collection("users")
    .doc(data.uid)
    .collection("Vehicles")
    .add({
      make: data.make,
      model: data.model,
      type: data.type,
      number: data.number
    });
});

exports.addCard = functions.https.onCall(async (data, context) => {
  console.log("addCard data", data);
  db.collection("users")
    .doc(data.uid)
    .collection("Cards")
    .add({
      number: data.number,
      type: data.type,
      provider: data.provider,
      expiry: data.expiry
    });
});

exports.initUser = functions.https.onRequest(async (request, response) => {
  console.log("request", request.query.uid);
  console.log("request", request.query.email);

  const result = await admin.auth().updateUser(request.query.uid, {
    displayName: request.query.email,
    photoURL:
      "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png"
  });
  console.log("after set", result);

  const listUsersResult = await admin.auth().listUsers(1000);

  listUsersResult.users.forEach(userRecord => {
    console.log("user", userRecord.toJSON());
  });

  response.send("All done ");
});
