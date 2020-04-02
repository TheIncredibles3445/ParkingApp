import React, { useState, useEffect } from "react";
import {
  TextInput,
  // Button,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Image,
  Text,
  View
} from "react-native";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";
import db from "../../db.js";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import DatePicker from "react-native-datepicker";
import { Button } from "react-native-elements";

export default function DiscountsScreen(props) {
  return (
    <View>
      <Text>Code</Text>
      <Text>Percentage</Text>
      <Text>Usage</Text>
      <Text>Start Date </Text>
      <Text>End Date</Text>

      <View style={{ marginTop: "60%", alignItems: "center" }}>
        <Button
          // onPress={handleSave}
          title="Create"
          buttonStyle={{ paddingEnd: 50, paddingStart: 50 }}
          titleStyle={{ alignItems: "center" }}
        />
      </View>
    </View>
  );
}
DiscountsScreen.navigationOptions = {
  title: "Discounts"
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#fff"
  },
  input: {
    //flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "flex-start"
    //width: "100%"
  }
});
