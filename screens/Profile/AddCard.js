import React, { useState, useEffect } from "react";
import {
  View,
  TouchableWithoutFeedback,
  SafeAreaView,
  Keyboard,
  TouchableOpacity,
  Picker,
  StyleSheet,
  ScrollView,
  Platform
} from "react-native";
import firebase from "firebase/app";
import "firebase/auth";
import db from "../../db";

import { Input, Text, Divider, Button } from "react-native-elements";
import ReactNativePickerModule from "react-native-picker-module";

export default function AddCard(props) {
  let pickerRef = null;
  const [cardNumber, setCardNumber] = useState(0);
  const [expiry, setExpiry] = useState("");
  const [provider, setProvider] = useState("");
  const [type, setType] = useState("");

  const handleSave = async () => {
    if (cardNumber !== 0 && expiry !== "" && type !== "" && provider !== "") {
      const addCard = firebase.functions().httpsCallable("addCard");
      const response = await addCard({
        uid: firebase.auth().currentUser.uid,
        number: cardNumber,
        type: type,
        provider: provider,
        expiry: expiry
      });
      props.navigation.goBack();
    } else alert("Please Enter All The Fields");
  };

  function matchesMonthAndYear(input) {
    return /((0[1-9]|1[0-2])\/[12]\d{1})/.test(input);
  }

  return (
    <ScrollView
      behavior={Platform.OS === "ios" ? "padding" : null}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView>
          <Text h3>Add Card</Text>
          <Divider style={{ marginTop: 20 }} />
          <View style={{ marginTop: 20 }}>
            <Input
              label="Card Number"
              placeholder="1234-5678-1234-5678"
              keyboardType="number-pad"
              value={cardNumber}
              onChangeText={text => setCardNumber(text)}
            />
          </View>
          <View style={{ marginTop: 20 }}>
            <Input
              label="Card Expiry Date"
              //inputStyle={flag ? { color: "red" } : { color: "black" }}
              placeholder="MM/YY"
              value={expiry}
              keyboardType="number-pad"
              onChangeText={text => setExpiry(text)}
            />
          </View>
          <View style={{ marginTop: 20 }}>
            <Text
              style={{
                marginLeft: 10,
                color: "gray",
                fontWeight: "bold",
                fontSize: 16,
                opacity: 0.7
              }}
            >
              Card Type
            </Text>
            {Platform.OS === "android" ? (
              <Picker
                selectedValue={type}
                onValueChange={cardType => setType(cardType)}
              >
                <Picker.Item label="Select Type" value="" />
                <Picker.Item label="Credit" value="Credit" />
                <Picker.Item label="Debit" value="Debit" />
              </Picker>
            ) : (
              <View>
                <TouchableOpacity
                  style={{
                    paddingTop: 15,
                    marginLeft: 10
                  }}
                  onPress={() => {
                    pickerRef.show();
                  }}
                >
                  <Text>{type === "" ? "Select Type" : type}</Text>
                </TouchableOpacity>
                <ReactNativePickerModule
                  pickerRef={e => (pickerRef = e)}
                  selectedValue={type}
                  title={"Select Card Type"}
                  items={["Credit", "Debit"]}
                  // onDismiss={() => {
                  //   console.log("onDismiss");
                  // }}
                  onCancel={() => {
                    console.log("Cancelled");
                  }}
                  onValueChange={(valueText, index) => {
                    console.log(valueText);
                    setType(valueText);
                  }}
                />
              </View>
            )}
          </View>
          <View style={{ marginTop: 20 }}>
            <Input
              label="Card Provider"
              placeholder="Card Provider"
              value={provider}
              onChangeText={text => setProvider(text)}
            />
          </View>
          <View style={{ marginTop: 20, alignItems: "center" }}>
            <Button
              onPress={handleSave}
              title="SAVE"
              buttonStyle={{ paddingEnd: 50, paddingStart: 50 }}
              titleStyle={{ alignItems: "center" }}
            />
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
}

AddCard.navigationOptions = {
  title: "Add a Card"
};

const s = StyleSheet.create({
  switch: {
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 20
  },
  container: {
    backgroundColor: "#F5F5F5",
    marginTop: 60
  },
  label: {
    color: "black",
    fontSize: 12
  },
  input: {
    fontSize: 16,
    color: "black"
  }
});
