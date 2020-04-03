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
  Image
} from "react-native";
import firebase from "firebase/app";
import "firebase/auth";
import { SearchBar, Badge, Divider, Avatar } from "react-native-elements";
import db from "../../db.js";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { user } from "firebase-functions/lib/providers/auth";
// import { ScrollView } from "react-native-gesture-handler";

const LinksScreen = props => {
  const data = props.navigation.getParam("data", "No params");
  const [users, setUsers] = useState([]);
  const [text, setText] = useState("");
  const [arrayholder, setArrayHolder] = useState([]);
  const [modalVisible, setmodalVisible] = useState(false);
  const [modalVisible2, setmodalVisible2] = useState(false);
  const [myfriends, setMyfriends] = useState([]);
  const [countReq, setCountReq] = useState(0);
  const [friendsRequestList, setFriendRequestList] = useState([]);
  const [myfriendList, setMyfriendList] = useState([]);
  //modal part ----------------------------------------------------------
  const ssetModalVisible = visible => {
    setmodalVisible(visible);
  };
  const ssetModalVisible2 = visible => {
    setmodalVisible2(visible);
  };

  //list all the users except my friends ---------------------------------
  const handleUsers = async () => {
    db.collection("users").onSnapshot(querySnapshot => {
      const users = [];
      querySnapshot.forEach(doc => {
        //mapping
        users.push({ id: doc.id, ...doc.data() });
      });
      setUsers([...users]);
      setArrayHolder(users);
    });
  };

  const getMyFriends = () => {
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("MyRequest")
      .onSnapshot(querySnapShot => {
        let friends = [];
        querySnapShot.forEach(doc => {
          friends.push(doc.id);
        });
        console.log("my friends", friends);
        setMyfriendList(friends);
      });
  };

  useEffect(() => {}, [myfriendList]);
  useEffect(() => {}, [myfriends]);

  useEffect(() => {
    handleUsers();
    getMyFriends();
    showRequest();
    getFriends();
  }, []);

  //search bar -----------------------------------------------
  const searchFunction = text => {
    const newData = arrayholder.filter(function(item) {
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

  //follow button function part ------------------------------------------
  const handleFollow = async item => {
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

  const findUserById = async id => {
    const userRef = await db
      .collection("users")
      .doc(id)
      .get();
    return userRef.data();
  };

  //list the follow requests part / change the status to  --------------
  const showRequest = async () => {
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("Request")
      .onSnapshot(querySnap => {
        let request = [];
        querySnap.forEach(async doc => {
          const userData = await findUserById(doc.id);
          request.push({ id: doc.id, ...userData });
          console.log("requests", request);
          setCountReq(request.length);
        });
        setFriendRequestList(request);
      });
  };

  //unfollow button function
  const handleUnFollow = async item => {
    await db
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("Friends")
      .onSnapshot(querySnapshot => {
        const users = [];
        querySnapshot.forEach(doc => {
          //mapping
          users.push({ id: doc.id, ...doc.data() });
        });
        for (let i = 0; i < users.length; i++) {
          let b = users[i].status;
          if (b === 1) {
            DeleteRequest(item);
          }
        }
      });
  };

  const declineRequest = async item => {
    //delete record from my request and his requst
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
      .onSnapshot(querySnapshot => {
        let friends = [];
        querySnapshot.forEach(doc => {
          friends.push({ id: doc.id, ...doc.data() });
        });
        console.log("my friends", friends);
        setMyfriends(friends);
      });
  };

  //accept button function / change status to 3 ----------------------
  const handleAccept = async item => {
    //console.log("Error removing document-----: ", item.id)
    const currentUser = firebase.auth().currentUser;
    const userRef = await db
      .collection("users")
      .doc(currentUser.uid)
      .get();
    const userData = userRef.data();
    //console.log("line 344", item);
    db.collection("users")
      .doc(item.id)
      .collection("Friends")
      .doc(currentUser.uid)
      .set(userData);

    db.collection("users")
      .doc(currentUser.uid)
      .collection("Friends")
      .doc(item.id)
      .set({
        displayName: item.displayName,
        email: item.email,
        photoURL: item.photoURL,
        uid: item.id,
        phone: item.phone
        // phone: item.phone,
        // photoURL: item.photoURL,
        // points: item.points
      });

    db.collection("users")
      .doc(item.id)
      .collection("MyRequest")
      .doc(firebase.auth().currentUser.uid)
      .delete()
      .then(function() {
        console.log("Document successfully deleted!");
      })
      .catch(function(error) {
        console.error("Error removing document: ", error);
      });

    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("Request")
      .doc(item.id)
      .delete()
      .then(function() {
        console.log("Document successfully deleted!");
      })
      .catch(function(error) {
        console.error("Error removing document: ", error);
      });
    getMyFriends();
    getFriends();
    setCountReq(friendsRequestList.length - 1);
    setmodalVisible(!modalVisible);
  };

  const handleRemoveFriend = async item => {
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
    setmodalVisible(!modalVisible);
  };

  return (
    <View style={{ flex: 1 }}>
      <SearchBar
        placeholder="Type Here..."
        lightTheme
        round
        onChangeText={Text => searchFunction(Text)}
        autoCorrect={false}
        value={text}
      />
      <TouchableOpacity onPress={() => ssetModalVisible(!modalVisible)}>
        <View style={{ flexDirection: "row" }}>
          <Ionicons
            name="md-person-add"
            size={21}
            style={{ marginRight: 10, marginTop: 9 }}
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
            style={{ marginLeft: 5, marginTop: 10 }}
          />
        </View>
      </TouchableOpacity>

      <Divider
        style={{ marginTop: 20, backgroundColor: "lightgray", height: 1 }}
      />

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={{ marginTop: 22 }}>
          <View>
            <Text
              style={{
                marginTop: "10%",
                marginLeft: "auto",
                marginRight: "auto",
                fontSize: 25
              }}
            >
              Follow Requests
            </Text>
            <ScrollView>
              <View style={styles.viewStyle}>
                <FlatList
                  data={friendsRequestList}
                  //Item Separator View
                  renderItem={({ item }) => {
                    return (
                      <View key={item.id}>
                        <View style={{ flexDirection: "row" }}>
                          <Avatar
                            rounded
                            source={{ uri: item.photoURL }}
                            size={70}
                          />
                          <Text style={{ marginTop: 30, marginLeft: 10 }}>
                            {item.displayName}
                          </Text>
                        </View>
                        <View style={{ flexDirection: "row" }}>
                          <View style={{ marginLeft: "60%", marginRight: 8 }}>
                            <Button
                              title="Accept"
                              onPress={() => handleAccept(item)}
                            ></Button>
                            {console.log(
                              "Error removing document-----: ",
                              item.id
                            )}
                          </View>
                          <View>
                            <Button
                              title="Decline"
                              onPress={() => declineRequest(item.id)}
                            ></Button>
                          </View>
                        </View>
                      </View>
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
                    fontSize: 25
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
            style={{ marginRight: 10, marginTop: 12 }}
          />
          <Text style={{ fontSize: 20, marginTop: 10, marginRight: "62%" }}>
            My Friends{" "}
          </Text>
          <Ionicons
            name="ios-arrow-forward"
            size={20}
            style={{ marginLeft: 5, marginTop: 15 }}
          />
        </View>
      </TouchableOpacity>

      <Divider
        style={{
          backgroundColor: "lightgray",
          height: 1,
          marginTop: 12,
          marginBottom: 12
        }}
      />

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible2}
        // onRequestClose={() => {
        //   Alert.alert("Modal has been closed.");
        // }}
      >
        <View style={{ marginTop: 22 }}>
          <View>
            <Text
              style={{
                marginTop: "10%",
                marginLeft: "auto",
                marginRight: "auto",
                fontSize: 25
              }}
            >
              Friends List
            </Text>
            <ScrollView>
              <View style={styles.viewStyle}>
                {myfriends && (
                  <FlatList
                    data={myfriends}
                    renderItem={({ item }) => {
                      return (
                        <View key={item.id}>
                          {console.log("userssssssssssssss:,", item.id, item)}
                          <View style={{ marginLeft: 15 }}>
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
                          <View>
                            <View style={{ flexDirection: "row" }}>
                              <View
                                style={{
                                  marginLeft: "47%",
                                  marginRight: 8,
                                  width: 120
                                }}
                              ></View>
                              <View>
                                <Button
                                  title="Remove"
                                  onPress={() => handleRemoveFriend(item.id)}
                                />
                              </View>
                            </View>
                          </View>
                        </View>
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
                    fontSize: 25
                  }}
                >
                  <Ionicons name="ios-exit" size={50} />
                </Text>
              </TouchableHighlight>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Text
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          fontSize: 20,
          marginBottom: 12
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
                item.id !== myfriends.includes(item.id) ? (
                <View>
                  {console.log("hey--",)}
                  <View key={item.id} style={{ flexDirection: "row" }}>
                    <Image
                      style={{
                        width: 100,
                        height: 80,
                        marginLeft: 15
                      }}
                      source={{ uri: item.photoURL }}
                    />

                    <View
                      style={
                        myfriendList.includes(item.id)
                          ? styles.num2
                          : styles.num
                      }
                    >
                      <Button
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
                    style={{ marginTop: 2, marginLeft: 30, marginBottom: 20 }}
                  >
                    {item.displayName}
                  </Text>
                </View>
              ) : null;
            }}
            enableEmptySections={true}
            style={{ marginTop: 10 }}
            key
            Extractor={(item, index) => index.toString()}
          />
        </View>
      </ScrollView>
    </View>
  );
};

LinksScreen.navigationOptions = {
  title: "Friends"
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#fff"
  },
  num: {
    width: 100,
    height: 35,
    marginLeft: "42%",

    marginTop: 30,
    backgroundColor: "#0084ff",
    color: "white"
  },
  num2: {
    width: 100,
    height: 35,
    marginLeft: "42%",
    marginTop: 30,
    backgroundColor: "#0084ff",
    color: "white"
  }
});
export default LinksScreen;
