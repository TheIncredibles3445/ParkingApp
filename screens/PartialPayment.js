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
  Picker,
} from "react-native";
import firebase from "firebase/app";
import "firebase/auth";
import db from "../db";
import DatePicker from "react-native-datepicker";
import moment from "moment";
import { AsyncStorage } from "react-native";

export default function ParcialPayment(props) {
  const userid = props.navigation.getParam("user", "some default value");
  const [user, setUser] = useState();
  const [cardNumber, setCardNumber] = useState();
  const [expiry, setExpiryDate] = useState();
  const [securityCode, setSecurityCode] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [useSavedCard, setUseSavedCard] = useState(false);
  const [provider, setProvider] = useState();
  const [userCards, setUserCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState();
  const [selectedPayment, setSelectedPayment] = useState();
  const [amount, setAmount] = useState();
  const date = moment().format("YYYY-MM-DD T HH:mm");

  useEffect(() => {
    getUser();
    getMyCard();
    console.log("user", user);
    console.log("user card", userCards);
  }, []);

  const getUser = async () => {
    let u = await db.collection("users").doc(userid.uid).get();
    setUser(u.data());
  };

  const getMyCard = () => {
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("Cards")
      .onSnapshot((querySnapshot) => {
        const userCards = [];
        querySnapshot.forEach((doc) => {
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
    let update = await db
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get();

    if (selectedPayment == "Advertisement") {
      db.collection("users")
        .doc(firebase.auth().currentUser.uid)
        .collection("Payments")
        .add({
          type: "credit card",
          amount: amount,
          for: "Advertisement Pending Amount",
          date,
        });

      db.collection("users")
        .doc(firebase.auth().currentUser.uid)
        .update({ advPendingAmount: update.data().pendingAmount - amount });
    } else {
      db.collection("users")
        .doc(firebase.auth().currentUser.uid)
        .collection("Payments")
        .add({
          type: "credit card",
          amount: amount,
          for: "Bookings Pending Amount",
          date,
        });

      db.collection("users")
        .doc(firebase.auth().currentUser.uid)
        .update({ pendingAmount: update.data().pendingAmount - amount });
    }
    if (!useSavedCard) {
      Alert.alert(
        "",
        "Save Credit Card Information?",
        [
          { text: "Yes?", onPress: () => saveCreditCard() },
          { text: "No", onPress: () => props.navigation.navigate("Settings") },
        ],
        { cancelable: false }
      );
    } else {
      setSelectedPayment();
      props.navigation.navigate("Settings");
    }
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
        provider,
      });
    setSelectedPayment();

    props.navigation.navigate("Settings");
  };

  return (
    <View>
      <ScrollView>
        <Text>Payment</Text>
        <Text>Bookings: {user ? user.pendingAmount : null}</Text>
        <Text>Advertisements: {user ? user.advPendingAmount : null}</Text>

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
              marginLeft: "auto",
            }}
            onValueChange={(itemValue) => setSelectedCard(itemValue)}
          >
            <Picker.Item label={"Select A Card"} value={""} disabled />
            {userCards.map((a) => (
              <Picker.Item label={a.number} value={a} />
            ))}
          </Picker>
        ) : null}

        <Picker
          selectedValue={selectedPayment}
          style={{
            height: 50,
            width: 200,
            fontSize: 20,
            backgroundColor: "#DCDCDC",
            marginBottom: 4,
            marginTop: 4,
            marginRight: "auto",
            marginLeft: "auto",
          }}
          onValueChange={(itemValue) => setSelectedPayment(itemValue)}
        >
          <Picker.Item label={"Payment For"} value={""} disabled />

          {user && parseInt(user.pendingAmount) > 0 ? (
            <Picker.Item label={"Bookings"} value={"Bookings"} />
          ) : null}
          {user && parseInt(user.AdvPendingAmount) > 0 ? (
            <Picker.Item label={"Advertisement"} value={"Advertisement"} />
          ) : null}
        </Picker>

        {selectedPayment ? (
          <View>
            <Text>First Name</Text>
            <TextInput
              style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
              onChangeText={(text) => setFirstName(text)}
              // placeholder="Cars Support"
              value={firstName}
            />
            <Text>Last Name</Text>
            <TextInput
              style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
              onChangeText={(text) => setLastName(text)}
              // placeholder="Cars Support"
              value={lastName}
            />
            <Text>Amount</Text>
            <TextInput
              style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
              keyboardType="numeric"
              onChangeText={(text) => setAmount(text)}
              //placeholder="Cars Support"
              value={amount}
            />

            <Text>Card Number</Text>
            <TextInput
              style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
              keyboardType="numeric"
              onChangeText={(text) => setCardNumber(text)}
              //placeholder="Cars Support"
              value={cardNumber}
            />
            <Text>Provider</Text>
            <TextInput
              style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
              onChangeText={(text) => setProvider(text)}
              value={provider}
            />
            <Text>Expiry Date</Text>
            <DatePicker
              style={{ width: 200 }}
              date={expiry}
              mode="date"
              placeholder="select date"
              format="YYYY-MM"
              minDate={moment().add(1, "M").format("YYYY-MM")}
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
                  marginLeft: 36,
                },
              }}
              onDateChange={(date) => setExpiryDate(date)}
            />
            <Text>Security Code</Text>
            <TextInput
              style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
              onChangeText={(text) => setSecurityCode(text)}
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
                securityCode &&
                amount
                  ? false
                  : true
              }
            />
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

ParcialPayment.navigationOptions = {
  title: "Payment",
};
