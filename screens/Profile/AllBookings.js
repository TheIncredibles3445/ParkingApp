import React, { useState, useEffect } from "react";
import { ScrollView, View, StyleSheet, Alert } from "react-native";
import { Text, Button, Icon, Divider } from "react-native-elements";
import db from "../../db";
import firebase from "firebase/app";
import "firebase/auth";
import * as Animatable from "react-native-animatable";
import { TouchableOpacity } from "react-native-gesture-handler";
import { DataTable } from "react-native-paper";
import { Surface } from "react-native-paper";

export default function AllBookings(props) {
  const [allBookings, setAllBookings] = useState([]);
  const [bookingType, setBookingType] = useState("");
  const [count, setCount] = useState(0);

  const AllBookingsDB = async () => {
    db.collection("booking")
      .orderBy("date","desc")
      .onSnapshot((querySnapShot) => {
        const all = [];
        querySnapShot.forEach((doc) => {
          all.push({ id: doc.id, ...doc.data() });
        });
        //setBookingType()
        let count = 0;
        setAllBookings([...all]);
        for (let i = 0; i < all.length; i++) {
          if (all[i].userId === firebase.auth().currentUser.uid) {
            count++;
          }
        }
        setCount(count);
        console.log("bookings", all);
        console.log("allBookings", allBookings);
      });
  };

  useEffect(() => {
    AllBookingsDB();
  }, []);

  return (
    <View style={{ backgroundColor: "#F0F8FF", flex: 1 }}>
      <View>
        <ScrollView style={{ marginTop: 30 }}>
          <DataTable.Header>
            <DataTable.Title>Date</DataTable.Title>
            <DataTable.Title numeric>Type</DataTable.Title>
            <DataTable.Title numeric>Price</DataTable.Title>
          </DataTable.Header>

          {allBookings.map((item, index) => {
            return item.userId === firebase.auth().currentUser.uid ? (
              <View key={item.id}>
                <Animatable.View
                  animation="lightSpeedIn"
                  iterationCount={1}
                  direction="alternate"
                >
                  {console.log("item.type", item.type)}

                  <TouchableOpacity
                    onPress={() =>
                      item.type === "Parking"
                        ? props.navigation.navigate("ParkingBookingsDetails", {
                            itemType: item.type,
                            allBookings: allBookings,
                            itemId: item.id,
                            itemDate: item.date,
                          })
                        : props.navigation.navigate("ServiceBookingDetails", {
                            itemType: item.type,
                            allBookings: allBookings,
                            itemId: item.id,
                            itemDate: item.date,
                          })
                    }
                  >
                    <Divider style={{ height: 1, marginBottom: 2 }} />

                    <DataTable>
                      <DataTable.Row>
                        <DataTable.Cell> {item.date}</DataTable.Cell>
                        <DataTable.Cell numeric>{item.type}</DataTable.Cell>
                        <DataTable.Cell numeric>
                          {" "}
                          {item.total_price}
                        </DataTable.Cell>
                      </DataTable.Row>
                    </DataTable>
                  </TouchableOpacity>
                </Animatable.View>
              </View>
            ) : null;
          })}
        </ScrollView>
      </View>
      <Surface style={styles.surface}>
        <Text>
          Total of {count} {count <= 1 ? "Booking" : "Bookings"}
        </Text>
      </Surface>
    </View>
  );
}

AllBookings.navigationOptions = {
  title: "My Bookings",
  headerTintColor: "white",
  headerStyle: {
    backgroundColor: "#5a91bf",
  },
};
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
  surface: {
    marginTop: "3%",
    // marginLeft: "54%",
    padding: 4,
    height: 40,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    marginBottom: 8,
  },
});
