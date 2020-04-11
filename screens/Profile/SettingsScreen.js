import React from "react";
import { StyleSheet } from "react-native";

import { createDrawerNavigator } from "react-navigation-drawer";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import PaymentCard from "./Payment";
import AddVehicle from "./AddVehicle";
import ProfileScreen from "./ProfileScreen.js";
import Vehicle from "./Vehicle";
import AddCard from "./AddCard";
import LinksScreen from "./LinksScreen";
import PartialPayment from "../../screens/PartialPayment";

const VehicleStack = createStackNavigator(
  {
    Vehicle: Vehicle,
    AddVehicle: AddVehicle,
  },
  {
    headerMode: "none",
  }
);

const CardStack = createStackNavigator({
  Payment: PaymentCard,
  AddCard: AddCard,
});

export default function SettingsScreen(props) {
  const MyDrawerNavigator = createDrawerNavigator({
    Home: ProfileScreen,
    Vehicle: VehicleStack,
    Friends: LinksScreen,
    Cards: CardStack,
    PartialPayment: PartialPayment,

    // AddVehicle: AddVehicle,
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
