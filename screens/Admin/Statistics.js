import React, { useState, useEffect, useRef } from "react";
import {
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

import "firebase/auth";
import db from "../../db.js";
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import { weekdaysShort } from "moment";
import * as Animatable from 'react-native-animatable';
import { service } from "firebase-functions/lib/providers/analytics";

export default function Statistics(props) {

    const [tracker, setTracker] = useState()
    const [bookings, setBookings] = useState([])
    const [advertisements, setAdvertisement] = useState([])
    const [update, setUpdate] = useState(true);
    const [total, setTotal] = useState(0)
    const [totalPraking, setTotalParking] = useState(0)
    const [totalService, setTotalService] = useState(0)
    const [totalBooking, setTotalBooking] = useState(0)
    const [totalAdv, setTotalAdv] = useState(0)

    useEffect(() => {
        track()
        getIncome()

    }, []);

    const track = async () => {
        let track = await db.collection("tracking").doc("track").get()
        setTracker(track.data())
        console.log("tracker --------->>>>>", tracker)

    }
    useEffect(() => {
        setUpdate(!update);
        console.log("bookings in update", advertisements);
        sumIncome()
    }, [bookings, advertisements]);

    const getIncome = async () => {
        let b = await db.collection("booking")
        let query = b.get()
            .then(snapshot => {
                let bookings = [];
                snapshot.forEach(doc => {
                    bookings.push({ id: doc.id, ...doc.data() });
                });
                setBookings(bookings);
            });

        let a = await db.collection("Advertisement").where("adStatus", "==", "Approved")
        let query2 = a.get()
            .then(snapshot => {
                let advertisement = [];
                snapshot.forEach(doc => {
                    advertisement.push({ id: doc.id, ...doc.data() });
                });
                setAdvertisement(advertisement);
            });
    }

    const sumIncome = () => {
        let advSum = 0
        let bookingSum = 0
        let service = 0
        let parking = 0
        let total = 0

        //loop through adv
        for (let i = 0; i < advertisements.length; i++) {
            if (advertisements[i].adStatus == "Approved") {
                total = total + parseInt(advertisements[i].offeredAmount)
                advSum = advSum + parseInt(advertisements[i].offeredAmount)
            }
        }


        for (let i = 0; i < bookings.length; i++) {
            total = total + parseInt(bookings[i].total_price)
            bookingSum = bookingSum + parseInt(bookings[i].total_price)
            if (bookings[i].type == "Service") {
                service = service + parseInt(bookings[i].total_price)
            }
            else {
                parking = parking + parseInt(bookings[i].total_price)
            }

        }
        setTotalParking(parking)
        setTotalService(service)
        setTotalBooking(bookingSum)
        setTotalAdv(advSum)
        setTotal(total)

        console.log("adv--------------------------------", advSum)
        console.log("booking----------------------------", bookingSum)
        console.log("total------------------------------", total)
        //loop through bookings

        //sum result in total

        // set result to state
    }


    return (
        <View style={styles.container}>
            {
                tracker ?
                    <View>

                        <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>

                            <View style={styles.box}>
                                <Text style={styles.search}>Users Currently Booking Services </Text>
                                <Text style={styles.search2}>{tracker.service}</Text>
                            </View>

                            <View style={styles.box}>
                                <Text style={styles.search}>Users Currently Booking Parkings </Text>
                                <Text style={styles.search2}>{tracker.parking}</Text>
                            </View>



                        </View>
                        <View style={styles.income}> 
                         <Text style={styles.search3}>Total Income</Text>  
                         <Text style={styles.search4}>{total} QR</Text> 
                         </View>
                         
                         <View style={styles.income}> 
                            <Text style={styles.search3}>Total Bookings Income</Text>  
                            <Text style={styles.search4}>{totalBooking} QR</Text>
                            
                            </View>
                      
                         <View style={styles.income}> 
                         <Text style={styles.search3}>Total Service Income</Text>  
                            <Text style={styles.search4}>{totalService} QR</Text>
                            </View>

                            <View style={styles.income}> 
                            <Text style={styles.search3}>Total Parking Income</Text>  
                            <Text style={styles.search4}>{totalPraking} QR</Text>
                            </View>

                            <View style={styles.income}> 
                            <Text style={styles.search3}>Total Advertisements Income</Text>  
                            <Text style={styles.search4}>{totalAdv} QR</Text>
                            </View>

                          
                       


                    </View>

                    :

                    null
            }






        </View>
    )


}
Statistics.navigationOptions = {
    title: 'Statistics',
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 3, paddingTop: 30, backgroundColor: '#F5F5F5' },
    head: { height: 40, backgroundColor: '#fbfdfb' },
    text: { margin: 6 },
    box: { backgroundColor: "#F5F5F5", padding: 5, flexDirection: "row", width: "50%" },
    box2: { backgroundColor: "#F5F5F5", padding: 5, flexDirection: "row", width: "50%" },
    user: { borderColor: "#D3D3D3", borderBottomWidth: 3, padding: 5, width: "50%", alignItems: "center" },
    search: { backgroundColor: "#DCDCDC", padding: 5, width: "70%", alignItems: "center" },
    search2: { borderColor: "#DCDCDC", padding: 5, width: "15%", alignItems: "center", borderWidth: 3 },
    search3: { backgroundColor: "#DCDCDC", padding: 5, width: "60%", alignItems: "center" },
    search4: { borderColor: "#DCDCDC", padding: 5, width: "40%", alignItems: "center", borderWidth: 3 },
    income:{ 
        flexDirection: "row", 
        justifyContent: "flex-start" ,
         marginLeft:"2%" ,
          marginBottom:10,
          marginTop:10,
          width:"80%" ,
            borderBottomColor:"#808080",
            borderBottomWidth:3 }


});

