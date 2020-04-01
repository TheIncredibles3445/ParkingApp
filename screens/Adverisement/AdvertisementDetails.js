import * as WebBrowser from "expo-web-browser";
import React, { useState, useEffect } from "react";
import {
  Image,
  Platform,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import DatePicker from "react-native-datepicker";
import moment, { updateLocale } from "moment";
import db from "../../db"

export default function AdvertisementDetails(props) {


  const item = props.navigation.getParam("adv", "some default value");
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()
  const [date, setDate] = useState(moment().add(7, "day"));
  const [disableAll, setDisableAll] = useState(true)
  const [offers, setOffers] = useState([])
  const [offeredAmount , setOfferedAmount] = useState()

  useEffect(() => {
    db.collection("Advertisement").doc(item.id).collection("offers").onSnapshot(querySnapshot => {
      let offers = [];
      querySnapshot.forEach(doc => {
        offers.push({ id: doc.id, ...doc.data() });
      });
      setOffers([...offers]);

    });
    console.log("the ads --->",offers , item.id) 
  }, [])

  const updateOffer = () =>{
    db.collection("Advertisement").doc(item.id).collection("offers").doc(offers.length + 1+"").set({ date: moment().format() ,startDate,
      endDate,
      offeredAmount })
  }

  return (
    <View>
      <Text>Advertisement Details </Text>

      <Text style={item.adStatus == "Pending" ? styles.pending : item.adStatus == "Declined" ? styles.declined : item.adStatus == "Approved" ? styles.approved : null}>
        Status: {item.adStatus}
      </Text>
      <Text style={{ marginLeft: 10, marginRight: 30 }}>
        Title: {item.title}
      </Text>
      <Text style={{ marginLeft: 10, marginRight: 30 }}>
        Description: {item.description}
      </Text>
      <Text style={{ marginLeft: 10, marginRight: 30 }}>
        Link: {item.link}
      </Text>
      <Text style={{ marginLeft: 10, marginRight: 30 }}>
        Image: {item.photoURL}
      </Text>

      <View>
        {
          offers.length > 0 ?
            <View>
              {offers.map((o, index) =>
              <View>
                <Text>{index + 1}) {o.startDate} {o.endDate} {o.offeredAmount} {o.date}</Text>
              <Text>{o.feedback}</Text>
                </View>
              )}

              {
                offers[offers.length - 1].feedback && item.adStatus !== "Approved" && item.adStatus !== "Declined" ?
                <View>
                  <View>
                    <Text>
                Start Date
              </Text>
              <DatePicker date={startDate}  mode="date"  placeholder="Select Start Date" format="YYYY-MM-DD"  minDate={date}
                confirmBtnText="Confirm" cancelBtnText="Cancel"  customStyles={{
                  dateIcon: {
                    position: "absolute",
                    left: 0,
                    top: 4,
                    marginLeft: 0
                  },
                  dateInput: {
                    marginLeft: 36
                  }
                }}
                onDateChange={startDate => setStartDate(startDate)} disabled={!disableAll}  />
            </View>

            <View style={{ flexDirection: "row" }}>
              <Text>
                End Date
              </Text>
              <DatePicker date={endDate} mode="date"  placeholder="Select End Date"  format="YYYY-MM-DD" minDate={moment(startDate).add(7, "day")}
                confirmBtnText="Confirm"  cancelBtnText="Cancel" customStyles={{
                  dateIcon: {
                    position: "absolute",
                    left: 0,
                    top: 4,
                    marginLeft: 0
                  },
                  dateInput: {
                    marginLeft: 36
                  }
                }}
                onDateChange={endDate => setEndDate(endDate)}
                disabled={!startDate} />
            </View>

            <View style={{ flexDirection: "row" }}>
              <Text>
                Offered Amount
              </Text>
              <TextInput
                require
                onChangeText={text => setOfferedAmount(text)}
                placeholder="Offered Amount"
                // value={offeredAmount}
                keyboardType={"numeric"}
                numeric
                editable={disableAll}
              />
            </View>
            <Button title="Update" onPress={()=>updateOffer() } disabled={endDate && startDate && offeredAmount ? false : true} />
                  </View> :
                  null
              }
            </View>
            :
            null
        }

      </View>

    </View>
  );
}


const styles = StyleSheet.create({
  pending: {
    height: 50,
    width: 200,
    fontSize: 20,
    backgroundColor: "#FFFFE0",
    marginBottom: 4,
    marginTop: 4,
    marginRight: "auto",
    marginLeft: "auto",
    alignItems: "center"
  },
  declined: {
    height: 50,
    width: 200,
    fontSize: 20,
    backgroundColor: "#FF4500",
    marginBottom: 4,
    marginTop: 4,
    marginRight: "auto",
    marginLeft: "auto",
    alignItems: "center"
  },
  approved: {
    height: 50,
    width: 200,
    fontSize: 20,
    backgroundColor: "#98FB98",
    marginBottom: 4,
    marginTop: 4,
    marginRight: "auto",
    marginLeft: "auto",
    alignItems: "center"
  },
  date: {

  }

});