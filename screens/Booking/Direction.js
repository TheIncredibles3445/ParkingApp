import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-elements";
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from "react-native-maps";
import db from "../../db";
import firebase from "firebase/app";
import "firebase/auth";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";

export default function Direction(props) {
  const blockId = props.navigation.getParam("blockId", "2NY04zHOtojiXfNKQyAU");
  const parkingId = props.navigation.getParam(
    "parkingId",
    "6Huqq5waKBehjQ9MHboL"
  );

  const [directions, setDirections] = useState([]);
  const api = "5b3ce3597851110001cf6248267b8b98f368411ebff98ddcdef0d186";
  const apiKey = "AIzaSyCKP2xT_4a4pgceP8EokUKB7mnJ_S5BPEI";

  useEffect(() => {
    getDirections();
  }, []);



  const getDirections = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      alert("Permission Denied");
    }

    let location = await Location.getCurrentPositionAsync({
      enableHighAccuracy: false
    });
    console.log("location, ", location);
    const userLocation = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    };

    const parkingLocation = (
      await db
        .collection("block")
        .doc(blockId)
        .collection("parking")
        .doc(parkingId)
        .get()
    ).data();

    const request = await fetch(
      `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${api}&start=${userLocation.longitude},${userLocation.latitude}&end=${parkingLocation.location.longitude},${parkingLocation.location.latitude}`
    );
    const json = await request.json();

    const coordinate = json.features[0].geometry.coordinates;
    convertArrayToObject(coordinate);
    console.log("coordinates", coordinate);
  };

  const convertArrayToObject = coordinates => {
    const result = [];
    coordinates.map(item => {
      // item.map(dir => {
      //   const direct = { latitude: dir[0], longitude: dir[1] };
      //   console.log(direct);
      // });

      const direct = { latitude: item[1], longitude: item[0] };
      //console.log(item[0]);
      result.push(direct);
    });
    setDirections(result);
  };

  return (
    <MapView
      initialRegion={{
        latitude: 25.286106,
        longitude: 51.534817,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08
      }}
      provider={PROVIDER_GOOGLE}
      style={styles.map}
    >
      {directions && <Marker coordinate={directions[0]}></Marker>}
      {directions && (
        <Marker coordinate={directions[directions.length - 1]}></Marker>
      )}
      {directions && (
        <Polyline
          coordinates={directions}
          strokeColor="#0000FF" // fallback for when `strokeColors` is not supported by the map-provider
          strokeWidth={5}
        />
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
});

Direction.navigationOptions = props => ({
  headerTitle: "Direction"
  //   headerRight: () => <Button title="Home" type="clear" />
});
