import React from "react";
import { ScrollView, StyleSheet, Button, View, Text , TouchableOpacity } from "react-native";
import { ExpoLinksView } from "@expo/samples";

export default function AdminPanel(props) {
  return (
    <View style={styles.container}>
    
      {/**
       * Go ahead and delete ExpoLinksView and replace it with your content;
       * we just wanted to provide you with some helpful links.
       */}
      
        
        <TouchableOpacity onPress={() => props.navigation.navigate("Services")} style={styles.btns}>
          <Text style={styles.text}>Services Manegement</Text>
          </TouchableOpacity>

        <TouchableOpacity onPress={() => props.navigation.navigate("UserAccounts")} style={styles.btns}>
          <Text style={styles.text}>Users Manegement</Text>
          </TouchableOpacity>

        <TouchableOpacity onPress={() => props.navigation.navigate("AllReport")} style={styles.btns}>
          <Text style={styles.text}>All Reports</Text>
          </TouchableOpacity>

        <TouchableOpacity onPress={() => props.navigation.navigate("Adv")} style={styles.btns}>
          <Text style={styles.text}>Advertisements</Text>
          </TouchableOpacity>

        <TouchableOpacity onPress={() => props.navigation.navigate("Statistics")} style={styles.btns}>
          <Text style={styles.text}>Statistics</Text>
          </TouchableOpacity>

        <TouchableOpacity  onPress={() => props.navigation.navigate("Discounts")} style={styles.btns}>
          <Text style={styles.text}>Discounts</Text>
          </TouchableOpacity>

        {/* <TouchableOpacity style={{ marginBottom: 10, backgroungColor:"#B0C4DE" }}>
          <Text style={{color:"#263c5a" , fontSize:15}}></Text>
          </TouchableOpacity> */}

      
    
    </View>
  );
}

AdminPanel.navigationOptions = {
  title: "Admin Panel",
  headerStyle:{ backgroundColor:"#246175"}
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#F5FCFF',
   // height:"100%"
  },
  text:{color:"#263c5a" , fontSize:18 , marginRight:"auto",marginLeft:"auto"},
  btns:{ 
    marginBottom: 10, 
    backgroundColor: "#B0C4DE",
     borderRadius:7 , 
     height:"10%" ,
      paddingTop:5 , 
      width:"50%", 
      marginRight:"auto",
      marginLeft:"auto" }
});
