
import React, { useState, useEffect, useRef } from "react";
import {
  Image,
  Platform,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollViewBase
} from "react-native";
import firebase from "firebase/app";
import "firebase/auth";
import db from "../../db.js";

export default function AdminAdvertisement(props) {
  const [usersAdsRequest, setUsersAdsRequest] = useState([]);
  const [ads, setAds] = useState([])
  const [all, setAll] = useState([])
  const [showBtn, setShowBtn] = useState(false)
  const showAdv = useRef()
  const [update, setUpdate] = useState(true)

  useEffect(() => {
    getAds()
  }, [])

  const getAds = async () => {

    db.collection("Advertisement").get()
      .then(querySnapshot => {
        let ads = [];
        querySnapshot.forEach(doc => {
          ads.push({ id: doc.id, ...doc.data() });
        });
        setAds([...ads]);

      });
    //setAll(ads)
    console.log("ads are", ads)

  }

  const adStatus = (s) => {
    getAds()
    let temp = ads
    temp = temp.filter(t => t.adStatus == s)
    showAdv.current = temp
  }

  const newAds = () => {
    getAds()
    let temp = ads
    temp = temp.filter(t => t.handledBy == "")
    showAdv.current = temp
  }

  const active = () => {
    getAds()
    let temp = ads
    temp = temp.filter(t => new Date(t.startDate).getTime() <= new Date().getTime() && new Date().getTime() <= new Date(t.endDate).getTime())
    showAdv.current = temp
  }
  const pending = () => {
    getAds()
    let temp = ads
    temp = temp.filter(t => t.adStatus == "Pending" && t.handledBy == firebase.auth().currentUser.uid)
    showAdv.current = temp
  }

  return (
    <View style={styles.container}>

      <View style={{ marginBottom: "5%" }}>
        <View style={styles.box2}>
          <TouchableOpacity onPress={() => active()} style={styles.btns2}><Text style={styles.text}>Active</Text></TouchableOpacity>

          <TouchableOpacity onPress={() => newAds()} style={styles.btns2}><Text style={styles.text}>New Request</Text></TouchableOpacity>
        </View>

        <View style={styles.box}>
          <TouchableOpacity onPress={() => adStatus("Approved")} style={styles.btns}><Text style={styles.text}>Approved</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => adStatus("Declined")} style={styles.btns}><Text style={styles.text}>Declined</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => pending()} style={styles.btns}><Text style={styles.text}>Pending</Text></TouchableOpacity>
        </View>

      </View>

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
      }


    </View>
  );
}

AdminAdvertisement.navigationOptions = {
  title: "Advertisements",
  headerStyle: { backgroundColor: "#5a91bf" },
  headerTitleStyle: {
    color: "white"
  }

};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#F5FCFF' },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { fontSize: 20, color: "#F0FFFF" },
  box: {
    borderColor: "#B0C4DE",
    borderBottomWidth: 4, backgroundColor: "#F5FCFF", flexDirection: "row", alignItems: "center", padding: 6
  },
  box2: { backgroundColor: "#F5FCFF", flexDirection: "row", padding: 6, alignItems: "center" },
  btns: {
    backgroundColor: "#B0C4DE",
    padding: 5,
    width: "30%",
    marginLeft: 10,
    height: 50,
    fontSize: 20,
    borderColor: "black",
    borderRadius: 5, alignItems: "center"
  },
  btns2: {
    backgroundColor: "#B0C4DE",
    padding: 5,
    width: "46%",
    marginLeft: 10,
    height: 50,
    fontSize: 20,
    borderRadius: 5, alignItems: "center"
  },
  list: {
    backgroundColor: "#eef2f7",
    padding: 5,
    width: "80%",
    //marginBottom: 4,
    height: 40,
    fontSize: 15,
    borderColor: "#40668c",
    borderWidth: 1,
    height: "90%",
    borderRadius: 5, paddingLeft: "5%", color: "#40668c", fontWeight: "bold", fontSize: 17, marginLeft: "auto", marginRight: "auto"
  },
  search: { backgroundColor: "#DCDCDC", padding: 5, width: "50%", alignItems: "baseline" }
});
