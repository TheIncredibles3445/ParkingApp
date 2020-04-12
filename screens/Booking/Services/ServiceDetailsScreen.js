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
import * as Animatable from 'react-native-animatable';

export default function ServiceDetailstScreen(props) {
    const [show, setShow] = useState("All")
    const [name, setName] = useState()
    const [price, setPrice] = useState(0)
    const [description, setDescription] = useState()
    const [status, setStatus] = useState()
    const service = props.navigation.getParam('service', 'some default value');

    useEffect(() => {
        setName(service.Name)
        setPrice(service.Price)
        setDescription(service.Description)
    }, [])


    const changeStatus = () => {
        if (status) {
            db.collection("service").doc(service.id).update({ Status: false });
            setStatus(false)
        }
        else if (!status) {
            db.collection("service").doc(service.id).update({ Status: true });
            setStatus(true)
        }
    }

    const update = () => {
        db.collection("service").doc(service.id).update({ Name: name, Description: description, Price: price });
        setShow("All")
    }


    return (
        <Animatable.View animation="fadeInUp" delay={10}>
            <View style={{
                marginLeft: "4%", height: 150,
                borderColor: "#b7c9e1", borderWidth: 2, marginRight: "5%",
                width: "90%", padding: 10, backgroundColor: "white", marginTop: "5%", marginBottom: "5%"
            }}>
                <View style={styles.box}>
                    <Text style={{ width: "50%", fontSize: 15, fontWeight: "bold", color: "#396a93" }}>Name</Text>
                    <Text style={{ width: "50%", fontSize: 15, fontWeight: "bold" }}>{name}</Text>
                </View>
                <View style={styles.box2}>
                    <Text style={{ width: "50%", fontSize: 15, fontWeight: "bold", color: "#396a93" }}>Description</Text>
                    <Text style={{ width: "50%", fontSize: 15, fontWeight: "bold" }}>{description}</Text>
                </View>
                <View style={styles.box}>
                    <Text style={{ width: "50%", fontSize: 15, fontWeight: "bold", color: "#396a93" }}>Price</Text>
                    <Text style={{ width: "50%", fontSize: 15, fontWeight: "bold" }}>{price} QR</Text>
                </View>

            </View>

            {show == "All" ?
                <View>

                    <View style={{ flexDirection: "row", justifyContent: "space-evenly", width: "100%" }}>
                        <View style={{ width: "45%", marginBottom: "5%" }}><Button title="Manage Workers" onPress={() => props.navigation.navigate("WorkersManagement", { service })} /></View>
                        <View style={{ width: "25%", height: "50%" }}><Button title="Edit" onPress={() => setShow("Edit")} /></View>
                        <View style={{ width: "25%" }}><Button title={status ? "Disable" : "Enable"} onPress={() => changeStatus()} /></View>
                    </View>

                </View>
                : show == "Edit" ?
                    <Animatable.View animation="fadeInUp" delay={10}>
                        <Animatable.Text animation="fadeInRight" delay={3} style={{ marginLeft: "auto", marginRight: "auto", fontSize: 30, color: "#284057", marginBottom: "2%"  }}>Edit</Animatable.Text>
                        <View style={{ marginLeft: "auto", marginRight: "auto", borderColor: "#284057", borderWidth: 2, width: "90%", padding: 10, backgroundColor: "white" }}>
                            <View style={styles.box3}>
                                <Text style={styles.label}>Name</Text>

                                <TextInput
                                    style={styles.input}
                                    onChangeText={setName}
                                    placeholder="Cars Support"
                                    value={name}
                                />

                            </View>

                            <View style={styles.box3}>
                                <Text style={styles.label}>Price</Text>
                                <TextInput
                                    style={styles.input}
                                    keyboardType="numeric"
                                    onChangeText={setPrice}
                                    placeholder="000"
                                    value={price}
                                    maxLength={4}
                                />
                            </View>

                            <View style={styles.box3}>
                                <Text style={styles.label}>Description</Text>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={setDescription}
                                    placeholder="..."
                                    value={description}
                                />
                            </View>


                            {/* <Text style={{ fontSize: 15, coloe: "#FF6347", margin: "5%" }}>{error ? error : null}</Text> */}
                            <View style={{ flexDirection: "row", justifyContent: "space-evenly" , marginTop:10}}>

                                <TouchableOpacity style={styles.btn} onPress={() => update()} ><Text style={{ fontSize: 20, color: "white" }}>Save</Text></TouchableOpacity>
                                <TouchableOpacity style={styles.btn} onPress={() => setShow("All") || setName(service.Name) || setPrice(service.Price) || setDescription(service.Description)}  ><Text style={{ fontSize: 20, color: "white" }}>Cancel</Text></TouchableOpacity>
                            </View>

                        </View>
                    </Animatable.View>

                    :
                    null
            }
        </Animatable.View >
    )


}
ServiceDetailstScreen.navigationOptions = {
    title: 'Details',
    headerStyle: { backgroundColor: "#5a91bf" },
    headerTitleStyle: {
        color: "white"
    }
};


const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
    head: { height: 40, backgroundColor: '#f1f8ff' },
    text: { margin: 6 },
    box: {
        flexDirection: "row", borderBottomColor: "#b7c9e1", borderBottomWidth: 1, height: 25
    }, 
    box2: {
        flexDirection: "row", borderBottomColor: "#b7c9e1", borderBottomWidth: 1, height: 81
    },
    box3: {
        flexDirection: "row", height: "auto", margin:5
    },
    btn: { backgroundColor: "#B0C4DE", width: "40%", alignItems: "center", height: 40, padding: 2, borderRadius: 4 },
  input: { height: 40, borderColor: "#b7c9e1", borderWidth: 2,width:"70%", borderRadius: 4 , padding:10 , backgroundColor:"white"},
  label:{ color: "#284057",fontSize:15 , width :"20%" , marginRight:"5%" , fontWeight:"bold"},
    user: { marginLeft: "auto", marginRight: "auto", backgroundColor: "#b7c9e1", padding: 5, width: "50%", alignItems: "center" },
    search: { backgroundColor: "#b7c9e1", padding: 5, width: "50%", alignItems: "center" }
});