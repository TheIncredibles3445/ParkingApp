//@refresh restart
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  AsyncStorage
} from "react-native";
import { NavigationActions } from "react-navigation";
import moment from "moment";
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from "react-native-maps";
import db from "../../db";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/functions";
import { getAutoFocusEnabled } from "expo/build/AR";
import Directions from "../Booking/FreeParkingDirection"

export default function FindParkings(props) {

  const [parkingSpots, setParkingSpots] = useState([]);
  const [selectedParking , setSelectedParking] = useState()
  const [cars, setCars] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [block, setBlock] = useState([]);
  const [update, setUpdate] = useState(false);
  const [update2, setUpdate2] = useState(false);
  const [update3, setUpdate3] = useState(false);
  const [show, setShow] = useState("building")
  const nearby = useRef()
  const free = useRef()
  const parkingDirection = useRef()
  const [arr, setArr] = useState([{ show:"building",color: "#3CB371", step: "Building" }, { show:"block", color: "#d9d9d9", step: "Parking Block" }, {  show:"parking",color: "#d9d9d9", step: "Parking Spot" }, {  show:"directions",color: "#d9d9d9", step: "Directions" }])
  //const [buildings , setBuildings] = useState([])
  useEffect(() => {
    getBuildings()
  }, [])

  const getBuildings = () => {
    db.collection("buildings").onSnapshot(querySnapshot => {
      let buildings = [];

      querySnapshot.forEach(doc => {
        buildings.push({ id: doc.id, ...doc.data(), isSelected: false });
      });
      setBuildings([...buildings]);
    });
    db.collection("block").onSnapshot(querySnapshot => {
      let block = [];

      querySnapshot.forEach(doc => {
        block.push({ id: doc.id, ...doc.data() });
      });
      setBlock([...block]);
    });

  }

  useEffect(() => {
    setUpdate(!update)
    console.log(" all locations", buildings)
    console.log("the blocks", block)
  }, [buildings, block])



  useEffect(() => {
    setUpdate2(!update2)

  }, [parkingSpots])


  const selectBuilding = async (building) => {
    console.log("select building")
    //filter block where nearby == building
    let finalBlocks = []
    for (let i = 0; i < block.length; i++) {
      let temp = block[i].nearby.filter(b => b == building.location)
      if (temp.length > 0) {
        console.log("here")
        finalBlocks.push(block[i])
      }
    }
    nearby.current = finalBlocks

    console.log(" all nearby == ", nearby.current)
    getParkigns()
  }

  const getParkigns = async () => {
    if (nearby.current.length > 0) {
      for (let i = 0; i < nearby.current.length; i++) {
        db.collection("block").doc(nearby.current[i].id).collection("parking").onSnapshot(querySnapshot => {
          let parkingSpots = [];
          querySnapshot.forEach(doc => {
            parkingSpots.push({ id: doc.id, ...doc.data(), block: nearby.current[i].id });
          });
          free.current = parkingSpots
          //.filter( p => p.isParked == false)    
        });
        console.log("---------------------- i=", free.current)
      }
    }
    changeShow("block",1)
  }

  const filterParkings = (block) => {
    console.log("free current", free.current, block.id)
    let temp = free.current
    temp = temp.filter(p => p.block === block.id && p.type == "free" && p.isParked == false)
    //&& p.type == "free" && isParked == false
    console.log(" the filter parking", temp)
    free.current = temp
    console.log(" the filter parking.current", free.current)
    changeShow("parking",2)
    //setUpdate3(!update3)
  }

  const showDirection = (b) => {
    // console.log("1",b.blockId ,"2", b.id)
    props.navigation.navigate("Direction", {
      blockId: b.block,
      parkingId: b.id
    })
  }

  const changeShow = (s,index,b) =>{
    setShow(s)
    let temp = arr
    for( let i=0 ; i < arr.length ; i++){
        if( i <= index){
          temp[i].color = "#3CB371"
        }
        else{
          temp[i].color = "#d9d9d9"
        }
    }
    setArr(temp)
    if(b){
      parkingDirection.current = b
      console.log("---------------------------",parkingDirection.current)
    }
  }

  return (
    <SafeAreaView style={{  backgroundColor: "#F0F8FF", height:"100%" }}>
      {
        show == "directions" ? 
        <View style ={{
          position: "absolute",
          top: 50,
          left: 0,
          right: 0,
          bottom: 0,
          height: "60%",
          width: "100%",
          flex: 1,
          marginTop: "25%",
          //marginLeft:"5%",
          //marginRight:"auto",borderRadius:15   
      
        }}>
        <Directions  
        blockId={ parkingDirection.current.block}
        parkingId={parkingDirection.current.id}
      /></View>
       
        :
        <MapView
        initialRegion={{
          latitude: 25.360664,
          longitude: 51.4788863,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01
        }}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
      >
        {
          buildings && show == "building" ?
            buildings.map((b, index) =>
              <Marker
                key={index}
                coordinate={{
                  latitude: b.latitude,
                  longitude: b.longitude
                }}
                onPress={() => selectBuilding(b)}
              ><View
                style={styles.unBookedMarker} >

                  <Text style={styles.text}>{b.location}</Text>

                </View></Marker>
            )
            : show == "block" ?
              nearby.current.map((b, index) =>
                <Marker
                  key={index}
                  coordinate={{
                    latitude: b.location.latitude,
                    longitude: b.location.longitude
                  }}
                  onPress={() => filterParkings(b)}
                ><View
                  style={styles.unBookedMarker} >

                    <Text style={styles.text}>{b.name}</Text>

                  </View>
                </Marker>
              )

              : show == "parking" ?
                free.current.map((b, index) =>
                  <Marker
                    key={index}
                    coordinate={{
                      latitude: b.location.latitude,
                      longitude: b.location.longitude
                    }}
                    onPress={() =>  changeShow("directions",3,b) }
                  ><View
                    style={styles.unBookedMarker} >

                      <Text style={styles.text}>{b.name}</Text>

                    </View>
                  </Marker>
                )

                :

                null

        }



      </MapView>
      }
      
     

      {/* { free.current && free.current.length > 0 && show == "parking"? 
        <TouchableOpacity onPress={ () =>
        props.navigation.navigate("Direction", {
          blockId: blockId,
          parkingId: parkingId
        })}>
          
        <Text>Show Directaion</Text>
        </TouchableOpacity>
      :null} */}
      <View style={{borderColor: "#B0C4DE",
  borderBottomWidth: 2,marginTop:"10%",flexDirection:"row", justifyContent:"space-evenly",width:"100%",height:"15%"}}>
        {
          arr.map((a, index) =>
          a.color != "#d9d9d9" ?
            <TouchableOpacity onPress={()=>changeShow(a.show,index)} style={{borderColor:a.color , backgroundColor:a.color , borderWidth:1 , borderRadius:15 ,height:"90%", width:"22%" , alignItems:"center"}}>
              <Text style={{color:"white"}}>{index + 1}</Text>
              <Text  style={{marginLeft:"auto",marginRight:"auto",color:"white"}}>{a.step}</Text>

            </TouchableOpacity>
            :
            <View desables={a.color == "#d9d9d9" ? true : false} style={{borderColor:a.color , backgroundColor:a.color , borderWidth:1 , borderRadius:15 ,height:"90%", width:"22%" , alignItems:"center"}}>
              <Text >{index + 1}</Text>
              <Text style={{marginLeft:"auto",marginRight:"auto"}}>{a.step}</Text>

            </View>
          )
        }

      </View>

      <View style={styles.borders}></View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  map: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    bottom: 0,
    height: "60%",
    width: "100%",
    flex: 1,
    marginTop: "25%",
    //marginLeft:"5%",
    //marginRight:"auto",borderRadius:15   

  },
  bookedMarker: {
    backgroundColor: "red",
    padding: 5,
    borderRadius: 5
  },
  unBookedMarker: {
    backgroundColor: "green",
    padding: 5,
    borderRadius: 5
  },
  text: {
    color: "white"
  },
  borders:{
    borderColor: "#B0C4DE",
    borderBottomWidth: 2, marginTop:"95%"}
  
});