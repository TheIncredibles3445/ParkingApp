import React from "react";
import { Platform } from "react-native";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";

import TabBarIcon from "../components/TabBarIcon";
//Asgad's Imports
import AdvertisementRequest from "../screens/Adverisement/AdvertisementRequest";
import FriendScreen from "../screens/Profile/FriendsScreen";

//Lamees's imports
import ReportScreen from "../screens/ReportScreen";
import AllReportsScreen from "../screens/Admin/AllReportsScreen";
import AdminScreen from "../screens/Admin/AdminScreen";

//Amal's Imports
import AdminPanel from "../screens/Admin/AdminPanel";
import UserAccountsScreen from "../screens/Admin/UserAccounts";
import ServicesScreen from "../screens/Booking/Services/ServicesScreen";
import WorkersManagementScreen from "../screens/Booking/Services/WorkersMenagementScreen";
import ServiceDetailsScreen from "../screens/Booking/Services/ServiceDetailsScreen";
import ServiceBookingScreen from "../screens/Booking/ServiceBooking/ServiceBookingScreen";
import ConfirmServiceBookingScreen from "../screens/Booking/ServiceBooking/ConfirmServiceBookingScreen";
import Payment from "../screens/Booking/Payment";
import ChangeRole from "../screens/Admin/ChangeRole"
import WorkerSchedule from "../screens/Profile/WorkerSchedule"
import ScheduleDetails from "../screens/Profile/ScheuduleDetails"
import AdvertisementDetails from "../screens/Adverisement/AdvertisementDetails"
import MyAdvertisement from "../screens/Adverisement/MyAdvertisements"
import AdminAdvertisements from "../screens/Admin/AdminAdvertisements"
import AdminAdvDetails from "../screens/Admin/AdminAdvertisementDetails"
import AdvertisementList from "../screens/Admin/AdvertisementsList"
import PartialPayment from "../screens/PartialPayment"

//Wasim's Import
import HomeScreen from "../screens/HomeScreen";
import LinksScreen from "../screens/Profile/LinksScreen";
import ParkingBooking from "../screens/Booking/ParkingBooking/ParkingBooking";
import SettingsScreen from "../screens/Profile/SettingsScreen";
import Parking from "../screens/Booking/ParkingBooking/Parkings";
import Profile from "../screens/Profile/Profile";
import PaymentCard from "../screens/Profile/Payment";
import Vehicle from "../screens/Profile/Vehicle";
import AddVehicle from "../screens/Profile/AddVehicle";
import Checkout from "../screens/Booking/Checkout";
import AddCard from "../screens/Profile/AddCard";

const config = Platform.select({
  web: { headerMode: "screen" },
  default: {}
});

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
    ParkingBooking: ParkingBooking,
    Parking: Parking,
    Checkout: Checkout,
    Advertisement: AdvertisementRequest,
    ServiceBooking: ServiceBookingScreen,
    ConfirmBooking: ConfirmServiceBookingScreen,
    Payment: Payment,
    ReportScreen: ReportScreen
  },
  config
);

HomeStack.navigationOptions = {
  tabBarLabel: "Home",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? `md-home` : "md-home"}
    />
  )
};

HomeStack.path = "";

const AdminStack = createStackNavigator({
  Main: {
    screen: AdminPanel
  },
  Services: {
    screen: ServicesScreen
  },
  WorkersManagement: {
    screen: WorkersManagementScreen
  },
  ServiceDetails: {
    screen: ServiceDetailsScreen
  },
  UserAccounts: {
    screen: UserAccountsScreen
  },
  AllReport: {
    screen: AllReportsScreen
  },
  ChangeRole: {
    screen: ChangeRole
  },
  Adv: {
    screen: AdminAdvertisements
  },
  AdminAdvDetails: {
    screen: AdminAdvDetails
  },
  AdvertisementList:{
    screen: AdvertisementList
  }

});

AdminStack.navigationOptions = {
  tabBarLabel: "Admin Panel",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-link" : "md-link"}
    />
  )
};
AdminStack.path = "";



const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen,
    Profile: Profile,
    Payment: PaymentCard,
    Vehicle: Vehicle,
    AddVehicle: AddVehicle,
    AddCard: AddCard,
    Friends: LinksScreen,
    Schedule: WorkerSchedule,
    ScheduleDetails: ScheduleDetails,
    AdvertisementDetails: AdvertisementDetails,
    MyAdvertisement: MyAdvertisement,
    PartialPayment: PartialPayment
  },
  config
);

SettingsStack.navigationOptions = {
  tabBarLabel: "Profile",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-options" : "md-options"}
    />
  )
};

SettingsStack.path = "";

const tabNavigator = createBottomTabNavigator({
  HomeStack,
  SettingsStack,
  AdminStack
});

tabNavigator.path = "";

export default tabNavigator;
