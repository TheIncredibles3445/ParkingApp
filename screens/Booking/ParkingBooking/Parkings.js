//@refresh restart
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
  AsyncStorage
} from "react-native";
import { SafeAreaView } from "react-navigation";
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from "react-native-maps";
import db from "../../../db";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/functions";
// import { Notifications } from "expo";
// import * as Permissions from "expo-permissions";

export default function Parking(props) {
  const data = props.navigation.getParam("data", "No params");
  const [parkingSpots, setParkingSpots] = useState([]);
  // const [token, setToken] = useState(null);
  useEffect(() => {
    db.collection("Block")
      .doc(data.selectedBlock.id)
      .collection("Parking")
      .onSnapshot(querySnapShot => {
        const parkings = [];
        querySnapShot.forEach(doc => {
          parkings.push({ id: doc.id, ...doc.data() });
        });
        setParkingSpots([...parkings]);
      });
  }, []);

  // useEffect(() => {
  //   registerForPushNotifications();
  // }, []);

  // const registerForPushNotifications = async () => {
  //   //Get the current users id So you can post the token to the user in your database
  //   const currentUser = firebase.auth().currentUser.uid;
  //   const { status: existingStatus } = await Permissions.getAsync(
  //     Permissions.NOTIFICATIONS
  //   );
  //   let finalStatus = existingStatus;
  //   // only ask if permissions have not already been determined, because
  //   // iOS won't necessarily prompt the user a second time.
  //   if (existingStatus !== "granted") {
  //     // Android remote notification permissions are granted during the app
  //     // install, so this will only ask on iOS
  //     const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
  //     finalStatus = status;
  //   }
  //   // Stop here if the user did not grant permissions
  //   if (finalStatus !== "granted") {
  //     return;
  //   }
  //   // Get the token that uniquely identifies this device
  //   try {
  //     let token = await Notifications.getExpoPushTokenAsync();
  //     console.log(token);
  //     // POST the token to your backend server from where you can retrieve it to send push notifications.
  //     db.collection("Users")
  //       .doc(firebase.auth().currentUser.uid)
  //       .update({ token: token });
  //     setToken(token)
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const sendPushNotification = () => {
  //   // I got the user that we will send the push notification to from the database and set it to state, now I have access to the users push token.
  //   const userExpoToken = token;
  //   console.log(userExpoToken);
  //   // Now we will send the message to the expo servers
  //   let response = fetch("https://exp.host/--/api/v2/push/send", {
  //     method: "POST",
  //     headers: {
  //       Accept: "application/json",
  //       "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify({
  //       to: userExpoToken,
  //       sound: "default",
  //       title: "This is a test",
  //       body: "IT WORKING !!!"
  //     })
  //   });
  // };

  const handleModal = item => {
    Alert.alert(
      "Confirm Booking",
      "Are you sure you want to book this parking spot?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Confirm", onPress: () => handleBooking(item) }
      ],
      { cancelable: false }
    );
  };

  const handleBooking = async item => {
    console.log("item", item);
    const date = `${new Date().getFullYear()}-0${new Date().getMonth() +
      1}-${new Date().getDate()}`;

    if (!item.isBooked) {


      //if (friend != null ){
      //   db.c......... userId : friend.id   
      //}
      //else{
      //   ...wasim's code
      //}

      db.collection("booking")
        .add({
          date: date,
          total_price: item.price,
          type: "Parking",
          userId: firebase.auth().currentUser.uid
        })
        .then(docRef => {
          db.collection("booking")
            .doc(docRef.id)
            .collection("parking_booking")
            .add({
              startTime: data.startTime,
              endTime: data.endTime,
              parkingId: item.id,
              rating: 0
            });
        });

      db.collection("Block")
        .doc(data.selectedBlock.id)
        .collection("Parking")
        .doc(item.id)
        .update({
          isBooked: true,
          location: item.location,
          price: item.price,
          type: item.type
        });

      props.navigation.navigate("Checkout");
      // }
    } else {
      alert("Booked");
      // sendPushNotification();
    }
    
  };

  // const callBook = () => {
  //   console.log("MAMA", book);
  //   // const bookings = book.filter(
  //   //   item =>
  //   //     item.date === date && item.userId === firebase.auth().currentUser.uid
  //   // );
  // };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ alignItems: "center", flex: 1 }}>
        <Text style={{ fontSize: 20 }}>Selected Block</Text>
      </View>

      <MapView
        initialRegion={{
          latitude: data.selectedBlock.location.latitude,
          longitude: data.selectedBlock.location.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001
        }}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
      >
        {parkingSpots &&
          parkingSpots.map((item, index) => {
            return (
              <Marker
                key={index}
                coordinate={item.location}
                onPress={() => handleModal(item)}
              >
                <View
                  style={
                    item.isBooked ? styles.bookedMarker : styles.unBookedMarker
                  }
                >
                  <Text style={styles.text}>QR{item.price}</Text>
                </View>
              </Marker>
            );
          })}

        {/* <Marker coordinate={coordinates[0]} />
          <Marker coordinate={coordinates[1]} />
          {console.log(directions)}
          <Polyline
            coordinates={directions}
            strokeColor="#FF0000" // fallback for when `strokeColors` is not supported by the map-provider
            strokeWidth={2}
          /> */}
      </MapView>
      {/* <Modal animationType="slide" transparent={false} visible={visible}>
        <SafeAreaView style={{ flex: 1 }}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between"
            }}
          >
            <View style={{ marginTop: "1%", marginLeft: "1%" }}>
              <Text style={{ fontSize: 20 }}>BOOK SPOT</Text>
            </View>
            <View style={{ marginTop: "1%", marginRight: "1%" }}>
              <TouchableOpacity onPress={() => handleCloseModal()}>
                <View
                  style={{
                    // borderWidth: 1,
                    // borderStyle: "solid",
                    // borderColor: "red",
                    // backgroundColor: "red",
                    paddingLeft: 20,
                    paddingRight: 20
                  }}
                >
                  <Text style={{ fontSize: 20 }}>X</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          
        </SafeAreaView>
      </Modal> */}
    </SafeAreaView>
  );
}

Parking.navigationOptions = {
  title: "Reserve Parking Spot"
};

const styles = StyleSheet.create({
  map: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  bookedMarker: {
    backgroundColor: "red",
    padding: 5,
    borderRadius: 5
  },
  unBookedMarker: {
    backgroundColor: "green",
    padding: 5,
    borderRadius: 5
  },
  text: {
    color: "white"
  }
});
