import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/functions";
import db from "../../db";
import { Input, Text, Divider, Button } from "react-native-elements";

export default function Profile(props) {
  const user = props.navigation.getParam("user", "No params");
  //this state for the user name
  const [displayName, setDisplayName] = useState("");
  //for user first name
  const [firstName, setFirstName] = useState("");
  //for user last name
  const [lastName, setLastName] = useState("");
  //for user phone number
  const [phoneNumber, setPhoneNumber] = useState("");

  // in this useeffect it will run one time calling the function handleUser once the app is rendered
  useEffect(() => {
    handleUser();
  }, []);

  const handleUser = async () => {
    const userRef = await db
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get();
    const data = userRef.data();
    setFirstName(data.firstName);
    setLastName(data.lastName);
    setDisplayName(firebase.auth().currentUser.displayName);
    setPhoneNumber(firebase.auth().currentUser.phoneNumber);
  };

  //async: means this function will return a promises always
  // in here when the user click on save button the user information will be changed so o used the update function to update/edit
  // the user first name, last name and phone number and chmged to the one they entered
  const handleSave = async () => {
    await db.collection("users").doc(firebase.auth().currentUser.uid).update({
      firstName: firstName,
      lastName: lastName,
      phoneNumer: phoneNumber,
    });

    const currentUser = firebase.auth().currentUser;
    console.log("current user from profile", currentUser);
    if (currentUser.phoneNumber === null) {
      const updateUser = firebase.functions().httpsCallable("updateUser");
      const response2 = await updateUser({
        uid: currentUser.uid,
        displayName: displayName,
        phoneNumber: `+974${phoneNumber}`,
      });
    } else {
      const updateDisplayName = firebase
        .functions()
        .httpsCallable("updateDisplayName");
      const response2 = await updateDisplayName({
        uid: currentUser.uid,
        displayName: displayName,
      });
    }
    props.navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : null}
      style={{ flex: 1, backgroundColor: "#F0F8FF" }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView>
          <View style={{ flex: 1, alignItems: "center", marginTop: 20 }}>
            <Text h4>Edit Profile</Text>
          </View>
          <View
            style={{
              marginTop: 40,
              width: "90%",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <Input label="Email" disabled value={user.email} />
          </View>
          <View
            style={{
              marginTop: 20,
              width: "90%",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <Input
              label="Display Name / Username"
              onChangeText={(text) => setDisplayName(text)}
              value={displayName}
            />
          </View>
          <View
            style={{
              marginTop: 20,
              width: "90%",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <Input
              label="First Name"
              value={firstName}
              onChangeText={(text) => setFirstName(text)}
            />
          </View>
          <View
            style={{
              marginTop: 20,
              width: "90%",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <Input
              label="Last Name"
              value={lastName}
              onChangeText={(text) => setLastName(text)}
            />
          </View>
          <View
            style={{
              marginTop: 20,
              width: "90%",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <Input
              label="Phone"
              value={phoneNumber}
              value={phoneNumber}
              keyboardType="phone-pad"
              disabled={
                firebase.auth().currentUser.phoneNumber === "" ||
                firebase.auth().currentUser.phoneNumber === null
                  ? false
                  : true
              }
              onChangeText={(text) => setPhoneNumber(text)}
            />
          </View>
          <View style={{ marginTop: 20, alignItems: "center" }}>
            <Button
              onPress={handleSave}
              title="SAVE"
              buttonStyle={{ paddingEnd: 50, paddingStart: 50 }}
              titleStyle={{ alignItems: "center" }}
            />
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

Profile.navigationOptions = {
  title: "My Profile",
  headerTintColor: "white",
  headerStyle: {
    backgroundColor: "#005992",
  },
};
