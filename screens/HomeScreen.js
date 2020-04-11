// import * as WebBrowser from "expo-web-browser";
import React, { useState, useEffect } from "react";
import DatePicker from "react-native-datepicker";

import firebase from "firebase/app";
import "firebase/auth";
import db from "../db.js";
import {
  Modal,
  TouchableOpacity,
  View,
  Alert,
  Platform,
  SafeAreaView,
  StyleSheet,
  ImageBackground,
  Image,
} from "react-native";
import { Card, Text, Button, Icon } from "react-native-elements";
import { NavigationActions } from "react-navigation";
import { ScrollView } from "react-native-gesture-handler";
import TimedSlideshow from "react-native-timed-slideshow";
import { AsyncStorage } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

export default function HomeScreen(props) {
  //============================ START DATE AND TIME ============================
  const image = {
    uri: "",
  };

  const [ads, setAds] = useState([]);
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [isVerified, setIsVerified] = useState(true);

  const [timer, setTimer] = useState(10);
  const [timeoutId, setTimeoutId] = useState(null);

  const unsubscribe = props.navigation.addListener("didFocus", () => {
    console.log("focussed");
    track();
  });

  const track = async () => {
    console.log(" in track");
    let old = await db.collection("tracking").doc("track").get();
    // AsyncStorage.setItem("service", "yes");
    let check = await AsyncStorage.getItem("service");
    console.log(check);
    if (check === "yes") {
      let newTrack = parseInt(old.data().service) - 1;
      db.collection("tracking").doc("track").update({ service: newTrack });
      AsyncStorage.setItem("service", "no");
    }

    let check2 = await AsyncStorage.getItem("parking");
    console.log(check2);
    if (check2 === "yes") {
      let newTrack = parseInt(old.data().parking) - 1;
      db.collection("tracking").doc("track").update({ parking: newTrack });
      AsyncStorage.setItem("parking", "no");
    }
  };

  useEffect(() => {
    db.collection("Advertisement")
      .where("adStatus", "==", "Approved")
      .get()
      .then((querySnapshot) => {
        let ads = [];
        querySnapshot.forEach((doc) => {
          ads.push({ id: doc.id, ...doc.data() });
        });
        setAds([...ads]);
      });
    //setAll(ads)
    console.log("ads are", ads);

    let temp = [];
    for (let i = 0; i < ads.length; i++) {
      console.log(
        "result --->>>",
        new Date(ads[i].startDate).getTime(),
        new Date().getTime()
      );
      if (
        new Date(ads[i].startDate).getTime() <= new Date().getTime() &&
        new Date().getTime() <= new Date(ads[i].endDate).getTime()
      )
        temp.push({
          uri: ads[i].photoURL,
          title: ads[i].title,
          text: `${(<Button />)}`,
        });
    }
    setItems(temp);
  }, []);

  // useEffect(() => {
  //   //console.log("heeereeee");
  //    setTimeoutId(
  //         setTimeout(() => {
  //           setTimer(timer + 1);
  //         }, 1000)
  //       )
  //   track();

  // }, [timer]);

  const getAds = async () => {
    db.collection("Advertisement")
      .get()
      .then((querySnapshot) => {
        let ads = [];
        querySnapshot.forEach((doc) => {
          ads.push({ id: doc.id, ...doc.data() });
        });
        setAds([...ads]);
      });
    //setAll(ads)
    console.log("ads are", ads);

    let temp = [];
    for (let i = 0; i < ads.length; i++) {
      temp.push({ uri: ads[i].photoURL, title: ads[i].title, text: "info" });
    }
    setItems(temp);
  };

  const getUser = async () => {
    const loggedInUser = await db
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get();
    const data = { id: loggedInUser.id, ...loggedInUser.data() };
    setUser(data);
  };

  const clicked = () => {
    console.log("clicked ---------->>>>>");
  };

  //============================ START DATE AND TIME ============================

  useEffect(() => {
    // const user = firebase.auth().currentUser;
    // if (!user.emailVerified) {
    //   user
    //     .sendEmailVerification()
    //     .then(function() {
    //       alert("Verify your email!");
    //     })
    //     .catch(function(error) {
    //       console.log("Error", error);
    //     });
    // }
    // console.log(user);
    // setIsVerified(user.emailVerified);
  }, []);

  // const getUser = async () => {
  //   const loggedInUser = await db
  //     .collection("users")
  //     .doc(firebase.auth().currentUser.uid)
  //     .get();
  //   const data = { id: loggedInUser.id, ...loggedInUser.data() };
  //   setUser(data);
  // };

  // const handleSend = async () => {
  //   const response = await fetch(
  //     "https://us-central1-parking-app-3b592.cloudfunctions.net/sendEmail"
  //   );
  //   console.log(response);
  // };
  //width:"100%"
  return (
    <SafeAreaView
      style={
        Platform.OS !== "ios"
          ? {
              flex: 1,
              marginTop: 10,
              justifyContent: "space-evenly",
              backgroundColor: "#DCDCDC",
            }
          : { flex: 1, backgroundColor: "#DCDCDC" }
      }
    >
      <View style={{ height: "40%", width: "100%" }}>
        {items.length > 0 ? (
          <TimedSlideshow items={items} onPress={() => clicked()} />
        ) : null}
      </View>

      <ScrollView
        style={Platform.OS !== "ios" ? { flex: 1, marginTop: 10 } : { flex: 1 }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 30 }}>Welcome</Text>
        </View>
        <View style={{ flex: 5 }}>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            <TouchableOpacity
              style={{ width: "50%" }}
              disabled={!isVerified}
              onPress={() => props.navigation.navigate("ParkingBooking")}
            >
              <Card
                title="Parking Booking"
                image={require("../assets/images/parking.png")}
                imageWrapperStyle={{ padding: 15 }}
              ></Card>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={!isVerified}
              style={{ width: "50%" }}
              onPress={() => props.navigation.navigate("ServiceBooking")}
            >
              <Card
                title="Service Booking"
                image={require("../assets/images/services.png")}
                imageWrapperStyle={{ padding: 15 }}
              ></Card>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={!isVerified}
              style={{ width: "50%" }}
              onPress={() => props.navigation.navigate("ReportScreen")}
            >
              <Card
                title="Report"
                image={require("../assets/images/report.png")}
                imageWrapperStyle={{ padding: 15 }}
              ></Card>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cards}
              onPress={() => props.navigation.navigate("Advertisement")}
            >
              <Card
                title="Advertise?"
                //containerStyle={{ width: "40%" }}
                image={require("../assets/images/advertisement.png")}
                imageWrapperStyle={{}}
              ></Card>
            </TouchableOpacity>
          </View>

          <View style={{ flex: 5 }}>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              <TouchableOpacity
                style={{ width: "100%" }}
                disabled={!isVerified}
                onPress={() => props.navigation.navigate("ParkingBooking")}
              >
                <Card
                  title="Parking Booking"
                  image={require("../assets/images/p.gif")}
                  // imageWrapperStyle={{ padding: 10 }}
                  imageStyle={{ width: 100, height: 200 }}
                ></Card>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={!isVerified}
                style={{ width: "50%" }}
                onPress={() => props.navigation.navigate("ServiceBooking")}
              >
                <Card
                  title="Service Booking"
                  image={require("../assets/images/car-wash.png")}
                  imageWrapperStyle={{ padding: 10 }}
                ></Card>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={!isVerified}
                style={{ width: "50%" }}
                onPress={() => props.navigation.navigate("ReportScreen")}
              >
                <Card
                  title="Report"
                  image={require("../assets/images/report-icon.png")}
                  imageWrapperStyle={{ padding: 15 }}
                ></Card>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

