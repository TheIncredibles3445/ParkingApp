import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Button, SafeAreaView } from "react-native";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";
import "firebase/functions";
import * as ImagePicker from "expo-image-picker";
import { Avatar, ListItem, Icon, Text } from "react-native-elements";
import "firebase/auth";
import db from "../../db.js";
import { getSupportedVideoFormats } from "expo/build/AR";
// import { Ionicons } from "@expo/vector-icons";

// import { Text } from "react-native-animatable";
// import { ScrollView } from "react-native-gesture-handler";


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

  const handleSet = () => {
    const user = firebase.auth().currentUser;
    // setDisplayName(user.displayName);
    setPhotoURL(user.photoURL);
    // setPhone(user.phoneNumber);
  };

  
  const handleLogout = () => {
    firebase.auth().signOut();

  };



  useEffect(() => {
    
  }, [loggedInUser.current ]);

  useEffect(() => { }, [photoURL]);

  const handleSave = async uri => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const putResult = await firebase
      .storage()
      .ref()
      .child(firebase.auth().currentUser.uid)
      .put(blob);
    const url = await firebase
      .storage()
      .ref()
      .child(firebase.auth().currentUser.uid)
      .getDownloadURL();
    const updateUser = firebase.functions().httpsCallable("updatePhoto");
    const response2 = await updateUser({
      uid: firebase.auth().currentUser.uid,
      photoURL: url
    });
    setPhotoURL(url);
  };


  const handlePickImage = async () => {
    // show camera roll, allow user to select
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    if (!result.cancelled) {
      console.log("not cancelled", result.uri);
      handleSave(result.uri);
      //setPhotoURL(result.uri);
    }
  };


  const list = ["MY PROFILE", "PAYMENT", "VEHICLES", "FRIENDS"];
  const files = ["Profile", "Payment", "Vehicle", "Friends"];
  return (
    <View style={styles.container}>
      <View style={{ flex: 2, alignItems: "center" }}>
        <Avatar
          containerStyle={{ marginTop: 10 }}
          rounded
          size={100}
          source={{
            uri: photoURL
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
                user: firebase.auth().currentUser
              })
            }
          />
        ))}

        
        {

          loggedInUser.current && loggedInUser.current.role === "worker" ?
            <View style={{ flex: 4 }}>

              <ListItem
                title="Schedule"
                bottomDivider
                rightIcon={<Icon type="ionicon" name="ios-arrow-forward" />}
                onPress={() =>
                  props.navigation.navigate("Schedule", {
                    user: loggedInUser.current
                  })
                }
              />
            </View>
            : 
            null
        }

        {
          ads.length > 0 ?
          <View style={{ flex: 4 }}>

              <ListItem
                title="My Advertisements"
                bottomDivider
                rightIcon={<Icon type="ionicon" name="ios-arrow-forward" />}
                onPress={() =>
                  props.navigation.navigate("MyAdvertisement", {
                    myAds: ads
                  })
                }
              />
            </View>
          :

          null
        }

      </View>





      <Button title="Log Out" onPress={handleLogout} />
    </View>
  );
}

SettingsScreen.navigationOptions = {
  title: "MY ACCOUNT"
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  developmentModeText: {
    marginBottom: 20,
    color: "rgba(0,0,0,0.4)",
    fontSize: 14,
    lineHeight: 19,
    textAlign: "center"
  },
  contentContainer: {
    paddingTop: 30
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: "contain",
    marginTop: 3,
    marginLeft: -10
  },
  getStartedContainer: {
    alignItems: "center",
    marginHorizontal: 50
  },
  homeScreenFilename: {
    marginVertical: 7
  },
  codeHighlightText: {
    color: "rgba(96,100,109, 0.8)"
  },
  codeHighlightContainer: {
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 3,
    paddingHorizontal: 4
  },
  getStartedText: {
    fontSize: 24,
    color: "rgba(96,100,109, 1)",
    lineHeight: 24,
    textAlign: "center"
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
        shadowRadius: 3
      },
      android: {
        elevation: 20
      }
    }),
    alignItems: "center",
    backgroundColor: "#fbfbfb",
    paddingVertical: 20
  },
  tabBarInfoText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    textAlign: "center"
  },
  navigationFilename: {
    marginTop: 5
  },
  helpContainer: {
    marginTop: 15,
    alignItems: "center"
  },
  helpLink: {
    paddingVertical: 15
  },
  helpLinkText: {
    fontSize: 14,
    color: "#2e78b7"
  }
});
