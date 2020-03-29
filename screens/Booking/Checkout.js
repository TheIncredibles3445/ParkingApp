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
    db.collection("booking").onSnapshot(querySnap => {
      let total = 0;
      querySnap.forEach(doc => {
        let data = doc.data();
        total += data.total_price;
      });
      setTotal(total);
    });
  };

  const getAllBlocks = async () => {
    const blocks = await db.collection("Block").get();
    let parkings = [];
    for (let block of blocks.docs) {
      const parkingsLots = await db
        .collection("Block")
        .doc(block.id)
        .collection("Parking")
        .get();
      for (let parking of parkingsLots.docs) {
        parkings.push({
          block: block.id,
          parkingId: parking.id,
          ...parking.data()
        });
      }
    }
    setAllParkings(parkings);
  };

  const getParkingBookings = async () => {
    const bookingsRef = db.collection("booking");
    const todaysBookings = await bookingsRef
      .where("date", "==", moment().format("YYYY-MM-DD"))
      .where("type", "==", "Parking")
      .get();
    let allParkings = [];
    for (let item of todaysBookings.docs) {
      let data = item.data();
      let parkingRef = await bookingsRef
        .doc(item.id)
        .collection("parking_booking")
        .get();
      for (let parking of parkingRef.docs) {
        let pData = parking.data();
        // let p = null;
        // allParkingsLots.map(lot => {
        //   if (lot.parkingId === pData.parkingId) {
        //     p = lot;
        //   } 
        //   // console.log("line 78 ==> ", p);
        // }) ;
        allParkings.push({
          id: parking.id,
          ...parking.data(),
          price: data.total_price,
          // parking: p.name
        });
      }
    }
    setParkingBookings(allParkings);
  };

  const getServiceBookings = async () => {
    const bookingsRef = db.collection("booking");
    const todaysBookings = await bookingsRef
      .where("date", "==", moment().format("YYYY-MM-DD"))
      .where("type", "==", "Service")
      .get();
    let allServices = [];
    for (let item of todaysBookings.docs) {
      let data = item.data();
      let serviceRef = await bookingsRef
        .doc(item.id)
        .collection("service_booking")
        .get();
      for (let service of serviceRef.docs) {
        let serviceData = service.data();
        let worker = (
          await db
            .collection("users")
            .doc(serviceData.worker)
            .get()
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
        allServices.push({
          id: service.id,
          ...serviceData,
          price: data.total_price,
          worker: worker.name,
          service: serviceInfo.Name
        });
      }
    }
    setServiceBookings(allServices);
  };

  const handlePayLater = () => {
    Alert.alert(
      "Confirm Booking",
      "Are you sure you want to pay  later?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Confirm", onPress: () => handlePayLate() }
      ],
      { cancelable: false }
    );
  };

  const handlePayLate = async () => {
    await db
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .update({
        points: 20,
        pendingAmount: total
      });
    props.navigation.navigate("Home");
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
            {parkingBookings.map(item => (
              <Grid>
                {/* <Col>
                  <Text style={{ textAlign: "center" }}>{item.parking}</Text>
                </Col> */}
                <Col>
                  <Text style={{ textAlign: "center" }}>{item.startTime}</Text>
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

            {serviceBookings.map(item => (
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
          justifyContent: "space-evenly"
        }}
      >
        <Button
          icon={<Icon type="material" name="payment" size={25} color="white" />}
          iconLeft
          title="Pay Now"
          onPress={() => props.navigation.navigate("Payment")}
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
  title: "Checkout"
};

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
