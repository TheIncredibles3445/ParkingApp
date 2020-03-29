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
import { NavigationActions } from "react-navigation";
import moment from "moment";
import { SafeAreaView } from "react-navigation";
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from "react-native-maps";
import db from "../../../db";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/functions";

export default function Parking(props) {
  const data = props.navigation.getParam("data", "No params");
  const [parkingSpots, setParkingSpots] = useState([]);
  const [cars, setCars] = useState([]);
  const [parkingBookings, setParkingBookings] = useState([]);
  const [flag, setFlag] = useState(false);

  // const [token, setToken] = useState(null);
  useEffect(() => {
    getAllParking();
  }, []);

  const getAllParking = () => {
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
  };

  useEffect(() => {
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("Vehicles")
      .onSnapshot(querySnap => {
        let vehicles = [];
        querySnap.forEach(doc => {
          vehicles.push({ id: doc.id, ...doc.data() });
        });
        setCars([...vehicles]);
      });
  }, []);

  useEffect(() => {
    getAllBooking();
    handleBookedSpots();
  }, []);

  const getAllBooking = async () => {
    const bookingsRef = db.collection("booking");
    const todaysBookings = await bookingsRef
      .where("date", "==", moment().format("YYYY-MM-DD"))
      .where("type", "==", "Parking")
      .get();
    let allParkings = [];
    for (let item of todaysBookings.docs) {
      let parkingRef = await bookingsRef
        .doc(item.id)
        .collection("parking_booking")
        .get();
      for (let parking of parkingRef.docs) {
        allParkings.push({ id: parking.id, ...parking.data() });
      }
    }
    setParkingBookings(allParkings);
  };

  const convertTime = time => {
    const splitTime = time.split(" ");
    if (splitTime[1] === "pm") {
      if (splitTime[0] === "12:00") {
        const split = splitTime[0].split(":");
        return new Date(moment().format("YYYY-MM-DDT" + `12:${split[1]}:00`));
      } else if (splitTime[0] === "01:00") {
        const split = splitTime[0].split(":");
        return new Date(moment().format("YYYY-MM-DDT" + `13:${split[1]}:00`));
      } else if (splitTime[0] === "02:00") {
        const split = splitTime[0].split(":");
        return new Date(moment().format("YYYY-MM-DDT" + `14:${split[1]}:00`));
      } else if (splitTime[0] === "03:00") {
        const split = splitTime[0].split(":");
        return new Date(moment().format("YYYY-MM-DDT" + `15:${split[1]}:00`));
      } else if (splitTime[0] === "04:00") {
        const split = splitTime[0].split(":");
        return new Date(moment().format("YYYY-MM-DDT" + `16:${split[1]}:00`));
      } else if (splitTime[0] === "05:00") {
        const split = splitTime[0].split(":");
        return new Date(moment().format("YYYY-MM-DDT" + `17:${split[1]}:00`));
      } else if (splitTime[0] === "06:00") {
        const split = splitTime[0].split(":");
        return new Date(moment().format("YYYY-MM-DDT" + `18:${split[1]}:00`));
      } else if (splitTime[0] === "07:00") {
        const split = splitTime[0].split(":");
        return new Date(moment().format("YYYY-MM-DDT" + `19:${split[1]}:00`));
      }
    } else {
      return new Date(moment().format("YYYY-MM-DDT" + `${splitTime[0]}:00`));
    }
  };

  const handleBookedSpots = async () => {
    const myStartTime = convertTime(data.startTime);
    const myEndTime = convertTime(data.endTime);

    const parkings = await db
      .collection("Block")
      .doc(data.selectedBlock.id)
      .collection("Parking")
      .get();

    let allParkings = [];
    for (let item of parkings.docs) {
      allParkings.push({ id: item.id, ...item.data() });
    }

    let tempAllParkingBookings = parkingBookings;
    for (let i = 0; i < allParkings.length; i++) {
      for (let j = 0; j < tempAllParkingBookings.length; j++) {
        if (allParkings[i].id === tempAllParkingBookings[j].parkingId) {
          const bookedStart = convertTime(tempAllParkingBookings[j].startTime);
          const bookedEnd = convertTime(tempAllParkingBookings[j].endTime);
          if (!(bookedStart - myEndTime < 0 && bookedEnd - myStartTime > 0)) {
            await handleBooked1(tempAllParkingBookings[j].parkingId);
          } else {
            await handleBooked2(tempAllParkingBookings[j].parkingId);
          }
        }
      }
    }
    getAllParking();
  };

  const handleBooked1 = async pId => {
    await db
      .collection("Block")
      .doc(data.selectedBlock.id)
      .collection("Parking")
      .doc(pId)
      .update({ isBooked: false });
  };

  const handleBooked2 = async pId => {
    await db
      .collection("Block")
      .doc(data.selectedBlock.id)
      .collection("Parking")
      .doc(pId)
      .update({ isBooked: true });
  };

  useEffect(() => {}, [parkingSpots]);

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

  const handleRedirect = () => {
    Alert.alert(
      "Warning",
      "You Did Not Register a vehicle",
      [
        {
          text: "OK",
          onPress: () =>
            props.navigation.navigate(
              "SettingsStack",
              {},
              NavigationActions.navigate({ routeName: "AddVehicle" })
            )
        }
      ],
      { cancelable: false }
    );
  };

  const handleBooking = async item => {
    console.log("item", item);
    const date = `${new Date().getFullYear()}-0${new Date().getMonth() +
      1}-${new Date().getDate()}`;

    if (cars.length !== 0) {
      if (!item.isBooked) {
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
      }
    } else {
      handleRedirect();
    }
  };

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
                  <Text style={styles.text}>{item.name}</Text>
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
