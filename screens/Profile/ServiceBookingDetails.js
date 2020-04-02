import React, { useState, useEffect } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { Text, Button, Icon } from "react-native-elements";
import db from "../../db";
import firebase from "firebase/app";
import "firebase/auth";
import { Rating } from "react-native-elements";
import moment from "moment";

export default function ServiceBookingDetails(props) {
  const [details, setDetails] = useState([]);
  const itemId = props.navigation.getParam("itemId", "No params");
  const [workers, setWorkers] = useState([]);
  const [servitemid, setServItemId] = useState([]);

  const BookingsDetailsDB = async () => {
    db.collection("booking")
      .doc(itemId)
      .collection("service_booking")
      .onSnapshot(async querySnapShot => {
        const all = [];
        const services = [];
        const workerId = [];
        querySnapShot.forEach(async doc => {
          all.push({ id: doc.id, ...doc.data() });
        });
        for (let i = 0; i < all.length; i++) {
          services.push(all[i].id);
          let users = await db
            .collection("users")
            .doc(all[i].worker)
            .get();

          const w = users.data();
          workerId.push(w);
          console.log("ww ", workerId);
          // console.log("worker id" , all[i].worker)
        }
        // for (let a = 0; a < workerId.length; a++) {
        //   setWorkers(workerId[a].email);
        //   console.log("wordker id-=---", workerId[a].email);
        // }
        setWorkers([...workerId]);
        setServItemId(services);
        setDetails([...all]);
      });
  };

  // const getWorkerName = async () => {
  //   db.collection("users").onSnapshot(querySnapShot => {
  //     const all = [];
  //     querySnapShot.forEach(doc => {
  //       all.push({ id: doc.id, ...doc.data() });
  //     });
  //     const workers = [];
  //     for (let i = 0; i < all.length; i++) {
  //       // console.log("mnnnn-", all[i].id);
  //       for (let w = 0; w < workerId.length; w++) {
  //         //console.log("mnnnn-", workerId[m]);
  //         if (workerId[w] === all[i].id) {
  //           workers.push(all[i].id);
  //           console.log("w-", workers);
  //         }
  //       }
  //     }

  //     setWorkerName([...workers]);
  //     // console.log("workerss", w);
  //   });
  // };
  const timeToRate = (date, id) => {
    //get the right current date
    const currentDate = moment().format();
    let s = moment(currentDate)
      .seconds(0)
      .milliseconds(0);
    let m = moment(s)
      .add(3, "h")
      .toDate();

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
    let endDate = moment(oldDate)
      .add(30, "m")
      .toDate();

    //console.log("tests => ", endDate > cd, "current", m, "end:", endDate);
    if (m >= endDate) {
      return true;
    } else {
      return false;
    }
  };

  const convertTime = time => {
    const splitTime = time.split(" ");
    if (splitTime[1] === "pm") {
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
    } else if (splitTime[1] === "am") {
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
    <View>
      <Text
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          fontSize: 20,
          marginBottom: 20
        }}
      >
        Service Booking Details
      </Text>
      <ScrollView>
        {details.map((item,index) => {
          return (
            <View key={item.id} style={{ marginBottom: 50 }}>
              <Text
                style={{
                  marginLeft: "auto",
                  marginRight: "auto",
                  fontWeight: "bold"
                }}
              >
                Time: {item.time} -
              </Text>
              <Text
                style={{
                  marginLeft: "auto",
                  marginRight: "auto",
                  fontWeight: "bold"
                }}
              >
                Service: {item.service}
              </Text>
              <Text
                style={{
                  marginLeft: "auto",
                  marginRight: "auto",
                  fontWeight: "bold"
                }}
              >
                worker:{workers[index].email}
              </Text>
              {timeToRate(item.time, item.id) ? (
                <Rating
                  showRating
                  type="star"
                  startingValue={item.rating}
                  imageSize={40}
                  onFinishRating={rating => ratingCompleted(rating, item.id)}
                  style={{ paddingVertical: 10 }}
                  readonly={item.rating > 0 ? true : false}
                />
              ) : (
                <View>
                  <Text
                    style={{
                      marginLeft: "auto",
                      marginRight: "auto",
                      marginTop: 12
                    }}
                  >
                    ** Please wait till the end of the service time to rate! **
                  </Text>
                  <Rating
                    readonly
                    showRating
                    type="star"
                    startingValue={item.rating}
                    imageSize={40}
                    onFinishRating={rating => ratingCompleted(rating, item.id)}
                    style={{ paddingVertical: 10 }}
                  />
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontWeight: "bold",
    fontSize: 15,
    opacity: 0.7
  },
  text2: {
    fontWeight: "bold",
    fontSize: 15,
    opacity: 0.7,
    textAlign: "center"
  }
});
