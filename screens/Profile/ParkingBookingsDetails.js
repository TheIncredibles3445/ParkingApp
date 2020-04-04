import React, { useState, useEffect, useCallback } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { Text, Button, Icon } from "react-native-elements";
import db from "../../db";
import firebase from "firebase/app";
import "firebase/auth";
import { Rating } from "react-native-elements";
import * as Animatable from "react-native-animatable";

export default function ParkingBookingsDetails(props) {
  const [details, setDetails] = useState([]);
  const itemId = props.navigation.getParam("itemId", "No params");
  const [parkingBookingid, setParkingBookingid] = useState(0);
  const [rate, setRating] = useState(0);
  const [blockId, setBlockId] = useState();
  const [parkingName, setParkingName] = useState();
  const [gateNumber, setGateNumber] = useState();

  const getParkingId = async () => {
    await db.collection("Block").onSnapshot((querySnapShot) => {
      const all = [];
      querySnapShot.forEach((doc) => {
        all.push({ id: doc.id, ...doc.data() });
      });
      for (let i = 0; i < all.length; i++) {
        setBlockId(all[i].id);
        setGateNumber(all[i].name);
      }
    });
  };
  const getparkingName = async () => {
    await db
      .collection("Block")
      .doc(blockId)
      .collection("Parking")
      .onSnapshot((querySnapShot) => {
        const all = [];
        const p = [];
        querySnapShot.forEach((doc) => {
          all.push({ id: doc.id, ...doc.data() });
        });
        for (let i = 0; i < all.length; i++) {
          setParkingName(all[i].name);
        }
      });
  };
  const BookingsDetailsDB = async () => {
    db.collection("booking")
      .doc(itemId)
      .collection("parking_booking")
      .onSnapshot((querySnapShot) => {
        const all = [];
        querySnapShot.forEach((doc) => {
          all.push({ id: doc.id, ...doc.data() });
        });
        for (let i = 0; i < all.length; i++) {
          setParkingBookingid(all[i].id);
        }
        setDetails([...all]);
      });
  };

  const ratingCompleted = async (rating, id) => {
    //console.log("rating", rating, "id", id);
    setRating(rating);
    db.collection("booking")
      .doc(itemId)
      .collection("parking_booking")
      .doc(id)
      .update({ rating: rating });
  };

  useEffect(() => {
    getParkingId();
    BookingsDetailsDB();
    getparkingName();
  }, [parkingName]);

  return (
    <View>
      <Animatable.Text
        animation="lightSpeedIn"
        iterationCount={3}
        direction="alternate"
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          fontSize: 20,
          marginBottom: 20,
        }}
      >
        {" "}
        Parking Booking Details
      </Animatable.Text>
      <Animatable.View
        animation="lightSpeedIn"
        iterationCount={3}
        direction="alternate"
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          fontSize: 20,
          marginBottom: 20,
        }}
      >
        <Button title="test" />
      </Animatable.View>
      <ScrollView>
        {details.map((item) => {
          return (
            <View key={item.id} style={{ marginBottom: 50 }}>
              <Text
                style={{
                  marginLeft: "auto",
                  marginRight: "auto",
                  fontWeight: "bold",
                }}
              >
                <Text>Parking: {parkingName} </Text>
                <Text> Gate Number: {gateNumber}</Text>
              </Text>

              <Text
                style={{
                  marginLeft: "auto",
                  marginRight: "auto",
                  fontWeight: "bold",
                }}
              >
                Start time:<Text>{item.startTime}</Text> -{" "}
                <Text>End time: {item.endTime}</Text>
              </Text>

              {item.rating > 0 ? (
                <Rating
                  readonly
                  showRating
                  type="star"
                  startingValue={item.rating}
                  imageSize={40}
                  onFinishRating={ratingCompleted}
                  style={{ paddingVertical: 10 }}
                />
              ) : (
                <Rating
                  showRating
                  type="star"
                  startingValue={item.rating}
                  imageSize={40}
                  onFinishRating={(rating) => ratingCompleted(rating, item.id)}
                  style={{ paddingVertical: 10 }}
                />
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontWeight: "bold",
    fontSize: 15,
    opacity: 0.7,
  },
  text2: {
    fontWeight: "bold",
    fontSize: 15,
    opacity: 0.7,
    textAlign: "center",
  },
});
