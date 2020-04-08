import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Card } from "react-native-elements";

import { Input, Divider, Button, Icon, Text } from "react-native-elements";
import db from "../../db";
import firebase from "firebase/app";
import "firebase/auth";
import { user } from "firebase-functions/lib/providers/auth";

export default function RewardScreen(props) {
  const [total, setTotal] = useState(0);
  const [users, setUsers] = useState([]);
  const [discount, setDiscount] = useState([]);

  const handleUsers = () => {
    db.collection("users").onSnapshot((querySnapshot) => {
      const userss = [];
      querySnapshot.forEach((doc) => {
        //mapping
        userss.push({ id: doc.id, ...doc.data() });
      });
      setUsers([...userss]);
    });
  };
  useEffect(() => {}, [users]);

  useEffect(() => {
    handleUsers();
  }, []);

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

  return (
    <View>
      <Text style={{marginLeft:"22%", fontSize:30, marginTop:"5%"}}>Your Total Points</Text>
      {discount.map((d, i) => {
        return (
          <View key={i}>
            <Card>
              <View style={{ flexDirection: "column", marginTop: "2%" }}>
                <Text style={{ fontSize: 15 }}>{d.name}</Text>
              </View>
            </Card>
          </View>
        );
      })}
    </View>
  );
}
RewardScreen.navigationOptions = {
  title: "Reward Points",
};
