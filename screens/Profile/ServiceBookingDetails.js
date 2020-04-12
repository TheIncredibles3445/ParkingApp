import React, { useState, useEffect } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { Text, Button, Icon } from "react-native-elements";
import db from "../../db";
import firebase from "firebase/app";
import "firebase/auth";
import { Rating } from "react-native-elements";
import moment from "moment";
import * as Animatable from "react-native-animatable";
import { Card } from "react-native-shadow-cards";

export default function ServiceBookingDetails(props) {
  const [details, setDetails] = useState([]);

  //itemId is a value that will store the param ("itemId") that have been passed from the other navigation (all booking navigation)
  const itemId = props.navigation.getParam("itemId", "No params");
  const [workers, setWorkers] = useState([]);
  const [servitemid, setServItemId] = useState([]);
  const [serviceName, setServiceName] = useState([]);
  
  const BookingsDetailsDB = async () => {
    db.collection("booking")
      .doc(itemId)
      .collection("service_booking")
      .onSnapshot(async (querySnapShot) => {
        const all = [];
        const services = [];
        const workerId = [];
        const serviceName = [];
        querySnapShot.forEach(async (doc) => {
          all.push({ id: doc.id, ...doc.data() });
        });
        for (let i = 0; i < all.length; i++) {
          services.push(all[i].id);
          //setServiceId(all[i].service_id);
          let users = await db.collection("users").doc(all[i].worker).get();
          let name = await db
            .collection("service")
            .doc(all[i].service_id)
            .get();
          const w = users.data();
          const n = name.data();
          workerId.push(w);
          serviceName.push(n);
          // console.log("ww ", workerId);
          // console.log("serviceId", serviceId);
          console.log("gtgr", name.data());
        }
        setWorkers([...workerId]);
        setServItemId(services);
        setServiceName([...serviceName]);
        setDetails([...all]);
        //console.log("gtgr", all[i].service_id)
      });
  };
  const timeToRate = (date, id) => {
    //get the right current date
    const currentDate = moment().format();
    let s = moment(currentDate).seconds(0).milliseconds(0);
    let m = moment(s).add(3, "h").toDate();

    //split the date parameter
    const splittedDate = date.split("  ");
    const splitTime = splittedDate[0].split(" ");
    const formattedTime = splitTime[0] + ":00";
    let splittedHour = formattedTime.split(":");
    if (splittedHour[0].length === 1) {
      splittedHour[0] = `0${splittedHour[0]}`;
    }
    let time = `${splittedHour[0]}:${splittedHour[1]}:${splittedHour[2]} ${splitTime[1]}`;
    // console.log("time", time);
    let finalTime = convertTime(time);

    const formattedDate = `${splittedDate[1]}T${finalTime}`;

    let oldDate = new Date(formattedDate);
    let cd = new Date(s);
    let endDate = moment(oldDate).add(30, "m").toDate();

    //console.log("tests => ", endDate > cd, "current", m, "end:", endDate);
    if (m >= endDate) {
      return true;
    } else {
      return false;
    }
  };

  const convertTime = (time) => {
    const splitTime = time.split(" ");
    if (splitTime[1] === "PM") {
      const split = splitTime[0].split(":");
      if (split[0] === "12") {
        return `12:${split[1]}:00`;
      } else if (split[0] === "01") {
        return `13:${split[1]}:00`;
      } else if (split[0] === "02") {
        return `14:${split[1]}:00`;
      } else if (split[0] === "03") {
        return `15:${split[1]}:00`;
      } else if (split[0] === "04") {
        return `16:${split[1]}:00`;
      } else if (split[0] === "05") {
        return `17:${split[1]}:00`;
      } else if (split[0] === "06") {
        return `18:${split[1]}:00`;
      } else if (split[0] === "07") {
        return `19:${split[1]}:00`;
      } else if (split[0] === "08") {
        return `20:${split[1]}:00`;
      } else if (split[0] === "09") {
        return `21:${split[1]}:00`;
      } else if (split[0] === "10") {
        return `22:${split[1]}:00`;
      } else if (split[0] === "11") {
        return `23:${split[1]}:00`;
      }
    } else if (splitTime[1] === "AM") {
      const split = splitTime[0].split(":");
      if (split[0] === "12") {
        return `12:${split[1]}:00`;
      } else if (split[0] === "11") {
        return `11:${split[1]}:00`;
      } else if (split[0] === "10") {
        return `10:${split[1]}:00`;
      } else if (split[0] === "09") {
        return `09:${split[1]}:00`;
      } else if (split[0] === "08") {
        return `08:${split[1]}:00`;
      }
    } else {
      return splitTime[0];
    }
  };

  const ratingCompleted = async (rating, id) => {
    // setRating(rating);
    db.collection("booking")
      .doc(itemId)
      .collection("service_booking")
      .doc(id)
      .update({ rating: rating });
  };

  useEffect(() => {
    BookingsDetailsDB();
  }, []);

  return (
    <View style={{ backgroundColor: "#F0F8FF", flex: 1 }}>
      <ScrollView style={{ marginTop: 24 }}>
        {details.map((item, index) => {
          return (
            <View key={item.id} style={{ marginBottom: 10 }}>
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
                  Block: {item.block}
                </Text>
                <Text
                  style={{
                    marginLeft: "auto",
                    marginRight: "auto",
                    fontWeight: "bold",
                  }}
                >
                  Service: {serviceName[index].Name}
                </Text>

                <Text
                  style={{
                    marginLeft: "auto",
                    marginRight: "auto",
                    fontWeight: "bold",
                  }}
                >
                  Time: {item.time}
                </Text>

                {console.log("time", item.time)}
                <Text
                  style={{
                    marginLeft: "auto",
                    marginRight: "auto",
                    fontWeight: "bold",
                  }}
                >
                  Worker:{workers[index].email}
                </Text>

                {timeToRate(item.time, item.id) ? (
                  <Animatable.View
                    animation="bounceIn"
                    easing="ease-out"
                    iterationCount={2}
                  >
                    <Rating
                      showRating
                      type="star"
                      startingValue={item.rating}
                      imageSize={40}
                      onFinishRating={(rating) =>
                        ratingCompleted(rating, item.id)
                      }
                      style={{ paddingVertical: 10 }}
                      readonly={item.rating > 0 ? true : false}
                    />
                  </Animatable.View>
                ) : (
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
                )}
              </Card>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
ServiceBookingDetails.navigationOptions = {
  title: "Service Booking Details",
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
