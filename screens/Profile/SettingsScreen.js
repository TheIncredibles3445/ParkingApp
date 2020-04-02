import React, { useState, useEffect } from "react";
import { StyleSheet, View, Button, SafeAreaView } from "react-native";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";
import "firebase/functions";
import * as ImagePicker from "expo-image-picker";
import { Avatar, ListItem, Icon, Text } from "react-native-elements";
// import { Ionicons } from "@expo/vector-icons";
// import { Text } from "react-native-animatable";
// import { ScrollView } from "react-native-gesture-handler";

export default function SettingsScreen(props) {
  const [hasCameraRollPermission, setHasCameraRollPermission] = useState(false);
  // const [displayName, setDisplayName] = useState("");
  // const [uri, setUri] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  // const [phone, setPhone] = useState("");

  const askPermission = async () => {
    const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
    setHasCameraRollPermission(status === "granted");
  };

  useEffect(() => {
    console.log(firebase.auth().currentUser);
    askPermission();
  }, []);

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
    handleSet();
  }, []);

  useEffect(() => {}, [photoURL]);

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

  const list = ["MY PROFILE", "PAYMENT", "VEHICLES", "FRIENDS", "My BOOKINGS"];
  const files = ["Profile", "Payment", "Vehicle", "Friends", "AllBookings"];
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
        {/* <TextInput
          style={{
            height: 40,
            borderColor: "gray",
            borderWidth: 1,
            fontSize: 24
          }}
          onChangeText={setDisplayName}
          placeholder="Display Name"
          value={displayName}
        /> */}
        {/* <Input
          placeholder="Name"
          label="Name"
          onChangeText={setDisplayName}
          value={displayName}
        />
        <Input
          placeholder="Phone"
          label="Phone"
          onChangeText={setDisplayName}
          value={phone}
        /> */}
      </View>

      {/* {photoURL !== "" && (
        <Image style={{ width: 100, height: 100 }} source={{ uri: photoURL }} />
      )} */}
      {/* <Button title="Pick Image" onPress={handlePickImage} /> */}
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
