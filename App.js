import { AppLoading } from "expo";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import React, { useState, useEffect } from "react";
// import { SafeAreaProvider } from "react-native-safe-area-context";

import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  TextInput,
  Button,
  SafeAreaView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { encode, decode } from "base-64";

if (!global.btoa) {
  global.btoa = encode;
}
if (!global.atob) {
  global.atob = decode;
}

import AppNavigator from "./navigation/AppNavigator";

import firebase from "firebase/app";
import "firebase/auth";
import db from "./db";
console.disableYellowBox = true;
export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    return firebase.auth().onAuthStateChanged(setUser);
    
  }, []);

  const handleRegister = async () => {
    await firebase.auth().createUserWithEmailAndPassword(email, password);

    const response = await fetch(
      `https://us-central1-parking-app-3b592.cloudfunctions.net/initUser?uid=${
        firebase.auth().currentUser.uid
      }&email=${email}`
    );

    updateUserLogin();
  };

  const handleLogin = async () => {
    await firebase.auth().signInWithEmailAndPassword(email, password);
    updateUserLogin();
  };

  const updateUserLogin = () => {
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .update({
        email: email,
        lastLogin: new Date()
      });
  };

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    );
  } else if (!user) {
    return (
      <SafeAreaView
        style={Platform.OS !== "ios" ? styles.contentContainer : null}
      >
        <TextInput
          style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
          onChangeText={setEmail}
          placeholder="Email"
          value={email}
          keyboardType="email-address"
          autoFocus={true}
        />
        <TextInput
          style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry={true}
          value={password}
        />
        <Button title="Register" onPress={handleRegister} />
        <Button title="Login" onPress={handleLogin} />
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={styles.container}>
        {Platform.OS === "ios" && <StatusBar barStyle="default" />}
        <AppNavigator />
      </SafeAreaView>
    );
  }
}

async function loadResourcesAsync() {
  await Promise.all([
    Asset.loadAsync([
      require("./assets/images/robot-dev.png"),
      require("./assets/images/robot-prod.png")
    ]),
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Ionicons.font,
      // We include SpaceMono because we use it in HomeScreen.js. Feel free to
      // remove this if you are not using it in your app
      "space-mono": require("./assets/fonts/SpaceMono-Regular.ttf")
    })
  ]);
}

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0FFFF"
  },
  contentContainer: {
    paddingTop: 25
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20
  }
});
