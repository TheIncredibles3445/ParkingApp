//@refresh restart
import React, { useEffect, useState , useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  AsyncStorage
} from "react-native";
import { NavigationActions } from "react-navigation";
import moment from "moment";
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from "react-native-maps";
import db from "../db";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/functions";
import { getAutoFocusEnabled } from "expo/build/AR";

export default function FindParkings(props) {

  const [parkingSpots, setParkingSpots] = useState([]);
  const [cars, setCars] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [block, setBlock] = useState([]);
  const [update, setUpdate] = useState(false);
  const nearby = useRef()
  //const [buildings , setBuildings] = useState([])
  useEffect(() => {
    getBuildings()
  }, [])

  const getBuildings = () => {
    db.collection("buildings").onSnapshot(querySnapshot => {
      let buildings = [];

      querySnapshot.forEach(doc => {
        buildings.push({ id: doc.id, ...doc.data(), isSelected: false });
      });
      setBuildings([...buildings]);
    });
    db.collection("block").onSnapshot(querySnapshot => {
      let block = [];

      querySnapshot.forEach(doc => {
        block.push({ id: doc.id, ...doc.data()});
      });
      setBlock([...block]);
    }); 

  }

  const getBlocks = () =>{

  }

  useEffect(() => {
    setUpdate(!update)
    console.log(" all locations", buildings)
    console.log("the blocks", block)
  }, [buildings,block])

  useEffect(() => {
    setUpdate(!update)
  
    console.log("all free parking spots", parkingSpots)
  }, [parkingSpots])

  const selectBuilding = async (building) => {
     console.log("select building")
     //filter block where nearby == building
     let finalBlocks = []
     for( let i=0 ; i < block.length ; i++){
      let temp = block[i].nearby.filter( b => b == building.location)
      if(temp.length > 0){
        finalBlocks.push(block[i])
      }
     }
     nearby.current = finalBlocks
     console.log(" all nearby == ", nearby.current)
     //get parkings of blocks
  }

  return (
    <View>
      <Text>Find A Parking Spot</Text>
      <MapView
        initialRegion={{
          latitude: 25.360664,
          longitude: 51.4788863,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01
        }}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
      >
        {
          buildings ?
            buildings.map((b, index) =>
              <Marker
                key={index}
                coordinate={{
                  latitude: b.latitude,
                  longitude: b.longitude
                }}
                onPress={() => selectBuilding(b)}
              ><View
                style={styles.unBookedMarker} >

                  <Text style={styles.text}>{b.location}</Text>

                </View></Marker>
            )
            :

            null

        }


      </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  map: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: 300,
    flex: 1

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