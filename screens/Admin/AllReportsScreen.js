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
  Alert
} from "react-native";
import db from "../../db.js";
import {
  List,
  ListItem,
  Avatar,
  SearchBar,
  Button
} from "react-native-elements";
import firebase from "firebase/app";
import "firebase/auth";
import * as SMS from "expo-sms";

export default AllReportsScreen = props => {
  const [reports, setReports] = useState([]);
  const [plateNumber, setPlateNumber] = useState("");
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  // const [phoneNumber, setPhoneNumber] = useState("");
  // const [vehicels, setVehicels] = useState("");
  // const [tempVehicels, setTempVehicels] = useState("");

  const handleReports = () => {
    db.collection("Reports").onSnapshot(querySnapshot => {
      const report = [];
      querySnapshot.forEach(doc => {
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

  // const handlePlateNumber = () => {
  //   db.collection("users")
  //     .doc(firebase.auth().currentUser.uid)
  //     .collection("Vehicles")
  //     .onSnapshot(querySnapshot => {
  //       const numbers = [];
  //       querySnapshot.forEach(doc => {
  //         //mapping
  //         numbers.push({ id: doc.id, ...doc.data() });
  //       });
  //       console.log(numbers);
  //       setPlateNumber([...numbers]);
  //       // setArrayHolder(report);
  //     });
  // };

  // useEffect(() => {
  //   handlePlateNumber();
  // }, []);

  //get all the users from database
  //get the vehicels of all users
  const handleSearchUsers = async () => {
    const allVehicles = [];
    //GET ALL USERS FROM THE DATABSE
    db.collection("users").onSnapshot(querySnapshot => {
      const users = [];
      querySnapshot.forEach(doc => {
        //mapping
        users.push({ id: doc.id, ...doc.data() });
      });

      //LOOP THROUGH ALL THE USERS AND GET THE VEHICLE OF EACH USER

      users.map(user => {
        // console.log("user", user);
        db.collection("users")
          .doc(user.id)
          .collection("Vehicles")
          .onSnapshot(querySnapshot => {
            //GETTING ALL THE VEHICLES OF EACH USER
            const numbers = [];
            querySnapshot.forEach(doc => {
              numbers.push({ id: doc.id, ...doc.data(), user: user.id });
            });

            //LOOP THROUGH ALL THE USER VEHICLES
            numbers.map(number => {
              //IF USER WITH THE PLATE NUMBER IS FOUND, SET IT TO STATE
              if (number.plateNumber === parseInt(plateNumber)) {
                setUser(user);
              }
            });
            // console.log("nuimdsfksdmf", numbers);
            //     allVehicles.push(numbers);

            //     //LOOPING AND FINDING THE USER WITH THE SEARCHED PLATE NUMBER
          });
      });

      // console.log("allVehicles", allVehicles);
    });
    // let temp = vehicels;
    // temp.push(tempVehicels);
    // setTempVehicels();

    //setUsers([...users]);

    //console.log(users)
    // for(let i=0;i<users.length;i++){

    //   db.collection("users")
    //   .doc(users.id)
    //   .collection("Vehicles")
    //   .onSnapshot(querySnapshot => {
    //     const numbers = [];
    //     querySnapshot.forEach(doc => {
    //       //mapping
    //       numbers.push({ id: doc.id, ...doc.data(), id: users.id });
    //     });
    //     // console.log(numbers);
    //     setPlateNumber([...numbers]);
    //     // setArrayHolder(report);
    //   });
    //   for(let i=0;i<plateNumber.length;i++){
    // }
  };

  const handleAlert = () => {
    Alert.alert(
      "Solving Issues",
      "Are you sure you want to solve this issue??",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel ..."),
          style: "cancel"
        },
        { text: "Yes", onPress: () => checkAvailable() }
      ],
      { cancelabele: false }
    );
  };

  const checkAvailable = async () => {
    const isAvailable = await SMS.isAvailableAsync();
    console.log(user);
    if (isAvailable) {
      const { result } = await SMS.sendSMSAsync(
        ["${user.phone}"],
        "Hello, you parked wrong!! please go and fix it!"
      );
      console.log(result);
    }
  };

  return (
    <ScrollView>
      <SearchBar
        // lightTheme
        onChangeText={text => setPlateNumber(text)}
        onSubmitEditing={handleSearchUsers}
        value={plateNumber}
        // onClearText={handleSearchUsers}
        placeholder="Search Here..."
      />
      {user === null ? (
        reports.map((item, i) => (
          <View key={i}>
            <TouchableOpacity onPress={() => handleAlert()}>
              <View style={{ flexDirection: "row" }}>
                <Avatar
                  containerStyle={{ marginTop: 33 }}
                  source={{ uri: item.image }}
                  size={50}
                />
                <View style={{ marginLeft: 50, marginTop: 35 }}>
                  <Text style={{ fontSize: 20 }}>{item.description}</Text>
                  <Text style={{ fontSize: 15 }}>
                    Car Number: {item.plateNumber}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <View style={{ marginLeft: 50, marginTop: 35 }}>
          <Text
            style={{
              marginBottom: 20,
              fontSize: 20,
              marginRight: 20
            }}
          >
            User Details
          </Text>

          <Text style={{ fontSize: 15, marginRight: 50 }}>
            User Name: {user.name}
          </Text>
          <Text style={{ fontSize: 15 }}> User Email: {user.email}</Text>
          <Text style={{ fontSize: 15 }}> Phone Number: {user.phone}</Text>
          <View style={{ width: "50%", marginLeft: "10%", marginTop: "20%" }}>
            <Button title=" GO TO THE REPORTS" onPress={() => setUser(null)} />
          </View>
        </View>
      )}
      {/* {user === null ? ():null
      // reports.map((item, i) => (
      //   <View key={i}>
         
      //       <TouchableOpacity>
      //         <View style={{ flexDirection: "row" }}>
      //           <Avatar
      //             containerStyle={{ marginTop: 33 }}
      //             source={{ uri: item.image }}
      //             size={50}
      //           />
      //           <View style={{ marginLeft: 50, marginTop: 35 }}>
      //             <Text style={{ fontSize: 20 }}>{item.description}</Text>
      //             <Text style={{ fontSize: 15 }}>
      //               Car Number: {item.plateNumber}
      //             </Text>
      //           </View>
      //         </View>
      //       </TouchableOpacity>
      //     ))
      //   </View>
      // ) :   (

      // )} */}
    </ScrollView>
  );
};

AllReportsScreen.navigationOptions = {
  title: "All Reports"
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#fff"
  }
});
