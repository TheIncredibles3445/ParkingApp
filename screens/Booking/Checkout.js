import React, { useState, useEffect } from "react";
import { ScrollView, View, StyleSheet, Alert } from "react-native";
import { Text, Button, Icon } from "react-native-elements";
import db from "../../db";
import firebase from "firebase/app";
import "firebase/auth";
import { Card } from "react-native-shadow-cards";
import moment from "moment";
// import * as Animatable from "react-native-animatable";
import { Col, Grid } from "react-native-easy-grid";

// export default function Checkout(props) {
//   const [bookings, setBookings] = useState([]);
//   const [bookedParking, setBookedParking] = useState([]);
//   const [bookedService, setBookedService] = useState([]);
//   const [totalPrice, setTotalPrice] = useState(0);
//   const [flag, setFlag] = useState(false);

//   const tableHeader = ["Start Time", "End Time", "Price"];

//   const getUserBookings = async () => {
//     let date = "";
//     if (new Date().getMonth() + 1 < 10) {
//       date = `${new Date().getFullYear()}-0${new Date().getMonth() +
//         1}-${new Date().getDate()}`;
//     } else {
//       date = `${new Date().getFullYear()}-${new Date().getMonth() +
//         1}-${new Date().getDate()}`;
//     }

//     db.collection("booking")
//       .where("userId", "==", firebase.auth().currentUser.uid)
//       .where("date", "==", date)
//       .onSnapshot(querySnapshot => {
//         let booking = [];
//         querySnapshot.forEach(async doc => {
//           let data = { id: doc.id, ...doc.data() };
//           booking.push(data);
//           let total = 0;
//           booking.map(item => (total += item.total_price));
//           setTotalPrice(total);
//           setBookings(booking);
//         });
//       });
//   };

//   const getParkings = () => {
//     bookings.map(item => {
//       db.collection("booking")
//         .doc(item.id)
//         .collection("parking_booking")
//         .onSnapshot(querySnap => {
//           let parking = [];
//           querySnap.forEach(doc => {
//             parking.push({
//               id: doc.id,
//               ...doc.data(),
//               price: item.total_price
//             });
//           });
//           console.log(parking);
//           setBookedParking(parking);
//         });
//     });
//   };

//   const getService = () => {
//     bookings.map(item => {
//       db.collection("booking")
//         .doc(item.id)
//         .collection("service_booking")
//         .onSnapshot(querySnap => {
//           let service = [];
//           querySnap.forEach(doc => {
//             service.push({ id: doc.id, ...doc.data() });
//           });
//           setBookedService(service);
//         });
//     });
//   };

//   useEffect(() => {
//     async function fetchData() {
//       await getUserBookings();
//       getParkings();
//       getService();
//     }

//     fetchData();
//   }, []);

//   useEffect(() => {
//     setFlag(!flag);
//   }, [bookedParking]);

//   return (
//     <ScrollView>
//       <View style={{ flex: 1, alignItems: "center", marginTop: 10 }}>
//         <Text h4>Checkout</Text>
//       </View>
//       <View style={{ flex: 5 }}>
//         <View style={{ flex: 1 }}>
//           <Text
//             style={{
//               fontWeight: "bold",
//               fontSize: 15,
//               opacity: 0.7
//             }}
//           >
//             Booking Details
//           </Text>
//           <Text
//             style={{
//               fontWeight: "bold",
//               fontSize: 15,
//               opacity: 0.7
//             }}
//           >
//             Total Price: <Text>{totalPrice}</Text>
//           </Text>
//         </View>

//         <View style={{ alignItems: "center", flex: 5 }}>
//           {/* <Card style={{ padding: 15 }}> */}
//           {/* <View
//               style={{
//                 alignItems: "center"
//               }}
//             > */}
//           <Text
//             style={{
//               fontWeight: "bold",
//               fontSize: 15,
//               opacity: 0.7
//             }}
//           >
//             Booked Date: <Text>{moment().format("YYYY-MM-DD")}</Text>
//           </Text>

