import React, { useEffect } from "react";
import { Platform } from "react-native";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import firebase from "firebase/app";
import "firebase/auth";
import db from "../db";
import { Icon } from "react-native-elements";
import TabBarIcon from "../components/TabBarIcon";
//Asgad's Imports
import AdvertisementRequest from "../screens/Adverisement/AdvertisementRequest";
import FriendScreen from "../screens/Profile/FriendsScreen";
import WorkersRating from "../screens/Admin/WorkersRating";

//Lamees's imports
import ReportScreen from "../screens/ReportScreen";
import AllReportsScreen from "../screens/Admin/AllReportsScreen";
import DiscountsScreen from "../screens/Admin/DiscountsScreen";
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
import ChangeRole from "../screens/Admin/ChangeRole";
import WorkerSchedule from "../screens/Profile/WorkerSchedule";
import ScheduleDetails from "../screens/Profile/ScheuduleDetails";
import AdvertisementDetails from "../screens/Adverisement/AdvertisementDetails";
import MyAdvertisement from "../screens/Adverisement/MyAdvertisements";
import AdminAdvertisements from "../screens/Admin/AdminAdvertisements";
import AdminAdvDetails from "../screens/Admin/AdminAdvertisementDetails";
import AdvertisementList from "../screens/Admin/AdvertisementsList";
import PartialPayment from "../screens/PartialPayment";
import Statistics from "../screens/Admin/Statistics";
import FindParking from "../screens/Booking/FindParkings";
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
import AllBookings from "../screens/Profile/AllBookings";
import ParkingBookingsDetails from "../screens/Profile/ParkingBookingsDetails";
import ServiceBookingDetails from "../screens/Profile/ServiceBookingDetails";
import Direction from "../screens/Booking/Direction";
import ProfileScreen from "../screens/Profile/ProfileScreen";

const config = Platform.select({
  web: { headerMode: "screen" },
  default: {},
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
    ReportScreen: ReportScreen,
    Direction: Direction,
    FindParking: FindParking,
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
  ),
};

HomeStack.path = "";

const AdminStack = createStackNavigator({
  Main: {
    screen: AdminPanel,
  },
  Services: {
    screen: ServicesScreen,
  },
  WorkersManagement: {
    screen: WorkersManagementScreen,
  },
  ServiceDetails: {
    screen: ServiceDetailsScreen,
  },
  UserAccounts: {
    screen: UserAccountsScreen,
  },
  AllReport: {
    screen: AllReportsScreen,
  },
  Adv: {
    screen: AdminAdvertisements,
  },
  AdminAdvDetails: {
    screen: AdminAdvDetails,
  },
  AdvertisementList: {
    screen: AdvertisementList,
  },
  Discounts: {
    screen: DiscountsScreen,
  },
  ChangeRole: {
    screen: ChangeRole,
  },
  Statistics: {
    screen: Statistics,
  },
  WorkersRating: {
    screen: WorkersRating,
  },
});

AdminStack.navigationOptions = {
  tabBarLabel: "Admin Panel",
  tabBarIcon: ({ focused }) => (
    <Icon
      name="settings"
      type="octicon"
      color={focused ? "#edf3f8" : "white"}
    />
  ),
};
AdminStack.path = "";

// const ServiceBookingStack = createStackNavigator({
//   Main: {
//     screen: ServiceBookingScreen
//   },
//   ConfirmBooking: {
//     screen: ConfirmServiceBookingScreen
//   },
//   // Payment: {
//   //   screen: Payment
//   // },
//   Home: {
//     screen: HomeScreen
//   }
// });
// ServiceBookingStack.navigationOptions = {
//   tabBarLabel: "Book a Service",
//   tabBarIcon: ({ focused }) => (
//     <TabBarIcon
//       focused={focused}
//       name={Platform.OS === "ios" ? "ios-link" : "md-link"}
//     />
//   )
// };
// ServiceBookingStack.path = "";

//

const TestStack = createStackNavigator(
  {
    Test: Direction,
  },
  config
);

TestStack.navigationOptions = {
  tabBarLabel: "Test",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-link" : "md-link"}
    />
  ),
};

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
    PartialPayment: PartialPayment,
    AllBookings: AllBookings,
    ParkingBookingsDetails: ParkingBookingsDetails,
    ServiceBookingDetails: ServiceBookingDetails,
  },
  config
);

SettingsStack.navigationOptions = {
  tabBarLabel: "Profile",
  tabBarIcon: ({ focused }) => (
    <Icon
      name="md-person"
      type="ionicon"
      color={focused ? "#edf3f8" : "white"}
    />
  ),
};

SettingsStack.path = "";

// useEffect(()=>{
// getUser()
// },[])

// const getUser = async() => {

//   if( firebase.auth().currentUser.uid ){
//     let user = await db.collection("users").doc(firebase.auth().currentUser.uid).get()
//     console.log("the userrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr",user)
//   }
// }

const tabNavigator = createBottomTabNavigator(
  {
    HomeStack,
    SettingsStack,
    AdminStack,
  },
  {
    tabBarOptions: {
      activeTintColor: "#edf3f8",
      inactiveTintColor: "white",
      style: {
        backgroundColor: "#5a91bf",
      },
    },
  }
);

tabNavigator.path = "";

export default tabNavigator;
