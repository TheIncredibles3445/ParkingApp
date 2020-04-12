// import * as WebBrowser from "expo-web-browser";
//@refrest restart
import React, { useState, useEffect } from "react";
import DatePicker from "react-native-datepicker";
import firebase from "firebase/app";
import "firebase/auth";
import db from "../../../db.js";
import * as Animatable from "react-native-animatable";
import { Button, Header, Icon, Rating } from "react-native-elements";
import Unorderedlist from "react-native-unordered-list";
import {
  Modal,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Alert,
  Platform,
  SafeAreaView,
  StyleSheet,
  Picker,
  Dimensions,
} from "react-native";
import { AsyncStorage } from "react-native";
import FlashMessage from "react-native-flash-message";
import { showMessage, hideMessage } from "react-native-flash-message";
import ReactNativePickerModule from "react-native-picker-module";
import { Col, Row, Grid } from "react-native-easy-grid";

const { width, height } = Dimensions.get("window");
export default function ParkingBooking(props) {
  //============================ START DATE AND TIME ============================

  const [startTime, setStartTime] = useState("00:00");
  const [friend, setFriend] = useState(null);
  const [friendsList, setFriendsList] = useState([]);
  const [endTime, setEndTime] = useState("00:00");
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [friendNames, setFriendNames] = useState([]);
  let pickerRef = null;

  const unsubscribe = props.navigation.addListener("didFocus", () => {
    console.log("focussed");
    track();
  });

  const track = async () => {
    let old = await db.collection("tracking").doc("track").get();
    let newTrack = parseInt(old.data().parking) + 1;
    db.collection("tracking").doc("track").update({ parking: newTrack });
    AsyncStorage.setItem("parking", "yes");

    showMessage({
      message: newTrack + " User/Users Trying To Book a Parking Right Now!!",
      //description: newTrack + " Users Are Trying To Book a Parking Right Now !!",
      type: "success",
    });
  };

  useEffect(() => {
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("Friends")
      .where("booking", "==", true)
      .onSnapshot((querySnapShot) => {
        let friends = [];
        let friendNms = [];
        querySnapShot.forEach((doc) => {
          friends.push({ id: doc.id, ...doc.data() });
          friendNms.push(doc.data().displayName);
        });
        setFriendNames([...friendNms]);
        setFriendsList([...friends]);
      });
  }, []);

  useEffect(() => {
    db.collection("block").onSnapshot((querySnapshot) => {
      let blcks = [];

      querySnapshot.forEach((doc) => {
        blcks.push({ id: doc.id, ...doc.data(), isSelected: false });
      });
      setBlocks([...blcks]);
    });
  }, []);

  const getRating = async (blockId) => {
    const bookings = await db
      .collection("booking")
      .where("type", "==", "Parking")
      .where("blockId", "==", blockId)
      .get();

    let avgRating = 0;
    let totalRate = 0;
    let bookingsData = bookings.docs;
    for (let i = 0; i < bookingsData.length; i++) {
      let parkingBooking = await db
        .collection("booking")
        .doc(bookingsData[i].id)
        .collection("parking_booking")
        .get();

      for (let p of parkingBooking.docs) {
        totalRate += p.data().rating;
      }

      if (i === bookingsData.length - 1) {
        avgRating = totalRate / bookingsData.length;
      }
    }
    return avgRating;
  };

  const handleLogout = () => {
    firebase.auth().signOut();
  };

  // const handleRef = (ref, index) => {
  //   this.view = ref;
  // };

  const handleSelectedBlock = async (item, index) => {
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
    } else {
      let tempBlocks = blocks;
      tempBlocks.map((tempItem) => {
        if (tempItem.isSelected) {
          tempItem.isSelected = false;
        }
      });
      tempBlocks[index].isSelected = true;
      const avgRating = await getRating(item.id);

      setRating(avgRating);
      setSelectedBlock(item);
      setIsVisible(true);
      setBlocks(tempBlocks);
    }
  };

  const handleSetFriend = (username) => {
    friendsList.map((item) => {
      if (item.displayName === username) {
        setFriend(item);
      }
    });
  };

  const handleBooking = () => {
    const data = {
      startTime: startTime,
      endTime: endTime,
      selectedBlock: selectedBlock,
    };

    props.navigation.navigate("Parking", { data: data, friend: friend });
    setIsVisible(false);
  };

  return (
    <Grid style={{ backgroundColor: "#F0F8FF" }}>
      <Row size={5} style={{ alignSelf: "center" }}>
        <Text style={{ fontSize: 20 }}>Book Your Desired Parking Spot!</Text>
      </Row>
      <Row size={95}>
        <Grid>
          <Col
            size={40}
            style={{
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
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
                datePickerCon: { color: "black" },
                dateInput: {
                  borderRadius: 35,
                },
              }}
              onDateChange={(time) => setStartTime(time)}
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
                datePickerCon: { color: "black" },
                dateInput: {
                  borderRadius: 35,
                  width: 10,
                },
              }}
              onDateChange={(time) => setEndTime(time)}
            />
            {Platform.OS === "android" ? (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 18 }}>Book For Friends</Text>
                <Picker
                  mode="dropdown"
                  selectedValue={friend}
                  style={styles.picker}
                  onValueChange={(itemValue, itemIndex) => setFriend(itemValue)}
                >
                  <Picker.Item label={"Select"} value={""} disabled />
                  {friendsList.map((v, index) => {
                    return <Picker.Item label={v.displayName} value={v} />;
                  })}
                </Picker>
              </View>
            ) : (
              friendNames && (
                <View style={{ justifyContent: "space-around" }}>
                  <TouchableOpacity
                    onPress={() => {
                      pickerRef.show();
                    }}
                  >
                    <Text style={{ fontSize: 20 }}>
                      {friend === null ? "Select Friend" : friend.displayName}
                    </Text>
                  </TouchableOpacity>
                  <ReactNativePickerModule
                    pickerRef={(e) => (pickerRef = e)}
                    selectedValue={friend}
                    title={"Select Friend"}
                    items={friendNames}
                    onValueChange={(valueText, index) => {
                      handleSetFriend(valueText);
                    }}
                  />
                </View>
              )
            )}
          </Col>
          <Row size={60}>
            <Grid
              style={{
                alignItems: "center",
                justifyContent: "space-evenly",
              }}
            >
              <Row size={10} style={{ justifyContent: "center" }}>
                <Text style={{ fontSize: 20 }}>Select Block</Text>
              </Row>
              <Row
                size={80}
                style={{
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {blocks.length === 0 ? (
                  <Button title="Loading button" loading type="clear" />
                ) : (
                  blocks.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleSelectedBlock(item, index)}
                    >
                      <Animatable.View
                        animation="bounceIn"
                        // ref={(ref) => handleRef(ref, index)}
                        style={
                          item.isSelected ? styles.selected : styles.notSelected
                        }
                      >
                        <Text style={{ textAlign: "center" }}>{item.name}</Text>
                      </Animatable.View>
                    </TouchableOpacity>
                  ))
                )}
              </Row>
            </Grid>
          </Row>
        </Grid>
      </Row>
      <FlashMessage
        position="bottom"
        animationDuration={700}
        duration={4000}
        style={{ marginBottom: 100 }}
      />
      <Modal animationType="slide" transparent={true} visible={isVisible}>
        <View style={styles.centeredView}>
          <View style={{ ...styles.modalView }}>
            <Header
              backgroundColor="#5a91bf"
              centerComponent={
                <Text
                  style={{
                    color: "white",
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  Parking Details
                </Text>
              }
              rightComponent={
                <TouchableOpacity
                  onPress={() => {
                    setIsVisible(!isVisible);
                  }}
                >
                  <Icon
                    name="close"
                    type="font-awesome"
                    size={25}
                    color="white"
                  />
                </TouchableOpacity>
              }
            />

            <Grid style={{ width: width }}>
              <Row size={15} style={{ justifyContent: "center" }}>
                <Text style={{ fontWeight: "bold", fontSize: 25 }}>
                  Parking Details
                </Text>
              </Row>
              <Row size={10}>
                <Text style={styles.textStyle}>
                  Block: {selectedBlock && selectedBlock.name}
                </Text>
              </Row>
              <Col size={35}>
                <Text style={styles.textStyle}>Nearby Buildings:</Text>
                {selectedBlock &&
                  selectedBlock.nearby.map((item, index) => {
                    return index < 2 ? (
                      <View
                        style={{
                          flexDirection: "row",
                          flexWrap: "wrap",
                          alignItems: "center",
                        }}
                      >
                        <Icon name="dot-single" type="entypo" size={30} />
                        <Text style={{ ...styles.textStyle, fontSize: 15 }}>
                          {item}
                        </Text>
                      </View>
                    ) : null;
                  })}
              </Col>
              <Row size={40}>
                <Grid>
                  <Row style={{ justifyContent: "center" }}>
                    {/* <Rating
                      showRating
                      readonly
                      imageSize={15}
                      fractions={1}
                      startingValue={rating}
                    /> */}
                    <View
                      style={{ flexDirection: "row", justifyContent: "center" }}
                    >
                      <Text style={styles.textStyle}>Average Ratings: </Text>
                      <Icon name="star" type="entypo" color="yellow" />
                      <Text style={styles.textStyle}>{rating.toFixed(1)}</Text>
                    </View>
                  </Row>
                  <Row style={{ justifyContent: "center" }}>
                    <TouchableOpacity
                      onPress={() => handleBooking()}
                      style={{
                        backgroundColor: "#B0C4DE",
                        height: 50,
                        width: 150,
                        borderRadius: 10,
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: "#263c5a",
                          textAlign: "center",
                          fontWeight: "bold",
                        }}
                      >
                        BOOK
                      </Text>
                    </TouchableOpacity>
                  </Row>
                </Grid>
              </Row>
            </Grid>
          </View>
        </View>
      </Modal>
    </Grid>
  );
}

ParkingBooking.navigationOptions = {
  title: "Parking Booking",
  headerTintColor: "white",
  headerStyle: {
    backgroundColor: "#5a91bf",
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  selected: {
    borderColor: "black",
    borderStyle: "solid",
    borderWidth: 1,
    padding: "15%",
    backgroundColor: "#5a91bf",
  },
  notSelected: {
    borderColor: "black",
    borderStyle: "solid",
    borderWidth: 1,
    padding: "15%",
  },
  picker: {
    height: 50,
    width: 150,
    borderColor: "black",
    borderWidth: 1,
    borderStyle: "solid",
  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalView: {
    height: height / 1.9,
    width: width,
    // margin: 20,
    backgroundColor: "#F0F8FF",
    // borderRadius: 1,
    // padding: 35,
    alignItems: "center",
    // backgroundColor: "lightblue",
  },
  textStyle: {
    fontWeight: "bold",
    fontSize: 18,
  },
});