//           <Text
//             style={{
//               fontWeight: "bold",
//               fontSize: 15,
//               opacity: 0.7
//             }}
//           >
//             Booking Type: <Text>Parking</Text>
//           </Text>
//           {/* </View> */}
//           <Grid>
//             <Col>
//               <Text style={{ textAlign: "center" }}>Start Time</Text>
//             </Col>
//             <Col>
//               <Text style={{ textAlign: "center" }}>End Time</Text>
//             </Col>
//             <Col>
//               <Text style={{ textAlign: "center" }}>Price</Text>
//             </Col>
//           </Grid>

//           {bookedParking.map(item => (
//             <Grid>
//               <Col>
//                 <Text style={{ textAlign: "center" }}>Hello</Text>
//               </Col>
//               <Col>
//                 <Text style={{ textAlign: "center" }}>World</Text>
//               </Col>
//               <Col>
//                 <Text style={{ textAlign: "center" }}>Wasim</Text>
//               </Col>
//             </Grid>
//           ))}

//           <Text
//             style={{
//               fontWeight: "bold",
//               fontSize: 15,
//               opacity: 0.7
//             }}
//           >
//             Booking Type: <Text>Service</Text>
//           </Text>
//           {/* </View> */}
//           <Grid>
//             <Col>
//               <Text style={{ textAlign: "center" }}>Start Time</Text>
//             </Col>
//             <Col>
//               <Text style={{ textAlign: "center" }}>End Time</Text>
//             </Col>
//             <Col>
//               <Text style={{ textAlign: "center" }}>Price</Text>
//             </Col>
//             <Col>
//               <Text style={{ textAlign: "center" }}>Worker</Text>
//             </Col>
//           </Grid>

//           {bookedService.map(item => (
//             <Grid>
//               <Col>
//                 <Text style={{ textAlign: "center" }}>Hello</Text>
//               </Col>
//               <Col>
//                 <Text style={{ textAlign: "center" }}>World</Text>
//               </Col>
//               <Col>
//                 <Text style={{ textAlign: "center" }}>Wasim</Text>
//               </Col>
//             </Grid>
//           ))}

//           {/* <Grid>
//               {tableHeader.map(head => (
//                 <Col>
//                   <Text style={{ textAlign: "center" }}>{head}</Text>
//                 </Col>
//               ))}
//             </Grid>
//             <View style={{ flexDirection: "row" }}>
//               <Grid>
//                 <View>
//                   <Col>
//                     <Text style={{ textAlign: "center" }}>Hello</Text>
//                   </Col>
//                   <Col>
//                     <Text style={{ textAlign: "center" }}>World</Text>
//                   </Col>
//                   <Col>
//                     <Text style={{ textAlign: "center" }}>Wasim</Text>
//                   </Col>
//                 </View>
//               </Grid>
//             </View> */}
//           {/* </Card> */}
//         </View>
//       </View>
//     </ScrollView>
//   );
// }

// Checkout.navigationOptions = {
//   title: "Checkout"
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: "#fff" },
//   head: { height: 40, backgroundColor: "#f1f8ff" },
//   text: { margin: 6 }
// });

// {
//   /* <Animatable.View duration={2000}>
//           <Animatable.Text duration={2000} easing="ease-in" animation="fadeIn">
//             lorem ipsium
//           </Animatable.Text>
//           <Animatable.Text duration={2000} easing="ease-in" animation="fadeIn">
//             lorem ipsium
//           </Animatable.Text>
//           <Animatable.Text duration={2000} easing="ease-in" animation="fadeIn">
//             lorem ipsium
//           </Animatable.Text>
//         </Animatable.View> */
// }

