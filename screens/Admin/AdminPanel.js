import React from "react";
import { ScrollView, StyleSheet, Button, View, Text } from "react-native";
import { ExpoLinksView } from "@expo/samples";
import { Divider } from "react-native-elements";
import * as Animatable from "react-native-animatable";

export default function AdminPanel(props) {
  return (
    <ScrollView style={styles.container}>
      {/**
       * Go ahead and delete ExpoLinksView and replace it with your content;
       * we just wanted to provide you with some helpful links.
       */}
      {/* <Divider style={{ marginTop: 20 }} /> */}
      <Animatable.View
        animation="flash"
        direction="alternate"
        iterationCount="infinite"
      >
        <Text style={{ fontSize: 35, marginLeft: "15%" }}>
          {" "}
          Welcome Admin!!{" "}
        </Text>
      </Animatable.View>
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
        <Animatable.View
          animation="flipInY"
          direction="alternate"
          iterationCount={1}
        >
          <Button
            title="Services Manegement"
            color="#005992"
            onPress={() => props.navigation.navigate("Services")}
          />
        </Animatable.View>
        <Text style={{ marginBottom: 10 }}></Text>
        <Animatable.View
          animation="flipInY"
          direction="alternate"
          iterationCount={1}
        >
          <Button
            title="Users Manegement"
            color="#005992"
            onPress={() => props.navigation.navigate("UserAccounts")}
          />
        </Animatable.View>
        <Text style={{ marginBottom: 10 }}></Text>
        <Animatable.View
          animation="flipInY"
          direction="alternate"
          iterationCount={1}
        >
          <Button
            title="All Reports"
            color="#005992"
            onPress={() => props.navigation.navigate("AllReport")}
          />
        </Animatable.View>
        <Text style={{ marginBottom: 10 }}></Text>
        <Animatable.View
          animation="flipInY"
          direction="alternate"
          iterationCount={1}
        >
          <Button
            title="Discounts"
            color="#005992"
            onPress={() => props.navigation.navigate("Discounts")}
          />
        </Animatable.View>
        <Text style={{ marginBottom: 10 }}></Text>
        <Animatable.View
          animation="flipInY"
          direction="alternate"
          iterationCount={1}
        >
          <Button
            title="others.."
            color="#005992"
            onPress={() => console.log("go to others")}
          />
        </Animatable.View>
      </View>
    </ScrollView>
  );
}

AdminPanel.navigationOptions = {
  title: "Admin Panel",
  headerTintColor: "white",
  headerStyle: { backgroundColor: "#005992" },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#fff",
  },
});
