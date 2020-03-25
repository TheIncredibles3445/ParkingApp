import React from "react";
import { ScrollView, StyleSheet, Text, Button } from "react-native";

export default function AdminScreen(props) {
  return (
    <ScrollView style={styles.container}>
      <Text>Click the button to see all the users reports!!</Text>
      <Button
        title="All Reports"
        onPress={() => props.navigation.navigate("AllReportsScreen")}
      />
    </ScrollView>
  );
}

AdminScreen.navigationOptions = {
  title: "Admin Managment"
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#fff"
  }
});
