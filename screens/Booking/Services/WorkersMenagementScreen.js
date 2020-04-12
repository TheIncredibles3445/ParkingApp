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
    View
} from "react-native";

import "firebase/auth";
import db from "../../../db.js";
import firebase from "firebase/app";
import { AsyncStorage } from 'react-native';
export default function WorkersManagementScreen(props) {


    const [workers, setWorkers] = useState([])
    //const [availableWorkers, setAvailableWorkers] = useState([])
    const service = props.navigation.getParam('service', 'some default value');
    const availableWorkers = useRef()
    const serviceWorkers = useRef()
    const update = useRef(true)
    useEffect(() => {
        getWorkers()
    }, [update])

    useEffect(() => {
        filterServiceWorkers()
    }, [workers])

    const getWorkers = async () => {
        await db.collection("worker").onSnapshot(querySnapshot => {
            const workers = [];
            querySnapshot.forEach(doc => {

                workers.push({ id: doc.id, ...doc.data() });
            });
            setWorkers([...workers]);
        });
    }

    const filterServiceWorkers = async () => {
        const sw = []
        const aw = []
        for (let i = 0; i < workers.length; i++) {
            let found = false
            for (let k = 0; k < workers[i].services.length; k++) {

                if (workers[i].services[k] === service.id) {
                    sw.push(workers[i])
                    found = true
                }
            }
            if (!found && workers[i].services.length < 2) {
                aw.push(workers[i])
            }
        }
        availableWorkers.current = aw
        serviceWorkers.current = sw
        return (aw)
    }

    const assign = async (w) => {
        let wrk = await db.collection("worker").doc(w.id).get()
        let workerServiceList = wrk.data().services
        workerServiceList.push(service.id)
        console.log("arr", workerServiceList)
        db.collection("worker").doc(w.id).update({ services: workerServiceList })
    }

    const unAssign = async (w) => {
        let wrk = await db.collection("worker").doc(w.id).get()
        let workerServiceList = wrk.data().services
        let newServiceList = []
        //remove the service from the worker's service list
        for (let i = 0; i < workerServiceList.length; i++) {
            if (workerServiceList[i] !== service.id) {
                newServiceList.push(workerServiceList[i])
            }
        }
        db.collection("worker").doc(w.id).update({ services: newServiceList })
    }

    return (
        <ScrollView syle={{backgroundColor: '#F0F8FF'}}>
            <Text style={{ marginLeft: "auto", marginRight: "auto", fontSize: 30, color: "#284057", marginBottom: "5%"  }}>Available Workers</Text>
            {

                filterServiceWorkers() && availableWorkers.current ?
                    availableWorkers.current.map((w, index) =>


                    <View key={index} style={{ marginLeft: "auto", marginRight: "auto",flexDirection:"row", borderWidth:1 , borderColor:"#284057", padding:10 , width:"95%"}}>
                    <Text style={{ width:"70%"}}>{w.name}{"\n"}{w.id}</Text>
                    <View style={{ width:"20%", marginBottom:9 , borderWidth: 1 , borderBottomColor:"#fbfdfb"}}><Button title={"Assign"} onPress={() => assign(w)} /></View>
                </View>


                    )
                    :
                    <Text>No Available Workers</Text>
            }
            <Text style={{ marginLeft: "auto", marginRight: "auto", fontSize: 30, color: "#284057", marginBottom: "5%"  }}>Assigned Workers</Text>
            {
                filterServiceWorkers() && serviceWorkers.current ?
                    serviceWorkers.current.map((w, index) =>

                        <View key={index} style={{marginLeft: "auto", marginRight: "auto", flexDirection:"row", borderWidth:1 , borderColor:"#284057", padding:10 , width:"95%"}}>
                            <Text style={{ width:"70%"}}>{w.name}  {"\n"}{w.id}</Text>
                            <View style={{ width:"20%", marginBottom:9 , borderWidth: 1 , borderBottomColor:"#fbfdfb"}}><Button title={"Remove"} onPress={() => unAssign(w)} /></View>
                        </View>

                    )
                    :
                    null
            }


        </ScrollView>
    )


}

WorkersManagementScreen.navigationOptions = {
    title: ' Workers Management',
    headerStyle: { backgroundColor: "#5a91bf" },
    headerTitleStyle: {
      color: "white"
    }
  };