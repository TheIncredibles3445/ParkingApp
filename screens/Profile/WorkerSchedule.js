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


export default function WorkerSchedule(props) {
    const user = props.navigation.getParam('user', 'some default value');
    const [show, setShow] = useState("H")
    const allSchedule = useRef()
    const historySchedule = useRef()
    const todaySchedule = useRef()
    const [ update , setUpdate] = useState(false)
    useEffect(() => {
        getSchedule()

    }, [])

    useEffect(()=>{

    },[update])
    

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

    const getDetails = () => {
        
    }

    const getSchedule = async () => {
        let worker = await db.collection("worker").doc(firebase.auth().currentUser.uid).get()
        allSchedule.current = worker.data().schedule
        setUpdate(!update)
    }

    return (
        <View style={styles.container}>

            <View style={styles.box}>
                <Text style={styles.user}>Name</Text>
                <Text style={styles.user}>{user.displayName}</Text>
            </View>
            <View style={styles.box}>
                <Text style={styles.user}>Email</Text>
                <Text style={styles.user}>{user.email}</Text>
            </View>


            <View style={styles.box}>
                <View style={{ padding: 5, width: "50%", alignItems: "center" }}>
                    <Button color={ show == "H"? "#008B8B" :"#A9A9A9"} title="History" onPress={() => setShow("H")} />
                </View>
                <View style={{ padding: 5, width: "50%", alignItems: "center" }}>
                    <Button color={ show == "T"? "#008B8B" :"#A9A9A9"} title="Today" onPress={() => setShow("T")} />
                </View>

            </View>

            {
                show == "H" && historySchedule.current?
                    historySchedule.current.map(t =>
                        <View style={styles.box}>
                            <Text style={styles.user}>Date and Time</Text>
                    <Text style={styles.user}>{t.dateTime}</Text>
                        </View>
                    )

                    : show == "T" && todaySchedule.current?
                        todaySchedule.current.map(t =>
                            <View style={styles.box}>
                                <Text style={styles.user}>Date and Time</Text>
                                <Text style={styles.user}>{t.dateTime}</Text>
                            </View>
                        )
                        :
                        null
            }




        </View>
    )


}
WorkerSchedule.navigationOptions = {
    title: 'Schedule',
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
    head: { height: 40, backgroundColor: '#f1f8ff' },
    text: { margin: 6 },
    box: {
        backgroundColor: "#FFFAFA", padding: 5, flexDirection: "row", borderBottomColor: "#DCDCDC",
        borderBottomWidth: 1,
    },
    user: { backgroundColor: "#F0FFF0", padding: 5, width: "50%", alignItems: "center" },
    search: { backgroundColor: "#DCDCDC", padding: 5, width: "50%", alignItems: "center" }
});