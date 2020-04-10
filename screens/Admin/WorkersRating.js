import React, { useState, useEffect } from "react";
import { ScrollView, View, StyleSheet, Alert } from "react-native";
import { Text, Button, Icon, Divider } from "react-native-elements";
import db from "../../db";
import firebase from "firebase/app";
import "firebase/auth";
import { DataTable } from "react-native-paper";

export default function WorkersRating(props) {
  const [workersNames, setWorkersNames] = useState([]);

  const Rating = async () => {
    db.collection("users")
      .where("role", "==", "worker")
      .onSnapshot((querySnapShot) => {
        ////Gettting all the workers
        let workers = [];
        for (let worker of querySnapShot.docs) {
          workers.push({ id: worker.id, ...worker.data() });
        }
        console.log(`workers =>`, workers);
        let workerArr = [];
        workers.map((item) => {
          db.collection("worker")
            .doc(item.id)
            .onSnapshot((querySnap) => {
              if (querySnap.data() !== undefined) {
                let services = querySnap.data().services;
                let schedules = querySnap.data().schedule;
                // console.log(schedules);
                let servicesss = [];
                services.map(async (item, index) => {
                  let serv = await db.collection("service").doc(item).get();
                  servicesss.push(serv.data().Name + "\n");
                });
                let avgRating = 0;
                let totalRating = 0;
                schedules.map(async (schedule, index) => {
                  let bookedWorker = await db
                    .collection("booking")
                    .doc(schedule.Booking)
                    .collection("service_booking")
                    .doc(schedule.Service_booking)
                    .get();
                  totalRating += bookedWorker.data().rating;
                  if (index === schedules.length - 1) {
                    avgRating = parseInt(totalRating / schedules.length);
                    workerArr.push({
                      displayName: item.displayName,
                      avgRating: avgRating,
                      service: servicesss,
                    });
                    setWorkersNames([...workerArr]);
                  }
                });
              }
            });
        });
      });
  };

  useEffect(() => {
    Rating();
  }, []);

  return (
    <View style={{ backgroundColor: "#F0F8FF", flex: 1 }}>
      <ScrollView style={{ marginTop: 30 }}>
        <Divider style={{ color: "white", fontWeight: 12 }} />
        <DataTable.Header>
          <DataTable.Title>Worker Name</DataTable.Title>
          <DataTable.Title>Service</DataTable.Title>
          <DataTable.Title numeric> Average Rating</DataTable.Title>
        </DataTable.Header>

        {workersNames.map((item, index) => {
          return (
            <View key={index}>
              <DataTable>
                <DataTable.Row>
                  <DataTable.Cell> {item.displayName}</DataTable.Cell>
                  <Text>{item.service}</Text>
                  <DataTable.Cell numeric> {item.avgRating}/4</DataTable.Cell>
                </DataTable.Row>
              </DataTable>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

WorkersRating.navigationOptions = {
  title: "Workers Rating",
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
  head: { height: 40, backgroundColor: "#f1f8ff" },
  text: { margin: 6 },
});
