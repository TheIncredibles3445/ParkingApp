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
import db from "../db";
import DatePicker from "react-native-datepicker";
import moment from "moment";
import { AsyncStorage } from "react-native";

export default function ParcialPayment(props) {


    const userid = props.navigation.getParam("user", "some default value");
    const [user, setUser] = useState()
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
    const [amount, setAmount] = useState()
    const date = moment().format("YYYY-MM-DD T HH:mm");


    useEffect(() => {
        getUser()
        getMyCard();
        console.log("user", user)
        console.log("user card", userCards)
    }, [])



    const getUser = async () => {
        let u = await db.collection("users").doc(userid.uid).get()
        setUser(u.data())
    }

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
                    date
                });


            db.collection("users")
                .doc(firebase.auth().currentUser.uid)
                .update({ advPendingAmount: update.data().advPendingAmount - amount });
        }
        else {
            db.collection("users")
                .doc(firebase.auth().currentUser.uid)
                .collection("Payments")
                .add({
                    type: "credit card",
                    amount: amount,
                    for: "Bookings Pending Amount",
                    date
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
                    { text: "No", onPress: () => props.navigation.navigate("Settings") }
                ],
                { cancelable: false }
            );
        } else {
            setSelectedPayment()
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
                provider
            });
            setSelectedPayment()
            
        props.navigation.navigate("Settings");
    };

    return (
        <View style={{backgroundColor: "#F0F8FF", height:"100%", paddingTop: 10 }}>
            {
                user && user.pendingAmount == 0  && user.advPendingAmount == 0 ? 
                <Text style={{ paddingBottom: 10 , paddingLeft: 50 , fontWeight: "bold", fontSize: 20, color: "#284057" }}>No Payments Required</Text>
            :
            <ScrollView>
                {/** */}
                { user && user.pendingAmount > 0 ? <Text style={{ paddingBottom: 10 , paddingLeft: 50 , fontWeight: "bold", fontSize: 20, color: "#284057" }}>Bookings: {user ? user.pendingAmount : null} QR</Text> : null}
                { user && user.advPendingAmount > 0 ? <Text style={{paddingBottom: 10 , paddingLeft: 50 , fontWeight: "bold", fontSize: 20, color: "#284057" }}>Advertisements:  {user ? user.advPendingAmount : null}QR</Text>: null}
                
 <View style={{flexDirection:"row" , marginBottom:10}}>
 {userCards. length > 0 ? (
                    <Picker
                        selectedValue={selectedCard}
                        style={{
                            height: 50,
                            width: 150,
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

                <Picker
                    selectedValue={selectedPayment}
                    style={{
                        height: 50,
                        width: 150,
                        fontSize: 20,
                        backgroundColor: "#DCDCDC",
                        marginBottom: 4,
                        marginTop: 4,
                        marginRight: "auto",
                        marginLeft: "auto" 
                    }}
                    onValueChange={itemValue => setSelectedPayment(itemValue)}
                >
                    <Picker.Item label={"Payment For"} value={""} disabled />

                    {user && user.pendingAmount > 0? <Picker.Item label={"Bookings"} value={"Bookings"} /> : null}
                    {user && user.advPendingAmount > 0 ? <Picker.Item label={"Advertisement"} value={"Advertisement"} /> : null}

                </Picker>


 </View>
                

                {
                    selectedPayment ?
                         <View>
                       
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
   <View style={{ flexDirection: "row",marginBottom: 8,paddingLeft: 15 }}>
    <Text style={styles.label}>Amount</Text>
        <TextInput
            style={styles.input}
            keyboardType="numeric"
            onChangeText={text => setAmount(text)}
            //placeholder="Cars Support"
            value={amount}
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
          amount &&
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
                        :
                        null

                }

            </ScrollView>
            }
            
        </View>
    );
}
ParcialPayment.navigationOptions = {
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
  })