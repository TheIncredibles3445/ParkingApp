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
  const [workerId, setWorkerId] = useState([]);
  const [workerName, setWorkerName] = useState([]);
  const [servitemid, setServItemId] = useState([]);
  const [rate, setRating] = useState(0);
  // const [min, setMin] = useState("00:00");

  const BookingsDetailsDB = async () => {
    db.collection("booking")
      .doc(itemId)
      .collection("service_booking")
      .onSnapshot(querySnapShot => {
        const all = [];
        const services = [];
        const workerId = [];
        querySnapShot.forEach(doc => {
          all.push({ id: doc.id, ...doc.data() });
        });
        for (let i = 0; i < all.length; i++) {
          services.push(all[i].id);
          workerId.push(all[i].worker);
        }
        setWorkerId(workerId);
       // console.log("worker id", workerId)
        setServItemId(services);
        setDetails([...all]);
      });
  };

  // const timeToRate = (stimes,id) => {
  //  let a = moment(stimes.format("hh:mm"))
  //     console.log("ddf", a);
  // };

  const getWorkerName = async () => {
    db.collection("users").onSnapshot(querySnapShot => {
      const all = [];
      let workerNames = [];
      querySnapShot.forEach(doc => {
        all.push({ id: doc.id, ...doc.data() });
      });
        const workers =[]
      for (let i = 0; i < all.length; i++) {
        //console.log("worker id -----:", workerId);

        for (let k = 0; k < workerId.length; k++) {
          //console.log("worker id -----:", workerId[k]);

          if (all[i].id === workerId[k]) {
            workers.push(all[i].email);
           // console.log("worker names -----:", workers);

          } else {
          }
        }
        // console.log("emails ------:", workerName.length);
        setWorkerName(workers);
        // console.log("worker names -----:", workerName);
        // console.log("3", workerName);
      }
    });
  };

  const ratingCompleted = async (rating, id) => {
    setRating(rating);
    db.collection("booking")
      .doc(itemId)
      .collection("service_booking")
      .doc(id)
      .update({ rating: rating });
  };

  useEffect(() => {
    BookingsDetailsDB();
    getWorkerName();
    console.log("workersss", workerName);
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
        {details.map(item => {
          return (
            <View key={item.id} style={{ marginBottom: 50 }}>
              <Text
                style={{
                  marginLeft: "auto",
                  marginRight: "auto",
                  fontWeight: "bold"
                }}
              >
                Time: {item.time} - Service: {item.service} worker:{workerName}
              </Text>
              <Text></Text>
              {item.id ? (
                <Rating
                  showRating
                  type="star"
                  startingValue={item.rating}
                  imageSize={40}
                  onFinishRating={ratingCompleted}
                  style={{ paddingVertical: 10 }}
                />
              ) : (
                <Rating
                  showRating
                  type="star"
                  startingValue={item.rating}
                  imageSize={40}
                  onFinishRating={rating => ratingCompleted(rating, item.id)}
                  style={{ paddingVertical: 10 }}
                />
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
