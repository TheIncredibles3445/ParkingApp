import React from "react";
import {
  Platform,
  SafeAreaView,
  View,
  Text,
  ScrollView,
  Image,
} from "react-native";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createDrawerNavigator, DrawerItems } from "react-navigation-drawer";
import { Avatar, Icon } from "react-native-elements";
import db from "../db";
import firebase from "firebase";
import "firebase/auth";
import TabBarIcon from "../components/TabBarIcon";
//Asgad's Imports
import AdvertisementRequest from "../screens/Adverisement/AdvertisementRequest";
import FriendScreen from "../screens/Profile/FriendsScreen";
import WorkersRating from "../screens/Admin/WorkersRating"

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

let loggedInUser = null;
firebase.auth().onAuthStateChanged(async (user) => {
  loggedInUser = user;
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
  WorkersRating:{
    screen: WorkersRating,
  }

});
//the simulator wont work >>. i have to shut down the pc it always happen
AdminStack.navigationOptions = {
  tabBarLabel: "Admin Panel",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-link" : "md-link"}
    />
  ),
};
AdminStack.path = "";

const SettingsStack = createStackNavigator(
  {
    // Settings: SettingsScreen,
    Profile: ProfileScreen,
    EditProfile: Profile,
    Card: PaymentCard,
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
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-options" : "md-options"}
    />
  ),
};

SettingsStack.path = "";

const ProfileStack = createStackNavigator({
  ProfileScreen: ProfileScreen,
  Profile: Profile,
});

const VehicleStack = createStackNavigator({
  Vehicle: Vehicle,
  AddVehicle: AddVehicle,
});

const CardStack = createStackNavigator({
  Card: PaymentCard,
  AddCard: AddCard,
});

const tabNavigator = createBottomTabNavigator(
  {
    HomeStack: HomeStack,
    SettingsStack: SettingsStack,
    AdminStack: AdminStack,
  },
  {
    navigationOptions: ({ navigation }) => {
      const { routeName, routes } = navigation.state.routes[
        navigation.state.index
      ];
      return {
        header: null,
        headerTitle: routeName,
      };
    },
  }
);

tabNavigator.path = "";

const HomeStk = createStackNavigator({
  Home: HomeScreen,
});

const DrawerStack = createStackNavigator(
  {
    HomeDrawerStack: tabNavigator,
    HomeStk: HomeStk,
  },
  {
    drawerIcon: ({ tintColor }) => (
      <Image
        source={require("../assets/images/home.png")}
        style={[styles.icon, { tintColor: tintColor }]}
      />
    ),
  }
);

const ProfileStk = createStackNavigator({
  HomeDrawerStk: tabNavigator,
  ProfileStk: ProfileStack,
});

const VehicleStk = createStackNavigator({
  HomeDrawerStk: tabNavigator,
  VehicleStk: VehicleStack,
});

const CardStk = createStackNavigator({
  HomeDrawerStk: tabNavigator,
  CardStk: PaymentCard,
});

const FriendsStk = createStackNavigator({
  HomeDrawerStk: tabNavigator,
  Friends: LinksScreen,
});

const AppDrawerNavigator = createDrawerNavigator(
  {
    Home: {
      screen: DrawerStack,
      contentOptions: {
        activeTintColor: "red",
        inactiveTintColor: "blue",
      },
      navigationOptions: {
        drawerLabel: "Home",
        drawerIcon: (
          <Image
            source={require("../assets/images/home.png")}
            style={{ width: 22, height: 22 }}
          />
        ),
      },
    },
    Profile: {
      screen: ProfileStk,
      navigationOptions: {
        drawerLabel: "Profile",
        drawerIcon: (
          <Icon
            name="ios-person"
            type="ionicon"
            // style={{ width: 33, height: 33 }}
          />
        ),
      },
    },
    Vehicle: {
      screen: VehicleStk,
      navigationOptions: {
        drawerLabel: "Vehicle",
        drawerIcon: (
          <Icon
            name="md-car"
            type="ionicon"
            style={{ width: 24, height: 24 }}
          />
        ),
      },
    },
    Friends: {
      screen: FriendsStk,
      navigationOptions: {
        drawerLabel: "Friends",
        drawerIcon: (
          <Icon
            name="people-outline"
            type="material"
            style={{ width: 24, height: 24 }}
          />
        ),
      },
    },
    Cards: {
      screen: CardStk,
      navigationOptions: {
        drawerLabel: "Cards",
        drawerIcon: (
          <Icon
            name="ios-card"
            type="ionicon"
            style={{ width: 24, height: 24 }}
          />
        ),
      },
    },
  },
  {
    drawerBackgroundColor: "#F0F8FF",
    navigationOptions: {
      backgroundColor: "red",
    },
    contentOptions: {
      activeTintColor: "black",
      inactiveTintColor: "black",
    },
    contentComponent: (props) => (
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            height: 200,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {loggedInUser && (
            <SafeAreaView style={{ marginTop: "20 %" }}>
              <Avatar
                source={{ uri: loggedInUser.photoURL }}
                size="large"
                rounded
              />
              <View style={{ alignItems: "center" }}>
                <Text style={{ fontSize: 20 }}>{loggedInUser.displayName}</Text>
              </View>
            </SafeAreaView>
          )}
        </View>
        <ScrollView>
          <DrawerItems {...props} />
        </ScrollView>
      </SafeAreaView>
    ),
  }
);

export default AppDrawerNavigator;
