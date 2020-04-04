import React, { useState, useEffect, useRef } from "react";
import {
  Alert,
  Image,
  Platform,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Picker
} from "react-native";
import firebase from "firebase/app";
import "firebase/auth";
import db from "../../../db.js";
import DatePicker from "react-native-datepicker";
import moment from "moment";
import { AsyncStorage } from "react-native";

export default function ConfirmServiceBookingScreen(props) {
  const booking = props.navigation.getParam("booking", "some default value");
  //const [bookingId , setBookingId] = useState()
  const bookingTotal = useRef();
  const bookingId = useRef();
  const bookingTotal2 = useRef();

  useEffect(() => {
    console.log("-------------<<<< Confirm Booking >>>>-----------", booking);
    track()
    addBookings();
  }, []);

  const track = async()=>{
    let old = await db.collection("tracking").doc("track").get()
    let newTrack = parseInt(old.data().service) - 1
    db.collection("tracking").doc("track").update({ service: newTrack})
    AsyncStorage.setItem("service", "no");
  }

  const addBookings = async () => {
    let total = 0;
    for (let i = 0; i < booking.length; i++) {
      total = total + parseInt(booking[i].service.Price);
    }
    bookingTotal.current = total;
    bookingTotal2.current = total;
    await db
      .collection("booking")
      .add({
        userId: firebase.auth().currentUser.uid,
        date: moment().format("YYYY-MM-DD"),
        type: "Service",
        total_price: total
      })
      .then(function(docRef) {
        AsyncStorage.setItem("booking_id", docRef.id);
      });

    for (let i = 0; i < booking.length; i++) {
      bookingId.current = await AsyncStorage.getItem("booking_id");
      console.log("-------------the id ==>>>>>", bookingId.current);
      console.log(
        "line 44(booking ID)",
        await AsyncStorage.getItem("booking_id")
      );
      let bi = await AsyncStorage.getItem("booking_id");
      let d = await db
        .collection("booking")
        .doc(bi)
        .collection("service_booking")
        .add({
          service_id: booking[i].service.id,
          time: booking[i].time,
          worker: booking[i].worker.id,
          parking: booking[i].parking.name,
          block: booking[i].block.name,
          rating: 0
        }).then(function(docRef) {
          AsyncStorage.setItem("service_booking_id", docRef.id);
        });;
      let sch = await db
        .collection("worker")
        .doc(booking[i].worker.id)
        .get();
      let info = sch.data();
      info.schedule.push({
        Booking: await AsyncStorage.getItem("booking_id"),
        Service_booking: await AsyncStorage.getItem("service_booking_id"),
        dateTime: booking[i].time
      });
      db.collection("worker")
        .doc(booking[i].worker.id)
        .update({ schedule: info.schedule });
    }

    let user = await db
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get();
    if (user.data().pendingAmount) {
      bookingTotal.current =
        parseInt(bookingTotal.current) + parseInt(user.data().pendingAmount);
      db.collection("users")
        .doc(firebase.auth().currentUser.uid)
        .update({ pendingAmount: bookingTotal.current });
    } else {
      db.collection("users")
        .doc(firebase.auth().currentUser.uid)
        .update({ pendingAmount: bookingTotal.current });
    }
  };

  const payLater = async () => {
    props.navigation.navigate("Home");
  };

  return (
    <View>
      <Text> Confirm Booking</Text>
      <Button
        title="Pay Now"
        onPress={() =>
          props.navigation.navigate("Payment", {
            booking: booking,
            total: bookingTotal2.current,
            id: bookingId.current
          })
        }
      />
      <Button title="Pay Later" onPress={() => payLater()} />
    </View>
  );
}
