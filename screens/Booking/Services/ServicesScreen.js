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

import "firebase/auth";
import db from "../../../db.js";
import FlashMessage from "react-native-flash-message";
import { showMessage, hideMessage } from "react-native-flash-message";

export default function ServicesScreen(props) {
  const [services, setServices] = useState([]);
  const [show, setShow] = useState("All");
  const [selectedService, setSelectedService] = useState();
  const [name, setName] = useState();
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    db.collection("service").onSnapshot(querySnapshot => {
      const services = [];
      querySnapshot.forEach(doc => {
        services.push({ id: doc.id, ...doc.data() });
      });
      setServices([...services]);
    });
  }, []);

  useEffect(() => {
    if (show == "All") {
      setName("");
      setPrice(0);
      setDescription("");
      setError("");
    }
  }, [show]);

  const save = type => {
    if (type == "Update") {
      db.collection("service")
        .doc(selectedService.id)
        .update({ Name: name, Description: description, Price: price });
      setShow("All");
    } else {
      if (!name || !description || !price) {
        //setError("Please Fill All The Requirements !");
        showMessage({
          message: "Warning",
          description: "Please Fill All The Requirements",
          type: "danger"
        })
      } else {
        db.collection("service").add({
          Name: name,
          Description: description,
          Price: price,
          Status: false
        });
        setShow("All");
      }
    }
  };

  return (
    <View>


      {show == "All" ? (
        <View style={{ marginTop: "5%", marginLeft: "5%" }}>
          {services.map((s, index) => (
            <TouchableOpacity
              key={index}
              onPress={() =>
                setSelectedService(s) ||
                props.navigation.navigate("ServiceDetails", { service: s })
              }
            >
              <Text
                style={{
                  width: "60%",
                  fontSize: 20,
                  borderBottomColor: "#DCDCDC",
                  borderBottomWidth: 4,
                  marginBottom: 10
                }}
              >
                {" "}
                {s.Name}{" "}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.btn} onPress={() => setShow("Add")}>
            <Text style={{ fontSize: 20, color: "white" }}>Add Service</Text>
          </TouchableOpacity>

        </View>
      ) : show == "Add" ? (
        <View style={{ width: "80%", marginLeft: "auto", marginRight: "auto" ,marginTop:"5%"}}>
<Text style={{ fontSize:30 , marginBottom:"5%", marginLeft: "auto", marginRight: "auto", color:"#708090"}}>Add New Service</Text>
          <View style={styles.box}>
            <Text style={styles.label}>Name</Text>

            <TextInput
              style={styles.input}
              onChangeText={setName}
              placeholder="Cars Support"
              value={name}
            />

          </View>

          <View style={styles.box}>
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

          <View style={styles.box}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            onChangeText={setDescription}
            placeholder="..."
            value={description}
          />
          </View>

          
          <Text style={{fontSize:  15 ,coloe:"#FF6347" , margin:"5%"}}>{error ? error : null}</Text>
          <View style={{ flexDirection:"row", justifyContent:"space-evenly" }}>
           
            <TouchableOpacity style={styles.btn} onPress={() => save("Insert")} ><Text style={{ fontSize: 20, color: "white" }}>Save</Text></TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={() => setShow("All")} ><Text style={{ fontSize: 20, color: "white" }}>Cancel</Text></TouchableOpacity>
          </View>
        </View>
      ) : null}
       <FlashMessage position="bottom" animationDuration={300} duration={50000} />
    </View>
  );
}
ServicesScreen.navigationOptions = {
  title: "Services Management"
};


const styles = StyleSheet.create({
  btn: { backgroundColor: "#00BFFF", width: "40%", alignItems: "center", height: 40, padding: 2, borderRadius: 4 },
  input: { height: 40, borderColor: "#DCDCDC", borderWidth: 3,width:"70%", borderRadius: 4 },
  label:{ fontSize:15 , width :"20%" , marginRight:"5%"},
  box:{flexDirection: "row" ,width:"100%" , margin:5}
})