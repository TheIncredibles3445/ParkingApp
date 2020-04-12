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
  Platform,
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
        expiry: expiry,
      });
      props.navigation.goBack();
    } else alert("Please Enter All The Fields");
  };

  return (
    <ScrollView
      behavior={Platform.OS === "ios" ? "padding" : null}
      style={{ flex: 1, backgroundColor: "#F0F8FF" }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView>
          <View style={{ flex: 1, alignItems: "center", marginTop: 20 }}>
            <Text h4>Add Cards</Text>
          </View>
          <View
            style={{
              marginTop: 40,
              width: "90%",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <Input
              label="Card Number"
              placeholder="1234-5678-1234-5678"
              keyboardType="number-pad"
              value={cardNumber}
              onChangeText={(text) => setCardNumber(text)}
            />
          </View>
          <View
            style={{
              marginTop: 40,
              width: "90%",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <Input
              label="Card Expiry Date"
              //inputStyle={flag ? { color: "red" } : { color: "black" }}
              placeholder="MM/YY"
              value={expiry}
              keyboardType="number-pad"
              onChangeText={(text) => setExpiry(text)}
            />
          </View>
          <View
            style={{
              marginTop: 40,
              width: "90%",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <Text
              style={{
                marginLeft: 10,
                color: "gray",
                fontWeight: "bold",
                fontSize: 16,
                opacity: 0.7,
              }}
            >
              Card Type
            </Text>
            {Platform.OS === "android" ? (
              <Picker
                selectedValue={type}
                onValueChange={(cardType) => setType(cardType)}
              >
                <Picker.Item label="Select Type" value="" />
                <Picker.Item label="Credit" value="Credit" />
                <Picker.Item label="Debit" value="Debit" />
              </Picker>
            ) : (
              <View
                style={{
                  marginTop: 40,
                  width: "90%",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                <TouchableOpacity
                  style={{
                    paddingTop: 15,
                    marginLeft: 10,
                  }}
                  onPress={() => {
                    pickerRef.show();
                  }}
                >
                  <Text>{type === "" ? "Select Type" : type}</Text>
                </TouchableOpacity>
                <ReactNativePickerModule
                  pickerRef={(e) => (pickerRef = e)}
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
          <View
            style={{
              marginTop: 40,
              width: "90%",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <Input
              label="Card Provider"
              placeholder="Card Provider"
              value={provider}
              onChangeText={(text) => setProvider(text)}
            />
          </View>
          <View
            style={{
              marginTop: 40,
              width: "90%",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <TouchableOpacity
              onPress={() => handleSave()}
              style={{
                backgroundColor: "#B0C4DE",
                height: 50,
                justifyContent: "center",
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  color: "#263c5a",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                Add
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
}

AddCard.navigationOptions = {
  title: "Add a Card",
  headerStyle: { backgroundColor: "#5a91bf" },
  headerTintColor: "white",
};

const s = StyleSheet.create({
  switch: {
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  container: {
    backgroundColor: "#F5F5F5",
    marginTop: 60,
  },
  label: {
    color: "black",
    fontSize: 12,
  },
  input: {
    fontSize: 16,
    color: "black",
  },
});
