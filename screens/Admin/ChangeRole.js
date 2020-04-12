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
            db.collection("worker").doc(user.id).set({ schedule: [] , services: [] , disable: false , name:user.displayName})
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
            <View style={{padding:10,borderColor:"#B0C4DE",borderWidth:3 , 
            backgroundColor:"white" , width:"80%" ,
            marginRight:"auto", marginLeft:"auto" , height:"40%"}}>
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
            <Text style={styles.user}>{user.phone}</Text>
            </View>
            <View style={styles.box}>
            <Text style={styles.user}>Points</Text>
            <Text style={styles.user}>{user.points}</Text>
            </View>


            </View>
           

            <View style={styles.box}>
            
                <Picker
                        selectedValue={role.current}
                        itemStyle={{ height: 60 }}
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
                        onValueChange={itemValue => updateRole(itemValue)
                        }>
                        <Picker.Item label="ROLE" value="" />
                        <Picker.Item label="Admin" value="Admin"/>
                        <Picker.Item label="User" value="user" />
                        <Picker.Item label="Worker" value="worker" />
                         
                          
                </Picker>

               
                    <TouchableOpacity 
                    style={{padding:8 , width:"40%" , height: "80%",  alignItems:"center", backgroundColor:"#3691b0", margin:6}} 
                    onPress={()=> updateDB()} disabled={!role.current} ><Text style={{color:"white" , fontSize:20}}>Update Role</Text></TouchableOpacity>
                    
   
            </View>
           
           
        </View>
    )


}
ChangeRole.navigationOptions = {
    title: 'Change Role',
    headerStyle: { backgroundColor: "#5a91bf" },
    headerTitleStyle: {
      color: "white"
    }
  };
const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#F0F8FF' },
    head: { height: 40, backgroundColor: '#fbfdfb' },
    text: { margin: 6 },
    user:{borderColor: "#D3D3D3",borderBottomWidth:3 , padding:5 , width:"50%" ,  alignItems:"center" },

    box:{ padding:5 , flexDirection:"row"},
    search:{backgroundColor: "#DCDCDC" , padding:5 , width:"50%" ,  alignItems:"center" }
});

