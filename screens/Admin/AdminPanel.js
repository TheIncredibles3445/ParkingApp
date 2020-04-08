import React from "react";
import { ScrollView, StyleSheet, Button, View, Text } from "react-native";
import { ExpoLinksView } from "@expo/samples";
import { Divider } from "react-native-elements";
import * as Animatable from "react-native-animatable";

export default function AdminPanel(props) {
  return (
    //Here I used react native components such as, ScorllView for renders all the components at once,
    // Buttons, and also I used the View and Text
    // I used also Animation on the Text and on the buttons
    // I used flash animation for the text and it runs when u open the admin panel page and also I made the iterationCount as "infinite" to keep the text runs as flash animation infintly.
    // I used flipInY animation for the buttons and it runs only once to let the admin choose where he wants to go easily.
    // I used react navigation also here in this page, so for example for Services Manegement button, it will navigate the admin to the Services Screen
    // Also, in All Reports button it will navigate the admin to AllReportsScreen that will show him all the reports that the users did.

    <ScrollView style={styles.container}>
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
          animation="lightSpeedIn"
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
