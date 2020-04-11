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

export default function ChangeRole(props) {
    const user = props.navigation.getParam('user', 'some default value');
    const [show, setShow] = useState(true)
    const [search, setSearch] = useState()
    const [Allusers, setAllUsers] = useState([])
    const [filteredUsers , setFilteredUsers] = useState([])
    const email = useRef()
    const  role= useRef()


    useEffect(() => {
       
    }, [show]);

    const updateDB = () =>{
        //console.log("------------------------------------",updatedRole)
        checkIfWorker()
        db.collection("users").doc(user.id).update({ role : role.current})
        if( role.current == "worker"){
            db.collection("worker").doc(user.id).set({ schedule: [] , services: [] , disable: false})
        }
        role.current = ""
        setShow(!show)
        
    }

    const checkIfWorker = async () =>{
        let found = await db.collection("worker").doc(user.id).get()
        if( found && role.current !== "worker"){
            //disable the worker
            db.collection("worker").doc(user.id).update({ disable: true})
        }

    }

    const updateRole = (newRole) =>{
        console.log("------------------------------------",newRole)
        role.current = newRole
        console.log(">>>>>>>>>>",role.current)
        setShow(!show)
    }
    const checkIfExist = () =>{

    }

    return (
        <View style={styles.container}>
           <View style={styles.box}>
            <Text style={styles.user}>User</Text>
            <Text style={styles.user}>{user.displayName}</Text>
            </View>
            <View style={styles.box}>
            <Text style={styles.user}>Email</Text>
            <Text style={styles.user}>{user.email}</Text>
            </View>
            <View style={styles.box}>
            <Text style={styles.user}>Phone</Text>
            <Text style={styles.user}>{}</Text>
            </View>
            <View style={styles.box}>
            <Text style={styles.user}>Points</Text>
            <Text style={styles.user}>{}</Text>
            </View>

            <View style={styles.box}>
            
                <Picker
                        selectedValue={role.current}
                        style={styles.search}
                        onValueChange={itemValue => updateRole(itemValue)
                        }>
                        <Picker.Item label="ROLE" value="" />
                        <Picker.Item label="Admin" value="Admin"/>
                        <Picker.Item label="User" value="user" />
                        <Picker.Item label="Worker" value="worker" />
                        <Picker.Item label="Advertiser" value="Advertiser" />  
                          
                </Picker>

                <View style={{padding:5 , width:"50%" ,  alignItems:"center"}}>
                    <Button color="#00BFFF"  title="Update Role" onPress={()=> updateDB()} disabled={!role.current}/>
                    </View>
   
            </View>
           
           
        </View>
    )


}
ChangeRole.navigationOptions = {
    title: 'Change Role',
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#F5F5F5' },
    head: { height: 40, backgroundColor: '#fbfdfb' },
    text: { margin: 6 },
    box:{backgroundColor:"#F5F5F5" , padding:5 , flexDirection:"row"},
    user:{borderColor: "#D3D3D3",borderBottomWidth:3 , padding:5 , width:"50%" ,  alignItems:"center" },
    search:{backgroundColor: "#DCDCDC" , padding:5 , width:"50%" ,  alignItems:"center" }
});

