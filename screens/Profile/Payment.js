import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { Card } from "react-native-shadow-cards";

import { Input, Divider, Button, Icon, Text } from "react-native-elements";
import db from "../../db";
import firebase from "firebase/app";
import "firebase/auth";

export default function PaymentCard(props) {
  const [userCards, setUserCards] = useState([]);

  useEffect(() => {
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("cards")
      .onSnapshot(querySnapshot => {
        let cards = [];
        querySnapshot.forEach(doc => {
          cards.push({ id: doc.id, ...doc.data() });
        });
        setUserCards(cards);
      });
  }, []);

  return userCards.length === 0 ? (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Icon type="font-awesome" name="credit-card" size={80} color="blue" />
      <Text style={{ fontSize: 20 }}>You have no cards registered</Text>
      {/* <Button title="+" buttonStyle={{ borderRadius: 100 }} /> */}
      <TouchableOpacity onPress={() => props.navigation.navigate("AddCard")}>
        <Icon
          type="ionicon"
          name="ios-add-circle-outline"
          size={30}
          color="blue"
        />
      </TouchableOpacity>
    </View>
  ) : (
    <ScrollView>
      <View style={{ flex: 1, alignItems: "center", marginTop: 20 }}>
        <Text h4>My Cards</Text>
      </View>
      <View>
        {userCards.map(
          (item, index) => (
            <View>
              <Card style={{ padding: 20, margin: 15 }}>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 16,
                    opacity: 0.7
                  }}
                >
                  Card Provider: <Text>{item.provider}</Text>
                </Text>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 16,
                    opacity: 0.7
                  }}
                >
                  Card Type: <Text>{item.type}</Text>
                </Text>

                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 16,
                    opacity: 0.7
                  }}
                >
                  Card Number: <Text>{item.number}</Text>
                </Text>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 16,
                    opacity: 0.7
                  }}
                >
                  Card Expiry Date: <Text>{item.expiry}</Text>
                </Text>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 16,
                    opacity: 0.7
                  }}
                >
                  Amount: <Text>QR {item.amount}</Text>
                </Text>
              </Card>
            </View>
          )
          // console.log(item)
        )}
      </View>
      <View>
        <TouchableOpacity onPress={() => props.navigation.navigate("AddCard")}>
          <Icon
            type="ionicon"
            name="ios-add-circle-outline"
            size={30}
            color="blue"
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

PaymentCard.navigationOptions = {
  title: "My Cards"
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1
  },
  backTextWhite: {
    color: "#FFF"
  },
  rowFront: {
    alignItems: "center",
    backgroundColor: "#CCC",
    borderBottomColor: "black",
    borderBottomWidth: 1,
    justifyContent: "center",
    height: 50
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: "red",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15
  },
  backRightBtn: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: 75
  },
  backRightBtnRight: {
    backgroundColor: "red",
    right: 0
  }
});
