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
  View
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
  const [code, setCode] = useState("");
  const [usage, setUsage] = useState("");
  const [percentage, setPercentage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleCreate = () => {};

  return (
    <View>
      <Text style={{ fontSize: 25, marginLeft: "30%" }}>Discount Form</Text>
      <Divider style={{ marginTop: 10 }} />

      <View style={{ marginTop: 15 }}>
        <Input
          label="Discount Code"
          placeholder="Enter code..."
          // keyboardType="number-pad"
          labelStyle={{ color: "black" }}
          // value={cardNumber}
          // onChangeText={text => setCardNumber(text)}
        />
      </View>
      <View style={{ marginTop: 15 }}>
        <Text style={{ marginLeft: "2%", fontWeight: "bold", fontSize: 17 }}>
          Percentage
        </Text>

        <Picker
          selectedValue={percentage}
          onValueChange={percent => setPercentage(percent)}
        >
          <Picker.Item label="Select.." value="" />
          <Picker.Item label="5%" value="5%" />
          <Picker.Item label="10%" value="10%" />
          <Picker.Item label="15%" value="15%" />
          <Picker.Item label="20%" value="20%" />
        </Picker>
      </View>
      <View style={{ marginTop: 15 }}>
        <Text style={{ marginLeft: "2%", fontWeight: "bold", fontSize: 17 }}>
          Usage
        </Text>
        <Input
          // label="Percentage"
          placeholder="Usage"
          // keyboardType="number-pad"
          labelStyle={{ color: "black" }}
          value={usage}
          onChangeText={text => setUsage(text)}
        />
      </View>
      <View style={{ marginTop: 15 }}>
        <Text style={{ marginLeft: "2%", fontWeight: "bold", fontSize: 17 }}>
          Start Date
        </Text>

        <DatePicker
          style={{
            width: "80%",
            marginLeft: "3.5%",
            marginBottom: "6%",
            fontSize: 15
          }}
          date={startDate}
          mode="date"
          placeholder="select date"
          format="YYYY-MM-DDThh:mm"
          minDate="2016-05-01"
          showIcon={true}
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
            },
            datePickerCon: { color: "black" }
          }}
          onDateChange={startDate => {
            setStartDate(startDate);
          }}
        />
      </View>
      <View style={{ marginTop: 15 }}>
        <Text style={{ marginLeft: "2%", fontWeight: "bold", fontSize: 17 }}>
          End Date
        </Text>

        <DatePicker
          style={{
            width: "80%",
            marginLeft: "3.5%",
            marginBottom: "6%",
            fontSize: 15
          }}
          date={endDate}
          mode="date"
          placeholder="select date"
          format="YYYY-MM-DDThh:mm"
          minDate="2016-05-01"
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
            },
            datePickerCon: { color: "black" }
          }}
          onDateChange={endDate => {
            setEndDate(endDate);
          }}
        />
      </View>

      <View style={{ marginTop: "5%", alignItems: "center" }}>
        <Button
          onPress={handleCreate}
          title="Create"
          // color="red"
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
