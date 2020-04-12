import React, { useState, useEffect, useRef } from "react";
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
import db from "../../db.js";
import DatePicker from "react-native-datepicker";
import moment from "moment";
import { AsyncStorage } from "react-native";

export default function Payment(props) {
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
  const [discount, setDiscount] = useState()
  const [newAmount, setNewAmount] = useState(0)
  //const [DiscountId , setDiscountId] = useState("") 
  const [update, setUpdate] = useState(true)
  //const discountId = useRef()
  useEffect(() => {
    //console.log("props", booking, bookingId, total)
    getDiscount();
    getMyCard();

  }, []);

  const getDiscount = async () => {
    let user = await db.collection("users").doc(firebase.auth().currentUser.uid).get()


    if (user.data().discount && user.data().discount !== "") {
      const disc = await db.collection("discounts").doc(user.data().discount).get()
      setDiscount(disc.data())
      //calculate(user.data())
    }
  }


  useEffect(() => {
    setUpdate(!update)
  }, [newAmount])

  useEffect(() => {
    console.log("the discount", discount)
    if (discount) {
      let percentage = parseInt(discount.percentage) / 100
      let p = total * percentage
      let newTotal = total - p
      setNewAmount(newTotal)
    }

  }, [discount])


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
    if (discount) {
      db.collection("users")
        .doc(firebase.auth().currentUser.uid)
        .collection("Payments")
        .add({
          type: "credit card",
          amount: newAmount,
          bookingId,
          date
        });
      console.log("--------------------------------------", discount)
      //update usage in 
      //**
      let user = await db.collection("users").doc(firebase.auth().currentUser.uid).get()
      let newUsage = await db.collection("discounts").doc(user.data().discount).collection("discount_users").doc(firebase.auth().currentUser.uid).get()
      let num = parseInt(newUsage.data().usage) + 1
      if (num == parseInt(discount.usage)) {
        db.collection("discounts").doc(user.data().discount).collection("discount_users").doc(firebase.auth().currentUser.uid).delete()
        db.collection("users").doc(firebase.auth().currentUser.uid).update({ discount: "" })
      }
      else {
        db.collection("discounts").doc(user.data().discount).collection("discount_users").doc(firebase.auth().currentUser.uid).update({ usage: num })
      }

    }
    else {
      db.collection("users")
        .doc(firebase.auth().currentUser.uid)
        .collection("Payments")
        .add({
          type: "credit card",
          amount: total,
          bookingId,
          date
        });
    }

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
        "Save Card",
        "Save Credit Card Information?",
        [
          { text: "Yes?", onPress: () => saveCreditCard() },
          { text: "No", onPress: () => handleNavigationAlert() },
        ],
        { cancelable: false }
      );
    } else {
      props.navigation.navigate("Home");
    }
  };

  const handleNavigationAlert = () => {
    if (parkingId != "No params" && blockId != "No params") {
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
    }
    else {
      props.navigation.navigate("Home")
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
    handleNavigationAlert();
  };

  return (
    <View style={{backgroundColor: "#F0F8FF", height:"100%", paddingTop: 10 }}>


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

{
        discount ?

          <View style={{marginBottom:10 , paddingLeft: 20 ,borderWidth: 1 , borderColor:"#284057" ,  marginTop:5,marginLeft:"auto", marginRight:"auto", width:"60%", paddingTop: 5, paddingBottom: 10,backgroundColor:"white"}}>
            <Text style={{ fontWeight: "bold", fontSize: 15, color: "#284057" }}>Applying {discount.code} </Text>
            <Text style={{ fontWeight: "bold", fontSize: 15, color: "#284057" }}>For {discount.percentage}% Discount</Text>
            <Text style={{ fontWeight: "bold", fontSize: 15, color: "red" }}>Before: {total} QR</Text>
            <Text style={{ fontWeight: "bold", fontSize: 15, color: "#90EE90" }}>After: {newAmount.toFixed(2)} QR</Text>
          </View>
          :
          <Text 
          style={{paddingTop: 20 ,paddingBottom: 20 ,paddingLeft: 20 ,
             fontWeight: "bold", fontSize: 20, color: "#284057",marginBottom: 30,
             borderBottomWidth: 2, borderColor:"#284057" }}>Amount: {total} QR</Text>
      }
      
          
      
      <View style={{ flexDirection: "row",marginBottom: 8,paddingLeft: 15 }}>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          onChangeText={text => setFirstName(text)}
          // placeholder="Cars Support"
          value={firstName}
        />
      </View>


      <View style={{ flexDirection: "row",marginBottom: 8,paddingLeft: 15 }}>
        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          onChangeText={text => setLastName(text)}
          // placeholder="Cars Support"
          value={lastName}
        />
      </View>

      <View style={{ flexDirection: "row",marginBottom: 8,paddingLeft: 15 }}>
        <Text style={styles.label}>Card Number</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          onChangeText={text => setCardNumber(text)}
          //placeholder="Cars Support"
          value={cardNumber}
        />
      </View>

      <View style={{ flexDirection: "row" ,marginBottom: 8,paddingLeft: 15}}>
        <Text style={styles.label}>Provider</Text>
        <TextInput
          style={styles.input}
          onChangeText={text => setProvider(text)}
          value={provider}
        />
      </View>

      <View style={{ flexDirection: "row",marginBottom: 8,paddingLeft: 15 }}>
        <Text style={styles.label}>Expiry Date</Text>
        <DatePicker
          style={styles.input}
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
      </View>

      <View style={{ flexDirection: "row" ,marginBottom: 8,paddingLeft: 15}}>

        <Text style={styles.label}>Security Code</Text>
        <TextInput
          style={styles.input}
          onChangeText={text => setSecurityCode(text)}
          keyboardType="numeric"
          placeholder="0000"
          value={securityCode}
        />
      </View>


<View style={{width:"30%", marginLeft:"auto", marginRight:"auto"}}>

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


    </View>
  );
}

Payment.navigationOptions = {
  title: "Payment",
  headerStyle: { backgroundColor: "#5a91bf" },
  headerTitleStyle: {
    color: "white"
  }
};
//
const styles = StyleSheet.create({
  input: { height: 40, borderColor:"#284057", borderWidth: 1, width: "60%" ,backgroundColor:"white", paddingLeft: 7},
  label: { fontSize: 15, color: "#284057", width: "30%",fontWeight:"bold" }
}) //backgroundColor:"white" fontWieght:"bold" , paddingLeft: 5
