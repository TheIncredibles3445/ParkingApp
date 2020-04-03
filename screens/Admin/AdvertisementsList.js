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

export default function AdvertisementList (props) {
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
    
  }
  
  const adStatus = (s) =>{
    //setAds([])
    setShowBtn(false)
    let temp = all
    temp = temp.filter( t => t.adStatus == s) 
    showAdv.current = temp
  }

  const newAds = () =>{
    setShowBtn(false)
    let temp = all
    temp = temp.filter( t => t.handledBy == "")
    showAdv.current = temp
  }

  const active = () =>{
    setShowBtn(false)
    let temp = all
    //temp = temp.filter( t => t.adStatus == "Declined")
    showAdv.current = temp
  }
  const pending = () =>{
    setShowBtn(false)
    let temp = all
    temp = temp.filter( t => t.adStatus == "Pending" && t.handledBy == firebase.auth().currentUser.uid)
    showAdv.current = temp
  }

  return(
      <View>

      </View>
  )
}
