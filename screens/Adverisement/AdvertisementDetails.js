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


export default function AdvertisementDetails (props) {


  const item = props.navigation.getParam("adv", "some default value");


  return (
    <View>
      <Text>Advertisement Details </Text>

      <Text  style={item.adStatus == "Pending" ? styles.pending : item.adStatus == "Declined" ? styles.declined : item.adStatus == "Approved" ? styles.approved : null}>
        Status: {item.adStatus}
      </Text>
      <Text style={{ marginLeft: 10, marginRight: 30 }}>
        Advertiser Name: {item.title}
      </Text>
      <Text style={{ marginLeft: 10, marginRight: 30 }}>
        Description: {item.description}
      </Text>
      <Text style={{ marginLeft: 10, marginRight: 30 }}>
        Link: {item.link}
      </Text>
      <Text style={{ marginLeft: 10, marginRight: 30 }}>
        Image: {item.photoURL}
      </Text>
      <Text style={{ marginLeft: 10, marginRight: 30 }}>
        Start Date: {item.endDate}
      </Text>
      <Text style={{ marginLeft: 10, marginRight: 30 }}>
        End Date: {item.startDate}
      </Text>
      <Text style={{ marginLeft: 10, marginRight: 30 }}>
        Offered Amount: {item.offeredAmount}
      </Text>



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