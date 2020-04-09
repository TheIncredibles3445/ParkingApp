import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Button,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";
import "firebase/functions";
import * as ImagePicker from "expo-image-picker";
import { Avatar, ListItem, Icon, Text } from "react-native-elements";
import "firebase/auth";
import db from "../../db.js";
import { createDrawerNavigator } from "react-navigation-drawer";
import { createAppContainer } from "react-navigation";

import ProfileScreen from "./ProfileScreen.js";
import Vehicle from "./Vehicle";

export default function SettingsScreen(props) {
  const MyDrawerNavigator = createDrawerNavigator({
    Home: {
      screen: ProfileScreen,
    },
    Vehicle: {
      screen: Vehicle,
    },
  });

  const MyApp = createAppContainer(MyDrawerNavigator);

  return <MyApp />;
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
});
