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
    Picker,
    DatePicker
} from "react-native";
import moment from "moment";
import "firebase/auth";
import firebase from "firebase/app";
import db from "../../db.js";
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import { weekdaysShort } from "moment";
import { firestore } from "firebase";
import CollapsingToolbar from 'react-native-collapse-view';


export default function WorkerSchedule(props) {
    const user = props.navigation.getParam('user', 'some default value');
    const [show, setShow] = useState("H")
    const allSchedule = useRef()
    const historySchedule = useRef()
    const todaySchedule = useRef()
    const [ update , setUpdate] = useState(false)
    const [rating,setRating] = useState(0)
    const service = useRef()
    useEffect(() => {
        getSchedule()

    }, [])

    useEffect(()=>{

    },[update])

    useEffect(() => {
        db.collection("booking").where("type","==","Service").onSnapshot(query => {
            let total = 0;
            let average = 0;
            let index = 0;
            for(let booking of query.docs) {
                db.collection("booking").doc(booking.id)
                .collection("service_booking")
                .where("worker","==",firebase.auth().currentUser.uid)
                .onSnapshot(querySnap =>{
                    let services =  querySnap.docs
                    for(let i = 0; i < services.length; i++) {
                        let data = services[i].data()
                        total += data.rating;
                        console.log("total ======>  ",total)
                        console.log("index ======>  ",index)
                        if(index === querySnap.docs.length ) {
                            average = total / querySnap.docs.length;
                            setRating(average)
                        }
                        index++
                    }
                }) 
            }
        })
    },[])
    

    useEffect(()=>{
        setUpdate(!update)
    },[ historySchedule.current ,  todaySchedule.current])

    useEffect(() => {

        let history = []
        let today = []
        let currentDate = moment().format("YYYY-MM-DD")

        if (allSchedule.current) {
            for (let i = 0; i < allSchedule.current.length; i++) {
                //console.log("date is -->", allSchedule.current[i].dateTime.split(" ")[2])
                //let schTime = allSchedule.current[i].dateTime.split(" ")[0] +" "+allSchedule.current[i].dateTime.split(" ")[1]
                let schDate = allSchedule.current[i].dateTime.split(" ")[2]
                // let isBefore = moment(schTime).isBefore(moment(currentTime))
                if ((currentDate != schDate)) {
                    history.push(allSchedule.current[i])
                }
                else {
                    today.push(allSchedule.current[i])
                }
            }
        }

        todaySchedule.current = today
        historySchedule.current = history
        //getDetails()
        setUpdate(!update)
    }, [allSchedule.current])

    const getDetails = async (booking , service_Booking) => {
        console.log("here ------->",booking , service_Booking)
        let bookingDB = await db.collection("booking").doc(booking).collection("service_booking").doc(service_Booking).get()
        console.log("the booking id --->",bookingDB.data())
        let service = await db.collection("service").doc(bookingDB.data().service_id).get()
        console.log("the service",service.data().Name)
        service.current = service.data().Name
        return true
    }

    const getSchedule = async () => {
        let worker = await db.collection("worker").doc(firebase.auth().currentUser.uid).get()
        allSchedule.current = worker.data().schedule
        setUpdate(!update)
    }

    return (
        <View style={{backgroundColor: "#F0F8FF", height:"100%", paddingTop: 10 }}>
<View style={{padding:10,borderColor:"#B0C4DE",borderWidth:3 , backgroundColor:"white" , width:"80%" ,marginRight:"auto", marginLeft:"auto" , height:"20%"}}>
            <View style={styles.box}>
                <Text style={{width:"50%",fontSize:15 , fontWeight:"bold", color:"#396a93"}}>Name</Text>
                <Text style={{width:"50%",fontSize:15 , fontWeight:"bold"}}>{user.displayName}</Text>
            </View>
            <View style={styles.box}>
                <Text style={{width:"50%",fontSize:15 , fontWeight:"bold", color:"#396a93"}}>Email</Text>
                <Text style={{width:"50%",fontSize:15 , fontWeight:"bold"}}>{user.email}</Text>
            </View>
            <View style={styles.box}>
                <Text style={{width:"50%",fontSize:15 , fontWeight:"bold", color:"#396a93"}}>Rating</Text>
                <Text style={{width:"50%",fontSize:15 , fontWeight:"bold"}}>{rating} / 5</Text>
            </View>
            </View>

            <View style={{ flexDirection:"row" , marginTop:"2%", marginBottom:"2%" , justifyContent:"center"}}>
                <View style={{ padding: 5,  alignItems: "center" }}>
                    <Button color={ show == "H"? "#008B8B" :"#A9A9A9"} title="History" onPress={() => setShow("H")} />
                </View>
                <View style={{ padding: 5, alignItems: "center" }}>
                    <Button color={ show == "T"? "#008B8B" :"#A9A9A9"} title="Today" onPress={() => setShow("T")} />
                </View>

            </View>
            {/* <View style={{ borderBottomColor:"#284057",borderBottomWidth:3 ,
                     width:"100%", marginRight:"auto" , marginLeft:"auto" }}></View> */}
        <ScrollView style={{marginBottom:"5%", borderColor:"#B0C4DE",borderWidth:3 , backgroundColor:"white" , width:"80%" , marginLeft:"auto", marginRight:"auto"}}>
            
            {
                show == "H" && historySchedule.current?
                    historySchedule.current.map(t =>
                        <TouchableOpacity style={{}}  onPress={() =>
                            props.navigation.navigate("ScheduleDetails", {
                              booking: t.Booking,
                              serviceBooking: t.Service_booking
                            })
                          }>
                            
                    <Text 
                    style={{ borderBottomColor:"#B0C4DE",borderBottomWidth:3 ,
                     width:"70%" , marginRight:"auto" , marginLeft:"auto" ,
                      alignItems:"center", padding:20, fontSize:15}}>
                          {t.dateTime}</Text>
                        </TouchableOpacity>
                    )

                    : show == "T" && todaySchedule.current?
                        todaySchedule.current.map(t =>
                            <TouchableOpacity style={{}}  onPress={() =>
                                props.navigation.navigate("ScheduleDetails", {
                                  booking: t.Booking,
                                  serviceBooking: t.Service_booking
                                })
                              }> 
                             
                                <Text style={{ borderBottomColor:"#B0C4DE",borderBottomWidth:3 ,
                     width:"70%" , marginRight:"auto" , marginLeft:"auto" ,
                      alignItems:"center", padding:20, fontSize:15}}>{t.dateTime}</Text>
                            </TouchableOpacity>
                        )
                        :
                        null
            }
            
    </ScrollView>
    


        </View>
    )


}
WorkerSchedule.navigationOptions = {
    title: 'Schedule',
    headerStyle:{ backgroundColor:"#5a91bf" },
    headerTitleStyle:{
        color: "white"}
  
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
    head: { height: 40, backgroundColor: '#f1f8ff' },
    text: { margin: 6 },
    box: { flexDirection: "row", borderBottomColor: "#b7c9e1",borderBottomWidth: 1, height:"33.5%"
},
        // marginLeft: "10%",
        // backgroundColor: "white",, width:"100%",
        // 
    user: { marginLeft:"auto", marginRight:"auto",backgroundColor: "#b7c9e1", padding: 5, width: "50%", alignItems: "center" },
    search: { backgroundColor: "#b7c9e1", padding: 5, width: "50%", alignItems: "center" }
});