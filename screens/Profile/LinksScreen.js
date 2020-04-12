import { useState, useEffect } from "react";
import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  Modal,
  TouchableHighlight,
  SafeAreaView,
  ScrollView,
  Image,
  Switch,
} from "react-native";
import firebase from "firebase/app";
import "firebase/auth";
import {
  SearchBar,
  Badge,
  Divider,
  Avatar,
  CheckBox,
} from "react-native-elements";
import db from "../../db.js";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Card } from "react-native-shadow-cards";
import * as Animatable from "react-native-animatable";
import { Snackbar } from "react-native-paper";

const LinksScreen = (props) => {
  const data = props.navigation.getParam("data", "No params");
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");

  const [v, setV] = useState(false);
  const [text, setText] = useState("");
  const [enableFriends, setEnableFriends] = useState(true);
  const [arrayholder, setArrayHolder] = useState([]);

  const [modalVisible, setmodalVisible] = useState(false);
  const [modalVisible2, setmodalVisible2] = useState(false);

  const [myfriends, setMyfriends] = useState([]);

  const [countReq, setCountReq] = useState(0);
  const [friendsRequestList, setFriendRequestList] = useState([]);

  const [myfriendList, setMyfriendList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);

  const toggleSwitch = (item, isEnabled) => {
    setIsEnabled(!isEnabled);
    db.collection("users")
      .doc(item.id)
      .collection("Friends")
      .doc(firebase.auth().currentUser.uid)
      .update({ booking: isEnabled });

    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("Friends")
      .doc(item.id)
      .update({ booking: isEnabled });
  };
  const ssetModalVisible = (visible) => {
    setmodalVisible(visible);
  };
  const ssetModalVisible2 = (visible) => {
    setmodalVisible2(visible);
  };
  const handleUsers = async () => {
    db.collection("users").onSnapshot((querySnapshot) => {
      const users = [];
      querySnapshot.forEach((doc) => {
        //mapping
        users.push({ id: doc.id, ...doc.data() });
      });

      setUsers([...users]);
      setArrayHolder(users);
    });
  };
  const getMyFriends = async () => {
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("MyRequest")
      .onSnapshot((querySnapShot) => {
        let friends = [];
        querySnapShot.forEach((doc) => {
          friends.push(doc.id);
        });
        console.log("my friends", friends);
        setMyfriendList(friends);
      });
  };

  useEffect(() => {}, [myfriendList]);
  useEffect(() => {}, [myfriends]);

  useEffect(() => {
    getFriends();
    handleUsers();
    getMyFriends();
    showRequest();
  }, []);

  const searchFunction = (text) => {
    const newData = arrayholder.filter(function (item) {
      //applying filter for the inserted text in search bar
      const itemData = item.displayName
        ? item.displayName.toUpperCase()
        : "".toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setUsers(newData);
    setText(text);
  };

  const handleFollow = async (item) => {
    await db
      .collection("users")
      .doc(item)
      .collection("Request")
      .doc(firebase.auth().currentUser.uid)
      .set({ status: "Friend Request Received" });

    await db
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("MyRequest")
      .doc(item)
      .set({ status: "Friend Request Sent" });

    getMyFriends();
  };

  const findUserById = async (id) => {
    const userRef = await db.collection("users").doc(id).get();
    return userRef.data();
  };
  const showRequest = async () => {
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("Request")
      .onSnapshot((querySnap) => {
        let request = [];
        querySnap.forEach(async (doc) => {
          const userData = await findUserById(doc.id);
          request.push({ id: doc.id, ...userData });
          console.log("requests", request);
          setCountReq(request.length);
        });
        setFriendRequestList(request);
      });
  };

  const handleUnFollow = async (item) => {
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("MyRequest")
      .doc(item)
      .delete();

    db.collection("users")
      .doc(item)
      .collection("Request")
      .doc(firebase.auth().currentUser.uid)
      .delete();
  };

  const declineRequest = async (item) => {
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("Request")
      .doc(item)
      .delete();

    db.collection("users")
      .doc(item)
      .collection("MyRequest")
      .doc(firebase.auth().currentUser.uid)
      .delete();
    setmodalVisible(!modalVisible);
    setCountReq(friendsRequestList.length - 1);
    console.log("friendsRequestList.length", friendsRequestList.length);
  };

  const getFriends = async () => {
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("Friends")
      .onSnapshot((querySnapshot) => {
        let friends = [];
        querySnapshot.forEach((doc) => {
          friends.push({ id: doc.id, ...doc.data() });
        });
        console.log("my friends", friends);
        setMyfriends(friends);
      });
  };

  const handleAccept = async (item) => {
    //console.log("Error removing document-----: ", item.id)
    const currentUser = firebase.auth().currentUser;
    const userRef = await db.collection("users").doc(currentUser.uid).get();
    const userData = userRef.data();
    //console.log("line 344", item);
    db.collection("users")
      .doc(item.id)
      .collection("Friends")
      .doc(currentUser.uid)
      .set({
        displayName: userData.displayName,
        email: userData.email,
        photoURL: userData.photoURL,
        booking: true,
        bookingRequest: true,
      });

    db.collection("users")
      .doc(currentUser.uid)
      .collection("Friends")
      .doc(item.id)
      .set({
        displayName: item.displayName,
        email: item.email,
        photoURL: item.photoURL,
        uid: item.id,
        booking: true,
        bookingRequest: true,
      });

    db.collection("users")
      .doc(item.id)
      .collection("MyRequest")
      .doc(firebase.auth().currentUser.uid)
      .delete();

    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("Request")
      .doc(item.id)
      .delete();

    getMyFriends();
    getFriends();
    setCountReq(friendsRequestList.length - 1);
    setmodalVisible(!modalVisible);
  };

  const checkFriend = (id) => {
    let friendsId = [];
    for (let i = 0; i < myfriends.length; i++) {
      friendsId.push(myfriends[i].id);
    }
    return friendsId.includes(id);
  };

  //async: means this function will return a promises always
  // it will remove the user b from user a “Friends” sub collection and same for user b
  const handleRemoveFriend = async (item) => {
    await db
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("Friends")
      .doc(item)
      .delete();

    await db
      .collection("users")
      .doc(item)
      .collection("Friends")
      .doc(firebase.auth().currentUser.uid)
      .delete();
    // setmodalVisible(!modalVisible);
  };

  // const checkFriend = (id) => {
  //   // console.log("checkFriend ", typeof id) WTF
  //   myfriends.map((item) => {
  //     return item.id === id
  //   });
  //   return false;
  // };

  return (
    <View style={{ backgroundColor: "#F0F8FF", flex: 1 }}>
      <SearchBar
        placeholder="Type Here..."
        lightTheme
        round
        onChangeText={(Text) => searchFunction(Text)}
        autoCorrect={false}
        value={text}
      />
      <TouchableOpacity onPress={() => ssetModalVisible(!modalVisible)}>
        <View style={{ flexDirection: "row" }}>
          <Ionicons
            name="md-person-add"
            size={21}
            style={{ marginRight: 10, marginTop: 9, marginLeft: 7 }}
          />
          <Text style={{ fontSize: 20, marginRight: "47%", marginTop: 6 }}>
            Follow Requests
          </Text>
          <Badge
            value={countReq}
            status="primary"
            style={{ fontSize: 30, marginTop: 6 }}
          ></Badge>
          <Ionicons
            name="ios-arrow-forward"
            size={20}
            style={{ marginLeft: 7, marginTop: 10 }}
          />
        </View>
      </TouchableOpacity>

      <Divider style={{ marginTop: 20, backgroundColor: "gray", height: 1 }} />

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={{ marginTop: 22, backgroundColor: "#F0F8FF", flex: 1 }}>
          <View>
            <Text
              style={{
                marginTop: "10%",
                marginLeft: "auto",
                marginRight: "auto",
                fontSize: 25,
              }}
            >
              Follow Requests
            </Text>
            <ScrollView>
              <View style={styles.viewStyle}>
                {/* this is a friendsRequestList array I am using it to display the follow requests that the current user have */}
                <FlatList
                  data={friendsRequestList}
                  //Item Separator View
                  renderItem={({ item }) => {
                    return (
                      <ScrollView key={item.id}>
                        <Card
                          style={{
                            height: "97%",
                            width: "95%",
                            margin: 4,
                            marginRight: "auto",
                            marginLeft: "auto",
                          }}
                        >
                          <View style={{ marginLeft: 15, marginTop: 10 }}>
                            <Avatar
                              rounded
                              source={{ uri: item.photoURL }}
                              size={70}
                            />
                            <Text style={{ marginTop: 10, marginLeft: 10 }}>
                              {item.displayName}

                              {console.log(
                                "item.displayName",
                                item.displayName
                              )}
                            </Text>
                          </View>

                          <View style={{ flexDirection: "row" }}>
                            <View
                              style={{
                                marginLeft: "60%",
                                marginRight: 8,
                                backgroundColor: "#B0C4DE",
                              }}
                            >
                              {/* this button will call the function handleAccpet with the user id as a parameter */}
                              <Button
                                color={"#263c5a"}
                                title="Accept"
                                onPress={() => handleAccept(item)}
                              ></Button>
                              {console.log(
                                "Error removing document-----: ",
                                item.id
                              )}
                            </View>
                            <View style={{ backgroundColor: "#B0C4DE" }}>
                              {/* this button will call the function declineRequest with the user id as a parameter */}
                              <Button
                                color={"#263c5a"}
                                title="Decline"
                                onPress={() => declineRequest(item.id)}
                              ></Button>
                            </View>
                          </View>
                        </Card>
                      </ScrollView>
                    );
                  }}
                  enableEmptySections={true}
                  style={{ marginTop: 10 }}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
              <TouchableHighlight
                onPress={() => {
                  ssetModalVisible(!modalVisible);
                }}
              >
                <Text
                  style={{
                    marginTop: 50,
                    marginLeft: "auto",
                    marginRight: "auto",
                    fontSize: 25,
                  }}
                >
                  <Ionicons name="ios-exit" size={50} />
                </Text>
              </TouchableHighlight>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <TouchableOpacity onPress={() => ssetModalVisible2(!modalVisible2)}>
        <View style={{ flexDirection: "row" }}>
          <AntDesign
            name="addusergroup"
            size={21}
            style={{ marginLeft: 7, marginRight: 10, marginTop: 12 }}
          />
          <Text style={{ fontSize: 20, marginTop: 10, marginRight: "62%" }}>
            My Friends{" "}
          </Text>
          <Ionicons
            name="ios-arrow-forward"
            size={20}
            style={{ marginLeft: 2, marginTop: 15 }}
          />
        </View>
      </TouchableOpacity>

      <Divider
        style={{
          backgroundColor: "gray",
          height: 1,
          marginTop: 12,
          marginBottom: 12,
        }}
      />

      <Modal animationType="slide" transparent={false} visible={modalVisible2}>
        <View style={{ marginTop: 22, backgroundColor: "#F0F8FF", flex: 1 }}>
          <View>
            <Text
              style={{
                marginTop: "10%",
                marginLeft: "auto",
                marginRight: "auto",
                fontSize: 25,
              }}
            >
              Friends List
            </Text>
            <ScrollView>
              <View style={styles.viewStyle}>
                {/* this is a map that will go through the user friends */}
                {myfriends && (
                  <FlatList
                    data={myfriends}
                    renderItem={({ item }, index) => {
                      return (
                        <ScrollView key={item.id}>
                          {/* style={{ width: "95%", margin: 4 , marginRight:"auto", marginLeft:"auto"}} */}
                          <Card
                            style={{
                              height: "97%",
                              width: "95%",
                              margin: 4,
                              marginRight: "auto",
                              marginLeft: "auto",
                            }}
                          >
                            {console.log("userssssssssssssss:,", item.id, item)}
                            <View style={{ marginLeft: 15, marginTop: 10 }}>
                              <Avatar
                                rounded
                                source={{ uri: item.photoURL }}
                                size={70}
                              />
                              <Text style={{ marginTop: 5, marginLeft: 10 }}>
                                {item.displayName}

                                {console.log(
                                  "item.displayName",
                                  item.displayName
                                )}
                                {setName(item.displayName)}
                              </Text>
                            </View>
                            <View>
                              <View style={{ flexDirection: "row" }}>
                                <Switch
                                  trackColor={{
                                    false: "#767577",
                                    true: "#81b0ff",
                                  }}
                                  style={{ marginLeft: "4%" }}
                                  thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                                  ios_backgroundColor="#3e3e3e"
                                  onValueChange={() =>
                                    toggleSwitch(item, isEnabled)
                                  }
                                  value={item.booking}
                                />

                                <View
                                  style={{
                                    marginLeft: "50%",
                                    width: 120,
                                    backgroundColor: "#B0C4DE",
                                  }}
                                >
                                  <Button
                                    color={"#263c5a"}
                                    title="Remove"
                                    onPress={() =>
                                      handleRemoveFriend(item.id) && setV(!v)
                                    }
                                  >
                                    {v ? "Hide" : "Show"}
                                  </Button>
                                </View>
                              </View>
                            </View>
                          </Card>
                        </ScrollView>
                      );
                    }}
                    enableEmptySections={true}
                    style={{ marginTop: 10 }}
                    keyExtractor={(item, index) => index.toString()}
                  />
                )}
              </View>

              <TouchableHighlight
                onPress={() => {
                  ssetModalVisible2(!modalVisible2);
                }}
              >
                <Text
                  style={{
                    marginTop: 50,
                    marginLeft: "auto",
                    marginRight: "auto",
                    fontSize: 25,
                  }}
                >
                  <Ionicons name="ios-exit" size={50} />
                </Text>
              </TouchableHighlight>
            </ScrollView>
          </View>
        </View>
        <Snackbar visible={v} onDismiss={() => setV(false)} duration={4000}>
          You removed <Text style={{ fontWeight: "bold" }}>{name} </Text>from
          your friend list!
        </Snackbar>
      </Modal>

      <Text
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          fontSize: 20,
          marginBottom: 12,
        }}
      >
        {" "}
        Discover People
      </Text>
      <ScrollView>
        <View>
          <FlatList
            data={users}
            //Item Separator View
            renderItem={({ item }) => {
              return item.id !== firebase.auth().currentUser.uid &&
                item.role !== "admin" ? (
                !checkFriend(item.id) ? (
                  <View>
                    {/* {console.log("my friendss", item.id)} */}
                    <Card
                      style={{
                        width: "95%",
                        margin: 4,
                        marginRight: "auto",
                        marginLeft: "auto",
                      }}
                    >
                      <View key={item.id} style={{ flexDirection: "row" }}>
                        <Animatable.View animation="zoomIn" iterationCount={1}>
                          <Image
                            style={{
                              width: 100,
                              height: 80,
                              marginLeft: 15,
                              marginTop: 10,
                            }}
                            source={{ uri: item.photoURL }}
                          />
                        </Animatable.View>
                        <View
                          style={
                            myfriendList.includes(item.id)
                              ? styles.num2
                              : styles.num
                          }
                        >
                          {/* in here i checked if the current user friend list include the user id that he/she just followed
                        if yes show requested if no show follow  as a title for the button */}
                          <Button
                            // titleStyle={{
                            //   alignItems: "center",
                            //   color: "#263c5a",
                            // }}
                            color={
                              myfriendList.includes(item.id)
                                ? "white"
                                : "#243447"
                            }
                            onPress={
                              myfriendList.includes(item.id)
                                ? () => handleUnFollow(item.id)
                                : () => handleFollow(item.id)
                            }
                            title={
                              myfriendList.includes(item.id)
                                ? "Requested"
                                : "Follow"
                            }
                          />
                        </View>
                      </View>
                      <Text
                        style={{
                          marginTop: 2,
                          marginLeft: 30,
                          marginBottom: 20,
                        }}
                      >
                        {item.displayName}
                      </Text>
                    </Card>
                  </View>
                ) : null
              ) : null;
            }}
            enableEmptySections={true}
            style={{ marginTop: 10 }}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </ScrollView>
    </View>
  );
};

LinksScreen.navigationOptions = {
  title: "Friends",
  headerTintColor: "white",
  headerStyle: {
    backgroundColor: "#5a91bf",
  },
};

const styles = StyleSheet.create({
  view: {
    backgroundColor: "#F0F8FF",
    flex: 1,
  },
  view2: {
    backgroundColor: "#243447",
    flex: 1,
    color: "white",
  },
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#fff",
  },
  num: {
    width: 100,
    height: 35,
    marginLeft: "35%",
    borderWidth: 1,
    borderColor: "#B0C4DE",
    marginTop: 47,
    backgroundColor: "#B0C4DE",
    // color: "white",
  },
  num2: {
    width: 100,
    height: 35,
    marginLeft: "35%",
    marginTop: 47,
    backgroundColor: "gray",
    //color: "#263c5a",
  },
});
export default LinksScreen;
