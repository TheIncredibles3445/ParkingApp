import React, { useState, useEffect } from "react";
import { ScrollView, View, StyleSheet, Alert } from "react-native";
import { Text, Button, Icon } from "react-native-elements";
import db from "../../db";
import firebase from "firebase/app";
import "firebase/auth";
import { Card } from "react-native-shadow-cards";
import moment from "moment";
import { Col, Grid } from "react-native-easy-grid";

export default function Checkout(props) {
  const blockId = props.navigation.getParam("blockId", "No params");
  const parkingId = props.navigation.getParam("parkingId", "No params");
  const [booking, setBooking] = useState([]);
  const [parkingBookings, setParkingBookings] = useState([]);
  const [serviceBookings, setServiceBookings] = useState([]);
  const [total, setTotal] = useState(0);
  const [allParkingsLots, setAllParkings] = useState([]);

  useEffect(() => {
    getParkingBookings();
    getTotalAmount();
    getServiceBookings();
  }, []);

  const getTotalAmount = () => {
    db.collection("booking")
      .where("date", "==", moment().format("YYYY-MM-DD"))
      .where("userId", "==", firebase.auth().currentUser.uid)
      .onSnapshot((querySnap) => {
        let total = 0;
        querySnap.forEach((doc) => {
          let data = doc.data();
          total += data.total_price;
        });
        setTotal(total);
      });
  };

  const getAllBlocks = async () => {
    const blocks = await db.collection("block").get();
    let parkings = [];
    for (let block of blocks.docs) {
      const parkingsLots = await db
        .collection("block")
        .doc(block.id)
        .collection("parking")
        .get();
      for (let parking of parkingsLots.docs) {
        parkings.push({
          block: block.id,
          parkingId: parking.id,
          ...parking.data(),
        });
      }
    }
    setAllParkings(parkings);
  };

  const getParkingBookings = async () => {
    db.collection("booking")
      .where("userId", "==", firebase.auth().currentUser.uid)
      .where("date", "==", moment().format("YYYY-MM-DD"))
      .where("type", "==", "Parking")
      .onSnapshot((querySnapshot) => {
        let parkingBooking = [];
        for (let book of querySnapshot.docs) {
          db.collection("booking")
            .doc(book.id)
            .collection("parking_booking")
            .onSnapshot((query) => {
              for (let park of query.docs) {
                parkingBooking.push({
                  id: park.id,
                  ...park.data(),
                  bookingId: book.id,
                  price: book.data().total_price,
                });
              }
              if (parkingBooking.length === querySnapshot.docs.length) {
                setParkingBookings([...parkingBooking]);
              }
            });
        }
      });
  };

  const getServiceBookings = async () => {
    const bookingsRef = db.collection("booking");
    bookingsRef
      .where("date", "==", moment().format("YYYY-MM-DD"))
      .where("userId", "==", firebase.auth().currentUser.uid)
      .where("type", "==", "Service")
      .onSnapshot((querySnapshot) => {
        let allServiceBookings = [];
        for (let book of querySnapshot.docs) {
          db.collection("booking")
            .doc(book.id)
            .collection("service_booking")
            .onSnapshot(async (query) => {
              for (let serviceBook of query.docs) {
                let serviceData = serviceBook.data();
                let worker = (
                  await db.collection("users").doc(serviceData.worker).get()
                ).data();
                let serviceInfo = (
                  await db
                    .collection("service")
                    .doc(serviceData.service_id)
                    .get()
                ).data();

                let time = serviceData.time;
                let timeArr = time.split(" ");
                let formattedTime = `${timeArr[0]} ${timeArr[1]}`;
                serviceData.time = formattedTime;
                allServiceBookings.push({
                  id: serviceBook.id,
                  ...serviceData,
                  price: book.data().total_price,
                  worker: worker.name,
                  service: serviceInfo.Name,
                });
              }
              if (allServiceBookings.length === querySnapshot.docs.length) {
                setServiceBookings([...allServiceBookings]);
              }
            });
        }
      });
  };

  const handlePayLater = () => {
    Alert.alert(
      "Confirm Booking",
      "Are you sure you want to pay later?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Confirm", onPress: () => handlePayLate() },
      ],
      { cancelable: false }
    );
  };

  const handlePayLate = async () => {
    await db.collection("users").doc(firebase.auth().currentUser.uid).update({
      points: 20,
      pendingAmount: total,
    });

    handleNavigationAlert();
  };

  const handleNavigationAlert = () => {
    Alert.alert(
      "Navigation",
      "Do You Want The Direction For Your Latest Booking?",
      [
        {
          text: "No",
          onPress: () => props.navigation.navigate("Home"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () =>
            props.navigation.navigate("Direction", {
              blockId: blockId,
              parkingId: parkingId,
            }),
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <ScrollView
    //contentContainerStyle={{ flex: 1, justifyContent: "space-around" }}
    >
      <View style={{ flex: 1, alignItems: "center" }}>
        <Text h4>Checkout</Text>
      </View>

      <View style={{ flex: 4 }}>
        <Text style={styles.text}>Booking Details</Text>
        <Text style={styles.text}>
          Total Price: <Text>{total}</Text>
        </Text>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.text}>
            Booked Date: <Text>{moment().format("YYYY-MM-DD")}</Text>
          </Text>
          <Card style={{ padding: 15 }}>
            <Text style={styles.text2}>
              Booking Type: <Text>Parking</Text>
            </Text>
            <Grid>
              {/* <Col>
                <Text style={styles.text2}>Parking Spot</Text>
              </Col> */}
              <Col>
                <Text style={styles.text2}>Start Time</Text>
              </Col>
              <Col>
                <Text style={styles.text2}>End Time</Text>
              </Col>
              <Col>
                <Text style={styles.text2}>Price</Text>
              </Col>
            </Grid>
            {parkingBookings &&
              parkingBookings.map((item) => (
                <Grid>
                  {/* <Col>
                  <Text style={{ textAlign: "center" }}>{item.parking}</Text>
                </Col> */}
                  <Col>
                    <Text style={{ textAlign: "center" }}>
                      {item.startTime}
                    </Text>
                  </Col>
                  <Col>
                    <Text style={{ textAlign: "center" }}>{item.endTime}</Text>
                  </Col>
                  <Col>
                    <Text style={{ textAlign: "center" }}>{item.price}</Text>
                  </Col>
                </Grid>
              ))}
          </Card>
          <Card style={{ padding: 15, marginTop: 10 }}>
            <Text style={styles.text2}>
              Booking Type: <Text style={styles.text2}>Service</Text>
            </Text>
            <Grid>
              <Col>
                <Text style={styles.text2}>Service</Text>
              </Col>
              <Col>
                <Text style={styles.text2}>Worker</Text>
              </Col>
              <Col>
                <Text style={styles.text2}>Price</Text>
              </Col>
              <Col>
                <Text style={styles.text2}>Time</Text>
              </Col>
            </Grid>

            {serviceBookings &&
              serviceBookings.map((item) => (
                <Grid>
                  <Col>
                    <Text style={{ textAlign: "center" }}>{item.service}</Text>
                  </Col>
                  <Col>
                    <Text style={{ textAlign: "center" }}>{item.worker}</Text>
                  </Col>
                  <Col>
                    <Text style={{ textAlign: "center" }}>{item.price}</Text>
                  </Col>
                  <Col>
                    <Text style={{ textAlign: "center" }}>{item.time}</Text>
                  </Col>
                </Grid>
              ))}
          </Card>
        </View>
      </View>
      <View
        style={{
          marginTop: 20,
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        <Button
          icon={<Icon type="material" name="payment" size={25} color="white" />}
          iconLeft
          title="Pay Now"
          onPress={() =>
            props.navigation.navigate("Payment", {
              blockId: blockId,
              parkingId: parkingId,
            })
          }
          //buttonStyle={{ width: "30%" }}
        />

        <Button
          icon={<Icon type="material" name="payment" size={25} color="white" />}
          iconLeft
          title="Pay Later"
          onPress={handlePayLater}
          //buttonStyle={{ width: "30%" }}
        />
      </View>
    </ScrollView>
  );
}

Checkout.navigationOptions = {
  title: "Checkout",
  headerTintColor: "white",
  headerStyle: {
    backgroundColor: "#005992",
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
});
