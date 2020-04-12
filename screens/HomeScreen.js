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
import { Avatar, Icon } from "react-native-elements";
import { Card, Text, Button } from "react-native-elements";
import { NavigationActions } from "react-navigation";
import { ScrollView } from "react-native-gesture-handler";
import TimedSlideshow from 'react-native-timed-slideshow';
import { AsyncStorage } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { Image } from "react-native";
import { hasStartedLocationUpdatesAsync } from "expo-location";

export default function HomeScreen(props) {

  const [ads, setAds] = useState([])
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([])
  const [isVerified, setIsVerified] = useState(true);
  const [update, setUpdate] = useState(true)
  const [timer, setTimer] = useState(10);
  const [timeoutId, setTimeoutId] = useState(null);

  const unsubscribe = props.navigation.addListener('didFocus', () => {
    console.log('focussed');
    track()
  });

  const track = async () => {
    console.log(" in track")
    let old = await db.collection("tracking").doc("track").get()
    // AsyncStorage.setItem("service", "yes");
    let check = await AsyncStorage.getItem("service")
    console.log(check)
    if (check === "yes") {
      let newTrack = parseInt(old.data().service) - 1
      db.collection("tracking").doc("track").update({ service: newTrack })
      AsyncStorage.setItem("service", "no");
    }

    let check2 = await AsyncStorage.getItem("parking")
    console.log(check2)
    if (check2 === "yes") {
      let newTrack = parseInt(old.data().parking) - 1
      db.collection("tracking").doc("track").update({ parking: newTrack })
      AsyncStorage.setItem("parking", "no");
    }
    

  }



  useEffect(() => {
    db.collection("Advertisement").where("adStatus", "==", "Approved").get()
      .then(querySnapshot => {
        let ads = [];
        querySnapshot.forEach(doc => {
          ads.push({ id: doc.id, ...doc.data() });
          console.log("---------------------",ads)
        });
        setAds([...ads]);

      });
    //setAll(ads)
    console.log("ads are", ads)



  },[])

  useEffect(() => {
    
    let temp = []
    for (let i = 0; i < ads.length; i++) {
      console.log("result --->>>", new Date(ads[i].startDate).getTime(), new Date().getTime())
      if (new Date(ads[i].startDate).getTime() <= new Date().getTime() && new Date().getTime() <= new Date(ads[i].endDate).getTime())
        temp.push({ uri: ads[i].photoURL, title: ads[i].title, text: ads[i].description })
    }
    setItems(temp)
    console.log("items are", items)
    getUser()
  }, [ads])
  



  const getUser = async () => {
    const loggedInUser = await db
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get();
    //const data = { id: loggedInUser.id, ...loggedInUser.data() };
    setUser(loggedInUser.data());
  };


  return ( 
    <SafeAreaView
      style={
        Platform.OS !== "ios"
          ? { flex: 1, marginTop: 10, justifyContent: "space-evenly", backgroundColor: "#F0F8FF" }
          : { flex: 1, backgroundColor: "#F0F8FF" }
      }
    >

      <View style={{ fontFamily: "sans-serif-medium", height: "40%", width: "90%", marginBottom: "2%", marginLeft: "auto", marginRight: "auto" }}>
        {
          items.length > 0 ?
            <TimedSlideshow
              items={items}
            />
            :
            null
        }

      </View>
      <Text style={{ marginLeft: "auto", marginRight: "auto", fontSize: 30, color: "#284057", marginBottom: "2%" }}>CNA-Q Parking Assistant</Text>

      <View
        style={{ marginLeft: "auto", marginRight: "auto", flexDirection: "row", width: "85%", height: "8%" }}>

        <TouchableOpacity style={styles.btns} onPress={()=> Alert.alert(`Earn Points And Get Discount!`,` \n 20 points for: \n Service or parking booking. \n Reporting issues.`)}>
          <Text
            style={{ marginLeft: "10%", color: "#F0F8FF", fontSize: 15 , fontWeight:"bold" }}
      >My Points {user ? user.points : null}  </Text>
       <Icon name="star-outlined" type="entypo" color={"white"} style={{marginRight:"auto"}}/>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btns}>
          <Text
            style={{ marginLeft: "10%", color: "white", fontSize: 15, fontWeight:"bold"  }}
            onPress={()=>props.navigation.navigate("RewardScreen")}
          >Get Discounts  </Text>
          <Icon name="sale" type="material-community" color={"white"} style={{marginRight:"auto"}}/> 
        </TouchableOpacity>

      </View>


      <View style={{ marginLeft: "auto", marginRight: "auto", borderColor: "#B0C4DE", borderTopWidth: 2, borderBottomWidth: 2, height: "38%" }}>
        <ScrollView horizontal={true} contentContainerStyle={styles.childScrollViewStyle}>

          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={styles.options}
              disabled={!isVerified}
              onPress={() => props.navigation.navigate("ParkingBooking")}
            >
              
              <Image
                    //style={{ width: 100, height: 100  }}
                    style={styles.icons}
                    source={require('../assets/images/parkings.png')}
                />
                <Text style={styles.labels}>Book a Parking</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.options} onPress={() => props.navigation.navigate("FindParking")}>

              <Image
                //style={{ width: 100, height: 100  }}
                style={styles.icons}
                source={require('../assets/images/free.png')}
              />
              <Text style={styles.labels}>Find Free Parkings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={!isVerified}
              style={styles.options}
              onPress={() => props.navigation.navigate("ServiceBooking")}
            >

              <Image
                //style={{ width: 100, height: 100  }}
                style={styles.icons}
                source={require('../assets/images/service.png')}
              />
              <Text style={styles.labels}>Book Services</Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={!isVerified}
              style={styles.options}
              onPress={() => props.navigation.navigate("ReportScreen")}
            >

              <Image
                //style={{ width: 100, height: 100  }}
                style={styles.icons}
                source={require('../assets/images/reports.jpg')}
              />
              <Text style={styles.labels}>Report a Problem</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.options}
              onPress={() => props.navigation.navigate("Advertisement")}
            >

              <Image
                //style={{ width: 100, height: 100  }}
                style={styles.icons}
                source={require('../assets/images/advertise2.png')}
              />
              <Text style={styles.labels}>Advertise With us</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>



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
  options: {
    width: "19%",
    marginLeft: "1%",
    // marginRight: "auto",
    borderColor: "#B0C4DE",
    borderWidth: 2,
    marginTop: "1.5%",
    marginBottom: "1.5%",
    paddingBottom: 10,
    borderRadius: 6,
  },
  sliderContent: {
    marginTop: 50,
    paddingVertical: 20,
    backgroundColor: '#F5FCFF',
    //width:1000
  },
  parentScrollViewStyle: {
    height: 300,
    borderWidth: 2,
    height: 150,
    borderColor: 'red',
    marginTop: "2%"
  },
  childScrollViewStyle: {
    //borderBottomWidth: 1,
    //borderColor: '#D3D3D3',
    width: 1000,
    margin: 2,
    //height:100
  },
  icons: {
    width: 150,
    height: 150,
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 10,
    marginTop: "5%"

  },
  labels: {
    fontSize: 21,
    color: "#284057",
    marginLeft: "auto",
    marginRight: "auto",
    fontWeight:"bold",
    //fontFamily: "Cochin" 

  },
  btns: {
    backgroundColor: "#B0C4DE",
    width: "48%",
    height: "70%",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 5, flexDirection:"row"
  }

});