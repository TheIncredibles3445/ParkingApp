
import React, { useState, useEffect , useRef } from "react";
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
import { getAutoFocusEnabled } from "expo/build/AR";

export default function AdminAdvertisement (props) {
  const [usersAdsRequest, setUsersAdsRequest] = useState([]);
  const [ads, setAds] = useState([])
  const [all , setAll] = useState([])
  const [showBtn , setShowBtn] = useState(true)
  const showAdv  = useRef()
  const [update , setUpdate] = useState(true)

  useEffect(() => {

    getAds()
    
  })
  const getAds = ()=>{
    db.collection("Advertisement").onSnapshot(querySnapshot => {
      let ads = [];
      querySnapshot.forEach(doc => {
        ads.push({ id: doc.id, ...doc.data() });
      });
      setAds([...ads]);
      
    });
    setAll(ads)
  }

  useEffect(()=>{
    setUpdate(!update)
  },[showAdv.current])

  useEffect(()=>{

  },[update])

  const declined = async() =>{
    setAds([])
    let temp = all
    temp = temp.filter( t => t.adStatus == "Declined")
    
    showAdv.current = temp
    console.log("decline result",showAdv.current)
  }

  const newAds = () =>{
    let temp = all
    temp = temp.filter( t => t.handledBy == "")
    showAdv.current = temp
  }
  const approved = () =>{
    let temp = all
    temp = temp.filter( t => t.adStatus == "Approved")
    showAdv.current = temp
  }
  const active = () =>{
    let temp = all
    //temp = temp.filter( t => t.adStatus == "Declined")
    showAdv.current = temp
  }
  const pending = () =>{
    let temp = all
    temp = temp.filter( t => t.adStatus == "Pending" && t.handledBy == firebase.auth().currentUser.uid)
    showAdv.current = temp
  }

  return (
    <View style={styles.container}>
      {
        showBtn ? 
        <View>
          <TouchableOpacity onPress={()=>declined() || setShowBtn(false)} style={styles.btn}><Text style={styles.text}>Declined</Text></TouchableOpacity>
         <TouchableOpacity onPress={()=>newAds()|| setShowBtn(false)} style={styles.btn}><Text style={styles.text}>New Requests</Text></TouchableOpacity>
         <TouchableOpacity onPress={()=>approved() || setShowBtn(false)} style={styles.btn}><Text style={styles.text}>Approved</Text></TouchableOpacity>
         <TouchableOpacity onPress={()=>active() || setShowBtn(false)} style={styles.btn}><Text style={styles.text}>Active</Text></TouchableOpacity>
         <TouchableOpacity onPress={()=>pending() || setShowBtn(false)} style={styles.btn}><Text style={styles.text}>Pending</Text></TouchableOpacity> 
         </View>
        :
        <View>
          {
        showAdv.current.map( a =>
          
          <TouchableOpacity onPress={()=>props.navigation.navigate("AdminAdvDetails", {adv: a})} style={styles.btn}><Text>{a.title}</Text></TouchableOpacity>
          
        )  }
        <Button title="Go Back" onPress={()=>setShowBtn(true)} />
          </View>   
      }

    </View>
  );
}


AdminAdvertisement.navigationOptions = {
  title: "Advertisements"
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff', alignItems: "center" },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { fontSize: 20 , color : "#F0FFFF"},
 // box: { backgroundColor: "#FFFAFA", padding: 5, flexDirection: "row" },
  btn: {
    backgroundColor: "#5F9EA0",
    padding: 5, 
    width: "50%",
    alignItems: "center",
    marginBottom: 30,
    height: 50,
    fontSize: 20,
    borderColor: "black",
    //borderWidth: 1,
    //borderRadius: 10
    
  },
  addList: {
    backgroundColor: "#F5F5DC",
    padding: 5, 
    width: "50%",
    alignItems: "center",
    //marginBottom: 30,
    height: 50,
    fontSize: 15,
    borderColor: "black",
    //borderWidth: 1,
    //borderRadius: 10
    
  },
  search: { backgroundColor: "#DCDCDC", padding: 5, width: "50%", alignItems: "center" }
});
