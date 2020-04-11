// import * as WebBrowser from "expo-web-browser";
//@refrest restart
import React, { useState, useEffect } from "react";
import DatePicker from "react-native-datepicker";
import firebase from "firebase/app";
import "firebase/auth";
import db from "../../../db.js";

import {
  Modal,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Alert,
  Platform,
  Button,
  SafeAreaView,
  StyleSheet,
  Picker
} from "react-native";
import { AsyncStorage } from "react-native";
import FlashMessage from "react-native-flash-message";
import { showMessage, hideMessage } from "react-native-flash-message";
export default function ParkingBooking(props) {
  //============================ START DATE AND TIME ============================

  const [startTime, setStartTime] = useState("00:00");
  const [friend, setfriend] = useState();
  const [friendsList, setFriendsList] = useState([]);
  const [endTime, setEndTime] = useState("00:00");
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [blocks, setBlocks] = useState([]);

  const unsubscribe = props.navigation.addListener('didFocus', () => {
    console.log('focussed');
    track()
});

const track = async()=>{
  let old = await db.collection("tracking").doc("track").get()
  let newTrack = parseInt(old.data().parking) + 1
  db.collection("tracking").doc("track").update({ parking: newTrack})
  AsyncStorage.setItem("parking", "yes");
  
  showMessage({
    message: newTrack + " User/Users Trying To Book a Parking Right Now!!",
    //description: newTrack + " Users Are Trying To Book a Parking Right Now !!",
    type: "success"
  })
}

  useEffect(() => {
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("Friends")
      .onSnapshot(querySnapShot => {
        let friends = [];
        querySnapShot.forEach(doc => {
          friends.push({ id: doc.id, ...doc.data() });
        });
     
        //console.log("one and only", friends.id);
        setFriendsList(friends);
        console.log("my frienxxdss", friendsList);
      });
  }, []);

  useEffect(() => {
    db.collection("block").onSnapshot(querySnapshot => {
      let blcks = [];

      querySnapshot.forEach(doc => {
        blcks.push({ id: doc.id, ...doc.data(), isSelected: false });
      });
      setBlocks([...blcks]);
    });
  }, []);

  const handleLogout = () => {
    firebase.auth().signOut();
  };

  const handleSelectedBlock = (item, index) => {
    let tempBlocks = blocks;
    tempBlocks.map(tempItem => {
      if (tempItem.isSelected) {
        tempItem.isSelected = false;
      }
    });
    tempBlocks[index].isSelected = true;
    setSelectedBlock(item);
    setBlocks(tempBlocks);
  };

  const handleBooking = () => {
    if (startTime === "00:00") {
      alert("Select Start Time");
    } else if (
      startTime === "08:00 pm" ||
      startTime === "09:00 pm" ||
      startTime === "10:00 pm" ||
      startTime === "11:00 pm"
    ) {
      alert("IT IS TOO LATE TO BOOK");
    } else if (
      startTime === "01:00 am" ||
      startTime === "02:00 am" ||
      startTime === "04:00 am" ||
      startTime === "03:00 am" ||
      startTime === "05:00 am"
    ) {
      alert("IT IS TOO EARLY TO BOOK");
    } else if (selectedBlock === null) {
      alert("Select a block");
    } else {
      const data = {
        startTime: startTime,
        endTime: endTime,
        selectedBlock: selectedBlock
      };

      props.navigation.navigate("Parking", { data: data, friend: friend });
    }
  };

  return (
    <View style={{flex: 1}}>
      <View style={{ flex: 1, alignItems: "center" }}>
        <Text style={{ fontSize: 20 }}>Book your desired Parking spot!</Text>
      </View>
      <View style={{ flex: 5 }}>
        <View style={{ flex: 2, alignItems: "center" }}>
          <Text style={{ fontSize: 20 }}>SELECT START TIME</Text>
          <DatePicker
            style={{ width: "80%" }}
            date={startTime}
            mode="time"
            format="hh:mm a"
            showIcon={false}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            is24Hour={true}
            customStyles={{
              datePickerCon: { color: "black" }
            }}
            onDateChange={time => setStartTime(time)}
          />

          <Text style={{ fontSize: 20 }}>SELECT END TIME</Text>
          <DatePicker
            style={{ width: "80%" }}
            date={endTime}
            mode="time"
            showIcon={false}
            format="hh:mm a"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            is24Hour={true}
            customStyles={{
              datePickerCon: { color: "black" }
            }}
            onDateChange={time => setEndTime(time)}
          />
        </View>
        <View
          style={{
            flex: 4,
            alignItems: "center",
            justifyContent: "space-evenly"
          }}
        >
          <Text style={{ fontSize: 20 }}>Select Block</Text>
          {blocks.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleSelectedBlock(item, index)}
            >
              <View
                style={item.isSelected ? styles.selected : styles.notSelected}
              >
                <Text>{item.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <Text>Book for af friends</Text>

        <Picker
          mode="dropdown"
          selectedValue={friend}
          style={{ height: 50, width: 150 }}
          onValueChange={(itemValue, itemIndex) => setfriend(itemValue)}
        >
          <Picker.Item label={"Select"} value={""} disabled />
          {friendsList.map((v, index) => {
            return <Picker.Item label={v.displayName} value={v.id} />;
          })}
        </Picker>

        <Button title="BOOK" onPress={() => handleBooking()} />
        {/* <Button title="Logout" onPress={() => handleLogout()} /> */}
        {/* <Button
          title="Navigate"
          onPress={() =>
            props.navigation.navigate(
              "LinksStack",
              {},
              NavigationActions.navigate({ routeName: "LinksScreen" })
            )
          }
        /> */}
      </View>
      <FlashMessage position="bottom" animationDuration={700} duration={4000} style={{marginBottom:100}} />
    </View>
  );
}

ParkingBooking.navigationOptions = {
  title: "Parking Booking"
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
