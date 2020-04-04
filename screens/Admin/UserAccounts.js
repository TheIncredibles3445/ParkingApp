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
import * as Animatable from 'react-native-animatable';


export default function UserAccounts(props) {
    
    const [show, setShow] = useState("All")
    const [search, setSearch] = useState()
    const [Allusers, setAllUsers] = useState([])
    const [filteredUsers , setFilteredUsers] = useState([])
    const email = useRef()
    const  role= useRef()


    useEffect(() => {
        db.collection("users").onSnapshot(querySnapshot => {
            const users = [];
            querySnapshot.forEach(doc => {
                users.push({ id: doc.id, ...doc.data() });
                //console.log("current users", users)
            });
            setAllUsers([...users]);
            setFilteredUsers([...users]);
        });
        //console.log("users", users)

    }, []);

    useEffect(() => {
        if (search) {
            setShow(false)
            //filter where user email == email


        }
        else {
            setShow(true)
        }
    }, [search])



    useEffect(() => {
        if (email) {
            
        }
    }, [email])

    useEffect(() => {
        if (role) {

        }
    }, [role])

    const filter = () => {
        let temp = Allusers
        if( email.current ){
            console.log("the email ------>>", email.current)
            temp = temp.filter( u => u.email === email.current)
            //console.log("email changed",temp)
        }
        if(role.current){
            console.log("changing role",role.current)
            temp = temp.filter( u => u.role === role.current)
        }
       
        setFilteredUsers(temp)
       // console.log("final result", filteredUsers)
    }

    const updateEmail = (updatedEmail) =>{
        console.log("------------------------------------",updatedEmail)
        email.current = updatedEmail
        filter()

    }

    const updateRole = (updatedRole) =>{
        console.log("------------------------------------",updatedRole)
        role.current = updatedRole
        filter()

    }

    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 20, marginLeft: "auto", marginRight: "auto" }}>Users</Text>
            <View style={styles.box}>
            
            <TextInput
                style={styles.search}
                onChangeText={text => updateEmail(text)}
                placeholder="email@example.com"
                value={email}
            />
               
                    {/* <View>
           <Button title="search" onPress={()=>filter()}/> 
           </View> */}
            <Picker
                        selectedValue={role}
                        itemStyle={{height: 60}}
                        style={styles.search}
                        onValueChange={itemValue => updateRole(itemValue)
                        }>
                        <Picker.Item  style={{ height: "1%"}}  label="ROLE" value="" />
                        <Picker.Item style={{ height: "5%"}} label="Admin" value="Admin" />
                        <Picker.Item style={{ height: "5%"}} label="User" value="user" />
                        <Picker.Item style={{ height: "5%"}} label="Worker" value="worker" />
                        <Picker.Item style={{ height: "5%"}} label="Advertiser" value="Advertiser" />
                       
                </Picker>
                   
            </View>
           
           
            {
                filteredUsers.length > 0 ?
                    filteredUsers.map((u, index) =>
                        <Animatable.View animation="fadeInRight"  delay={ index+150}>
                        <TouchableOpacity style={styles.box} onPress={ () => props.navigation.navigate("ChangeRole" , {user: u})}>

                            <View style={styles.user}>
                            <Text  style={{fontSize:20}}>{u.displayName}</Text>
                    <Text>{u.email}</Text>
                            </View>
                            <View style={styles.user}>
                    <Text style={{fontSize:20}}>{u.role}</Text>
                            </View>

                        </TouchableOpacity>
                        </Animatable.View>
                    )

                    :
                    <Text>No Users Found</Text>
            } 

          
        </View>
    )


}
UserAccounts.navigationOptions = {
    title: 'User Accounts',
};


const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fbfdfb' },
    head: { height: 40, backgroundColor: '#fbfdfb' },
    text: { margin: 6 },
    box:{backgroundColor:"#fbfdfb" , padding:5 , flexDirection:"row"},
    user:{borderColor: "#D3D3D3",borderBottomWidth:3 , padding:5 , width:"50%" ,  alignItems:"center" },
    search:{backgroundColor: "#DCDCDC" , padding:5 , width:"50%", height:"100%" , margin:3 },
    //search2:{ padding:5 , width:"50%", height:"10%"  }
});
