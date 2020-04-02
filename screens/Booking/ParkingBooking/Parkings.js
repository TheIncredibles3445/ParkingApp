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
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from "react-native-maps";
import db from "../../../db";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/functions";

export default function Parking(props) {
  const data = props.navigation.getParam("data", "No params");
  const friend = props.navigation.getParam("friend", "No params");
  const [parkingSpots, setParkingSpots] = useState([]);
  const [cars, setCars] = useState([]);
  const [parkingBookings, setParkingBookings] = useState([]);
  const [flag, setFlag] = useState(false);
  // const [token, setToken] = useState(null);
  useEffect(() => {
    getAllParking();
  }, []);

  const getAllParking = () => {
    const bookingsRef = db.collection("booking");
    bookingsRef
      .where("date", "==", moment().format("YYYY-MM-DD"))
      .where("type", "==", "Parking")
      .onSnapshot(querySnapShot => {
        let p = [];
        let filteredParking = [];
        for (let booking of querySnapShot.docs) {
          bookingsRef
            .doc(booking.id)
            .collection("parking_booking")
            .onSnapshot(async querySnap => {
              for (let parkingBooking of querySnap.docs) {
                p.push({ id: parkingBooking.id, ...parkingBooking.data() });
              }
              if (p.length === querySnapShot.docs.length) {
                const myStartTime = convertTime(data.startTime);
                const myEndTime = convertTime(data.endTime);
                filteredParking = p.filter(item => {
                  const bookedStart = convertTime(item.startTime);
                  const bookedEnd = convertTime(item.endTime);
                  if (
                    !(
                      bookedStart - myEndTime < 0 && bookedEnd - myStartTime > 0
                    )
                  ) {
                  } else {
                    return item;
                  }
                });

                const parkingIds = [];
                console.log("filteredParking ==>", filteredParking);
                filteredParking.map(item => parkingIds.push(item.parkingId));

                db.collection("Block")
                  .doc(data.selectedBlock.id)
                  .collection("Parking")
                  .onSnapshot(querySnapShot => {
                    const parkings = [];
                    querySnapShot.forEach(docum => {
                      let park = docum.data();
                      if (parkingIds.includes(docum.id)) {
                        park.isBooked = true;
                      } else {
                        park.isBooked = false;
                      }
                      parkings.push({ id: docum.id, ...park });
                    });
                    setParkingSpots([...parkings]);
                  });
              }
            });
        }
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
        if (friend != null) {
          db.collection("booking")
            .add({
              date: date,
              total_price: item.price,
              type: "Parking",
              userId: friend
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
          let user = await db
            .collection("users")
            .doc(friend)
            .get();
          let dbpendingAmount = parseInt(
            user.data().pendingAmount + parseInt(item.price)
          );
          db.collection("users")
            .doc(friend)
            .update({ pendingAmount: dbpendingAmount });
          props.navigation.navigate("HomeScreen");
        } else {
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
          props.navigation.navigate("Checkout");
        }

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
