import React, { useState, useEffect } from "react";
import {
  TextInput,
  // Button,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Image,
  Picker,
  Text,
  View,
} from "react-native";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";
import db from "../../db.js";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import DatePicker from "react-native-datepicker";
import { Button, Divider, Input } from "react-native-elements";

export default function DiscountsScreen(props) {
  const [discounts, setDiscounts] = useState([]);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [usage, setUsage] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [active, setActive] = useState(true);
  const [requiredPoints, setRequiredPoints] = useState(0);

  const handleCreate = () => {
    db.collection("discounts").add({
      name: name,
      code: code,
      percentage: percentage,
      usage: usage,
      startDate: startDate,
      endDate: endDate,
      requiredPoints: requiredPoints,
      active: active,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <KeyboardAvoidingView enabled behavior="padding">
          <Text style={{ fontSize: 25, marginLeft: "30%" }}>Discount Form</Text>
          <Divider style={{ marginTop: 5 }} />
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                marginBottom: 10,
                fontSize: 15,
                marginRight: 4,
                marginTop: "7%",
                fontSize: 15,
              }}
            >
              Discount Name:
            </Text>
            <TextInput
              style={{
                width: "59%",
                height: 30,
                borderColor: "gray",
                borderWidth: 1,
                borderRadius: 5,
                marginLeft: "4%",
                marginBottom: "1%",
                marginTop: "5%",
                backgroundColor: "#f5f5f5",
              }}
              value={name}
              onChangeText={(text) => setName(text)}
              placeholder=" Discount Name .."
            />
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                marginBottom: 10,
                fontSize: 15,
                marginRight: 4,
                marginTop: "5%",
                fontSize: 15,
              }}
            >
              Discount Code:
            </Text>
            <TextInput
              style={{
                width: "59%",
                height: 30,
                borderColor: "gray",
                borderWidth: 1,
                borderRadius: 5,
                marginLeft: "5.3%",
                marginBottom: "1%",
                marginTop: "3.5%",
                backgroundColor: "#f5f5f5",
              }}
              value={code}
              onChangeText={(code) => setCode(code)}
              placeholder=" Discount Code .."
            />
          </View>
          <View style={{ flexDirection: "row", padding: 5 }}>
            <Text
              style={{
                marginBottom: 10,
                fontSize: 15,
                marginRight: 4,
                marginTop: "8%",
              }}
            >
              Percentage:
            </Text>

            <Picker
              style={styles.picker}
              mode="dropdown"
              selectedValue={percentage}
              onValueChange={(num) => setPercentage(num)}
            >
              <Picker.Item label="Select.." value="" />
              <Picker.Item label="5" value="5" />
              <Picker.Item label="10" value="10" />
              <Picker.Item label="15" value="15" />
              <Picker.Item label="20" value="20" />
            </Picker>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                marginBottom: 10,
                fontSize: 15,
                marginLeft: 3,
                marginTop: "7%",
              }}
            >
              Usage:
            </Text>

            <TextInput
              style={{
                width: "57%",
                height: 33,
                borderColor: "gray",
                borderWidth: 1,
                borderRadius: 5,
                marginLeft: "18.5%",
                marginBottom: "2%",
                marginTop: "5%",
                backgroundColor: "#f5f5f5",
              }}
              value={usage}
              onChangeText={(num) => setUsage(num)}
              placeholder=" Usage .."
            />
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                marginBottom: 10,
                fontSize: 15,
                marginLeft: 3,
                marginTop: "7%",
              }}
            >
              Required Points:
            </Text>

            <TextInput
              style={{
                width: "60%",
                height: 30,
                borderColor: "gray",
                borderWidth: 1,
                borderRadius: 5,
                marginLeft: "3%",
                marginBottom: "3%",
                marginTop: "5%",
                backgroundColor: "#f5f5f5",
              }}
              value={requiredPoints}
              onChangeText={(num) => setRequiredPoints(num)}
              placeholder=" Required Points .."
            />
          </View>
          {/* </View> */}
          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontSize: 15, marginTop: "4%" }}>Start Date: </Text>
            <DatePicker
              style={{
                width: "71%",
                marginLeft: "1.9%",
                marginTop: "2%",
                marginBottom: "6%",
                fontSize: 15,
              }}
              date={startDate}
              mode="date"
              placeholder="select date"
              format="YYYY-MM-DD"
              minDate="2016-05-01"
              // maxDate="2016-06-01"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: "absolute",
                  left: 0,
                  top: 4,

                  marginLeft: 0,
                },
                dateInput: {
                  marginLeft: 44,
                  borderRadius: 5,
                  backgroundColor: "#f5f5f5",
                },
                datePickerCon: { color: "black" },
              }}
              onDateChange={(date) => {
                // console.log(date);
                setStartDate(date);
              }}
            />
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontSize: 15, marginTop: "2%" }}>End Date: </Text>
            <DatePicker
              style={{
                width: "71%",
                marginLeft: "4%",
                marginTop: "1%",
                marginBottom: "5%",
                fontSize: 15,
              }}
              date={endDate}
              mode="date"
              placeholder="select date"
              format="YYYY-MM-DD"
              minDate="2016-05-01"
              // maxDate="2016-06-01"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: "absolute",
                  left: 0,
                  top: 0,
                  marginLeft: 0,
                },
                dateInput: {
                  marginLeft: 43,
                  marginBottom: "4%",
                  borderRadius: 5,
                  backgroundColor: "#f5f5f5",
                },
                datePickerCon: { color: "black" },
              }}
              onDateChange={(date) => {
                // console.log(date);
                setEndDate(date);
              }}
            />
          </View>

          <View
            style={{
              marginBottom: "15%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              onPress={handleCreate}
              title="Create"
              // color="red"
              buttonStyle={{ paddingEnd: 50, paddingStart: 50 }}
              titleStyle={{ alignItems: "center" }}
            />
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
}
DiscountsScreen.navigationOptions = {
  title: "Discounts",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#fff",
  },
  input: {
    //flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "flex-start",
    //width: "100%"
  },
  picker: {
    height: 50,
    width: "62%",
    marginTop: "5%",
    marginLeft: 38,
    // borderWidth: 1,
    // borderRadius: 8,
    // backgroundColor: "#f5f5f5",
    // borderWidth:1,
    // marginRight: "5%",
    alignItems: "center",
    // padding: 2,
  },
  box: {
    padding: 5,
    flexDirection: "row",
  },
});
