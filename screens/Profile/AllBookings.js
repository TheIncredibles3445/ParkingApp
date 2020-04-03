import React, { useState, useEffect } from "react";
import { ScrollView, View, StyleSheet, Alert } from "react-native";
import { Text, Button, Icon, Divider } from "react-native-elements";
import db from "../../db";
import firebase from "firebase/app";
import "firebase/auth";
// import * as Animatable from "react-native-animatable";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function AllBookings(props) {
  const [allBookings, setAllBookings] = useState([]);
  const [bookingType, setBookingType] = useState("");

  const AllBookingsDB = async () => {
    // let a = db.collection("booking");
    // let b = a.orderBy("date").limit(3);
    // console.log("fir", firstThree);
    db.collection("booking")
      .orderBy("date", "desc")
      .onSnapshot(querySnapShot => {
        const all = [];
        querySnapShot.forEach(doc => {
          all.push({ id: doc.id, ...doc.data() });
        });
        //setBookingType()
        setAllBookings([...all]);
        console.log("bookings", all);
        console.log("allBookings", allBookings);
      });
  };

  useEffect(() => {
    AllBookingsDB();
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
        My Bookings
      </Text>
      <ScrollView>
        {allBookings.map(item => {
          return item.userId === firebase.auth().currentUser.uid ? (
            <View key={item.id}>
              {console.log("item.type", item.type)}
              <TouchableOpacity
                onPress={() =>
                  item.type === "Parking"
                    ? props.navigation.navigate("ParkingBookingsDetails", {
                        itemType: item.type,
                        allBookings: allBookings,
                        itemId: item.id,
                        itemDate: item.date
                      })
                    : props.navigation.navigate("ServiceBookingDetails", {
                        itemType: item.type,
                        allBookings: allBookings,
                        itemId: item.id,
                        itemDate: item.date
                      })
                }
              >
                <Divider style={{ height: 1, marginBottom: 2 }} />
                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={{
                      marginRight: "23%",
                      marginLeft: "17%",
                      fontWeight: "bold"
                    }}
                  >
                    Date
                  </Text>
                  <Text style={{ marginRight: "19%", fontWeight: "bold" }}>
                    Type
                  </Text>
                  <Text style={{ fontWeight: "bold" }}>Price</Text>
                </View>
                <Divider style={{ height: 1, marginTop: 2 }} />
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ marginRight: "15%", marginLeft: "13%" }}>
                    {item.date}
                  </Text>
                  <Text style={{ marginRight: "17%" }}>{item.type}</Text>
                  <Text style={{ marginBottom: "1%", marginBottom: 40 }}>
                    {" "}
                    {item.total_price}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : <Text>No booking</Text>;
        })}
      </ScrollView>
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
