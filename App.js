import { AppLoading } from "expo";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import React, { useState, useEffect } from "react";
// import { SafeAreaProvider } from "react-native-safe-area-context";
import { Input, Icon, Button, Text, Overlay } from "react-native-elements";

import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  Dimensions
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

const screen = Dimensions.get("screen");

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [register, setRegister] = useState(false);
  const [visible, setVisible] = useState(false);
  const [dimensions, setDimensions] = useState({ screen });
  const [forgotEmail, setForgotEmail] = useState("");

  const onChange = ({ screen }) => {
    setDimensions({ screen });
  };

  useEffect(() => {
    return firebase.auth().onAuthStateChanged(setUser);
  }, []);

  useEffect(() => {
    Dimensions.addEventListener("change", onChange);
    return () => {
      Dimensions.removeEventListener("change", onChange);
    };
  }, []);

  const handleRegister = async () => {
    if (userName !== "" && email !== "" && password !== "") {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
      const response = await fetch(
        `https://us-central1-parking-app-3b592.cloudfunctions.net/initUser?uid=${
          firebase.auth().currentUser.uid
        }&email=${email}&displayName=${userName}`
      );

      const user = firebase.auth().currentUser;
      const verify = await user.sendEmailVerification();

      setUpUser();
    } else {
      alert("Enter All Credentials");
    }
  };

  const setUpUser = () => {
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .set({
        email: firebase.auth().currentUser.email,
        displayName: userName,
        phoneNumber: firebase.auth().currentUser.phoneNumber,
        points: 0,
        pendingAmount: 0,
        advPendingAmount: 0,
        role: "user",
        photoURL:
          "https://image.shutterstock.com/image-vector/blank-avatar-photo-place-holder-260nw-1114445501.jpg",
        lastLogin: new Date()
      });
  };

  const handleShowRegister = value => {
    setRegister(value);
  };

  const handleLogin = async () => {
    if (email !== "" && password !== "") {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      updateUserLogin();
    } else {
      alert("Enter Email and Password");
    }
  };

  const updateUserLogin = () => {
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .update({
        lastLogin: new Date()
      });
  };

  const handleSubmit = () => {
    firebase
      .auth()
      .sendPasswordResetEmail(forgotEmail)
      .then(() => {
        alert("Check Your Email");
      })
      .catch(error => {
        console.log("Error !", error);
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
    return !register ? (
      <SafeAreaView style={Platform.OS !== "ios" ? { marginTop: "5%" } : null}>
        <View>
          <Text
            style={{
              marginLeft: "2%",
              color: "black",
              fontWeight: "bold",
              fontSize: 25,
              opacity: 0.4
            }}
          >
            Login
          </Text>
        </View>
        <View style={{ marginTop: "5%" }}>
          <Input
            label="Email"
            keyboardType="email-address"
            autoFocus={true}
            value={email}
            placeholder="Email"
            onChangeText={setEmail}
            rightIcon={
              <Icon name="email" type="material" size={24} color="black" />
            }
          />
        </View>
        <View style={{ marginTop: "5%" }}>
          <Input
            inputContainerStyleStyle={{ marginTop: "10%" }}
            label="Password"
            value={password}
            placeholder="Password"
            onChangeText={setPassword}
            secureTextEntry={true}
            rightIcon={
              <Icon name="lock" type="font-awesome" size={25} color="black" />
            }
          />
        </View>
        <View style={{ alignItems: "center" }}>
          <Button
            type="clear"
            title="Forgot Password ?"
            onPress={() => setVisible(true)}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: "2%"
          }}
        >
          <Text
            style={{
              fontSize: 16,
              marginLeft: "2%",
              alignItems: "center",
              marginTop: "2%"
            }}
          >
            Don't have an account ?
          </Text>
          <Button
            type="clear"
            title="Register"
            onPress={() => handleShowRegister(true)}
          />
        </View>
        <View style={{ alignItems: "center", marginTop: "5%" }}>
          <Button
            buttonStyle={{
              borderRadius: 30,
              paddingLeft: "30%",
              paddingRight: "30%"
            }}
            title="Login"
            onPress={handleLogin}
          />
        </View>
        <Overlay
          isVisible={visible}
          windowBackgroundColor="rgba(255, 255, 255, .5)"
          width={dimensions.screen.width}
          height={dimensions.screen.height}
        >
          <SafeAreaView
            style={Platform.OS !== "ios" ? { marginTop: "40%" } : null}
          >
            <View>
              <Text
                style={{
                  marginLeft: "2%",
                  color: "black",
                  fontWeight: "bold",
                  fontSize: 25,
                  opacity: 0.4
                }}
              >
                Forgot Password
              </Text>
            </View>
            <View style={{ marginTop: "5%" }}>
              <Input
                label="Email"
                keyboardType="email-address"
                autoFocus={true}
                value={forgotEmail}
                placeholder="Email"
                onChangeText={setForgotEmail}
                rightIcon={
                  <Icon name="email" type="material" size={24} color="black" />
                }
              />
            </View>

            <View style={{ alignItems: "center", marginTop: "5%" }}>
              <Button
                buttonStyle={{
                  borderRadius: 30,
                  paddingLeft: "30%",
                  paddingRight: "30%"
                }}
                title="Submit"
                onPress={handleSubmit}
              />
            </View>

            <View style={{ alignItems: "center", marginTop: "5%" }}>
              <Button
                buttonStyle={{
                  borderRadius: 30,
                  paddingLeft: "30%",
                  paddingRight: "30%"
                }}
                title="Close"
                onPress={() => setVisible(false)}
              />
            </View>
          </SafeAreaView>
        </Overlay>
      </SafeAreaView>
    ) : (
      <SafeAreaView style={Platform.OS !== "ios" ? { marginTop: "5%" } : null}>
        <View>
          <Text
            style={{
              marginLeft: "2%",
              color: "black",
              fontWeight: "bold",
              fontSize: 25,
              opacity: 0.4
            }}
          >
            Register
          </Text>
        </View>
        <View style={{ marginTop: "5%" }}>
          <Input
            label="Email"
            keyboardType="email-address"
            autoFocus={true}
            value={email}
            placeholder="Email"
            onChangeText={setEmail}
            rightIcon={
              <Icon name="email" type="material" size={24} color="black" />
            }
          />
        </View>
        <View style={{ marginTop: "5%" }}>
          <Input
            inputContainerStyleStyle={{ marginTop: "10%" }}
            label="Password"
            value={password}
            placeholder="Password"
            onChangeText={setPassword}
            secureTextEntry={true}
            rightIcon={
              <Icon name="lock" type="font-awesome" size={25} color="black" />
            }
          />
        </View>
        <View
          style={{
            marginTop: "5%"
          }}
        >
          <Input
            inputContainerStyleStyle={{ marginTop: "10%" }}
            label="Username"
            value={userName}
            placeholder="Username"
            onChangeText={setUserName}
            rightIcon={
              <Icon name="user" type="font-awesome" size={25} color="black" />
            }
          />
        </View>

        <View style={{ alignItems: "center", marginTop: "5%" }}>
          <Button
            buttonStyle={{
              borderRadius: 30,
              paddingLeft: "30%",
              paddingRight: "30%"
            }}
            title="Register"
            onPress={handleRegister}
          />
        </View>
        <View style={{ alignItems: "center", marginTop: "5%" }}>
          <Button
            buttonStyle={{
              borderRadius: 30,
              paddingLeft: "30%",
              paddingRight: "30%"
            }}
            title="Go Back"
            onPress={() => handleShowRegister(false)}
          />
        </View>
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
    backgroundColor: "#fff"
  },
  contentContainer: {
    paddingTop: "10%",
    // justifyContent: "space-around",
    flex: 1,
    backgroundColor: "#fff"
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20
  }
});
