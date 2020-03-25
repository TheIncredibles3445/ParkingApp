import React, { useState, useEffect , useRef } from "react";
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
        <View>
            <Text> {name}</Text>
            <Text>{description}</Text>
            {show == "All" ?

                <View>
                    <Button title="Edit" onPress={() => setShow("Edit")} />
                    <Button title={status ? "Disable" : "Enable"} onPress={() => changeStatus()} />
                    <Button title="Manage Workers" onPress={() => props.navigation.navigate("WorkersManagement", { service })} />
                </View>
                : show == "Edit" ?
                    <View>
                        <Text>Edit</Text>
                        <TextInput
                            style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
                            onChangeText={setName}
                            //placeholder={name}
                            value={name}
                        />
                        <TextInput
                            style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
                            keyboardType='numeric'
                            onChangeText={setPrice}
                            // placeholder={price}
                            value={price}
                            maxLength={4}
                        />
                        <TextInput
                            style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
                            onChangeText={setDescription}
                            // placeholder={description}
                            value={description}
                        />

                        <Button title="Save" onPress={() => update()} />
                        <Button title="Cancel" onPress={() => setShow("All") || setName(service.Name) || setPrice(service.Price) || setDescription(service.Description)} />


                    </View>

                    :
                    null
            }
        </View>
    )


}
ServiceDetailstScreen.navigationOptions = {
    title: 'Details' ,
};