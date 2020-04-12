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
import { Card } from "react-native-shadow-cards";

export default function AllBookings(props) {
  const [allBookings, setAllBookings] = useState([]);
  const [bookingType, setBookingType] = useState("");
  const [count, setCount] = useState(0);

  const AllBookingsDB = async () => {
    db.collection("booking")
      .orderBy("date", "desc")
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
        <Surface style={styles.surface}>
          <Text style={{color:"white"}}>
          {count <= 1 ? "Booking" : "Bookings"} Total : {count}
          </Text>
        </Surface>
        <ScrollView style={{ marginTop: 20 }}>
          <Card
            style={{
              width: "100%",
            }}
          >
            <DataTable>
              <DataTable.Header>
                <DataTable.Cell>Date</DataTable.Cell>
                <DataTable.Cell numeric>Type</DataTable.Cell>
                <DataTable.Cell numeric>Price</DataTable.Cell>
              </DataTable.Header>
            </DataTable>
       
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
             </Card>
        </ScrollView>
      </View>
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
    padding: 3,
    height: 40,
    width: "40%",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    marginBottom: 8,
    backgroundColor: "#0C2D48",
    marginLeft: "32%",
  },
});
