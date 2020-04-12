import { AppLoading } from "expo";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import React, { useState, useEffect, useRef } from "react";
// import { SafeAreaProvider } from "react-native-safe-area-context";
import { Input, Icon, Button, Text, Overlay } from "react-native-elements";

import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  // Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  SafeAreaView,
  Dimensions,
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
import AdminAppNavigator from "./navigation/AdminAppNavigator";
import Animated, { Easing } from "react-native-reanimated";
import {
  TapGestureHandler,
  State,
  TouchableOpacity,
} from "react-native-gesture-handler";
import firebase from "firebase/app";
import "firebase/auth";
import db from "./db";
import Svg, { Image, Circle, ClipPath } from "react-native-svg";

console.disableYellowBox = true;
 
const screen = Dimensions.get("screen");
const { width, height } = Dimensions.get("window");

function cacheImages(images) {
  return images.map((image) => {
    if (typeof image === "string") {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}   
 
const {
  Value,
  event,
  block,
  cond,
  eq,
  set,
  Clock,
  startClock,
  stopClock,
  debug,
  timing,
  clockRunning,
  interpolate,
  Extrapolate,
  concat,
} = Animated;

function runTiming(clock, value, dest) {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  };

  const config = {
    duration: 1000,
    toValue: new Value(0),
    easing: Easing.inOut(Easing.ease),
  };

  return block([
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.position, value),
      set(state.frameTime, 0),
      set(config.toValue, dest),
      startClock(clock),
    ]),
    timing(clock, state, config),
    cond(state.finished, debug("stop clock", stopClock(clock))),
    state.position,
  ]);
}

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [user, setUser] = useState(null);
  const [loggedInUser , setLoggedInUser] = useState()
  const email = useRef();
  const password = useRef();
  const emailR = useRef();
  const passwordR = useRef();
  const phone = useRef();
  const [isReady, setIsReady] = useState(false);

  const buttonOpacity = new Value(1);


  const onStateChange = event([
    {
      nativeEvent: ({ state }) =>
        block([
          cond(
            eq(state, State.END),
            set(buttonOpacity, runTiming(new Clock(), 1, 0))
          ),
        ]),
    },
  ]);

  const onCloseState = event([
    {
      nativeEvent: ({ state }) =>
        block([
          cond(
            eq(state, State.END),
            set(buttonOpacity, runTiming(new Clock(), 0, 1))
          ),
        ]),
    },
  ]); 

  const buttonY = interpolate(buttonOpacity, {
    inputRange: [0, 1],
    outputRange: [100, 0],
    extrapolate: Extrapolate.CLAMP,
  });

  const bgY = interpolate(buttonOpacity, {
    inputRange: [0, 1],
    outputRange: [-height / 2 - 50, 0],
    extrapolate: Extrapolate.CLAMP,
  });

  const textInputOpacity = interpolate(buttonOpacity, {
    inputRange: [0, 1],
    outputRange: [1, 0],
    extrapolate: Extrapolate.CLAMP,
  });

  const textInputZIndex = interpolate(buttonOpacity, {
    inputRange: [0, 1],
    outputRange: [1, -1],
    extrapolate: Extrapolate.CLAMP,
  });

  const textInputY = interpolate(buttonOpacity, {
    inputRange: [0, 1],
    outputRange: [0, 100],
    extrapolate: Extrapolate.CLAMP,
  });

  const rotateCross = interpolate(buttonOpacity, {
    inputRange: [0, 1],
    outputRange: [180, 360],
    extrapolate: Extrapolate.CLAMP,
  });


  const loadAssetsAsync = async () => {
    const imageAssets = cacheImages([require("./assets/images/park.png")]);
    await Promise.all([...imageAssets]);
  };
  useEffect(()=>{
    getUser()
  },[])

  const getUser = async() =>{
    let u = await db.collection("users").doc(firebase.auth().currentUser.uid).get()
    setLoggedInUser(u.data())
    console.log("---------------------------userrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr",user)
  }

  useEffect(() => {
    getUser()
    return firebase.auth().onAuthStateChanged(setUser);
    
  }, []);

  const handleRegister = async () => {
    if (emailR.current && passwordR.current && phone.current ) {
      await firebase
        .auth()
        .createUserWithEmailAndPassword(emailR.current, passwordR.current);
      const response = await fetch(
        `https://us-central1-parking-assistant-d2d25.cloudfunctions.net/initUser?uid=${
        firebase.auth().currentUser.uid
        }&email=${email.current}`
      );
      setUpUser();
    } else {
      alert("Enter All Credentials");
    }
  };


  const setUpUser = () => {
    db.collection("users").doc(firebase.auth().currentUser.uid).set({
      lastLogin: new Date(),
      email : emailR.current,
      role :"user",
      pendingAmount: 0,
      advPendingAmount: 0,
      points: 0,
      displayName: "",
      photoURL: "",
      phoneNumber : phone.current
    });
  };  

  const handleLogin = async () => {
    if (email.current  && password.current ) {
      await firebase
        .auth()
        .signInWithEmailAndPassword(email.current, password.current);
      updateUserLogin();
    } else {
      alert("Enter Email and Password");
    }
  };

  const updateUserLogin = async() => {
    
    db.collection("users").doc(firebase.auth().currentUser.uid).update({
      lastLogin: new Date(),
    });
    
  };


  useEffect(()=>{},[loggedInUser])

  const handleEmail = (text) => {
    email.current = text;
  };

  const handlePassword = (text) => {
    password.current = text;
  };

  const handlePasswordR = (text) => {
    passwordR.current = text;
  };
  const handleEmailR = (text) => {
    emailR.current = text;
  };

  const handlePhone = (text) => {
    phone.current = text;
  };
  if (!isLoadingComplete && !props.skipLoadingScreen && !isReady) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    );
  } else if (!user) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.Os == "ios" ? "padding" : "height"}
        style={{
          flex: 1,
          backgroundColor: "white",
          justifyContent: "flex-end",
        }} 
      >
        <Animated.View
          style={{
            ...StyleSheet.absoluteFill,
            transform: [{ translateY: bgY }],
          }}
        >
          <Svg height={height + 50} width={width}>
            <ClipPath id="clip">
              <Circle r={height + 50} cx={width / 2} />
            </ClipPath>
            <Image
              href={require("./assets/images/park.png")}
              height={height + 50}
              width={width}
              preserveAspectRatio="xMidYMid slice"
              clipPath="url(#clip)"
            />
          </Svg>

        </Animated.View>
        <View style={{ height: height / 4, justifyContent: "center" }}>
          <TapGestureHandler onHandlerStateChange={onStateChange}>
            <Animated.View
              style={{
                ...styles.button,
                backgroundColor: "#2E71DC",
                opacity: buttonOpacity,
                transform: [{ translateY: buttonY }],
              }}  
            >
              <Text
                style={{ color: "white", fontSize: 20, fontWeight: "bold" }}
              >
                SIGN IN / SIGN UP
              </Text>
            </Animated.View>
          </TapGestureHandler>
          <Animated.View
            style={{
              zIndex: textInputZIndex,
              opacity: textInputOpacity,
              transform: [{ translateY: textInputY }],
              height: height / 2,
              ...StyleSheet.absoluteFill,
              top: null,
              justifyContent: "center",
            }}
          >
            <TapGestureHandler onHandlerStateChange={onCloseState}>
              <Animated.View style={styles.closeButton}>
                <Animated.Text
                  style={{
                    fontSize: 15,
                    transform: [{ rotate: concat(rotateCross, "deg") }],
                  }}
                >
                  X
                </Animated.Text>
              </Animated.View>
            </TapGestureHandler>
            <View style={{ flexDirection: "row"  }}>
              {/**login */}
              <View>
                <TextInput
                  keyboardType="email-address"
                  placeholderTextColor="black"
                  value={email}
                  placeholder="EMAIL"
                  onChangeText={(text) => handleEmail(text)}
                  style={styles.input}
                />

                <TextInput
                  value={password}
                  placeholder="PASSWORD"
                  placeholderTextColor="black"
                  onChangeText={(text) => handlePassword(text)}
                  secureTextEntry={true}
                  style={styles.input}
                />

              </View>
              <View style={{borderLeftWidth:0.5}}></View>

              {/**register */}
              <View>
                <TextInput
                  keyboardType="email-address"
                  placeholderTextColor="black"
                  value={emailR}
                  placeholder="EMAIL"
                  onChangeText={(text) => handleEmailR(text)}
                  style={styles.input}
                />

                <TextInput
                  value={passwordR}
                  placeholder="PASSWORD"
                  placeholderTextColor="black"
                  onChangeText={(text) => handlePasswordR(text)}
                  secureTextEntry={true}
                  style={styles.input}
                />
                <TextInput
                   value={phone}
                  placeholder="PHONE NUMBER"
                  placeholderTextColor="black"
                  onChangeText={(text) => handlePhone(text)}
                  keyboardType="numeric"
                  style={styles.input}
                />
 
              </View>
            </View> 

             <Animated.View
              style={{ flexDirection: "row", justifyContent: "space-evenly" }}
            >
              <TouchableOpacity onPress={handleLogin}>
                <Animated.View style={styles.button}>
                  <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                    SIGN IN
                  </Text> 
                </Animated.View>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleRegister}>
                <Animated.View style={styles.button}>
                  <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                    SIGN UP
                  </Text>
                </Animated.View>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    );
  } else { 
    return ( 
      
      <SafeAreaView style={styles.container}>
        
        {
        loggedInUser && loggedInUser.role != "admin" ?
        <AppNavigator />
        : loggedInUser && loggedInUser.role == "admin" ?
        
        <AdminAppNavigator />
        : 
        <TouchableOpacity onPress={getUser()}></TouchableOpacity>
      }
       
      </SafeAreaView>
    );
  }
}
    
async function loadResourcesAsync() {
  await Promise.all([
    Asset.loadAsync([
      require("./assets/images/robot-dev.png"),
      require("./assets/images/robot-prod.png"),
    ]),
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Ionicons.font,
      // We include SpaceMono because we use it in HomeScreen.js. Feel free to
      // remove this if you are not using it in your app
      "space-mono": require("./assets/fonts/SpaceMono-Regular.ttf"),
    }),
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
    backgroundColor: '#F5FCFF'
  },
  contentContainer: {
    paddingTop: "10%",
    // justifyContent: "space-around",
    flex: 1,
    backgroundColor: "#fff",
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "white",
    height: 70,
    marginHorizontal: 20,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "black",
    shadowOpacity: 0.2,
  },
  closeButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: -20,
    left: width / 2 - 20,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "black",
    shadowOpacity: 0.2,
  },
  input: {
    margin: "1%",
    height: 50,
    borderRadius: 25,
    borderWidth: 0.5,
    //marginHorizontal: 20,
    paddingLeft: 10,
    //marginVertical: 5,
    borderColor: "rgba(0,0,0,0.2)",
    width:200
  },
});