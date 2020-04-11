import React, { useState, useEffect, useCallback } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { Text, Button, Icon } from "react-native-elements";
import db from "../../db";
import firebase from "firebase/app";
import "firebase/auth";
import { Rating } from "react-native-elements";
import * as Animatable from "react-native-animatable";
import moment from "moment";
import { Card } from "react-native-shadow-cards";

export default function ParkingBookingsDetails(props) {
  const [details, setDetails] = useState([]);
  const itemId = props.navigation.getParam("itemId", "No params");
  const [parkingBookingid, setParkingBookingid] = useState(0);
  const [rate, setRating] = useState(0);
  const [blockId, setBlockId] = useState();
  const [parkingName, setParkingName] = useState();
  const [gateNumber, setGateNumber] = useState();

  const getParkingId = async () => {
    await db.collection("block").onSnapshot((querySnapShot) => {
      const all = [];
      querySnapShot.forEach((doc) => {
        all.push({ id: doc.id, ...doc.data() });
      });
      for (let i = 0; i < all.length; i++) {
        setBlockId(all[i].id);
        setGateNumber(all[i].name);
      }
    });
  };
  const getparkingName = async () => {
    await db
      .collection("block")
      .doc(blockId)
      .collection("parking")
      .onSnapshot((querySnapShot) => {
        const all = [];
        const p = [];
        querySnapShot.forEach((doc) => {
          all.push({ id: doc.id, ...doc.data() });
        });
        for (let i = 0; i < all.length; i++) {
          setParkingName(all[i].name);
        }
      });
  };
  const BookingsDetailsDB = async () => {
    db.collection("booking")
      .doc(itemId)
      .collection("parking_booking")
      .onSnapshot((querySnapShot) => {
        const all = [];
        querySnapShot.forEach((doc) => {
          all.push({ id: doc.id, ...doc.data() });
        });
        for (let i = 0; i < all.length; i++) {
          setParkingBookingid(all[i].id);
        }
        setDetails([...all]);
      });
  };

  const ratingCompleted = async (rating, id) => {
    //console.log("rating", rating, "id", id);
    setRating(rating);
    db.collection("booking")
      .doc(itemId)
      .collection("parking_booking")
      .doc(id)
      .update({ rating: rating });
  };

  useEffect(() => {
    getParkingId();
    BookingsDetailsDB();
    getparkingName();
  }, [parkingName]);

  const timeToRate = (endDate, id) => {
    let currentTime = moment().format("LT");

    let endD = endDate;
    let convert = convertTime(endD);

    //console.log("newCurrentDate", newCurrentDate)
    console.log("convert", convert);
    console.log(
      "endDate",
      currentTime > convert,
      "endDate",
      convert,
      "curent day",
      currentTime
    );
    if (currentTime > convert) {
      return true;
    } else {
      return false;
    }
  };
  const convertTime = (endD) => {
    const splitTime = endD.split(" ");
    if (splitTime[1] === "pm") {
      const split = splitTime[0].split(":");
      if (split[0] === "12") {
        return `12:${split[1]} PM`;
      } else if (split[0] === "01") {
        return `13:${split[1]} PM`;
      } else if (split[0] === "02") {
        return `14:${split[1]} PM`;
      } else if (split[0] === "03") {
        return `15:${split[1]} PM`;
      } else if (split[0] === "04") {
        return `16:${split[1]} PM`;
      } else if (split[0] === "05") {
        return `17:${split[1]} PM`;
      } else if (split[0] === "06") {
        return `18:${split[1]} PM`;
      } else if (split[0] === "07") {
        return `19:${split[1]} PM`;
      } else if (split[0] === "08") {
        return `20:${split[1]} PM`;
      } else if (split[0] === "09") {
        return `21:${split[1]} PM`;
      } else if (split[0] === "10") {
        return `22:${split[1]} PM`;
      } else if (split[0] === "11") {
        return `23:${split[1]} PM`;
      }
    } else if (splitTime[1] === "AM" || splitTime[1] === "am") {
      const split = splitTime[0].split(":");
      if (split[0] === "12") {
        return `12:${split[1]}`;
      } else if (split[0] === "11") {
        return `11:${split[1]} AM`;
      } else if (split[0] === "10") {
        return `10:${split[1]} AM`;
      } else if (split[0] === "09") {
        return `09:${split[1]} AM`;
      } else if (split[0] === "08") {
        return `08:${split[1]} AM`;
      } else if (split[0] === "07") {
        return `07:${split[1]} AM`;
      } else if (split[0] === "06") {
        return `06:${split[1]} AM`;
      } else if (split[0] === "05") {
        return `05:${split[1]} AM`;
      } else if (split[0] === "04") {
        return `04:${split[1]} AM`;
      } else if (split[0] === "03") {
        return `03:${split[1]} AM`;
      } else if (split[0] === "02") {
        return `02:${split[1]} AM`;
      } else if (split[0] === "01") {
        return `01:${split[1]} AM`;
      }
    } else {
      return splitTime[0];
    }
  };

  return (
    <View style={{backgroundColor: "#F0F8FF", flex: 1 }}>
      <ScrollView style={{ marginTop: 24 }}>
        {details.map((item) => {
          return (
            <View key={item.id} style={{ marginBottom: 50 }}>
               <Card
                style={{
                  width: "95%",
                  margin: 4,
                  marginRight: "auto",
                  marginLeft: "auto",
                  
                }}
              >
              <Text
                style={{
                  marginLeft: "auto",
                  marginRight: "auto",
                  fontWeight: "bold",
                  marginTop: 10,
                }}
              >
                {/* <Text>Parking: {parkingName} </Text> */}
                <Text> Gate Number: {gateNumber}</Text>
              </Text>

              <Text
                style={{
                  marginLeft: "auto",
                  marginRight: "auto",
                  fontWeight: "bold",
                }}
              >
                Start time:<Text>{item.startTime}</Text> -{" "}
                <Text>End time: {item.endTime}</Text>
              </Text>

              {timeToRate(item.endTime, item.id) ? (
                <Rating
                  showRating
                  type="star"
                  startingValue={item.rating}
                  imageSize={40}
                  onFinishRating={(rating) => ratingCompleted(rating, item.id)}
                  style={{ paddingVertical: 10 }}
                  readonly={item.rating > 0 ? true : false}
                />
              ) : (
                <Animatable.View
                  animation="bounceIn"
                  easing="ease-out"
                  iterationCount={2}
                >
                  <Rating
                    readonly
                    showRating
                    type="star"
                    startingValue={item.rating}
                    imageSize={40}
                    onFinishRating={(rating) =>
                      ratingCompleted(rating, item.id)
                    }
                    style={{ paddingVertical: 10 }}
                  />
                </Animatable.View>
              )}
              </Card>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
ParkingBookingsDetails.navigationOptions = {
  title: "Parking Bookings Details",
  headerTintColor: "white",
  headerStyle: {
    backgroundColor: "#5a91bf",
  },
};
const styles = StyleSheet.create({
  text: {
    fontWeight: "bold",
    fontSize: 15,
    opacity: 0.7,
  },
  text2: {
    fontWeight: "bold",
    fontSize: 15,
    opacity: 0.7,
    textAlign: "center",
  },
});
