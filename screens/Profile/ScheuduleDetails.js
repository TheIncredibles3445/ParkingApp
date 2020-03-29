import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform
} from "react-native";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/functions";
import db from "../../db";
import { Input, Text, Divider, Button } from "react-native-elements";

export default function ScheduleDetails(props) {
    const booking = props.navigation.getParam('booking', 'some default value');
    const serviceBooking = props.navigation.getParam('serviceBooking', 'some default value');
    const [name , setName] = useState()
    const [block, setBlock] = useState()
    const [parking, setParking] = useState()
    const [user, setUser]= useState()
    const [rating , setRating] = useState()
    const [dateTime, setDateTime] = useState()

    useEffect(()=>{
        getDetails()
    })

    const getDetails = async () => {
        console.log("valie in the props", booking , serviceBooking)
        let bookingDB = await db.collection("booking").doc(booking).collection("service_booking").doc(serviceBooking).get()
        console.log("the booking id --->",bookingDB.data())
        let service = await db.collection("service").doc(bookingDB.data().service_id).get()
        console.log("the service",service.data().Name)
        let bookingUser = await db.collection("booking").doc(booking).get()
        let theUser = await db.collection("users").doc(bookingUser.data().userId).get()
        setName(service.data().Name)
        setBlock(bookingDB.data().block)
        setParking(bookingDB.data().parking)
        setUser(theUser.data().email)
        setDateTime(bookingDB.data().time)
    }

    return(
        <View style={styles.container}>
            <Text>Schedule Details</Text>
            <View style={styles.box}>
            <Text style={styles.user}>User</Text>
            <Text style={styles.user}>{user}</Text>
            </View>

            <View style={styles.box}>
            <Text style={styles.user}>Parking Block</Text>
            <Text style={styles.user}>{block}</Text>
            </View>

            <View style={styles.box}>
            <Text style={styles.user}>Parking Spot</Text>
            <Text style={styles.user}>{parking}</Text>
            </View>

            <View style={styles.box}>
            <Text style={styles.user}>Service</Text>
            <Text style={styles.user}>{name}</Text>
            </View>

            <View style={styles.box}>
            <Text style={styles.user}>Date & Time</Text>
            <Text style={styles.user}>{dateTime}</Text>
            </View>

            {/*
               *****  ADD RATING *****
            <View style={styles.box}>
            <Text style={styles.user}>User</Text>
            <Text style={styles.user}>{user}</Text>
            </View> */}

        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
    head: { height: 40, backgroundColor: '#f1f8ff' },
    text: { margin: 6 },
    box: {
        backgroundColor: "#FFFAFA", padding: 5, flexDirection: "row", borderBottomColor: "#DCDCDC",
        borderBottomWidth: 1,
    },
    user: { backgroundColor: "#F0FFF0", padding: 5, width: "50%", alignItems: "center" },
    search: { backgroundColor: "#DCDCDC", padding: 5, width: "50%", alignItems: "center" }
});