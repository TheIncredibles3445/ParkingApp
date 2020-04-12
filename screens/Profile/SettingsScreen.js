import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Button, SafeAreaView , ScrollView} from "react-native";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";
import "firebase/functions";
import * as ImagePicker from "expo-image-picker";
import { Avatar, ListItem, Icon, Text } from "react-native-elements";
import "firebase/auth";
import db from "../../db.js";



export default function SettingsScreen(props) {
  const [hasCameraRollPermission, setHasCameraRollPermission] = useState(false);
  // const [displayName, setDisplayName] = useState("");
  // const [uri, setUri] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const loggedInUser = useRef()
  const [update , setUpate] = useState(false)
  const[ ads , setAds] = useState([])

  const askPermission = async () => {
    const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
    setHasCameraRollPermission(status === "granted");
  };

  useEffect(()=>{

  },[ update])

  useEffect(() => {
    console.log(firebase.auth().currentUser.uid);
    handleSet();
    getUser()
    askPermission();

    db.collection("Advertisement").where("uid", "==", firebase.auth().currentUser.uid).onSnapshot(querySnapshot => {
      let ads = [];

      querySnapshot.forEach(doc => {
          ads.push({ id: doc.id, ...doc.data(), isSelected: false });
      });
     
      setAds([...ads]);
    });


  }, []);

  const getUser = async () => {
    let loggeduser = await db.collection("users").doc(firebase.auth().currentUser.uid).get()
    loggedInUser.current = loggeduser.data()
    console.log("the user ---->", loggedInUser.current.role) 
    setUpate(!update) 
  }


  // const CardStack = createStackNavigator({
  //   Payment: PaymentCard,
  //   AddCard: AddCard,
  // });


//   const MyDrawerNavigator = createDrawerNavigator({
//     Home: ProfileScreen,
//     Vehicle: VehicleStack,
//     Friends: LinksScreen,
//     Cards: CardStack,
//     PartialPayment: PartialPayment,

//     // AddVehicle: AddVehicle,
//   });

  const list = ["MY PROFILE", "PAYMENT", "VEHICLES", "FRIENDS", "MY POINTS"];
  const files = ["Profile", "Payment", "Vehicle", "Friends", "Reward"];

  return (
    <ScrollView style={styles.container}>
      <View style={{ flex: 2, alignItems: "center" }}>
        <Avatar
          containerStyle={{ marginTop: 10 }}
          rounded
          size={100}
          source={{
            uri: photoURL,
          }}
          overlayContainerStyle={{ backgroundColor: "white" }}
          showEditButton
          onEditPress={handlePickImage}
          // editButton={<Icon type="feather" name="edit-2" color="red" />}
        />
        <Text>You are logged in as</Text>
        <Text>{firebase.auth().currentUser.email}</Text>
      </View>
      <View style={{ flex: 4 }}>
        {list.map((item, index) => (
          <ListItem
            key={index}
            title={item}
            bottomDivider
            rightIcon={<Icon type="ionicon" name="ios-arrow-forward" />}
            onPress={() =>
              props.navigation.navigate(files[index], {
                user: firebase.auth().currentUser,
              })
            }
          />
        ))}
      </View>





      <Button title="Log Out" onPress={handleLogout} />
    </ScrollView>
  );
}

SettingsScreen.navigationOptions = {
  title: "MY ACCOUNT",
  headerTintColor: "white",
  headerStyle: {
    backgroundColor: "#005992",
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  developmentModeText: {
    marginBottom: 20,
    color: "rgba(0,0,0,0.4)",
    fontSize: 14,
    lineHeight: 19,
    textAlign: "center",
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: "contain",
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: "center",
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: "rgba(96,100,109, 0.8)",
  },
  codeHighlightContainer: {
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 24,
    color: "rgba(96,100,109, 1)",
    lineHeight: 24,
    textAlign: "center",
  },
  tabBarInfoContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: "center",
    backgroundColor: "#fbfbfb",
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    textAlign: "center",
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: "center",
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
})