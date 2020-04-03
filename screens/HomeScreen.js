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
  StyleSheet
} from "react-native";
import { Card, Text, Button, Icon } from "react-native-elements";
import { NavigationActions } from "react-navigation";
import { ScrollView } from "react-native-gesture-handler";
import TimedSlideshow from 'react-native-timed-slideshow';
export default function HomeScreen(props) {

  const [ads, setAds] = useState([])
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([])
  const [isVerified, setIsVerified] = useState(true);

  useEffect(() => {
    db.collection("Advertisement").where("adStatus","==","Approved").get()
      .then(querySnapshot => {
        let ads = [];
        querySnapshot.forEach(doc => {
          ads.push({ id: doc.id, ...doc.data() });
        });
        setAds([...ads]);

      });
    //setAll(ads)
    console.log("ads are", ads)

    let temp = []
    for (let i = 0; i < ads.length; i++) {
      console.log("result --->>>",new Date(ads[i].startDate).getTime() ,new Date().getTime())
      if( new Date(ads[i].startDate).getTime() <= new Date().getTime() && new Date().getTime() <= new Date(ads[i].endDate).getTime())
    temp.push({ uri: ads[i].photoURL, title: ads[i].title, text: `${<Button />}` })
    }
    setItems(temp)
  },[])


  const getAds = async () => {

    db.collection("Advertisement").get()
      .then(querySnapshot => {
        let ads = [];
        querySnapshot.forEach(doc => {
          ads.push({ id: doc.id, ...doc.data() });
        });
        setAds([...ads]);

      });
    //setAll(ads)
    console.log("ads are", ads)

    let temp = []
    for (let i = 0; i < ads.length; i++) {
      temp.push({ uri: ads[i].photoURL, title: ads[i].title, text: "info" })
    }
    setItems(temp)

  }



  const getUser = async () => {
    const loggedInUser = await db
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get();
    const data = { id: loggedInUser.id, ...loggedInUser.data() };
    setUser(data);
  };

  const clicked = () =>{
    console.log("clicked ---------->>>>>")
  }


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

  return (
    <SafeAreaView
      style={
        Platform.OS !== "ios"
          ? { flex: 1, marginTop: 10, justifyContent: "space-evenly", backgroundColor: "#DCDCDC" }
          : { flex: 1, backgroundColor: "#DCDCDC" }
      }
    >



      <View style={{ height: "40%", width: "100%" }}>
        {
          items.length > 0 ?
            <TimedSlideshow
              items={items}
              onPress={()=>clicked()}
            />

            :
            null
        }

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
          {/* <View>
            <Button title="Send Email" onPress={handleSend} />
          </View> */}
        </View>

      </ScrollView>


    </SafeAreaView>
  );
}

HomeScreen.navigationOptions = {
  header: null
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
    backgroundColor: "lightgreen"
  },
  notSelected: {
    borderColor: "black",
    borderStyle: "solid",
    borderWidth: 1,
    paddingLeft: "35%",
    paddingRight: "35%",
    paddingTop: 10,
    paddingBottom: 10
  },
  cards: {
    width: "42%",
    marginLeft: "auto",
    marginRight: "auto",
    borderColor: "#A9A9A9",
    borderWidth: 3,
    marginBottom: "3%",
    paddingBottom: 10,
    borderRadius: 6
  }
});

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff"
//   },
//   developmentModeText: {
//     marginBottom: 20,
//     color: "rgba(0,0,0,0.4)",
//     fontSize: 14,
//     lineHeight: 19,
//     textAlign: "center"
//   },
//   contentContainer: {
//     paddingTop: 30
//   },
//   welcomeContainer: {
//     alignItems: "center",
//     marginTop: 10,
//     marginBottom: 20
//   },
//   welcomeImage: {
//     width: 100,
//     height: 80,
//     resizeMode: "contain",
//     marginTop: 3,
//     marginLeft: -10
//   },
//   getStartedContainer: {
//     alignItems: "center",
//     marginHorizontal: 50
//   },
//   homeScreenFilename: {
//     marginVertical: 7
//   },
//   codeHighlightText: {
//     color: "rgba(96,100,109, 0.8)"
//   },
//   codeHighlightContainer: {
//     backgroundColor: "rgba(0,0,0,0.05)",
//     borderRadius: 3,
//     paddingHorizontal: 4
//   },
//   getStartedText: {
//     fontSize: 24,
//     color: "rgba(96,100,109, 1)",
//     lineHeight: 24,
//     textAlign: "center"
//   },
//   tabBarInfoContainer: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     ...Platform.select({
//       ios: {
//         shadowColor: "black",
//         shadowOffset: { width: 0, height: -3 },
//         shadowOpacity: 0.1,
//         shadowRadius: 3
//       },
//       android: {
//         elevation: 20
//       }
//     }),
//     alignItems: "center",
//     backgroundColor: "#fbfbfb",
//     paddingVertical: 20
//   },
//   tabBarInfoText: {
//     fontSize: 17,
//     color: "rgba(96,100,109, 1)",
//     textAlign: "center"
//   },
//   navigationFilename: {
//     marginTop: 5
//   },
//   helpContainer: {
//     marginTop: 15,
//     alignItems: "center"
//   },
//   helpLink: {
//     paddingVertical: 15
//   },
//   helpLinkText: {
//     fontSize: 14,
//     color: "#2e78b7"
//   }
// });
