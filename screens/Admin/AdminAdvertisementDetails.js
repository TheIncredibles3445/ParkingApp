import React, { useState, useEffect } from "react";
import {
    Image,
    Platform,
    TextInput,
    Button,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View, KeyboardAvoidingView , SafeAreaView
} from "react-native";
import * as SMS from "expo-sms";
import firebase from "firebase/app";
import "firebase/auth";
import db from "../../db.js";

export default function AdminAdvertisementDetails(props) {


    const [feedback, setFeedBack] = useState()
    const adv = props.navigation.getParam('adv', 'some default value');
    const [offers, setOffers] = useState([])
    const [advertiser, setAdvertiser] = useState()
    const [sendAfterDis, setSendAfterDis] = useState(false)
    useEffect(() => {
        db.collection("Advertisement").doc(adv.id).collection("offers").onSnapshot(querySnapshot => {
            let offers = [];
            querySnapshot.forEach(doc => {
                offers.push({ id: doc.id, ...doc.data() });
            });
            setOffers([...offers]);

        });
        getAdvertiser()
    }, [])

    const getAdvertiser = async () => {
        let user = await db.collection("users").doc(adv.uid).get()
        setAdvertiser(user.data())
        console.log("advertiser -->", advertiser.id)
    }


    const handleStatus = async (status) => {
        db.collection("Advertisement").doc(adv.id).update({
            adStatus: status,
            offeredAmount: offers[offers.length - 1].offeredAmount,
            startDate: offers[offers.length - 1].startDate,
            endDate: offers[offers.length - 1].endDate
        })

        let pa = parseInt(advertiser.pendingAmount) + parseInt(offers[offers.length - 1].offeredAmount)
        db.collection("users")
            .doc(adv.uid)
            .update({ advPendingAmount: pa });

        const isAvailable = await SMS.isAvailableAsync();

        if (isAvailable) {
            const { result } = await SMS.sendSMSAsync(
                [advertiser.phone],
                `Dear,${advertiser.displayName} \nYour ${adv.title} Avertisement Request Has Been ` + status + `.`
            );
            console.log(result);
        }
        props.navigation.navigate("Adv")
    }

    const sendFeedback = async () => {
        db.collection("Advertisement").doc(adv.id).collection("offers").doc(offers.length + "").update({ feedback })
        const isAvailable = await SMS.isAvailableAsync();

        if (isAvailable) {
            const { result } = await SMS.sendSMSAsync(
                [advertiser.phone],
                `Dear,${advertiser.displayName} \nYour ${adv.title} offer feedback is available now.`
            );
            console.log(result);
        }
        console.log("here2")
        props.navigation.navigate("Adv")
    }

    const handleAdv = () => {
        db.collection("Advertisement").doc(adv.id).update({ handledBy: firebase.auth().currentUser.uid })
        props.navigation.navigate("Adv")
    }

    return (
        
                <View style={styles.container}>
            
                <Text style={styles.title}>{adv.title}</Text>
                <Text style={styles.email}>User: {advertiser ? advertiser.email : null}</Text>
                <Image
                    style={{ width: 100, height: 100 , marginLeft:"4%" ,marginBottom:"5%"}}
                    source={{ uri: adv.photoURL }}
                />
                
                {adv.adStatus === "Pending" && adv.handledBy === "" ?
                    <View>
                        <Text style={styles.email}>Offers</Text>
                        {offers.map((o, index) =>
                            <Text style={styles.list}>OFFER NO.{index + 1}{"\n"}FROM: {o.startDate} TO: {o.endDate} {"\n"}OFFERED AMOUNT: {o.offeredAmount} QR {"\n"}UPDATED ON: {o.date}</Text>
                        )}

                        <TouchableOpacity style={styles.btns2} onPress={() => handleAdv()}><Text style={styles.text}>HANDEL</Text></TouchableOpacity></View> : null}
                {adv.adStatus === "Pending" && adv.handledBy === firebase.auth().currentUser.uid && offers.length > 0 ?
                    <View style={styles.adminSe}>
                        <ScrollView style={{ height: "20%", paddingBottom:5 , backgroundColor:"#b7c9e1"}}>
                            {offers.map((o, index) =>
                                <Text style={styles.list}>OFFER NO.{index + 1}{"\n"}FROM: {o.startDate} TO: {o.endDate} {"\n"}OFFERED AMOUNT: {o.offeredAmount} QR {"\n"}UPDATED ON: {o.date}</Text>
                            )}
                        </ScrollView>
                        {
                            offers[offers.length - 1].feedback == "" ?
                                <KeyboardAvoidingView
                                behavior={Platform.Os == "ios" ? "padding" : "height"}
                                //style={styles.container}
                              >
                                    <TextInput
                                        value={feedback}
                                        placeholder={"ADD A FEEDBACK"}
                                        onChangeText={(text) => setFeedBack(text)}
                                        style={styles.feedbackBox}
                                        multiline
                                    />

                                    <View style={styles.box}> 

                                        <TouchableOpacity style={styles.btns2} onPress={() => sendFeedback()} disabled={!feedback}><Text style={styles.text}>Add Feedback</Text></TouchableOpacity>
                                        <TouchableOpacity style={styles.btns2} onPress={() => handleStatus("Approved")} ><Text style={styles.text}>Approve</Text></TouchableOpacity>
                                        <TouchableOpacity style={styles.btns2} onPress={() => handleStatus("Declined")} ><Text style={styles.text}>Decline</Text></TouchableOpacity>

                                     </View> 

                                </KeyboardAvoidingView>
                                :
                                <View style={styles.box2}>
                                    <TouchableOpacity style={styles.btns2} onPress={() => handleStatus("Approved")} ><Text style={styles.text}>Approve</Text></TouchableOpacity>
                                    <TouchableOpacity style={styles.btns2} onPress={() => handleStatus("Declined")} ><Text style={styles.text}>Decline</Text></TouchableOpacity>
                                </View>
                        }

                    </View>
                    : null}
            
        </View>
        

    )
}
AdminAdvertisementDetails.navigationOptions = {
    title: "Details",
    headerStyle:{ backgroundColor:"#5a91bf" },
    headerTitleStyle:{
        color: "white"}
  };

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 5, backgroundColor: "#F0F8FF" },
    head: { height: 40, backgroundColor: '#f1f8ff' },
    text: { fontSize: 17, color: "#F0FFFF", marginLeft: "auto", marginRight: "auto" },
    box: { backgroundColor: "#FFFAFA", flexDirection: "row", alignItems: "center", padding: 6, backgroundColor: "#F0F8FF" },
    box2: { marginTop: "5%",backgroundColor: "#FFFAFA", flexDirection: "row", padding: 6, alignItems: "center", backgroundColor: "#F0F8FF", marginLeft: "auto", marginRight: "auto" },
    btns: {
        backgroundColor: "#B0C4DE",
        padding: 5,
        width: "30%",
        marginLeft: 10,
        height: "auto",
        fontSize: 20,
        borderColor: "black",
        borderRadius: 5
    },
    btns2: {
        backgroundColor: "#B0C4DE",
        padding: 5,
        width: "30%",
        marginLeft: 10,
        height: 50,
        fontSize: 20,
        borderRadius: 5,
        textAlign: "center"
    },
    list: {
        marginLeft: "auto",
        marginRight: "auto",
        backgroundColor: "#b7c9e1",
        padding: 5,
        width: "90%",
        marginBottom: 4,
        marginTop: 4,
        height: 82,
        fontSize: 15,
        borderColor: "#6f93c3",
        borderBottomWidth: 4,
        borderRadius: 5
    },
    feedbackBox: {
        
        borderWidth: 1,
        borderColor: "#6f93c3",
        height: "40%",
        marginTop: "2%",
        marginBottom: "5%",
        width: "85%",
        marginLeft: "auto",
        marginRight: "auto",
        backgroundColor:"#ffffff"
    },
    title: {
        fontSize: 30,
        color: "#284057",
        width: "90%",
        marginLeft: "auto",
        marginRight: "auto"

    },
    email: {
        fontSize: 20,
        color: "#284057",
        width: "90%",
        marginLeft: "auto",
        marginRight: "auto"
    },
    adminSe:{
        //borderWidth:1
    }
});