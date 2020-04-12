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
import moment from "moment";
import db from "../../db";

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
      offeredAmount , feedback:""})
  }

  return (
    <ScrollView>
    
<View style={{padding:10,borderColor:"#B0C4DE",borderWidth:3 , 
            backgroundColor:"white" , width:"80%" ,
            marginRight:"auto", marginLeft:"auto" , height:350 , marginTop:"5%" , marginBottom:"5%"}}>
<Text style={{borderColor:"#B0C4DE",borderBottomWidth:1 ,fontSize:15 , fontWeight:"bold", marginLeft: 10, marginRight: 30 , marginBottom:10}}>Status: {item.adStatus}
      </Text>
      <Text style={{ borderColor:"#B0C4DE",borderBottomWidth:1 ,fontSize:15 , fontWeight:"bold",marginLeft: 10, marginRight: 30 , marginBottom:10}}>
        Title: {item.title}
      </Text>
      <Text style={{borderColor:"#B0C4DE",borderBottomWidth:1 , fontSize:15 , fontWeight:"bold", marginLeft: 10, marginRight: 30 , marginBottom:10}}>
        Description: {item.description}
      </Text>
      <Text style={{ borderColor:"#B0C4DE",borderBottomWidth:1 ,fontSize:15 , fontWeight:"bold",marginLeft: 10, marginRight: 30 , marginBottom:10}}>
        Link: {item.link}
      </Text>
      <Text style={{ borderColor:"#B0C4DE",borderBottomWidth:1 ,fontSize:15 , fontWeight:"bold",marginLeft: 10, marginRight: 30, marginBottom:10 }}>
        Image: 
      </Text>
      <Image
          style={{ width: 150, height: 150,marginLeft: "auto", marginRight: "auto" }}
          source={{ uri: item.photoURL }}
        />

              
            </View>
      

      <View>
        <Text style={{ marginLeft: "auto", marginRight: "auto", fontSize: 30, color: "#284057", marginBottom: "5%"  }}>Offers</Text>
        {
          offers.length > 0 ?
            <View style={{ marginLeft: "auto", marginRight:"auto"}}>
              {offers.map((o, index) =>
              <View style={{borderColor:"#B0C4DE",borderWidth:2 , width:"90%"}}>
                <Text style={{ borderColor:"#B0C4DE",borderBottomWidth:1 ,fontSize:15 , fontWeight:"bold",marginLeft: 10, marginRight: 30 , marginBottom:10}}>From: {o.startDate}, To: {o.endDate} 
                {"\n"}Offered Amount: {o.offeredAmount} QR{"\n"}Last Update: {o.date}</Text>
              <Text style={{ borderColor:"#B0C4DE",borderBottomWidth:1 ,fontSize:15 , fontWeight:"bold",marginLeft: 10, marginRight: 30 , marginBottom:10}}>Admin Feedback: {o.feedback}</Text>
                </View>
              )}

              {
                offers[offers.length - 1].feedback && item.adStatus !== "Approved" && item.adStatus !== "Declined" ?
                <View style={{padding:10,borderColor:"#B0C4DE",borderWidth:3 , 
                backgroundColor:"white" , width:"100%" ,
               height:250 , marginTop:"5%" , marginBottom:"5%"}}>

                  <Text style={{ marginLeft: "auto", marginRight: "auto", fontSize: 20, color: "#284057", marginBottom: "5%"  }}>Update Offers</Text>
                  <View style={{flexDirection:"row", marginBottom:9}}>
                    <Text  style={{width:"40%",fontSize: 15, color: "#284057"}}>
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

            <View style={{ flexDirection: "row" , marginBottom:9}}>
              <Text style={{width:"40%",fontSize: 15, color: "#284057"}}>
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

            <View style={{ flexDirection: "row" , marginBottom:9}}>
              <Text  style={{width:"40%",fontSize: 15, color: "#284057"}}>
                Offered Amount
              </Text>
              <TextInput
              style={{borderColor:"grey", borderWidth:1 , height:40 , marginLeft:"14%"}}
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
      
      

    </ScrollView>
  );
}

AdvertisementDetails.navigationOptions = {
  title: 'Advertisements',
  headerStyle: { backgroundColor: "#5a91bf" },
  headerTitleStyle: {
    color: "white"
  }
};
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