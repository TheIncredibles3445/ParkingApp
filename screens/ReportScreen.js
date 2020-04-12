import React, { useState, useEffect } from "react";
import { Platform, ShadowPropTypesIOS } from "react-native";
import {
  TextInput,
  // Button,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Image,
  Text,
  View,
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
import * as Animatable from "react-native-animatable";

export default function ReportScreen(props) {
  // here im using react hooks as useState which used to store the data
  // and down I used useEffect to get the variables
  // for example, in plateNumber element the state can be accessed with the first element which is plateNumber and can be set with the second element which is setPlateNumber.

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
      longitude: location.coords.longitude,
    };

    let reqId = 0;
    let adv = await db
      .collection("Reports")
      // .doc(firebase.auth().currentUser.uid)
      .add({
        userId: firebase.auth().currentUser.uid,
        reporterName: reporterName,
        description: description,
        date: date,
        image: "",
        location: loc,
        plateNumber: plateNumber,
        status: status,
      })
      .then(function (docRef) {
        reqId = docRef.id;
      });
    console.log("req id ------------------------------", reqId);

    const response = await fetch(image);
    const blob = await response.blob();
    const putResult = await firebase
      .storage()
      .ref()
      .child(`/reports/${firebase.auth().currentUser.uid}${reqId}`)
      .put(blob);
    const url = await firebase
      .storage()
      .ref()
      .child(`/reports/${firebase.auth().currentUser.uid}${reqId}`)
      .getDownloadURL();

    db.collection("Reports").doc(reqId).update({ image: url });
    // gives points to the user
    const userRef = await db
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get();
    const user = userRef.data();
    let userPoint = user.points + 50;
    user.points = userPoint;
    db.collection("users").doc(firebase.auth().currentUser.uid).update(user);
    props.navigation.navigate("Home");
  };

  const _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    console.log("TESTING !!!", result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

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
      allowsEditing: true,
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
  // and here I used react hooks as useEffect to get the variables
  // this useEffect takes two parameters, handleLocation() function and an array, and it returns nothing. The handleLocation function it takes will be executed after every render cycle.
  useEffect(() => {
    handleLocation();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <KeyboardAvoidingView enabled behavior="padding">
          <Text
            style={{
              marginTop: "3%",
              color: "#005992",
              fontWeight: "bold",
              fontSize: 22,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Problems Report Form
          </Text>
          <Animatable.View
            animation="flash"
            direction="alternate"
            iterationCount={3}
          >
            <Text style={{ marginBottom: "7%", fontSize: 15, marginTop: "5%" }}>
              Please fill the following fields to report a problem:
            </Text>
          </Animatable.View>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                marginBottom: 10,
                fontSize: 16,
                marginRight: 4,
                marginTop: 8,
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
                borderRadius: 5,
                marginLeft: "3%",
                marginBottom: "3%",
                backgroundColor: "#f5f5f5",
              }}
              value={reporterName}
              onChangeText={(first) => setReporterName(first)}
              placeholder=" reporter name .."
            />
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                marginBottom: 10,
                fontSize: 16,
                marginRight: 4,
                marginTop: 8,
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
                borderRadius: 5,
                marginLeft: "10%",
                textAlignVertical: "top",
                marginBottom: "4%",
                backgroundColor: "#f5f5f5",
              }}
              value={description}
              onChangeText={(last) => setDescription(last)}
              placeholder=" Please describe the problem..."
            />
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontSize: 15, marginTop: "2%" }}>DateTime: </Text>
            <DatePicker
              style={{
                width: "70.5%",
                marginLeft: "5%",
                marginBottom: "6%",
                fontSize: 16,
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

                  marginLeft: 0,
                },
                dateInput: {
                  marginLeft: 36,
                  borderRadius: 5,
                  backgroundColor: "#f5f5f5",
                },
                datePickerCon: { color: "black" },
              }}
              onDateChange={(date) => {
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
                marginTop: 8,
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
                borderRadius: 5,
                backgroundColor: "#f5f5f5",
                marginLeft: "7.5%",
                marginTop: "2%",
              }}
              keyboardType={"numeric"}
              numeric
              value={plateNumber}
              onChangeText={(last) => setPlateNumber(last)}
              placeholder="plateNumber"
            />
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                marginBottom: 10,
                fontSize: 16,
                // marginRight: 7,
                marginTop: 48,
                marginLeft: "1.5%",
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
                  width: "33%",
                  height: "2%",
                  marginLeft: "18%",
                  marginRight: 20,
                  marginTop: "12%",
                }}
              >
                <Button
                  buttonStyle={{ backgroundColor: "#B0C4DE" }}
                  titleStyle={{ alignItems: "center", color: "#263c5a" }}
                  title="Choose file"
                  onPress={() => _pickImage()}
                />
              </View>
              <View
                style={{
                  width: "33%",
                  height: "2%",
                  marginRight: "5%",
                  marginTop: "12%",
                  backgroundColor: "#B0C4DE",
                }}
              >
                <Button
                  buttonStyle={{ backgroundColor: "#B0C4DE" }}
                  titleStyle={{ alignItems: "center", color: "#263c5a" }}
                  title="Camera Roll"
                  onPress={() => _openCamera()}
                />
              </View>
            </View>
            {/* </View> */}
          </View>
          <View
            style={{
              width: "35%",
              height: "12%",
              marginLeft: "60%",
              marginTop: "16%",

              // color: "#B0C4DE",
              // borderRadius: 10,
              // borderWidth: 1,

              // justifyContent:"center",
              // alignItems:"center",
              // borderColor: "#B0C4DE",
            }}
          >
            <Button
              buttonStyle={{
                backgroundColor: "#B0C4DE",
                borderColor: "#263c5a",
              }}
              titleStyle={{ alignItems: "center", color: "#263c5a" }}
              title="Submit"
              onPress={handleSubmit}
            ></Button>
          </View>
          {/* <View style={{ width: 100, marginLeft: "10%" }}>
        <Button title="Logout" onPress={handleLogout} />
      </View> */}
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
}
// on this navigationOptions I added a title called Reports which will be dispalaying as header title
// headerStyle this will change the background image
ReportScreen.navigationOptions = {
  title: "Reports",
  headerTintColor: "white",
  headerStyle: { backgroundColor: "#5a91bf" },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#F0F8FF",
  },
  input: {
    //flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "flex-start",
    //width: "100%"
  },
});
