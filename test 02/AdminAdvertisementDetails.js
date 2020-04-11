 {/**
        in line 61:
        used navigation props to pass an object in the navigation button
        the props is stored in the variable adv 
        This useEffect runs only one time to retrieve the advertisement offers from db using the passed props
        stored in adv as the document id to get the advertisement offers

        hooks:
        the documents retrieved from the database are stored in the state variable offers which should be declared as in line 23
        offers is the variable name, setOffers is used to update the offer array. setOffer(example) -> example becomes the new value of offers.
        the square brackets in useState([]) indicated to store arrays in the offers variable, 
        calling setOffer will cuase a rernder to the compoenet, if the values of the offers are displayed then the new values will replace the old ones
        or added to the old ones.

        useEffect:
        the following use effect is called only once. when the screen run or refresh.
        that happens when the square brackets after the closing carly brace is empty.
        that indicates to call only once
        if a varaible was in the sqaure brackets then, the useEffect will be called each time the variable is updated 
        

         * in this screen I used 2 components :
         * 1- image
         * 2- scrollView
         * 
         * Image: each advertisement submitted by the adveriser must have an image uri, in our project we store the images in
         * firebase storage and save the uri in the advertisement Collection, as a field named uri.
         * the admin chooses an advertisement and using the advertisement ID i get the document from the db 
         * after that import Image component from react-native. use the <Image> and use the props style and source
         * style contains the width and hight of the image and other stylings, source uses the uri retreaved from db and display it to the user
         * 
         * ScrollView:
         * an advertiser can negotiate with the manager or admin, resulting a list of new offers for one advertisement request.
         * so, i list all the offers for the advertisement in a ScrollView.
         * i imported the component from react-native and used the <ScrollView> tag, bwtween the opening and closing tag i used a map() to list all offers.
         * the offers will be listed you can see  all of it by scrolling up and down  
         */
    }

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
    View
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
        <View>
            
                <Text style={styles.title}>{adv.title}</Text>
                <Text style={styles.email}>User: {advertiser ? advertiser.email : null}</Text>
                <Image
                    style={{ width: 100, height: 100 , marginLeft:"4%" }}
                    source={{ uri: adv.photoURL }}
                />
                <Text style={styles.email}>Offers</Text>
                {adv.adStatus === "Pending" && adv.handledBy === "" ?
                    <View>
                        {offers.map((o, index) =>
                            <Text style={styles.list}>OFFER NO.{index + 1}{"\n"}FROM: {o.startDate} TO: {o.endDate} {"\n"}OFFERED AMOUNT: {o.offeredAmount} QR {"\n"}UPDATED ON: {o.date}</Text>
                        )}

                        <TouchableOpacity style={styles.btns2} onPress={() => handleAdv()}><Text style={styles.text}>HANDEL</Text></TouchableOpacity></View> : null}
                {adv.adStatus === "Pending" && adv.handledBy === firebase.auth().currentUser.uid && offers.length > 0 ?
                    <View style={styles.adminSe}>
                        <ScrollView style={{ height: "15%"}}>
                            {offers.map((o, index) =>
                                <Text style={styles.list}>OFFER NO.{index + 1}{"\n"}FROM: {o.startDate} TO: {o.endDate} {"\n"}OFFERED AMOUNT: {o.offeredAmount} QR {"\n"}UPDATED ON: {o.date}</Text>
                            )}
                        </ScrollView>
                        {
                            offers[offers.length - 1].feedback == "" ?
                                <View>
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

                                </View>
                                :
                                <View>
                                    <TouchableOpacity style={styles.btns2} onPress={() => handleStatus("Approved")} ><Text style={styles.text}>Approve</Text></TouchableOpacity>
                                    <TouchableOpacity style={styles.btns2} onPress={() => handleStatus("Declined")} ><Text style={styles.text}>Decline</Text></TouchableOpacity>
                                </View>
                        }

                    </View>
                    : null}
            
        </View>

    )
}


const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
    head: { height: 40, backgroundColor: '#f1f8ff' },
    text: { fontSize: 17, color: "#F0FFFF", marginLeft: "auto", marginRight: "auto" },
    box: { backgroundColor: "#FFFAFA", flexDirection: "row", alignItems: "center", padding: 6 },
    box2: { backgroundColor: "#FFFAFA", flexDirection: "row", padding: 6, alignItems: "center" },
    btns: {
        backgroundColor: "#5F9EA0",
        padding: 5,
        width: "30%",
        marginLeft: 10,
        height: "auto",
        fontSize: 20,
        borderColor: "black",
        borderRadius: 5
    },
    btns2: {
        backgroundColor: "#5F9EA0",
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
        backgroundColor: "#F0FFF0",
        padding: 5,
        width: "90%",
        marginBottom: 4,
        height: 82,
        fontSize: 15,
        borderColor: "#66CDAA",
        borderBottomWidth: 4,
        borderRadius: 5
    },
    feedbackBox: {
        
        borderWidth: 1,
        borderColor: "#5F9EA0",
        height: "40%",
        marginTop: "2%",
        marginBottom: "5%",
        width: "85%",
        marginLeft: "auto",
        marginRight: "auto"
    },
    title: {
        fontSize: 30,
        color: "#5F9EA0",
        width: "90%",
        marginLeft: "auto",
        marginRight: "auto"

    },
    email: {
        fontSize: 20,
        color: "#5F9EA0",
        width: "90%",
        marginLeft: "auto",
        marginRight: "auto"
    },
    adminSe:{
        //borderWidth:1
    }
});