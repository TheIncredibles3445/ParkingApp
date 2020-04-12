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
  View,
  ScrollViewBase
} from "react-native";

import "firebase/auth";
import db from "../../../db.js";
import FlashMessage from "react-native-flash-message";
import { showMessage, hideMessage } from "react-native-flash-message";
import * as Animatable from 'react-native-animatable';

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
    <View style={{backgroundColor: "#F0F8FF" , height:"100%"}}>

      {show == "All" ? (
        <View style={{ marginTop: "5%", marginLeft: "5%" }}>
          <Animatable.Text animation="fadeInRight" delay={3} style={{ marginLeft: "auto", marginRight: "auto", fontSize: 30, color: "#284057", marginBottom: "10%"  }}>CNA-Q Cars Services</Animatable.Text>
          <Animatable.View animation="fadeInRight" delay={10}>
          <ScrollView style={{marginLeft: "4%" , height:"auto",
          borderColor: "#284057", borderWidth: 2 ,marginRight:"5%" ,
           width:"90%", padding:10 , backgroundColor:"white"}}>
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
                  width: "80%",
                  fontSize: 20,
                  borderBottomColor: "#284057",
                  borderBottomWidth: 2,
                  marginBottom: 10, marginRight:"auto" , marginLeft:"auto"
                }}
              >
                {" "}
                {s.Name}{" "}
              </Text>
            </TouchableOpacity>
          ))}
          </ScrollView>
          </Animatable.View>

          <Animatable.View animation="fadeInRight" delay={10}>
          <TouchableOpacity style={{ marginTop: "10%", marginLeft: "10%",backgroundColor: "#B0C4DE", width: "40%", alignItems: "center", height: 40, padding: 2, borderRadius: 4 }} onPress={() => setShow("Add")}>
            <Text style={{ fontSize: 20, color: "white"}}>Add Service</Text>
          </TouchableOpacity>
          </Animatable.View>
        </View>
      ) : show == "Add" ? (
        
        <Animatable.View animation="fadeInUp" delay={10} style={{ width: "95%", marginLeft: "auto", marginRight: "auto" ,marginTop:"5%"}}>
<Text style={{ marginLeft: "auto", marginRight: "auto", fontSize: 30, color: "#284057", marginBottom: "10%"  }}>Add New Service</Text>
<View style={{borderColor: "#284057", borderWidth: 2 , width:"100%" , padding:10 , backgroundColor:"white"}}>
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
          
        </Animatable.View>
      ) : null}
       <FlashMessage position="bottom" animationDuration={300} duration={9000} />
    </View>
  );
}
ServicesScreen.navigationOptions = {
  title: "Services Management",
  headerStyle: { backgroundColor: "#5a91bf" },
  headerTitleStyle: {
    color: "white"
  }
};


const styles = StyleSheet.create({
  btn: { backgroundColor: "#B0C4DE", width: "40%", alignItems: "center", height: 40, padding: 2, borderRadius: 4 },
  input: { height: 40, borderColor: "#C0C0C0", borderWidth: 2,width:"70%", borderRadius: 4 , padding:10 , backgroundColor:"white"},
  label:{ fontSize:15 , width :"20%" , marginRight:"5%" , fontWeight:"bold"},
  box:{flexDirection: "row" ,width:"100%" , margin:5}
})