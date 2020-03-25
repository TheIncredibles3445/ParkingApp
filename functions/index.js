const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const cors = require("cors")({ origin: true });
admin.initializeApp(functions.config().firebase);

const db = admin.firestore();
// const db = admin.firestore();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   response.send("Hello from Firebase!");
// });

// let transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "theincredibles3445@gmail.com",
//     pass: "TheIncredibles3445!"
//   }
// });

// exports.sendMail = functions.https.onRequest((req, res) => {
//   cors(req, res, () => {
//     // getting dest email by query string
//     const dest = req.query.dest;

//     const mailOptions = {
//       from: "theincredibles3445@gmail.com", // Something like: Jane Doe <janedoe@gmail.com>
//       to: "wasimibrahim19@gmail.com",
//       subject: "I'M A PICKLE!!!", // email subject
//       html: `<p style="font-size: 16px;">Pickle Riiiiiiiiiiiiiiiick!!</p>
//               <br />
//               <img src="https://images.prod.meredith.com/product/fc8754735c8a9b4aebb786278e7265a5/1538025388228/l/rick-and-morty-pickle-rick-sticker" />
//           ` // email content in HTML
//     };

//     // returning result
//     return transporter.sendMail(mailOptions, (erro, info) => {
//       if (erro) {
//         return res.send(erro.toString());
//       }
//       return res.send("Sended");
//     });
//   });
// });

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
  db.collection("Users")
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
  db.collection("Users")
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

// exports.handleParkingBooking = functions.https.onCall(async (data, context) => {
//   const date = `${new Date().getFullYear()}-0${new Date().getMonth() +
//     1}-${new Date().getDate()}`;
//   // console.log("data", data);

//   //console.log("handleBooking data", data);
//   // await db.collection("Booking").add({
//   //   userId: data.user,
//   //   type: "Parking",
//   //   date: date,
//   //   totalPrice: data.price
//   // });
//   let booking = [];
//   await db.collection("Booking").onSnapshot(querySnapshot => {
//     let allBookings = [];
//     querySnapshot.forEach(async doc => {
//       let docData = doc.data();
//       allBookings.push({
//         id: doc.id,
//         date: docData.date,
//         totalPrice: docData.totalPrice,
//         userId: docData.userId
//       });
//       // console.log(docData);
//     });
//     // console.log("allBookings before", allBookings);

//     const bookings = allBookings.filter(
//       item => item.date === date && item.userId === data.user
//     );
//     booking = bookings;
//   });

//   if (booking) {
//     //await bookSpot(data, date);
//     console.log("empty");
//   } else {
//     console.log("Not empty");
//   }
// });

// const bookSpot = async (data, date) => {
//   // db.collection("")
// };
