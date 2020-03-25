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
        setError("Please Fill All The Requirements !");
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
      <Text style={{ fontSize: 20, marginLeft: "auto", marginRight: "auto" }}>
        Service Management
      </Text>

      {show == "All" ? (
        <View style={{ marginLeft: "auto", marginRight: "auto" }}>
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
                  width: 250,
                  fontSize: 20,
                  borderBottomColor: "#DCDCDC",
                  borderBottomWidth: 1,
                  marginBottom: 10
                }}
              >
                {" "}
                {s.Name}{" "}
              </Text>
            </TouchableOpacity>
          ))}
          <Button title="Add Service" onPress={() => setShow("Add")} />
        </View>
      ) : show == "Add" ? (
        <View style={{ width: "80%", marginLeft: "auto", marginRight: "auto" }}>
          <Text>Name</Text>

          <TextInput
            style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
            onChangeText={setName}
            placeholder="Cars Support"
            value={name}
          />
          <Text>Price</Text>
          <TextInput
            style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
            keyboardType="numeric"
            onChangeText={setPrice}
            placeholder="000"
            value={price}
            maxLength={4}
          />
          <Text>Description</Text>
          <TextInput
            style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
            onChangeText={setDescription}
            placeholder="..."
            value={description}
          />
          <Text>{error ? error : null}</Text>
          <View style={{ marginLeft: "auto", marginRight: "auto", width: 250 }}>
            <Button title="Save" onPress={() => save("Insert")} />
            <Text style={{ marginBottom: 10 }}></Text>
            <Button title="Cancel" onPress={() => setShow("All")} />
          </View>
        </View>
      ) : null}
    </View>
  );
}
ServicesScreen.navigationOptions = {
  title: "Services"
};
