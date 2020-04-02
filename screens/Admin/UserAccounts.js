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
  Picker
} from "react-native";

import "firebase/auth";
import db from "../../db.js";
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
  Cols,
  Cell
} from "react-native-table-component";

export default function UserAccounts(props) {
  const [services, setServices] = useState([]);
  const [show, setShow] = useState("All");
  const [search, setSearch] = useState();
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState();
  const [role, setRole] = useState();

  useEffect(() => {
    db.collection("users").onSnapshot(querySnapshot => {
      const users = [];
      querySnapshot.forEach(doc => {
        users.push({ id: doc.id, ...doc.data() });
        console.log("current users", users);
      });
      setUsers([...users]);
    });
    console.log("users", users);
  }, []);

  useEffect(() => {
    if (search) {
      setShow(false);
      //filter where user email == email
    } else {
      setShow(true);
    }
  }, [search]);

  useEffect(() => {
    if (email) {
    }
  }, [email]);

  useEffect(() => {
    if (role) {
    }
  }, [role]);

  const filter = () => {};

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, marginLeft: "auto", marginRight: "auto" }}>
        Users
      </Text>
      <View style={styles.box}>
        <TextInput
          style={styles.search}
          onChangeText={text => setEmail(text)}
          placeholder="email@example.com"
          value={email}
        />

        <Picker
          selectedValue={role}
          style={styles.search}
          onValueChange={itemValue => setRole(itemValue)}
        >
          <Picker.Item label="ROLE" value="" />
          <Picker.Item label="Admin" value="" />
          <Picker.Item label="User" value="" />
          <Picker.Item label="Worker" value="" />
          <Picker.Item label="Advertiser" value="" />
        </Picker>
        <View>
          <Button title="search" onPress={() => filter()} />
        </View>
      </View>

      {users.length > 0 ? (
        users.map(u => (
          <View style={styles.box}>
            <View style={styles.user}>
              <Text style={{ fontSize: 20 }}>{u.displayName}</Text>
              <Text>email@email.com</Text>
            </View>
            <View style={styles.user}>
              <Text style={{ fontSize: 20 }}>{u.role}</Text>
            </View>
          </View>
        ))
      ) : (
        <Text>No Users Found</Text>
      )}

      {/* {
                show == "All" ?
                    <View style={{ marginLeft:"auto", marginRight:"auto"}}>
                        {services.map((s, index) =>
                            <TouchableOpacity key={index} onPress={()=> setSelectedService(s) || props.navigation.navigate("ServiceDetails" , {service: s})} >
                                <Text style={{width: 250 ,fontSize: 20 , borderBottomColor: "#DCDCDC" , borderBottomWidth: 1 , marginBottom:10}}>  {s.Name} </Text>
                            </TouchableOpacity>
                        )}
                        <Button title="Add Service" onPress={() => setShow("Add")} />
                    </View>
                  
                        : show == "Add" ?

                            <View style={{ width: "80%", marginLeft:"auto", marginRight:"auto"}}>
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
                                    keyboardType='numeric'
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
                                <View style={{ marginLeft:"auto", marginRight:"auto", width: 250}}>
                                <Button title="Save" onPress={() => save("Insert")} />
                                <Text style={{ marginBottom:10}}></Text>
                                <Button title="Cancel" onPress={() => setShow("All")} />
                                </View>
                            </View>
                            :
                            null
            } */}
    </View>
  );
}
UserAccounts.navigationOptions = {
  title: "User Accounts"
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: "#fff" },
  head: { height: 40, backgroundColor: "#f1f8ff" },
  text: { margin: 6 },
  box: { backgroundColor: "#FFFAFA", padding: 5, flexDirection: "row" },
  user: {
    backgroundColor: "#F0FFF0",
    padding: 5,
    width: "50%",
    alignItems: "center"
  },
  search: {
    backgroundColor: "#DCDCDC",
    padding: 5,
    width: "50%",
    alignItems: "center"
  }
});
