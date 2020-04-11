import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Card } from "react-native-elements";
// import MakeItRain from "./MakeItRain";
import { Input, Divider, Button, Icon, Text } from "react-native-elements";
import db from "../../db";
import firebase from "firebase/app";
import "firebase/auth";
// import RewardsComponent from "react-native-rewards";
// import * as Animatable from "react-native-animatable";
import { FontAwesome5 } from "@expo/vector-icons";

export default function RewardScreen(props) {
  const [total, setTotal] = useState(0);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState("");
  const [update, setUpdate] = useState(false);
  const [animationState, setAnimationState] = useState("rest");
  // const [usageCount, setUsageCount] = useState(0);

  const [discount, setDiscount] = useState([]);

  const handleUser = async () => {
    const userData = await db
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get();
    let tempUser = userData.data();
    setUser(tempUser);
  };

  useEffect(() => {
    handleUser();
  }, []);

  useEffect(() => {}, [update]);

  const handleDiscounts = () => {
    db.collection("discounts").onSnapshot((querySnapshot) => {
      const discounts = [];
      querySnapshot.forEach((doc) => {
        //mapping
        discounts.push({ id: doc.id, ...doc.data() });
      });
      setDiscount([...discounts]);
    });
  };
  useEffect(() => {}, [discount]);

  useEffect(() => {
    handleDiscounts();
  }, []);

  // create a discount_users sub collection
  // update the user points
  const handleUse = async (d) => {
    const discount = await db
      .collection("discounts")
      .doc(d.id)
      .collection("discount_users")
      .doc(firebase.auth().currentUser.uid)
      .set({
        userId: firebase.auth().currentUser.uid,
        usageCount: 0,
      });
    let user = await db
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get();
    console.log(" user points", user.data().points);
    let newPoints = parseInt(user.data().points);
    let newData = newPoints - d.requiredPoints;
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .update({ points: newData, discount: d.id });
    handleUser();
  };

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          {/* <MakeItRain count={15} delay={3000}> */}
          <Text
            style={{
              // paddingTop: "1%",
              // marginLeft: "22%",
              fontSize: 30,
              color: "#263c5a",
              fontWeight: "bold",
            }}
          >
            Your Total Points
          </Text>
          {/* <Animatable.View
            animation="flash"
            direction="alternate"
            iterationCount={"infinite"}
          > */}
          <Text
            style={{
              // marginLeft: "45%",
              fontSize: 25,
              // marginTop: "5%",
              color: "#263c5a",
              fontWeight: "bold",
            }}
          >
            {user.points}
            <FontAwesome5 name="coins" size={30} color="gold" />

            {/* <Image
              style={{
                marginBottom: 4,
                marginLeft: "auto",
                // marginRight: "auto",
                height: "50%",
                width: "50%",
              }}
              source={require(`../../assets/images/coins.png`)}
            /> */}
          </Text>
          {/* </Animatable.View> */}
          {/* </MakeItRain> */}
        </View>

        {discount.map((d, i) => {
          return (
            <View key={i}>
              <View>
                <Card
                  containerStyle={{
                    borderColor: "#263c5a",
                  }}
                >
                  <View style={{ marginTop: 20 }}>
                    <Text
                      style={{
                        fontSize: 18,
                        marginLeft: "5%",
                        color: "#263c5a",
                        // paddingTop: 5,
                        // width: "50%",
                        fontWeight: "bold",
                        //backgroundColor: "blue",
                        // marginTop: "10%",
                      }}
                    >
                      {d.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: "bold",
                        marginLeft: "69%",
                        //backgroundColor: "red",
                        // marginBottom: "3%",
                      }}
                    >
                      for {d.requiredPoints} points
                    </Text>
                    <View
                      style={{
                        alignItems: "flex-end",
                        paddingVertical: 15,
                        marginTop: 10,
                      }}
                    >
                      <View
                        style={{
                          width: "30%",
                          height: 20,
                          marginTop: "7%",
                        }}
                      >
                        <Button
                          buttonStyle={{ backgroundColor: "#B0C4DE" }}
                          titleStyle={{
                            alignItems: "center",
                            color: "#263c5a",
                          }}
                          title="USE IT"
                          onPress={() => handleUse(d)}
                          disabled={
                            user.points >= d.requiredPoints && !user.discount
                              ? false
                              : true
                          }
                        />
                      </View>
                    </View>
                  </View>
                </Card>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
RewardScreen.navigationOptions = {
  title: "Reward Points",
  headerTintColor: "white",
  headerStyle: { backgroundColor: "#5a91bf" },
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F8FF",
  },
  buttonProps: {
    backgroundColor: "#f60",
    height: 60,
    width: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  buttonText: {
    color: "white",
    fontSize: 24,
  },
});
