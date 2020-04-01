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
  FlatList
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

export default FriendsScreen = props => {
  const [adStatus, setAdStatus] = useState("");
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
    if (uri !== "") {
      const response = await fetch(uri);
      console.log("fetch result", JSON.stringify(response));

      const blob = await response.blob();
      const putResult = await firebase
        .storage()
        .ref()
        .child(firebase.auth().currentUser.uid)
        .put(blob);

      const url = await firebase
        .storage()
        .ref()
        .child(firebase.auth().currentUser.uid)
        .getDownloadURL();
      console.log("download url", url);

      setPhotoURL(url);
    }


      let offerid = 0
      let adv = await db.collection("Advertisement").add({
        uid: firebase.auth().currentUser.uid,
        title : displayName,
        photoURL,
        description,
        link,
        startDate,
        endDate,
        offeredAmount,
        feedback,
        offerNumber,
        adStatus: "Pending",
        handledBy:""
      }).then(function(docRef) {
        offerid =  docRef.id;
      });

      db.collection("Advertisement").doc(offerid).collection("offers").doc("1").set({ date: moment().format() ,startDate,
        endDate,
        offeredAmount })

    alert(`Dear ${displayName} ,
    Your form has been send to the admin`);

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
    <View>
    
            <Text
              style={{
                marginBottom: 10,
                fontSize: 20,
                marginLeft: "auto",
                marginRight: "auto"
              }}
            >
              Advertisment Form
            </Text>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  marginBottom: 10,
                  fontSize: 15,
                  marginRight: 4,
                  marginTop: 8
                }}
              >
                Title
              </Text>
              <TextInput
                style={{
                  width: "70%",
                  height: 40,
                  borderColor: "gray",
                  borderWidth: 1,
                  marginLeft: "10%",
                  marginBottom: "3%"
                }}
                onChangeText={text => setDisplayName(text)}
                placeholder="Advertiser name"
                editable={disableAll}
                //  value={displayName}
                
              />
            </View>

            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  marginBottom: 10,
                  fontSize: 15,
                  marginRight: 4,
                  marginTop: 8
                }}
              >
                Description
              </Text>
              <ScrollView>
                <TextInput
               
                  multiline={true}
                  numberOfLines={30}
                  style={{
                    width: "90%",
                    height: 130,
                    borderColor: "gray",
                    borderWidth: 1,
                    marginLeft: "1%",
                    textAlignVertical: "top",
                    marginBottom: "4%"
                  }}
                  onChangeText={text => setDescription(text)}
                  placeholder="Description"
                  editable={disableAll}
                  //value={description}
                />
              </ScrollView>
            </View>

            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  marginBottom: 10,
                  fontSize: 15,
                  marginRight: 4,
                  marginTop: 8
                }}
              >
                Link
              </Text>
              <TextInput
                style={{
                  width: "70%",
                  height: 40,
                  borderColor: "gray",
                  borderWidth: 1,
                  marginLeft: "13%",
                  marginBottom: "3%"
                }}
                onChangeText={text => setLink(text)}
                placeholder="Link"
                editable={disableAll}
                //value={link}
              />
            </View>

           
            <View
              style={{ width: "73%", marginLeft: "20%", marginBottom: "2%" }}
            >
              <Button title="Pick Image" onPress={handlePickImage} />
            </View>

            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  marginBottom: 10,
                  fontSize: 15,
                  marginRight: 4,
                  marginTop: 8
                }}
              >
                Start Date
              </Text>
              <DatePicker
                style={{ width: 200, marginLeft: "2%", marginBottom: "2%" }}
                date={startDate}
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
          
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  marginBottom: 10,
                  fontSize: 15,
                  marginRight: 4,
                  marginTop: 8
                }}
              >
                End Date
              </Text>
              <DatePicker
                style={{ width: 200, marginBottom: "2%", marginLeft: "4%" }}
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

            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  marginBottom: 10,
                  fontSize: 15,
                  marginRight: 4,
                  marginTop: 8
                }}
              >
                Offered Amount
              </Text>
              <TextInput
                require
                style={{
                  width: "62%",
                  height: 40,
                  borderColor: "gray",
                  borderWidth: 1,
                  marginLeft: "1%",
                  marginBottom: "2%"
                }}
                onChangeText={text => setOfferedAmount(text)}
                placeholder="Offered Amount"
                // value={offeredAmount}
                keyboardType={"numeric"}
                numeric
                editable={disableAll} 
              />
            </View>
            <View
              style={{ width: "30%", marginLeft: "63%", marginBottom: "2%" }}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#fff"
  },
  num: {
    borderColor: "black",
    borderWidth: 1.1,
    marginLeft: "60%",
    width: 100,
    height: 35,
    backgroundColor: "lightblue"
  },
  num2: {
    borderColor: "black",
    borderWidth: 1.1,
    width: 100,
    height: 35,
    backgroundColor: "gray"
  }
});
