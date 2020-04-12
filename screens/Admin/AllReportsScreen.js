import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SegmentedControlIOSComponent,
  Image,
  // Button,
  TextInput,
  Alert,
} from "react-native";
import db from "../../db.js";
import {
  List,
  ListItem,
  Avatar,
  SearchBar,
  Button,
  Divider,
} from "react-native-elements";
import firebase from "firebase/app";
import "firebase/auth";
import * as SMS from "expo-sms";
import * as Animatable from "react-native-animatable";
import { Card } from "react-native-elements";

export default AllReportsScreen = (props) => {
  const [reports, setReports] = useState([]);
  const [plateNumber, setPlateNumber] = useState("");
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(false);
  const [showTitle, setShowTitle] = useState(true);

  const handleReports = () => {
    db.collection("Reports").onSnapshot((querySnapshot) => {
      const report = [];
      querySnapshot.forEach((doc) => {
        //mapping
        report.push({ id: doc.id, ...doc.data() });
      });
      // console.log(report);
      setReports([...report]);
      // setArrayHolder(report);
    });
  };
  useEffect(() => {}, [reports]);

  useEffect(() => {
    handleReports();
  }, []);

  //get all the users from database
  //get the vehicels of all users
  const handleSearchUsers = async () => {
    console.log("updating--------------------------------------", showTitle);
    if (plateNumber !== "") {
      setShowTitle(false);
      console.log("updating--------------------------------------", showTitle);
      const allVehicles = [];
      //GET ALL USERS FROM THE DATABSE
      db.collection("users")
        .where("role", "==", "user")
        .onSnapshot((querySnapshot) => {
          const users = [];
          querySnapshot.forEach((doc) => {
            //mapping
            users.push({ id: doc.id, ...doc.data() });
          });

          //LOOP THROUGH ALL THE USERS AND GET THE VEHICLE OF EACH USER
          let count = 0;
          users.map((user, index) => {
            // console.log("user", user);
            db.collection("users")
              .doc(user.id)
              .collection("Vehicles")
              .onSnapshot((querySnapshot) => {
                //GETTING ALL THE VEHICLES OF EACH USER
                const numbers = [];
                querySnapshot.forEach((doc) => {
                  numbers.push({ id: doc.id, ...doc.data(), user: user.id });
                });

                //LOOP THROUGH ALL THE USER VEHICLES
                // let count = 0;
                numbers.map((number, index) => {
                  //IF USER WITH THE PLATE NUMBER IS FOUND, SET IT TO STATE
                  if (number.plateNumber === plateNumber) {
                    setUser({ ...user, plateNumber: plateNumber });
                  } else {
                    count++;
                  }
                  console.log("count", count);
                  console.log("users length", users.length);
                  if (count === users.length) {
                    alert("No User Found With That Plate Number");
                  }
                });

                //     allVehicles.push(numbers);

                //     //LOOPING AND FINDING THE USER WITH THE SEARCHED PLATE NUMBER
              });
          });

          // console.log("allVehicles", allVehicles);
        });
    } else {
      setUser(null);
      setShowTitle(true);
      console.log("updating--------------------------------------", showTitle);
    }
  };

  const handleAlert = (plateNumber) => {
    Alert.alert(
      "Solving Issues",
      "Are you sure you want to solve this issue??",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel ..."),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => checkAvailable() && updateStatus(plateNumber),
        },
      ],
      { cancelabele: false }
    );
  };
  //sending sms
  const checkAvailable = async () => {
    const isAvailable = await SMS.isAvailableAsync();
    console.log(user);
    if (isAvailable) {
      const { result } = await SMS.sendSMSAsync(
        [`${user.phoneNumber}`],
        "Hello, you parked wrong!! please go and fix it!"
      );
      console.log(result);
    }
  };
  // update the status of th report
  const updateStatus = (pNumber) => {
    reports.map((text) => {
      if (text.plateNumber === pNumber) {
        db.collection("Reports").doc(text.id).update({ status: true });
      }
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <SearchBar
          lightTheme
          onChangeText={(text) => setPlateNumber(text)}
          onSubmitEditing={handleSearchUsers}
          value={plateNumber}
          placeholder="Search Here..."
        />
        {/* <Animatable.View
          animation="flash"
          direction="alternate"
          iterationCount="infinite"
        > */}

        <Text
          style={{
            fontSize: 23,
            fontWeight: "bold",
            marginLeft: "25%",
            marginTop: "3%",
            color: "#005992",
          }}
        >
          {showTitle == true ? "List of all Reports" : null}
        </Text>

        {/* </Animatable.View> */}
        {user === null ? (
          reports.map((item, i) =>
            item.status === false ? (
              <Animatable.View animation="bounceInDown" direction="normal">
                <View key={i}>
                  <View style={{ flexDirection: "row" }}>
                    <Avatar
                      containerStyle={{ marginTop: 33 }}
                      source={{ uri: item.image }}
                      size={50}
                    />
                    <View style={{ marginLeft: 50, marginTop: 35 }}>
                      <Text style={{ fontSize: 21 }}>{item.description}</Text>
                      <Text>
                        Car Number:
                        <Text style={{ fontSize: 15, color: "#005992" }}>
                          {item.plateNumber}
                        </Text>
                      </Text>
                    </View>
                  </View>
                </View>
              </Animatable.View>
            ) : null
          )
        ) : (
          <View>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                // marginTop: "1%",
              }}
            >
              <Text
                style={{
                  marginBottom: 20,
                  fontSize: 25,
                  marginRight: 20,
                  color: "#005992",
                  fontWeight: "bold",
                }}
              >
                User information
              </Text>
              <View>
                <Card
                  containerStyle={{
                    borderColor: "#263c5a",
                    width: "85%",
                    // height:"100%"
                    // borderWidth: 1,
                  }}
                >
                  <View style={{ marginLeft: 30 }}>
                    <View style={{ flexDirection: "row" }}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: "bold",
                          color: "#263c5a",
                        }}
                      >
                        User Name:
                      </Text>
                      <Text>{user.displayName}</Text>
                    </View>

                    <View style={{ flexDirection: "row" }}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: "bold",
                          color: "#263c5a",
                        }}
                      >
                        User Email:
                      </Text>
                      <Text>{user.email}</Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: "bold",
                          color: "#263c5a",
                        }}
                      >
                        Phone Number:
                      </Text>
                      <Text>{user.phoneNumber}</Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: "bold",
                          color: "#263c5a",
                        }}
                      >
                        Plate Number:
                      </Text>
                      <Text>{user.plateNumber}</Text>
                    </View>

                    <View style={{ flex: 1, flexDirection: "row" }}>
                      <View
                        style={{
                          width: "35%",
                          // height: "2%",
                          marginLeft: "2%",
                          marginRight: 20,
                          marginTop: "8%",
                        }}
                      >
                        <Button
                          title="CANCEL"
                          onPress={() => setUser(null) || setShowTitle(true)}
                          buttonStyle={{
                            // width:"95%",
                            borderWidth: 1,
                            borderColor: "#263c5a",
                            backgroundColor: "#B0C4DE",
                          }}
                          titleStyle={{
                            alignItems: "center",
                            color: "#263c5a",
                          }}
                        />
                      </View>
                      <View
                        style={{
                          width: "45%",
                          // height: "1%",
                          marginLeft: "2%",
                          marginTop: "8%",
                        }}
                      >
                        <Button
                          title="SOLVE IT"
                          onPress={() => handleAlert(user.plateNumber)}
                          buttonStyle={{
                            borderWidth: 1,
                            borderColor: "#263c5a",
                            backgroundColor: "#B0C4DE",
                          }}
                          titleStyle={{
                            alignItems: "center",
                            color: "#263c5a",
                          }}
                        />
                      </View>
                    </View>
                  </View>
                </Card>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

AllReportsScreen.navigationOptions = {
  title: "All Reports",
  headerTintColor: "white",
  headerStyle: { backgroundColor: "#5a91bf" },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#F0F8FF",
  },
});
