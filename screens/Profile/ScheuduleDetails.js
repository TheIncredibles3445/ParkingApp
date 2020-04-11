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
import * as Progress from 'react-native-progress';
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
        <View style={{backgroundColor: "#F0F8FF", height:"100%", paddingTop: 10 }}>
            <View style={{padding:10,borderColor:"#B0C4DE",borderWidth:3 , backgroundColor:"white" ,
             width:"80%" ,marginRight:"auto", marginLeft:"auto" , height:"80%", marginTop:10}}>


        <View style={styles.box}>
            <Text style={{width:"50%",fontSize:15 , fontWeight:"bold", color:"#396a93"}}>User</Text>
             <Text style={{width:"50%",fontSize:15 , fontWeight:"bold"}}>{user}</Text>
           
            </View>

            <View style={styles.box}>
            <Text style={{width:"50%",fontSize:15 , fontWeight:"bold", color:"#396a93"}}>Parking Block</Text>
            <Text style={{width:"50%",fontSize:15 , fontWeight:"bold"}}>{block}</Text>
            </View>

            <View style={styles.box}>
            <Text style={{width:"50%",fontSize:15 , fontWeight:"bold", color:"#396a93"}}>Parking Spot</Text>
            <Text style={{width:"50%",fontSize:15 , fontWeight:"bold"}}>{parking}</Text>
            </View>

            <View style={styles.box}>
            <Text style={{width:"50%",fontSize:15 , fontWeight:"bold", color:"#396a93"}}>Service</Text>
            <Text style={{width:"50%",fontSize:15 , fontWeight:"bold"}}>{name}</Text>
            </View>

            <View style={styles.box}>
            <Text style={{width:"50%",fontSize:15 , fontWeight:"bold", color:"#396a93"}}>Date & Time</Text>
            <Text style={{width:"50%",fontSize:15 , fontWeight:"bold"}}>{dateTime}</Text>
            </View>


             </View>
            

            {/* <View style={{padding:10,borderColor:"#B0C4DE",borderWidth:3 , backgroundColor:"white" , width:"80%" ,marginRight:"auto", marginLeft:"auto" , height:"20%"}}>
            <View style={styles.box}>
                <Text style={{width:"50%",fontSize:15 , fontWeight:"bold", color:"#396a93"}}>Name</Text>
                <Text style={{width:"50%",fontSize:15 , fontWeight:"bold"}}>{user.displayName}</Text>
            </View>
            <View style={styles.box}>
                <Text style={{width:"50%",fontSize:15 , fontWeight:"bold", color:"#396a93"}}>Email</Text>
                <Text style={{width:"50%",fontSize:15 , fontWeight:"bold"}}>{user.email}</Text>
            </View>
            <View style={styles.box}>
                <Text style={{width:"50%",fontSize:15 , fontWeight:"bold", color:"#396a93"}}>Rating</Text>
                <Text style={{width:"50%",fontSize:15 , fontWeight:"bold"}}>4</Text>
            </View>
            </View>

            <View style={{ flexDirection:"row" , marginTop:"2%", marginBottom:"2%" , justifyContent:"center"}}>
                <View style={{ padding: 5,  alignItems: "center" }}>
                    <Button color={ show == "H"? "#008B8B" :"#A9A9A9"} title="History" onPress={() => setShow("H")} />
                </View>
                <View style={{ padding: 5, alignItems: "center" }}>
                    <Button color={ show == "T"? "#008B8B" :"#A9A9A9"} title="Today" onPress={() => setShow("T")} />
                </View>

            </View> */}

            {/*
               *****  ADD RATING *****
            <View style={styles.box}>
            <Text style={styles.user}>User</Text>
            <Text style={styles.user}>{user}</Text>
            </View> */}

        </View>
    )
}
ScheduleDetails.navigationOptions = {
    title: 'Deatils',
    headerStyle:{ backgroundColor:"#5a91bf" },
    headerTitleStyle:{
        color: "white"}
  
};
const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
    head: { height: 40, backgroundColor: '#f1f8ff' },
    text: { margin: 6 },
    box: {
        backgroundColor: "#FFFAFA", padding: 5, flexDirection: "row", borderBottomColor: "#DCDCDC",
        borderBottomWidth: 1, height:"20%"
    },
    user: { backgroundColor: "#F0FFF0", padding: 5, width: "50%", alignItems: "center" },
    search: { backgroundColor: "#DCDCDC", padding: 5, width: "50%", alignItems: "center" }
});