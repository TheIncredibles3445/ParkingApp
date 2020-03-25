import React, { useState, useEffect } from "react";
import {
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  SafeAreaView,
  Keyboard,
  TouchableOpacity,
  Picker,
  ScrollView,
  Platform
} from "react-native";
import firebase from "firebase/app";
import "firebase/auth";
import db from "../../db";

import { Input, Text, Divider, Button } from "react-native-elements";
import ReactNativePickerModule from "react-native-picker-module";

export default function AddVehicle(props) {
  let pickerRef = null;
  const [type, setType] = useState("");
  const [model, setModel] = useState("");
  const [make, setMake] = useState("");
  const [number, setNumber] = useState("");

  const handleSave = async () => {
    if (type !== "" && model !== "" && make !== "" && number !== "") {
      const addVehicle = firebase.functions().httpsCallable("addVehicle");
      const response = await addVehicle({
        uid: firebase.auth().currentUser.uid,
        type: type,
        make: make,
        model: model,
        number: number
      });
      props.navigation.goBack();
    } else alert("Please Enter All The Fields");
  };

  // useEffect(() => {}, [type]);

  return (
    <ScrollView
      behavior={Platform.OS === "ios" ? "padding" : null}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView>
          <Text h3>Add Vehicle</Text>
          <Divider style={{ marginTop: 20 }} />
          <View style={{ marginTop: 20 }}>
            <Input
              label="Car Maker / Company"
              placeholder="Car Maker / Company"
              onChangeText={text => setMake(text)}
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
              Car Type
            </Text>
            {Platform.OS === "android" ? (
              <Picker
                selectedValue={type}
                onValueChange={carType => setType(carType)}
              >
                <Picker.Item label="Select Type" value="" />
                <Picker.Item label="Hatchback" value="Hatchback" />
                <Picker.Item label="Sedan" value="Sedan" />
                <Picker.Item label="SUV" value="SUV" />
                <Picker.Item label="Convertible" value="Convertible" />
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
                  title={"Select Car Type"}
                  items={["Hatchback", "SUV", "Convertible", "Sedan"]}
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
              label="Car Model"
              placeholder="Car Model"
              onChangeText={text => setModel(text)}
            />
          </View>
          <View style={{ marginTop: 20 }}>
            <Input
              label="Plate Number"
              placeholder="Plate Number"
              onChangeText={text => setNumber(text)}
            />
          </View>
          {/* <View style={{ marginTop: 20 }}>
            <TriangleColorPicker
              onColorSelected={color => alert(`Color selected: ${color}`)}
              hideSliders={false}
            />
          </View> */}
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

AddVehicle.navigationOptions = {
  title: "Add a Vehicle"
};
