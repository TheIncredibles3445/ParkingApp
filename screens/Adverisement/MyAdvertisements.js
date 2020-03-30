import * as WebBrowser from "expo-web-browser";
import React, { useState, useEffect } from "react";
import {
    Image,
    Platform,
    TextInput,
    Button,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

import firebase from "firebase/app";
import "firebase/auth";
import db from "../../db";

export default function MyAdvertisement(props) {

    const [ads, setAds] = useState([])

    useEffect(() => {
        db.collection("Advertisement").where("uid", "==", firebase.auth().currentUser.uid).onSnapshot(querySnapshot => {
            let ads = [];
            querySnapshot.forEach(doc => {
                ads.push({ id: doc.id, ...doc.data(), isSelected: false });
            });
            setAds([...ads]);
        });
    })

    return (
        <View>
            <Text>My Advertisements</Text>

            {
                ads.map(a =>
                    <TouchableOpacity 
                    onPress={()=>props.navigation.navigate("AdvertisementDetails", {adv : a})}
                    style={a.adStatus == "Pending" ? styles.pending : a.adStatus == "Declined" ? styles.declined : a.adStatus == "Approved" ? styles.approved : null}>
                        
                        <Text>{a.title}</Text>
                    </TouchableOpacity>


                )
            }



        </View>
    );
}
const styles = StyleSheet.create({
   pending:{
    height: 50,
    width: 200,
    fontSize: 20,
    backgroundColor: "#FFFFE0",
    marginBottom: 4,
    marginTop: 4,
    marginRight: "auto",
    marginLeft: "auto",
    alignItems: "center"
   },
   declined:{
    height: 50,
    width: 200,
    fontSize: 20,
    backgroundColor: "#FF4500",
    marginBottom: 4,
    marginTop: 4,
    marginRight: "auto",
    marginLeft: "auto",
    alignItems: "center"
   },
   approved:{
    height: 50,
    width: 200,
    fontSize: 20,
    backgroundColor: "#98FB98",
    marginBottom: 4,
    marginTop: 4,
    marginRight: "auto",
    marginLeft: "auto",
    alignItems: "center"
   },

  });