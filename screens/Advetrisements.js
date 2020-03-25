import { useState, useEffect, useDebugValue } from "react";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  TouchableHighlight,
  Modal,
  Image,
  FlatList
} from "react-native";
import firebase from "firebase/app";
import "firebase/auth";
import db from "../db.js";
import * as ImagePicker from "expo-image-picker";
import DatePicker from "react-native-datepicker";
//import moment, { isMoment } from "moment";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Divider } from "react-native-elements";

export default function AdvertisementScreen(props) {
  const [adStatus, setAdStatus] = useState("");
  const [feedback, setFeedback] = useState("");
  const [offerNumber, setOfferNumber] = useState(0);

  const [hasCameraRollPermission, setHasCameraRollPermission] = useState(false);
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [uri, setUri] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [offeredAmount, setOfferedAmount] = useState(0);
  const [prevAds, setPrevAds] = useState([]);
  const [modalVisible2, setmodalVisible2] = useState(false);
  const [modalVisible, setmodalVisible] = useState(false);
  const [modalVisible3, setmodalVisible3] = useState(false);
  const [flag, setFlag] = useState(false);

  const ssetModalVisible = visible => {
    setmodalVisible(visible);
  };
  const ssetModalVisible2 = visible => {
    setmodalVisible2(visible);
  };
  const ssetModalVisible3 = visible => {
    setmodalVisible3(visible);
  };

  // const sendAdmin = async () => {
  //   await db
  //     .collection("users")
  //     .doc("HJmBFsNpwlYOjVa70j4pYPU3jFa2")
  //     .collection("AdsRequest")
  //     .doc(firebase.auth().currentUser.uid)
  //     .set({ status: "Ads Request Received" });

  //   // await db
  //   //   .collection("users")
  //   //   .doc(firebase.auth().currentUser.uid)
  //   //   .collection("Advertisment")
  //   //   .doc()
  //   //   .set({ status: "Friend Request Sent" });

  //   // getMyFriends();
  // };

  // const changeButton=()=>{
  // //  setDisplayName('')
  //   if(displayName==""){
  //     return false
  //   }else{
  //     return true
  //   }
  // }

  //handle image
  const askPermission = async () => {
    const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
    setHasCameraRollPermission(status === "granted");
  };
  const handleSet = async () => {
    const snap = await db
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("Advertisment")
      .doc(firebase.auth().currentUser.uid)
      .get();

    setDisplayName(snap.data().displayName);
    setPhotoURL(snap.data().photoURL);
    setDescription(snap.data().description);
    setLink(snap.data().link);
    setStartDate(snap.data().startDate);
    setEndDate(snap.data().endDate);
    setOfferedAmount(snap.data().offeredAmount);
  };

  useEffect(() => {
    askPermission();
    handleSet();
    getPreviousAds();
  }, []);

  const handlePickImage = async () => {
    // show camera roll, allow user to select
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    if (!result.cancelled) {
      console.log("not cancelled", result.uri);
      setUri(result.uri);
    }
  };

  const getPreviousAds = () => {
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("Advertisment")
      .onSnapshot(querySnapShot => {
        let ads = [];
        querySnapShot.forEach(doc => {
          ads.push(doc.id, doc.data());
        });
        console.log("prev ads", ads);
        console.log("prev ads", ads.length);
        setPrevAds(ads);
      });
  };

  const handleSubmit = async () => {
    // - use firebase storage
    if (uri !== "") {
      const response = await fetch(uri);
      console.log("fetch result", JSON.stringify(response));

      const blob = await response.blob();
      const putResult = await firebase
        .storage()
        .ref()
        .child(firebase.auth().currentUser.uid)
        .put(blob);

      const url = await firebase
        .storage()
        .ref()
        .child(firebase.auth().currentUser.uid)
        .getDownloadURL();
      console.log("download url", url);

      setPhotoURL(url);
    }
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("Advertisment")
      .doc()
      .set({
        displayName,
        photoURL,
        description,
        link,
        startDate,
        endDate,
        offeredAmount,
        feedback,
        offerNumber,
        adStatus
      });

    await db
      .collection("users")
      .doc("HJmBFsNpwlYOjVa70j4pYPU3jFa2")
      .collection("AdsRequest")
      .doc(firebase.auth().currentUser.uid)
      .set({ displayName: displayName, status: "Ads Request Received" });

    alert(`Dear ${displayName} ,
    Your form has been send to the admin`);
  };

  return (
    <View>
      <ScrollView>
        <View
          style={{
            marginBottom: 30,
            marginTop: "6%",
            marginLeft: "auto",
            marginRight: "auto"
          }}
        >
          <Image
            style={{
              marginBottom: 4,
              marginLeft: "auto",
              marginRight: "auto",
              height: 100,
              width: 100
            }}
            //source={require(`../assets/images/feedback.png`)}
          />
          <Button
            title="Check Admin's Feedback"
            onPress={() => ssetModalVisible(!modalVisible)}
          />
        </View>
        <View
          style={{
            width: "46%",
            marginBottom: 30,
            marginLeft: "auto",
            marginRight: "auto"
          }}
        >
          <Image
            style={{
              marginBottom: 4,
              marginLeft: "auto",
              marginRight: "auto",
              height: 100,
              width: 200
            }}
            //source={require(`../assets/images/advertise.png`)}
          />

          <Button
            title="Fill Advertisment Form"
            onPress={() => ssetModalVisible2(!modalVisible2)}
          />
        </View>
        <View style={{ width: "46%", marginLeft: "auto", marginRight: "auto" }}>
          <Image
            style={{
              marginBottom: 4,
              marginLeft: "auto",
              marginRight: "auto",
              height: 100,
              width: 170
            }}
            //source={require(`../assets/images/previousAds.jpg`)}
          />
          <Button
            title="Check previous ads"
            onPress={() => ssetModalVisible3(!modalVisible3)}
          />
        </View>

        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={{ marginTop: 22 }}>
            <TouchableHighlight
              onPress={() => {
                ssetModalVisible(!modalVisible);
              }}
            >
              <Text
                style={{
                  marginLeft: "auto",
                  marginRight: "auto",
                  fontSize: 25
                }}
              >
                <Ionicons name="ios-exit" size={50} />
              </Text>
            </TouchableHighlight>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible2}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={{ marginTop: 22 }}>
            <Text
              style={{
                marginBottom: 10,
                fontSize: 20,
                marginLeft: "auto",
                marginRight: "auto"
              }}
            >
              Advertisment Form
            </Text>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  marginBottom: 10,
                  fontSize: 15,
                  marginRight: 4,
                  marginTop: 8
                }}
              >
                Name
              </Text>
              <TextInput
                style={{
                  width: "70%",
                  height: 40,
                  borderColor: "gray",
                  borderWidth: 1,
                  marginLeft: "10%",
                  marginBottom: "3%"
                }}
                onChangeText={text => setDisplayName(text)}
                placeholder="Advertiser name"
                //  value={displayName}
              />
            </View>

            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  marginBottom: 10,
                  fontSize: 15,
                  marginRight: 4,
                  marginTop: 8
                }}
              >
                Description
              </Text>
              <ScrollView>
                <TextInput
                  multiline={true}
                  numberOfLines={30}
                  style={{
                    width: "90%",
                    height: 130,
                    borderColor: "gray",
                    borderWidth: 1,
                    marginLeft: "1%",
                    textAlignVertical: "top",
                    marginBottom: "4%"
                  }}
                  onChangeText={text => setDescription(text)}
                  placeholder="Description"
                  //value={description}
                />
              </ScrollView>
            </View>

            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  marginBottom: 10,
                  fontSize: 15,
                  marginRight: 4,
                  marginTop: 8
                }}
              >
                Link
              </Text>
              <TextInput
                style={{
                  width: "70%",
                  height: 40,
                  borderColor: "gray",
                  borderWidth: 1,
                  marginLeft: "13%",
                  marginBottom: "3%"
                }}
                onChangeText={text => setLink(text)}
                placeholder="Link"
                //value={link}
              />
            </View>

            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  marginBottom: 10,
                  fontSize: 15,
                  marginRight: 4,
                  marginTop: 8
                }}
              >
                Image
              </Text>
              <TextInput
                style={{
                  width: "70%",
                  height: 40,
                  borderColor: "gray",
                  borderWidth: 1,
                  marginLeft: "9.4%",
                  marginBottom: "2%"
                }}
                onChangeText={text => setPhotoURL(text)}
                placeholder="Image"
                //value={link}
              />
            </View>
            <View
              style={{ width: "73%", marginLeft: "20%", marginBottom: "2%" }}
            >
              <Button title="Pick Image" onPress={handlePickImage} />
            </View>

            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  marginBottom: 10,
                  fontSize: 15,
                  marginRight: 4,
                  marginTop: 8
                }}
              >
                Start Date
              </Text>
              <DatePicker
                style={{ width: 200, marginLeft: "2%", marginBottom: "2%" }}
                date={startDate}
                mode="date"
                placeholder="Select Start Date"
                format="YYYY-MM-DD"
                minDate={date}
                //maxDate="2020-03-23"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateIcon: {
                    position: "absolute",
                    left: 0,
                    top: 4,
                    marginLeft: 0
                  },
                  dateInput: {
                    marginLeft: 36
                  }
                }}
                onDateChange={startDate => setStartDate(startDate)}
              />
            </View>

            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  marginBottom: 10,
                  fontSize: 15,
                  marginRight: 4,
                  marginTop: 8
                }}
              >
                End Date
              </Text>
              <DatePicker
                style={{ width: 200, marginBottom: "2%", marginLeft: "4%" }}
                date={endDate}
                mode="date"
                placeholder="Select End Date"
                format="YYYY-MM-DD"
                minDate={startDate}
                // maxDate="2016-06-01"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateIcon: {
                    position: "absolute",
                    left: 0,
                    top: 4,
                    marginLeft: 0
                  },
                  dateInput: {
                    marginLeft: 36
                  }
                }}
                onDateChange={endDate => setEndDate(endDate)}
              />
            </View>

            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  marginBottom: 10,
                  fontSize: 15,
                  marginRight: 4,
                  marginTop: 8
                }}
              >
                Offered Amount
              </Text>
              <TextInput
                require
                style={{
                  width: "62%",
                  height: 40,
                  borderColor: "gray",
                  borderWidth: 1,
                  marginLeft: "1%",
                  marginBottom: "2%"
                }}
                onChangeText={text => setOfferedAmount(text)}
                placeholder="Offered Amount"
                // value={offeredAmount}
                keyboardType={"numeric"}
                numeric
              />
            </View>
            <View
              style={{ width: "30%", marginLeft: "63%", marginBottom: "2%" }}
            >
              <Button
                //  disabled={changeButton()}
                color="green"
                title="Submit"
                onPress={() =>
                  handleSubmit() &&
                  ssetModalVisible2(!modalVisible2) &&
                  sendAdmin()
                }
              />
              {console.log("flaaaaaaag", flag)}
            </View>

            <TouchableHighlight
              onPress={() => {
                ssetModalVisible2(!modalVisible2);
              }}
            >
              <Text
                style={{
                  marginLeft: "auto",
                  marginRight: "auto",
                  fontSize: 25
                }}
              >
                <Ionicons name="ios-exit" size={50} />
              </Text>
            </TouchableHighlight>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible3}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <Text
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              fontSize: 20,
              marginBottom: 12,
              marginTop: 12
            }}
          >
            Previous Advertisments
          </Text>
          <FlatList
            data={prevAds}
            //Item Separator View
            renderItem={({ item }) => {
              return (
                <View key={item.id}>
                  <Text style={{ marginLeft: 10 }}>
                    Name: {item.displayName}
                  </Text>
                  <Text style={{ marginLeft: 10 }}>
                    Description: {item.description}
                  </Text>
                  <Text style={{ marginLeft: 10 }}>
                    Start Date: {item.startDate}
                  </Text>
                  <Text style={{ marginLeft: 10 }}>
                    End Date: {item.endDate}
                  </Text>
                  <Text style={{ marginLeft: 10 }}>Link: {item.link}</Text>
                  <Text style={{ marginLeft: 10 }}>
                    Offered Amount: {item.offeredAmount}
                  </Text>
                  <Divider
                    style={{
                      marginTop: 20,
                      backgroundColor: "lightgray",
                      height: 1
                    }}
                  />
                </View>
              );
            }}
            enableEmptySections={true}
            style={{ marginTop: 10 }}
            keyExtractor={(item, index) => index.toString()}
          />
          <TouchableHighlight
            onPress={() => {
              ssetModalVisible3(!modalVisible3);
            }}
          >
            <Text
              style={{
                marginLeft: "auto",
                marginRight: "auto",
                fontSize: 25
              }}
            >
              <Ionicons name="ios-exit" size={50} />
            </Text>
          </TouchableHighlight>
        </Modal>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#fff"
  },
  num: {
    borderColor: "black",
    borderWidth: 1.1,
    marginLeft: "60%",
    width: 100,
    height: 35,
    backgroundColor: "lightblue"
  },
  num2: {
    borderColor: "black",
    borderWidth: 1.1,
    width: 100,
    height: 35,
    backgroundColor: "gray"
  }
});
