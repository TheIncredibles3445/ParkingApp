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
import db from "../../db.js";

export default function  AdminAdvertisementDetails(props) {

    const adv = props.navigation.getParam('adv', 'some default value');
    useEffect(()=>{

    })

    const handleAdv = async()=>{
        db.collection("Advertisement").doc(adv.id).update({ handledBy: firebase.auth().currentUser.uid})
        props.navigate.navigation("Adv")
    }

    return(
        <View>
            <Text>Details</Text>

    <Text>{adv.title}</Text>
    { adv.adStatus === "Pending" && adv.handledBy === "" ? <Button title="Handle" onPress={()=> handleAdv()} /> : null}
        </View>
    )
}