import { useState, useEffect, useDebugValue } from "react";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  TouchableHighlight,
  Modal,
  Image,
  FlatList, Alert
} from "react-native";
import firebase from "firebase/app";
import "firebase/auth";
import db from "../../db";
import * as ImagePicker from "expo-image-picker";
import DatePicker from "react-native-datepicker";
//import moment, { isMoment } from "moment";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Divider } from "react-native-elements";
import moment from "moment";
import * as Progress from 'react-native-progress';

export default function AdvertismentRequest(props) {

  const [feedback, setFeedback] = useState("");
  const [offerNumber, setOfferNumber] = useState(1);
  const [hasCameraRollPermission, setHasCameraRollPermission] = useState(false);
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [uri, setUri] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [date, setDate] = useState(moment().add(7 , "day"));
  const [offeredAmount, setOfferedAmount] = useState(0);
  const [progress , setProgress] = useState(false)
  const [disableAll , setDisableAll] = useState(true)
  const [submitBtn , setSubmitBtn] = useState(true)

  //handle image
  const askPermission = async () => {
    const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
    setHasCameraRollPermission(status === "granted");
  };
 

  useEffect(() => {
    askPermission(); 
  }, []);

  const handlePickImage = async () => {
    // show camera roll, allow user to select
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    if (!result.cancelled) {
      console.log("not cancelled", result.uri);
      setUri(result.uri);
    }
  };

  const handleSubmit = async () => {
    setDisableAll(true)
    setSubmitBtn(true)
    
      let offerid = 0
      let adv = await db.collection("Advertisement").add({
        uid: firebase.auth().currentUser.uid,
        title : displayName,
        photoURL: "",
        description,
        link,
        startDate,
        endDate,
        offeredAmount,
        feedback,
        offerNumber,
        adStatus: "Pending",
        handledBy:"",
        viewers: 0
      }).then(function(docRef) {
        offerid =  docRef.id;
      });

      db.collection("Advertisement").doc(offerid).collection("offers").doc("1").set({ date: moment().format() ,startDate,
        endDate,
        offeredAmount,
      feedback: "" })

      let URL = ""
    if (uri !== "") {
      const response = await fetch(uri);
      console.log("fetch result", JSON.stringify(response));

      const blob = await response.blob();
      const putResult = await firebase
        .storage()
        .ref()
        .child(`/ads/${firebase.auth().currentUser.uid}${offerid}`)
        .put(blob);

      const url = await firebase
        .storage()
        .ref()
        .child(`/ads/${firebase.auth().currentUser.uid}${offerid}`)
        .getDownloadURL();
      console.log("download url", url);

      setPhotoURL(url);
      URL = url
    }
    db.collection("Advertisement").doc(offerid).update({ photoURL : URL})

    Alert.alert(`Your Request Has Been Send To The Admin`);

    props.navigation.navigate("Home")
   
  };

  useEffect(()=>{
    if(startDate && endDate && description && link && uri && link && displayName && offeredAmount){
        setSubmitBtn(false)
    }
    else{
      setSubmitBtn(true)
    }
  },[startDate , endDate, description , link , uri , link , displayName , offeredAmount])

  return (
    <View style={{ paddingTop:20}}>
    
           
            <View style={{ flexDirection: "row",marginBottom: 8,paddingLeft: 15 }}>
              <Text
                style={styles.label}
              >
                Title
              </Text>
              <TextInput
                style={styles.input}
                onChangeText={text => setDisplayName(text)}
                placeholder="Advertiser name"
                editable={disableAll}
                //  value={displayName}
                
              />
            </View>

            <View style={{ flexDirection: "row",marginBottom: 8,paddingLeft: 15 }}>
              <Text
                style={styles.label}
              >
                Description
              </Text>
              <ScrollView>
                <TextInput
               
                  multiline={true}
                  numberOfLines={30}
                  style={{
                    //width: "100%",
                    height: 130,
                    borderColor:"#284057", borderWidth: 1, width: "85%" ,backgroundColor:"white", paddingLeft: 7
                  }}
                  onChangeText={text => setDescription(text)}
                  placeholder="Description"
                  editable={disableAll}
                  //value={description}
                />
              </ScrollView>
            </View>

            <View style={{ flexDirection: "row",marginBottom: 8,paddingLeft: 15 }}>
              <Text
                style={styles.label}
              >
                Link
              </Text>
              <TextInput
                style={styles.input}
                onChangeText={text => setLink(text)}
                placeholder="Link"
                editable={disableAll}
                //value={link}
              />
            </View>

           
            <View
              style={{ width: "30%", marginLeft: "35%", marginBottom: "2%" }}
            >
              <Button title="Pick Image" onPress={handlePickImage} />
            </View>

            <View style={{ flexDirection: "row",marginBottom: 8,paddingLeft: 15 }}>
              <Text
                style={styles.label}
              >
                Start Date
              </Text>
              <DatePicker
                 style={styles.input}
                mode="date"
                placeholder="Select Start Date"
                format="YYYY-MM-DD"
                minDate={date}
                //maxDate="2020-03-23"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateIcon: {
                    position: "absolute",
                    left: 0,
                    top: 4,
                    marginLeft: 0
                  },
                  dateInput: {
                    marginLeft: 36
                  }
                }}
                onDateChange={startDate => setStartDate(startDate)}
                disabled={!disableAll}
                
              />
            </View>
          
            <View style={{ flexDirection: "row",marginBottom: 8,paddingLeft: 15 }}>
              <Text
                style={styles.label}
              >
                End Date
              </Text>
              <DatePicker
                 style={styles.input}
                date={endDate}
                mode="date"
                placeholder="Select End Date"
                format="YYYY-MM-DD"
                minDate={moment(startDate).add(7 , "day")}
                // maxDate="2016-06-01"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateIcon: {
                    position: "absolute",
                    left: 0,
                    top: 4,
                    marginLeft: 0
                  },
                  dateInput: {
                    marginLeft: 36
                  }
                }}
                onDateChange={endDate => setEndDate(endDate)}
                disabled={!startDate}

              />
            </View>

            <View style={{ flexDirection: "row",marginBottom: 8,paddingLeft: 15 }}>
              <Text
                style={styles.label}
              >
                Offered Amount
              </Text>
              <TextInput
                require
                style={styles.input}
                onChangeText={text => setOfferedAmount(text)}
                placeholder="Offered Amount"
                // value={offeredAmount}
                keyboardType={"numeric"}
                numeric
                editable={disableAll} 
              />
            </View>
            <View
              style={{ width: "30%", marginLeft: "63%", marginBottom: "2%" , marginTop: "5%"}}
            >
              <Button
                disabled={submitBtn}
                color="green"
                title="Submit"
                onPress={() => handleSubmit()}
               // disabled={disableAll}
              />
      
            </View>

 
              
          </View>
       
  );
};

AdvertismentRequest.navigationOptions = {
  title: "Advertisement Requests",
  headerStyle: { backgroundColor: "#5a91bf" },
  headerTitleStyle: {
    color: "white"
  }
};
//
const styles = StyleSheet.create({
  input: { height: 40, borderColor:"#284057", borderWidth: 1, width: "60%" ,backgroundColor:"white", paddingLeft: 7},
  label: { fontSize: 15, color: "#284057", width: "30%",fontWeight:"bold" }
}) 