HomeScreen.navigationOptions = {
  header: null,
};

function DevelopmentModeNotice() {
  if (__DEV__) {
    const learnMoreButton = (
      <Text onPress={handleLearnMorePress} style={styles.helpLinkText}>
        Learn more
      </Text>
    );

    return (
      <Text style={styles.developmentModeText}>
        Development mode is enabled: your app will be slower but you can use
        useful development tools. {learnMoreButton}
      </Text>
    );
  } else {
    return (
      <Text style={styles.developmentModeText}>
        You are not in development mode: your app will run at full speed.
      </Text>
    );
  }
}

function handleLearnMorePress() {
  WebBrowser.openBrowserAsync(
    "https://docs.expo.io/versions/latest/workflow/development-mode/"
  );
}

function handleHelpPress() {
  WebBrowser.openBrowserAsync(
    "https://docs.expo.io/versions/latest/workflow/up-and-running/#cant-see-your-changes"
  );
}

const styles = StyleSheet.create({
  selected: {
    borderColor: "black",
    borderStyle: "solid",
    borderWidth: 1,
    paddingLeft: "35%",
    paddingRight: "35%",
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "lightgreen",
  },
  notSelected: {
    borderColor: "black",
    borderStyle: "solid",
    borderWidth: 1,
    paddingLeft: "35%",
    paddingRight: "35%",
    paddingTop: 10,
    paddingBottom: 10,
  },
  cards: {
    width: "42%",
    marginLeft: "auto",
    marginRight: "auto",
    borderColor: "#A9A9A9",
    borderWidth: 3,
    marginBottom: "3%",
    paddingBottom: 10,
    borderRadius: 6,
  },
});
