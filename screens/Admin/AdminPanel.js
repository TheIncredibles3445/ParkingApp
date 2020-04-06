import React from "react";
import { ScrollView, StyleSheet, Button, View, Text } from "react-native";
import { ExpoLinksView } from "@expo/samples";

export default function AdminPanel(props) {
  return (
    <ScrollView style={styles.container}>
      {/**
       * Go ahead and delete ExpoLinksView and replace it with your content;
       * we just wanted to provide you with some helpful links.
       */}
      <View
        style={{
          width: 250,
          marginRight: "auto",
          marginLeft: "auto",
          justifyContent: "space-evenly",
          marginBottom: 10
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

        <Text style={{ marginBottom: 10 }}></Text>

        <Button title="Statistics" onPress={() => props.navigation.navigate("Statistics")} />
        <Text style={{ marginBottom: 10 }}></Text>
        <Button
          title="Discounts"
          onPress={() => props.navigation.navigate("Discounts")}
        />
        
      </View>
    </ScrollView>
  );
}

AdminPanel.navigationOptions = {
  title: "Admin Panel"
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#fff"
  }
});
