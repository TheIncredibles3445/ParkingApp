import React, { useState, useEffect, useRef } from "react";
import {
  Image,
  Platform,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Picker
} from "react-native";

import "firebase/auth";
import db from "../../../db.js";
import DatePicker from "react-native-datepicker";
import moment from "moment";
import { checkForUpdateAsync } from "expo/build/Updates/Updates";

export default function ServiceBookingScreen(props) {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");

  const [block, setBlock] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState();

  const [parking, setParking] = useState([]);
  const [selectedParking, setSelectedParking] = useState();

  const [workers, setWorkers] = useState([]);

  const [selectedTime, setSelectedTime] = useState("");
  const [userBookings, setUserBookings] = useState([]);
  const finalTimingList = useRef();
  const sBlock = useRef();
  const sService = useRef();
  const [showTime, setShowTime] = useState(false);

  useEffect(() => {
    manageTimeRange();
    db.collection("service")
      .where("Status", "==", true)
      .onSnapshot(querySnapshot => {
        const services = [];
        querySnapshot.forEach(doc => {
          services.push({ id: doc.id, ...doc.data() });
        });
        setServices([...services]);
      });

    db.collection("block").onSnapshot(querySnapshot => {
      const block = [];
      querySnapshot.forEach(doc => {
        block.push({ id: doc.id, ...doc.data() });
      });
      setBlock([...block]);
    });
    console.log("------------------------------blocks",block);
  }, []);

  const getWorkers = () => {
    setSelectedTime();
    //setAvailableTimings([])

    if (selectedService) {
      let w = [];
      workers.current = [];
      db.collection("worker").onSnapshot(querySnapshot => {
        const worker = [];
        querySnapshot.forEach(doc => {
          workers.current.push({ id: doc.id, ...doc.data() });
          console.log("here in db");
        });
        filterAvailableTimings();
      });
    }
  };

  useEffect(() => {
    if (selectedBlock) {
      console.log(selectedBlock.id)
      db.collection("Block")
        .doc(selectedBlock.id)
        .collection("Parking")
        .onSnapshot(querySnapshot => {
          const parking = [];
          querySnapshot.forEach(doc => {
            parking.push({ id: doc.id, ...doc.data() });
          });
          setParking([...parking]);
        });
        console.log("here in 92",parking)
    } else {
      setParking([]);
    }
  }, [selectedBlock]);

  useEffect(() => {
    //setSelectedTime()
    setShowTime(false);
    manageTimeRange();
    //finalTimingList.current = []
  }, [selectedService]);

  const manageTimeRange = () => {
    let startTime = "";
    let hour = moment()
      .format("LTS")
      .split(":")[0];
    let nextHour = parseInt(hour) + 1;
    let minute = moment()
      .format("LTS")
      .split(":")[1];
    let timings = [
      `8:00 AM ${moment().format("YYYY-MM-DD")}`,
      `8:30 AM ${moment().format("YYYY-MM-DD")}`,
      `9:00 AM ${moment().format("YYYY-MM-DD")}`,
      `9:30 AM ${moment().format("YYYY-MM-DD")}`,
      `10:00 AM ${moment().format("YYYY-MM-DD")}`,
      `10:30 AM ${moment().format("YYYY-MM-DD")}`,
      `11:00 AM ${moment().format("YYYY-MM-DD")}`,
      `11:30 AM ${moment().format("YYYY-MM-DD")}`,
      `12:00 PM ${moment().format("YYYY-MM-DD")}`,
      `12:30 PM ${moment().format("YYYY-MM-DD")}`,
      `1:00 PM ${moment().format("YYYY-MM-DD")}`,
      `1:30 PM ${moment().format("YYYY-MM-DD")}`,
      `2:00 PM ${moment().format("YYYY-MM-DD")}`,
      `2:30 PM ${moment().format("YYYY-MM-DD")}`,
      `3:00 PM ${moment().format("YYYY-MM-DD")}`,
      `3:30 PM ${moment().format("YYYY-MM-DD")}`,
      `4:00 PM ${moment().format("YYYY-MM-DD")}`,
   
    ];
    if (minute > 30 && parseInt(hour) !== 12) {
      startTime = nextHour + ":00";
    } else if (minute > 30 && parseInt(hour) == 12) {
      startTime = 1 + ":00";
    } else {
      startTime = hour + ":30";
    }

    let timingsForBooking = [];
    for (let i = 0; i < timings.length; i++) {
      if (timings[i].split(" ")[0] === startTime) {
        for (let k = i; k < timings.length; k++) {
          timingsForBooking.push(timings[k]);
        }
      }
    }
    finalTimingList.current = timingsForBooking;
    console.log("final list", finalTimingList.current)
  };

  const filterAvailableTimings = () => {
    let availables = [];
    let timeList = finalTimingList.current;
    for (let t = 0; t < timeList.length; t++) {
      for (let i = 0; i < workers.current.length; i++) {
        //check if worker assigned for the service
        let assigned = workers.current[i].services.filter(
          s => s === selectedService.id
        );
        if (assigned.length > 0) {
          let tmp = workers.current[i].schedule.filter(
            s => s.dateTime === timeList[t]
          );
          if (tmp.length == 0) {
            let check = availables.filter(a => a === timeList[t]);
            if (check.length == 0) {
              availables.push(timeList[t]);
            }
          }
        }
      }
    }
    finalTimingList.current = availables;
    setShowTime(true);
  };

  const book = () => {
    let temp = userBookings;
    let worker = "";
    //schedule a worker
    for (let i = 0; i < workers.current.length; i++) {
      let tmp = workers.current[i].schedule.filter(
        s => s.dateTime === selectedTime
      );
      if (tmp.length == 0) {
        worker = workers.current[i];
        console.log("FOUND WORKER", worker);
        let tempWrk = workers;
        tempWrk.current[i].schedule.push({ dateTime: selectedTime });
        workers.current = tempWrk.current;
        console.log("new worker schedule", workers.current);
        break;
      }
    }
    temp.push({
      service: selectedService,
      time: selectedTime,
      worker: worker,
      block: selectedBlock,
      parking: selectedParking
    });
    setUserBookings(temp);
    setSelectedParking();
    setSelectedService();
    setSelectedBlock();
    setSelectedTime();
    setShowTime(false);
  };

  const deleteBooking = index => {
    let worker = userBookings[index].worker.id;
    //not working !!
    let tmpWorkers = workers;
    for (let i = 0; i < tmpWorkers.current.length; i++) {
      if (tmpWorkers.current[i].id == worker) {
        for (let k = 0; k < tmpWorkers.current[i].schedule.length; k++) {
          if (
            tmpWorkers.current[i].schedule[k].dateTime ===
            userBookings[index].time
          ) {
            tmpWorkers.current[i].schedule[k].dateTime = "...";
          }
        }
      }
    }
    workers.current = tmpWorkers.current;
    let tmp = [...userBookings];
    tmp.splice(index, 1);
    setUserBookings(tmp);
  };

  const confirm = () => {
    let bookings = userBookings;
    setShowTime(false);
    setUserBookings([]);
    setSelectedParking();
    setSelectedService();
    setSelectedBlock();
    setSelectedTime();
    finalTimingList.current = [];

    props.navigation.navigate("ConfirmBooking", { booking: bookings });
  };

  return (
    <View style={{ width: "80%", marginLeft: "auto", marginRight: "auto" }}>
      {services.length !== 0 ? (
        <Picker
          selectedValue={selectedService}
          style={{
            height: 50,
            width: 200,
            fontSize: 20,
            backgroundColor: "#DCDCDC",
            marginBottom: 4,
            marginTop: 4,
            marginRight: "auto",
            marginLeft: "auto"
          }}
          onValueChange={itemValue => setSelectedService(itemValue)}
        >
          <Picker.Item label="SERVICES" value="" />
          {services.map(s => (
            <Picker.Item label={s.Name} value={s} />
          ))}
        </Picker>
      ) : null}

      {block.length !== 0 ? (
        <Picker
          selectedValue={selectedBlock}
          style={{
            height: 50,
            width: 200,
            fontSize: 20,
            backgroundColor: "#DCDCDC",
            marginBottom: 4,
            marginTop: 4,
            marginRight: "auto",
            marginLeft: "auto"
          }}
          onValueChange={itemValue => setSelectedBlock(itemValue)}
        >
          <Picker.Item label={"BLOCK"} value={""} disabled />
          {block.map(s => (
            <Picker.Item label={s.name} value={s} />
          ))}
        </Picker>
      ) : null}

      {parking.length !== 0 ? (
        <Picker
          selectedValue={selectedParking}
          style={{
            height: 50,
            width: 200,
            fontSize: 20,
            backgroundColor: "#DCDCDC",
            marginBottom: 4,
            marginTop: 4,
            marginRight: "auto",
            marginLeft: "auto"
          }}
          onValueChange={itemValue => setSelectedParking(itemValue)}
        >
          <Picker.Item label={"PARKING"} value={""} disabled />
          {parking.map(a => (
            <Picker.Item label={a.name + ""} value={a} />
          ))}
        </Picker>
      ) : null}
      {showTime ? (
        <Picker
          selectedValue={selectedTime}
          style={{
            height: 50,
            width: 200,
            fontSize: 20,
            backgroundColor: "#DCDCDC",
            marginBottom: 4,
            marginTop: 4,
            marginRight: "auto",
            marginLeft: "auto"
          }}
          onValueChange={itemValue => setSelectedTime(itemValue)}
        >
          <Picker.Item label={"Available Times"} value={""} disabled />
          {finalTimingList.current.map(a => (
            <Picker.Item
              label={a.split(" ")[0] + " " + a.split(" ")[1]}
              value={a}
            />
          ))}
        </Picker>
      ) : null}

      {selectedParking && selectedService && selectedBlock ? (
        <Button title="Search" onPress={() => getWorkers()} />
      ) : null}
      {selectedTime ? <Button title="Book" onPress={() => book()} /> : null}

      <Text
        style={{
          width: 200,
          borderBottomColor: "#DCDCDC",
          borderBottomWidth: 1,
          marginBottom: 10
        }}
      ></Text>
      {userBookings.length !== 0 ? (
        <Text
          style={{
            height: 50,
            width: 200,
            fontSize: 20,
            backgroundColor: "#F0FFFF",
            marginRight: "auto",
            marginLeft: "auto"
          }}
        >
          {" "}
          Bookings{" "}
        </Text>
      ) : null}

      {userBookings.length !== 0
        ? userBookings.map((b, index) => (
            <View style={{ marginRight: "auto", marginLeft: "auto" }}>
              <View style={{ float: "left" }}>
                <Text>{b.service.Name} </Text>
                <Text>{b.time} </Text>
              </View>
              <View style={{ width: 30, float: "left" }}>
                <Button title="X" onPress={() => deleteBooking(index)} />
              </View>
            </View>
          ))
        : null}

      {userBookings.length !== 0 ? (
        <Button title="Confirm Booking" onPress={() => confirm()} />
      ) : null}
    </View>
  );
}
ServiceBookingScreen.navigationOptions = {
  title: "Service Booking"
};
