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
} from "react-native";
import firebase from "firebase/app";
import "firebase/auth";
import { SearchBar, Badge, Divider, Avatar } from "react-native-elements";
import db from "../../db.js";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { user } from "firebase-functions/lib/providers/auth";
// import { ScrollView } from "react-native-gesture-handler";
import { Card } from "react-native-shadow-cards";
import * as Animatable from "react-native-animatable";

const LinksScreen = (props) => {
  const data = props.navigation.getParam("data", "No params");
  const [users, setUsers] = useState([]);

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

  //async: means this function will return a promises always
  // this function will map throught the current user sub collection > "MyRequest" and i store the result in useState array variable since the user can
  // have more than one request and it will be accessible in the return part
  // I pushed only the Id of the user beacuse i am just gonna compare if the setMyfriendList array include one of the usersa array
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

  //this useEffect will run when any of these two state variables are changed in the state to re-render
  useEffect(() => {}, [myfriendList]);
  useEffect(() => {}, [myfriends]);

  //In this use effect there is 4 functions will be called one time once the app is rendered
  useEffect(() => {
    getFriends();
    handleUsers();
    getMyFriends();
    showRequest();
  }, []);

  //search bar -----------------------------------------------
  //1- array holder: an array that have all the users names
  //2- this function will run the filter function on the arrayholder, it will filter
  //   based on th names of the users
  //3- first store the name inside the itemData and convert it to uppercase
  //4- second i used indexOf to compare both text and return true if the text is found
  //   inside the itemData >> so if true return the filtered item and set the users array to the filtered item only
  //   if false nothing will show
  //5- setText(text): to save the text value of the user in the search bar
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

  //THIS IS CREATE FUNCTION
  //async: means this function will return a promises always
  //when the user clicks on the button "follow" this process is going to:
  // add a sub collection called "Request" for user 'b' with user 'a' id as document id for the sub collection and it has one field which is status showing that Friend Request Received
  //and its going to add sub collection called "MyRequest" for user 'a' with user 'b' as document id for the sub collection and it has status field too
  // then calling the function getMyFriends() which explained above
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

  //THIS IS A SELECT FUNCTION
  //async: means this function will return a promises always
  //this function is used to show the list of follow request the the current user get
  // so first go to the users collection >> go to the current user document using current user id >> go to "Request" sub collection
  // loop through that sub collection and get all the document in it and push the documnts in an local arrat then store it in
  //useState array const setFriendRequestList(request);
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

  //THIS IS DELETE FUNCTION
  // the logic is: when current user follow someone and the button changes from "follow" to "requested" user can unfollow them and that will change
  // the button back to "follow"
  // when the button is back to "follow" this is where the function will be called
  // it's going to the user 'a' sub collection "MyRequest" and remove the documet thats stores user 'b' details
  // and same for user 'b' the document for user 'a' will be deleted from 'Request' sub collection
  //async: means this function will return a promises always

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

  //THIS IS A DELETE FUNCTION
  //Logic: when user 'a' have a follow request from user 'b' and its showing in the follow request list
  //of user 'a', when user 'a' press the decline button this is going to remove the document of user 'b' from user 'a' "Request" sub collection
  // and its going to remove user 'a' from user 'b' "MyRequest" sub collection using .delete() function
  // and this functionis using async since i am callingback the data from firebase
  //async: means this function will return a promises always
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

  //SELECT FUNCTION
  //This function will go to the current user document then to his/her Friends sub collection and it will loop through all the document
  // in that sub collection to get all the friends/users for the current user i pushed that in an array and i stored in a useSatate const
  // which is setMyfriends(friends)
  //async: means this function will return a promises always
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

  // THIS IS CREATE AND DELETE FUNCTION
  //This function is taking the user object (item) as a parameter
  // I put async since I am taking the details of the item from firebase
  // then i got all the info about the current user using get() and .data()
  // then i added a sub collection for both users called "Friends" with each user details
  // and since they are friends no I used .delete() function to delete users doc from Request and MyRequest sub  collection
  // after that  I am calling the two functions  getMyFriends() and getFriends() to
  // after that  I am calling the two functions  getMyFriends() and getFriends() tolay the friends list  for the current user in My Friends section
  //-----------------------------------------
  //current user >> a ----- the the one who requested >> b
  //it takes user b data as a parameter and what this function gonna do is: its going to
  // add sub collection with the name “Friends” for both users with each others id as
  //  a document id for the sub collection “Friends”, and remove the request from
  //  “MyRequest” for user b and “Request” for user a and then calling the two functions
  //  “getMyFriends” and “getFriends”
  //async: means this function will return a promises always
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
        // phone: item.phone,
        // phone: item.phone,
        // photoURL: item.photoURL,
        // points: item.points
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
    setmodalVisible(!modalVisible);
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
        <View style={{ marginTop: 22, backgroundColor: "#E7EAEB", flex: 1 }}>
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
                      <View key={item.id}>
                        <Card
                          style={{
                            height: "100%",
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
        <View style={{ marginTop: 22, backgroundColor: "#E7EAEB", flex: 1 }}>
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
                        <View key={item.id}>
                          {/* style={{ width: "95%", margin: 4 , marginRight:"auto", marginLeft:"auto"}} */}
                          <Card
                            style={{
                              height: "100%",
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
                                    marginLeft: "5%",
                                    marginTop: 10,
                                  }}
                                >
                                </View>
                                <View
                                  style={{
                                    marginLeft: "47%",
                                    marginRight: 8,
                                    width: 120,
                                    backgroundColor: "#B0C4DE",
                                  }}
                                >
                                  <Button
                                    color={"#263c5a"}
                                    title="Remove"
                                    onPress={() => handleRemoveFriend(item.id)}
                                  />
                                </View>

                                <View style={{}}></View>
                              </View>
                            </View>
                          </Card>
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
          {/* <Button title="hi" disabled={user.points>=d.requiredPoints ? false:true}/> */}
          {/* this is a map that will go through all the users from the db  */}
          <FlatList
            data={users}
            //Item Separator View
            renderItem={({ item }) => {
              return item.id !== firebase.auth().currentUser.uid ? (
                // !checkFriend(item.id)
                <View>
                  {console.log("my friendss", item.id)}
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
                          color={
                            myfriendList.includes(item.id) ? "white" : "#263c5a"
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
                      style={{ marginTop: 2, marginLeft: 30, marginBottom: 20 }}
                    >
                      {item.displayName}
                    </Text>
                  </Card>
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
  title: "Friends",
  headerTintColor: "white",
  headerStyle: {
    backgroundColor: "#5a91bf",
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#fff",
  },
  num: {
    width: 100,
    height: 35,
    marginLeft: "42%",
    borderWidth: 1,
    borderColor: "#B0C4DE",
    marginTop: 47,
    backgroundColor: "#B0C4DE",
    // color: "white",
  },
  num2: {
    width: 100,
    height: 35,
    marginLeft: "42%",
    marginTop: 47,
    backgroundColor: "gray",
    //color: "#263c5a",
  },
});
export default LinksScreen;
