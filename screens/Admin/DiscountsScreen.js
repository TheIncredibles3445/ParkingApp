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
      percentage: parseInt(percentage),
      usage: usage,
      startDate: startDate,
      endDate: endDate,
      requiredPoints: parseInt(requiredPoints),
      active: active,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={{ height: "100%", flex: 1 }}>
        <KeyboardAvoidingView enabled behavior="padding">
          <Text
            style={{
              fontSize: 25,
              marginLeft: "28%",
              color: "#263c5a",
              fontWeight: "bold",
            }}
          >
            Discount Form
          </Text>
          {/* <Divider style={{ marginTop: 3 }} /> */}
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
                marginLeft: "5%",
                marginBottom: "1%",
                marginTop: "3.5%",
                backgroundColor: "#f5f5f5",
              }}
              value={code}
              onChangeText={(code) => setCode(code)}
              placeholder=" Discount Code .."
            />
          </View>
          <View style={{ flexDirection: "row", width: "100%", height: "9%" }}>
            <Text
              style={{
                marginBottom: 10,
                fontSize: 15,
                marginRight: 8,
                marginTop: "5%",
                fontSize: 15,
              }}
            >
              Percentage:
            </Text>

            <Picker
              style={{
                width: "60%",
                height: "90%",
                borderColor: "gray",
                borderWidth: 1,
                borderRadius: 5,
                marginLeft: "10%",
                marginBottom: "1%",
                marginTop: "2.5%",
                backgroundColor: "#f5f5f5",
              }}
              mode="dropdown"
              itemStyle={{ height: "100%" }}
              selectedValue={percentage}
              onValueChange={(num) => setPercentage(num)}
            >
              <Picker.Item label="Select.." value="" />
              <Picker.Item label="5%" value="5" />
              <Picker.Item label="10%" value="10" />
              <Picker.Item label="15%" value="15" />
              <Picker.Item label="20%" value="20" />
              <Picker.Item label="25%" value="25" />
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
                width: "56%",
                height: 32,
                borderColor: "gray",
                borderWidth: 1,
                borderRadius: 5,
                marginLeft: "20%",
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
                height: 28,
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

          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontSize: 15, marginTop: "4%" }}>Start Date: </Text>
            <DatePicker
              style={{
                width: "72%",
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
                  borderColor: "gray",
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
                width: "72%",
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
                  borderColor: "gray",
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
              width: "50%",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: "25%",
            }}
          >
            <Button
              onPress={handleCreate}
              title="Create"
              buttonStyle={{
                paddingEnd: 50,
                borderWidth: 1,
                borderColor: "#263c5a",
                paddingStart: 50,
                backgroundColor: "#B0C4DE",
              }}
              titleStyle={{
                alignItems: "center",
                color: "#263c5a",
                // borderColor: "#B0C4DE",
              }}
            />
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
}
DiscountsScreen.navigationOptions = {
  title: "Discount",
  headerTintColor: "white",
  headerStyle: { backgroundColor: "#5a91bf" },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#F0F8FF",
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
    borderWidth: 2,
    borderColor: "black",
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
