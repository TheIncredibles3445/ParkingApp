import React, { useState, useEffect } from "react";
import { Platform } from "react-native";
import {
  TextInput,
  // Button,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Image,
  Text,
  View
} from "react-native";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";
import db from "../db.js";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import DatePicker from "react-native-datepicker";
import * as Location from "expo-location";
import { Button } from "react-native-elements";

export default function ReportScreen() {
  const [userId, setUserId] = useState("");
  const [reporterName, setReporterName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState(null);
  const [date, setDate] = useState(new Date());
  const [status, setStatus] = useState(false);
  const [plateNumber, setPlateNumber] = useState("");

  const [flag, setFlag] = useState(true);

  const [image, setImage] = useState(null);
  const [permissions, SetHasCameraPermission] = useState(null);

  const handleLogout = () => {
    firebase.auth().signOut();
  };
  const handleSubmit = async () => {
    let loc = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    };

    const response = await fetch(image);
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

    db.collection("Reports")
      // .doc(firebase.auth().currentUser.uid)
      .add({
        userId: firebase.auth().currentUser.uid,
        reporterName: reporterName,
        description: description,
        date: date,
        image: url,
        location: loc,
        plateNumber: plateNumber,
        status: status
      });
    // gives points to the user
    const userRef = await db
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get();
    const user = userRef.data();
    let userPoint = user.points + 50;
    user.points = userPoint;
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .update(user);
  };

  const _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images
    });
    console.log("TESTING !!!", result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  // const changeButtonFlag = () =>{
  //   if(
  //     description !== "" &&
  //     datetime !== ""&&
  //     plateNumber !== "" &&
  //     image !== ""
  //   ){
  //     return false
  //   }else{
  //     return true
  //   }

  // }

  const getPermission = async () => {
    const status = await Permissions.askAsync(Permissions.CAMERA);
    // alert(status);
    SetHasCameraPermission(status === "granted");
  };
  useEffect(() => {
    getPermission();
  }, []);

  // show camera roll, allow user to select and take pic
  const _openCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true
    });
    if (!result.cancelled) {
      setImage(result.uri);
    } else console.log("cancelled");
  };

  const handleLocation = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      alert("Permission Denied");
    } else {
      const locations = await Location.getCurrentPositionAsync({});
      setLocation(locations);
    }
  };
  useEffect(() => {
    handleLocation();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <KeyboardAvoidingView enabled behavior="padding">
          <Text
            style={{
              marginBottom: 30,
              fontSize: 22,
              marginLeft: "auto",
              marginRight: "auto"
            }}
          >
            Problems Report Form
          </Text>
          {/* <Text style={{ marginLeft: "30%" }}> Fill the following report </Text> */}

          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                marginBottom: 10,
                fontSize: 15,
                marginRight: 4,
                marginTop: 8
              }}
            >
              Reporter Name:
            </Text>
            <TextInput
              style={{
                width: "60.5%",
                height: 30,
                borderColor: "gray",
                borderWidth: 1,
                marginLeft: "3%",
                marginBottom: "3%"
              }}
              value={reporterName}
              onChangeText={first => setReporterName(first)}
              placeholder=" reporter name .."
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
              Description:
            </Text>
            <TextInput
              style={{
                width: "58%",
                height: 50,
                borderColor: "gray",
                borderWidth: 1,
                marginLeft: "9.5%",
                textAlignVertical: "top",
                marginBottom: "4%"
              }}
              value={description}
              onChangeText={last => setDescription(last)}
              placeholder=" Please describe the problem..."
            />
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontSize: 15, marginTop: "2%" }}>DateTime: </Text>
            <DatePicker
              style={{
                width: "70.5%",
                marginLeft: "3.5%",
                marginBottom: "6%",
                fontSize: 15
              }}
              date={date}
              mode="datetime"
              placeholder="select date"
              format="YYYY-MM-DDThh:mm"
              minDate="2016-05-01"
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
                // ... You can check the source to find the other keys.
              }}
              onDateChange={date => {
                console.log(date);
                setDate(date);
              }}
            />
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                marginBottom: 10,
                fontSize: 15,
                marginLeft: "1%",
                marginTop: 8
              }}
            >
              Plate Number:
            </Text>
            <TextInput
              style={{
                width: "59%",
                height: 30,
                borderColor: "gray",
                borderWidth: 1,
                marginLeft: "5.8%",
                marginTop: "2%"
              }}
              value={plateNumber}
              onChangeText={last => setPlateNumber(last)}
              placeholder="plateNumber"
            />
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                marginBottom: 10,
                fontSize: 15,
                // marginRight: 7,
                marginTop: 55,
                marginLeft: "1.5%"
              }}
            >
              Image:
            </Text>
            {image && <Image source={{ uri: image }} />}
            {/* <View
              style={{
                width: 100,
                height: 50,
                marginTop: "10%",
                marginRight: "20%"
                // justifyContent: "center",
                // alignItems: "center"
              }}
            > */}
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  width: "28%",
                  height: "2%",
                  marginLeft: "18%",
                  marginRight: 20,
                  marginTop: "10%"
                }}
              >
                <Button title="Choose file" onPress={() => _pickImage()} />
              </View>
              <View
                style={{
                  width: "28%",
                  height: "1%",
                  marginRight: "20%",
                  marginTop: "10%"
                }}
              >
                <Button title="Camera Roll" onPress={() => _openCamera()} />
              </View>
            </View>
            {/* </View> */}
          </View>
          <View style={{ width: "30%", marginLeft: "63%", marginTop: "20%" }}>
            <Button title="Submit" onPress={handleSubmit} />
          </View>
          {/* <View style={{ width: 100, marginLeft: "10%" }}>
        <Button title="Logout" onPress={handleLogout} />
      </View> */}
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
}
ReportScreen.navigationOptions = {
  title: "Reports"
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#fff"
  },
  input: {
    //flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "flex-start"
    //width: "100%"
  }
});
