import React from "react";
import { ScrollView, StyleSheet, Button, View, Text } from "react-native";
import { ExpoLinksView } from "@expo/samples";
import { Divider } from "react-native-elements";

export default function AdminPanel(props) {
  return (
    <ScrollView style={styles.container}>
      {/* <Text style={{ fontSize: 35, marginLeft: "15%" }}> Welcome Admin!! </Text> */}
      <View
        style={{
          width: 250,
          marginRight: "auto",
          marginLeft: "auto",
          justifyContent: "space-evenly",
          marginBottom: 10,
          marginTop: "15%",
          borderRadius: 10,
        }}
      >
        <Button
          title="Services Manegement"
          onPress={() => props.navigation.navigate("Services")}
        />

        <Text style={{ marginBottom: 10 }}></Text>

        <Button
          title="Users Manegement"
          onPress={() => props.navigation.navigate("UserAccounts")}
        />

        <Text style={{ marginBottom: 10 }}></Text>

        <Button
          title="All Reports"
          onPress={() => props.navigation.navigate("AllReport")}
        />

        <Text style={{ marginBottom: 10 }}></Text>
        <Button title="Advertisements" onPress={() => props.navigation.navigate("Adv")} />
        <Button
          title="Discounts"
          onPress={() => props.navigation.navigate("Discounts")}
        />

        <Text style={{ marginBottom: 10 }}></Text>

        <Button title="others.." onPress={() => console.log("go to others")} />
        <Button
          title="Workers Rating"
          onPress={() => props.navigation.navigate("WorkersRating")}
        />
      </View>
    </ScrollView>
  );
}

AdminPanel.navigationOptions = {
  title: "Admin Panel",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#E7EAEB",
  },
});
