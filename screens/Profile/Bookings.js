import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import db from "../../db";
import firebase from "firebase";
import "firebase/auth";
export default function Bookings(props) {
  const [parkingBookings, setParkingBookings] = useState([]);
  const [serviceBookings, setServiceBookings] = useState([]);

  useEffect(() => {
    getParkingBooking();
    getServiceBooking();
  }, []);

  const getParkingBooking = async () => {
    const bookings = db
      .collection("booking")
      .where("userId", "==", firebase.auth().currentUser.uid)
      .where("type", "==", "Parking");
    bookings.onSnapshot(query => {
      query.forEach(doc => {
        db.collection("booking")
          .doc(doc.id)
          .collection("parking_booking")
          .onSnapshot(query => {
            let parkingBook = [];
            query.forEach(docs => {
                parkingBook.push({})
            })
          });
      });
      setParkingBookings([...parkingBook]);
    });
  };

  const getServiceBooking = () => {
    const bookings = db
      .collection("booking")
      .where("userId", "==", firebase.auth().currentUser.uid)
      .where("type", "==", "Service");
    bookings.onSnapshot(query => {
      let serviceBook = [];
      query.forEach(doc => {
        serviceBook.push({ id: doc.id, ...doc.data() });
      });
      setParkingBookings([...serviceBook]);
    });
  };
  return (
    <View>
      <Text>Hello</Text>
    </View>
  );
}

Bookings.navigationOptions = {
  title: "My Bookings"
};