export default function Checkout(props) {
  const [booking, setBooking] = useState([]);
  const [parkingBookings, setParkingBookings] = useState([]);
  const [serviceBookings, setServiceBookings] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    getParkingBookings();
    //db.collection("booking").
    // .firestore.collection("parking_booking")
    // .onSnapshot(query => {
    //   let park = [];
    //   //console.log("doc", query);

    //   query.forEach(doc => {
    //     console.log("doc", doc.data());
    //     park.push({ id: doc.id, ...doc.data() });
    //   });
    //   //console.log(park);
    //   setParkingBookings(park);
    // });

    // db.collection("booking")
    //   .where("userId", "==", firebase.auth().currentUser.uid)
    //   .where("date", "==", moment().format("YYYY-MM-DD"))
    //   .onSnapshot(querySnap => {
    //     let allBookings = [];
    //     querySnap.forEach(doc => {
    //       allBookings.push({ id: doc.id, ...doc.data() });
    //     });

    //     allBookings.map(item => {
    //       db.collection("booking")
    //         .doc(item.id)
    //         .collection("parking_booking")
    //         .onSnapshot(query => {
    //           const allParking = [];
    //           query.forEach(park => {
    //             allParking.push({ id: park.id, ...park.data() });
    //           });
    //           setParkingBookings(allParking)
    //         });
    //     });
    //   });
  }, []);

  useEffect(() => {
    console.log("object");
  });

  const getParkingBookings = async () => {
    db.collection("booking")
      .where("type", "==", "Parking")
      .get()
      .then(query => {
        let parkings = [];
        query.forEach(doc => {
          const data = { id: doc.id, ...doc.data() };
          db.collection("booking")
            .doc(data.id)
            .collection("parking_booking")
            .onSnapshot(q => {
              let p = parkingBookings;
              q.forEach(d => {
                p.push(...p, {
                  id: d.id,
                  ...d.data(),
                  price: data.total_price
                });
              });
              setParkingBookings(p);
            });
        });
      });
  };
  // const getAllBookings = async () => {
  //   const date = moment().format("YYYY-MM-DD");
  //   await db
  //     .collection("booking")
  //     .where("userId", "==", firebase.auth().currentUser.uid)
  //     .where("date", "==", date)
  //     .onSnapshot(querySnapshot => {
  //       let bookin = [];
  //       let total = 0;
  //       querySnapshot.forEach(async doc => {
  //         bookin.push({ id: doc.id, ...doc.data() });
  //       });
  //       getParkingBookings(bookin);
  //       getServiceBookings(bookin);
  //       bookin.map(item => (total += item.total_price));
  //       setTotal(total);
  //       setBooking([...bookin]);
  //     });
  // };

  // const getParkingBookings = async booking => {
  //   console.log("getParkingBookings", booking);

  //   let tempParking = [];
  //   let tempService = [];
  //   booking.map(item => {
  //     item.type === "Parking"
  //       ? db
  //           .collection("booking")
  //           .doc(item.id)
  //           .collection("parking_booking")
  //           .onSnapshot(query => {
  //             let parking = [];
  //             query.forEach(doc => {
  //               parking.push({
  //                 id: doc.id,
  //                 ...doc.data(),
  //                 price: item.total_price
  //               });
  //             });
  //             if (parking.length !== 0) tempParking.push(parking[0]);
  //           })
  //       : db
  //           .collection("booking")
  //           .doc(item.id)
  //           .collection("service_booking")
  //           .onSnapshot(query => {
  //             let service = [];
  //             query.forEach(doc => {
  //               service.push({
  //                 id: doc.id,
  //                 ...doc.data(),
  //                 price: item.total_price
  //               });
  //             });
  //             if (service.length !== 0) tempService.push(service[0]);
  //             setServiceBookings(tempService);
  //           });

  //     setParkingBookings(tempParking);
  //   });

  //   //let tempService = [];
  //   booking.map(item => {
  //     db.collection("booking")
  //       .doc(item.id)
  //       .collection("service_booking")
  //       .onSnapshot(query => {
  //         let service = [];
  //         query.forEach(doc => {
  //           service.push({
  //             id: doc.id,
  //             ...doc.data(),
  //             price: item.total_price
  //           });
  //         });
  //         if (service.length !== 0) tempService.push(service[0]);
  //         setServiceBookings(tempService);
  //       });
  //   });
  // };

  // const getServiceBookings = async booking => {
  //   console.log("getServiceBookings", booking);
  // };

  // useEffect(() => {
  //   async function fetchData() {
  //     await getAllBookings();
  //     // console.log("fetchData", booking);

  //     // getParkingBookings();
  //     // getServiceBookings();
  //   }

  //   fetchData();
  // }, []);

  const handlePayLater = () => {
    Alert.alert(
      "Confirm Booking",
      "Are you sure you want to pay  later?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Confirm", onPress: () => handlePayLate() }
      ],
      { cancelable: false }
    );
  };

  const handlePayLate = async () => {
    await db
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .update({
        points: 20,
        pending_amount: total
      });
    props.navigation.navigate("Home");
  };

  return (
    <ScrollView
    //contentContainerStyle={{ flex: 1, justifyContent: "space-around" }}
    >
      <View style={{ flex: 1, alignItems: "center" }}>
        <Text h4>Checkout</Text>
      </View>

      <View style={{ flex: 4 }}>
        <Text style={styles.text}>Booking Details</Text>
        <Text style={styles.text}>
          Total Price: <Text>{total}</Text>
        </Text>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.text}>
            Booked Date: <Text>{moment().format("YYYY-MM-DD")}</Text>
          </Text>
          <Card style={{ padding: 15 }}>
            <Text style={styles.text2}>
              Booking Type: <Text>Parking</Text>
            </Text>
            <Grid>
              <Col>
                <Text style={styles.text2}>Start Time</Text>
              </Col>
              <Col>
                <Text style={styles.text2}>End Time</Text>
              </Col>
              {/* <Col>
                <Text style={styles.text2}>Price</Text>
              </Col> */}
            </Grid>
            {console.log("from render", parkingBookings)
            // parkingBookings.map(item => (
            //   <Grid>
            //     <Col>
            //       <Text style={{ textAlign: "center" }}>{item.startTime}</Text>
            //     </Col>
            //     <Col>
            //       <Text style={{ textAlign: "center" }}>{item.endTime}</Text>
            //     </Col>
            //     {/* <Col>
            //         <Text style={{ textAlign: "center" }}>{item.price}</Text>
            //       </Col> */}
            //   </Grid>
            // ))
            }
          </Card>
          <Card style={{ padding: 15, marginTop: 10 }}>
            <Text style={styles.text2}>
              Booking Type: <Text style={styles.text2}>Service</Text>
            </Text>
            <Grid>
              <Col>
                <Text style={styles.text2}>Service</Text>
              </Col>
              <Col>
                <Text style={styles.text2}>Worker</Text>
              </Col>
              <Col>
                <Text style={styles.text2}>Price</Text>
              </Col>
              <Col>
                <Text style={styles.text2}>Time</Text>
              </Col>
            </Grid>

            {serviceBookings.map(item => (
              <Grid>
                <Col>
                  <Text style={{ textAlign: "center" }}>{item.Service}</Text>
                </Col>
                <Col>
                  <Text style={{ textAlign: "center" }}>{item.Worker}</Text>
                </Col>
                <Col>
                  <Text style={{ textAlign: "center" }}>{item.price}</Text>
                </Col>
                <Col>
                  <Text style={{ textAlign: "center" }}>{item.time}</Text>
                </Col>
              </Grid>
            ))}
          </Card>
        </View>
      </View>
      <View
        style={{
          marginTop: 20,
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-evenly"
        }}
      >
        <Button
          icon={<Icon type="material" name="payment" size={25} color="white" />}
          iconLeft
          title="Pay Now"
          onPress={() => alert("add the payment page")}
          //buttonStyle={{ width: "30%" }}
        />

        <Button
          icon={<Icon type="material" name="payment" size={25} color="white" />}
          iconLeft
          title="Pay Later"
          onPress={handlePayLater}
          //buttonStyle={{ width: "30%" }}
        />
      </View>
    </ScrollView>
  );
}

Checkout.navigationOptions = {
  title: "Checkout"
};

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
