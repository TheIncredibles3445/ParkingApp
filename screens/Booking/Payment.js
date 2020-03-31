import React, { useState, useEffect } from "react";
import {
  Alert,
  Image,
  Platform,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Picker
} from "react-native";
import firebase from "firebase/app";
import "firebase/auth";
import db from "../../db.js";
import DatePicker from "react-native-datepicker";
import moment from "moment";
import { AsyncStorage } from "react-native";

export default function Payment(props) {
  const booking = props.navigation.getParam("booking", "some default value");
  const bookingId = props.navigation.getParam("id", "some default value");
  const total = props.navigation.getParam("total", "some default value");
  const [cardNumber, setCardNumber] = useState();
  const [expiry, setExpiryDate] = useState();
  const [securityCode, setSecurityCode] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [useSavedCard, setUseSavedCard] = useState(false);
  const [provider, setProvider] = useState();
  const [userCards, setUserCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState();
  const date = moment().format("YYYY-MM-DD T HH:mm");
  const blockId = props.navigation.getParam("blockId", "No params");
  const parkingId = props.navigation.getParam("parkingId", "No params");

  useEffect(() => {
    //console.log("props", booking, bookingId, total)
    getMyCard();
  });
  const getMyCard = () => {
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("Cards")
      .onSnapshot(querySnapshot => {
        const userCards = [];
        querySnapshot.forEach(doc => {
          userCards.push({ id: doc.id, ...doc.data() });
        });
        setUserCards([...userCards]);
      });
  };
  useEffect(() => {
    console.log("selected ------>", selectedCard);
    if (selectedCard) {
      setCardNumber(selectedCard.number);
      setExpiryDate(selectedCard.expiry);
      setSecurityCode(selectedCard.securityCode);
      setFirstName(selectedCard.firstName);
      setLastName(selectedCard.lastName);
      setProvider(selectedCard.provider);
      setUseSavedCard(true);
    }
  }, [selectedCard]);

  const pay = async () => {
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("Payments")
      .add({
        type: "credit card",
        amount: total,
        bookingId,
        date
      });

    let update = await db
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get();
    let data = update.data();
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .update({ pendingAmount: data.pendingAmount - total });

    if (!useSavedCard) {
      Alert.alert(
        "",
        "Save Credit Card Information?",
        [
          { text: "Yes?", onPress: () => saveCreditCard() },
          { text: "No", onPress: () => handleNavigationAlert() }
        ],
        { cancelable: false }
      );
    } else {
      props.navigation.navigate("Home");
    }
  };

  const handleNavigationAlert = () => {
    Alert.alert(
      "Navigation",
      "Do You Want The Direction For Your Latest Booking?",
      [
        {
          text: "No",
          onPress: () => props.navigation.navigate("Home"),
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: () =>
            props.navigation.navigate("Direction", {
              blockId: blockId,
              parkingId: parkingId
            })
        }
      ],
      { cancelable: false }
    );
  };

  const saveCreditCard = () => {
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("Cards")
      .add({
        type: "credit card",
        firstName,
        lastName,
        number: cardNumber,
        expiry,
        securityCode,
        amount: 1000,
        provider
      });
    handleNavigationAlert();
  };

  return (
    <View>
      <Text>Payment</Text>
      {userCards ? (
        <Picker
          selectedValue={selectedCard}
          style={{
            height: 50,
            width: 200,
            fontSize: 20,
            backgroundColor: "#DCDCDC",
            marginBottom: 4,
            marginTop: 4,
            marginRight: "auto",
            marginLeft: "auto"
          }}
          onValueChange={itemValue => setSelectedCard(itemValue)}
        >
          <Picker.Item label={"Select A Card"} value={""} disabled />
          {userCards.map(a => (
            <Picker.Item label={a.number} value={a} />
          ))}
        </Picker>
      ) : null}

      <Text>Amount: {total}</Text>
      <Text>First Name</Text>
      <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        onChangeText={text => setFirstName(text)}
        // placeholder="Cars Support"
        value={firstName}
      />
      <Text>Last Name</Text>
      <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        onChangeText={text => setLastName(text)}
        // placeholder="Cars Support"
        value={lastName}
      />

      <Text>Card Number</Text>
      <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        keyboardType="numeric"
        onChangeText={text => setCardNumber(text)}
        //placeholder="Cars Support"
        value={cardNumber}
      />
      <Text>Provider</Text>
      <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        onChangeText={text => setProvider(text)}
        value={provider}
      />
      <Text>Expiry Date</Text>
      <DatePicker
        style={{ width: 200 }}
        date={expiry}
        mode="date"
        placeholder="select date"
        format="YYYY-MM"
        minDate={moment()
          .add(1, "M")
          .format("YYYY-MM")}
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
          }
        }}
        onDateChange={date => setExpiryDate(date)}
      />
      <Text>Security Code</Text>
      <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        onChangeText={text => setSecurityCode(text)}
        keyboardType="numeric"
        placeholder="0000"
        value={securityCode}
      />

      <Button
        title="Pay"
        onPress={() => pay()}
        disabled={
          firstName &&
          provider &&
          lastName &&
          cardNumber &&
          expiry &&
          securityCode
            ? false
            : true
        }
      />
    </View>
  );
}
