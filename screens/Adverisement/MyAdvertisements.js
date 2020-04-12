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
        <View style={styles.container}>
            <Text style={{ marginLeft: "auto", marginRight: "auto", fontSize: 30, color: "#284057", marginBottom: "5%"  }}>My Advertisements</Text>
            <ScrollView style={{
            marginTop: "2%"
          }}>
            {
                ads.map(a =>
                    <TouchableOpacity 
                    onPress={()=>props.navigation.navigate("AdvertisementDetails", {adv : a})}
                   
                    style={styles.list}>
                        
                <Text style={{fontSize: 20,color: "#40668c", fontWeight:"bold"}}>Title: {a.title}</Text>
                <Text style={{fontSize: 15,color: "#40668c",}}>ID: {a.id} </Text>
                <Text style={{fontSize: 15,color: "#40668c",}}>Status: {a.adStatus}</Text>
                    </TouchableOpacity>


                )
            }
            </ScrollView>
{/* 
{
        showAdv.current && showAdv.current.length > 0 ?
          <ScrollView style={{
            marginTop: "2%"
          }}>

            {

              showAdv.current.map(a =>

                <TouchableOpacity style={{
                   height: 80
                }} onPress={() => props.navigation.navigate("AdminAdvDetails", { adv: a })} >
                  <Text style={styles.list}>Title: {a.title} {"\n"} ID: {a.id}</Text></TouchableOpacity>

              )}
              


          </ScrollView>
          : <Text style={{ fontSize: 20 }}>NO ADVERISEMENTS IN THIS SECTION!</Text>
      } */}



        </View>
    );
}
MyAdvertisement.navigationOptions = {
    title: 'Advertisements',
    headerStyle: { backgroundColor: "#5a91bf" },
    headerTitleStyle: {
      color: "white"
    }
  };
const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#F5FCFF' },
   pending:{
    height: 80,
    width: "80%",
    fontSize: 20,
    //backgroundColor: "#FFFFE0",
    marginBottom: 4,
    marginTop: 4,
    marginRight: "auto",
    marginLeft: "auto",
    alignItems: "center"
   },
   declined:{
    height: 80,
    width: "80%",
    fontSize: 20,
    //backgroundColor: "#FF4500",
    marginBottom: 4,
    marginTop: 4,
    marginRight: "auto",
    marginLeft: "auto",
    alignItems: "center"
   },
   approved:{
    height: 80,
    width: "80%",
    fontSize: 20,
    //backgroundColor: "#98FB98",
    marginBottom: 4,
    marginTop: 4,
    marginRight: "auto",
    marginLeft: "auto",
    alignItems: "center"
   },
   list: {
     backgroundColor: "#eef2f7",
     padding: 5,
     width: "80%",
     marginBottom: 4,
     height: 40,
     
     borderColor: "#40668c",
     borderWidth: 1,
     height: 90,
     borderRadius: 5, paddingLeft: "5%",  fontWeight: "bold", fontSize: 17, marginLeft: "auto", marginRight: "auto"
   },

  });