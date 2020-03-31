import React, { useState, useEffect } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { Text, Button, Icon } from "react-native-elements";
import db from "../../db";
import firebase from "firebase/app";
import "firebase/auth";
import { Rating } from "react-native-elements";

export default function ParkingBookingsDetails(props) {
  const [details, setDetails] = useState([]);
  const itemId = props.navigation.getParam("itemId", "No params");
  const [parkingBookingid, setParkingBookingid] = useState(0);
  const [rate, setRating] = useState(0);
  const [blockId, setBlockId] = useState();
  const [parkingName, setParkingName] = useState();
  const [gateNumber, setGateNumber] = useState();

  const getParkingName = async () => {
    db.collection("Block").onSnapshot(querySnapShot => {
      const all = [];
      querySnapShot.forEach(doc => {
        all.push({ id: doc.id, ...doc.data() });
      });
      console.log("all", all);
      for (let i = 0; i < all.length; i++) {
        setBlockId(all[i].id);
        setGateNumber(all[i].name);
        console.log("all  ffffid", all[i].id);
      }
    });
    db.collection("Block")
      .doc(blockId)
      .collection("Parking")
      .onSnapshot(querySnapShot => {
        const all = [];
        querySnapShot.forEach(doc => {
          all.push({ id: doc.id, ...doc.data() });
          console.log("all  ffdfgdsfffss", all);
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
      .onSnapshot(querySnapShot => {
        const all = [];
        querySnapShot.forEach(doc => {
          all.push({ id: doc.id, ...doc.data() });
        });
        for (let i = 0; i < all.length; i++) {
          setParkingBookingid(all[i].id);
        }
        setDetails([...all]);
      });
  };
  const timeToRate = (stimes, id) => {
    console.log("ddccf", stimes);
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
    getParkingName();
    BookingsDetailsDB("SSS");
  }, []);

  return (
    <View>
      <Text
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          fontSize: 20,
          marginBottom: 20
        }}
      >
        Parking Booking Details
      </Text>

      {details.map(item => {
        return (
          <ScrollView>
            <View key={item.id} style={{ marginBottom: 50 }}>
              <Text
                style={{
                  marginLeft: "auto",
                  marginRight: "auto",
                  fontWeight: "bold"
                }}
              >
                <Text>Parking: {parkingName} </Text>
                <Text> Gate Number: {gateNumber}</Text>
              </Text>

              <Text
                style={{
                  marginLeft: "auto",
                  marginRight: "auto",
                  fontWeight: "bold"
                }}
              >
                Start time:<Text>{item.startTime}</Text> -{" "}
                <Text>End time: {item.endTime}</Text>
              </Text>
              <Text>{timeToRate(item.startTime, item.id)}</Text>
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
                  onFinishRating={rating => ratingCompleted(rating, item.id)}
                  style={{ paddingVertical: 10 }}
                />
              )}
            </View>
          </ScrollView>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontWeight: "bold",
    fontSize: 15,
    opacity: 0.7
  },
  text2: {
    fontWeight: "bold",
    fontSize: 15,
    opacity: 0.7,
    textAlign: "center"
  }
});
