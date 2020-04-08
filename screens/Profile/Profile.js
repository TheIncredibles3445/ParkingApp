import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TouchableOpacity,
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
  const [displayName, setDisplayName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

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

  const handleSave = async () => {
    await db.collection("users").doc(firebase.auth().currentUser.uid).update({
      firstName: firstName,
      lastName: lastName,
      displayName: displayName,
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
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView>
          <View style={{ flex: 1, alignItems: "center", marginTop: 20 }}>
            <Text h4>Edit Profile</Text>
          </View>
          <Divider style={{ marginTop: 20 }} />
          <View style={{ marginTop: 20 }}>
            <Input
              label="Email"
              placeholder="Email"
              disabled
              value={user.email}
            />
          </View>
          <View style={{ marginTop: 20 }}>
            <Input
              label="Display Name / Username"
              placeholder="Display Name / Username"
              onChangeText={(text) => setDisplayName(text)}
              value={displayName}
            />
          </View>
          <View style={{ marginTop: 20 }}>
            <Input
              label="First Name"
              placeholder="First Name"
              value={firstName}
              onChangeText={(text) => setFirstName(text)}
            />
          </View>
          <View style={{ marginTop: 20 }}>
            <Input
              label="Last Name"
              placeholder="Last Name"
              value={lastName}
              onChangeText={(text) => setLastName(text)}
            />
          </View>
          <View style={{ marginTop: 20 }}>
            <Input
              label="Phone"
              value={phoneNumber}
              placeholder="Phone"
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
            <TouchableOpacity
              onPress={() => handleLogout()}
              style={{
                backgroundColor: "#005992",
                height: 50,
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontWeight: "bold",
                  letterSpacing: 5,
                }}
              >
                LOGOUT
              </Text>
            </TouchableOpacity>
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
