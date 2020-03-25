import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { Card } from "react-native-shadow-cards";

import { Input, Divider, Button, Icon, Text } from "react-native-elements";
import db from "../../db";
import firebase from "firebase/app";
import "firebase/auth";

export default function Vehicle(props) {
  const [userVehicles, setUserVehicles] = useState([]);

  useEffect(() => {
    db.collection("Users")
      .doc(firebase.auth().currentUser.uid)
      .collection("Vehicles")
      .onSnapshot(querySnapshot => {
        let vehicle = [];
        querySnapshot.forEach(doc => {
          vehicle.push({ id: doc.id, ...doc.data() });
        });
        setUserVehicles(vehicle);
      });
  }, []);

  return userVehicles.length === 0 ? (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Icon type="font-awesome" name="car" size={80} color="blue" />
      <Text style={{ fontSize: 20 }}>You have no cars registered</Text>
      {/* <Button title="+" buttonStyle={{ borderRadius: 100 }} /> */}
      <TouchableOpacity onPress={() => props.navigation.navigate("AddVehicle")}>
        <Icon
          type="ionicon"
          name="ios-add-circle-outline"
          size={30}
          color="blue"
        />
      </TouchableOpacity>
    </View>
  ) : (
    <ScrollView>
      <View style={{ flex: 1, alignItems: "center", marginTop: 20 }}>
        <Text h4>My Vehicles</Text>
      </View>
      <View>
        {userVehicles.map(
          (item, index) => (
            <View key={index}>
              <Card style={{ padding: 20, margin: 15 }}>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 16,
                    opacity: 0.7
                  }}
                >
                  Car Make: <Text>{item.make}</Text>
                </Text>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 16,
                    opacity: 0.7
                  }}
                >
                  Car Model: <Text>{item.model}</Text>
                </Text>

                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 16,
                    opacity: 0.7
                  }}
                >
                  Car Type: <Text>{item.type}</Text>
                </Text>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 16,
                    opacity: 0.7
                  }}
                >
                  Plate Number: <Text>{item.number}</Text>
                </Text>
              </Card>
            </View>
          )
          // console.log(item)
        )}
      </View>
      <View>
        <TouchableOpacity
          onPress={() => props.navigation.navigate("AddVehicle")}
        >
          <Icon
            type="ionicon"
            name="ios-add-circle-outline"
            size={30}
            color="blue"
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

Vehicle.navigationOptions = {
  title: "My Vehicles"
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1
  },
  backTextWhite: {
    color: "#FFF"
  },
  rowFront: {
    alignItems: "center",
    backgroundColor: "#CCC",
    borderBottomColor: "black",
    borderBottomWidth: 1,
    justifyContent: "center",
    height: 50
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: "red",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15
  },
  backRightBtn: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: 75
  },
  backRightBtnRight: {
    backgroundColor: "red",
    right: 0
  }
});
