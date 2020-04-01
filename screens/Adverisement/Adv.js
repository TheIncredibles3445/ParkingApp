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

    return (
        <View>

            <Text>Details</Text>

            <Text>{adv.title}</Text>
            {adv.adStatus === "Pending" && adv.handledBy === "" ? <Button title="Handle" onPress={() => handleAdv()} /> : null}
            {adv.adStatus === "Pending" && adv.handledBy === firebase.auth().currentUser.uid && offers.length > 0 ?
                <View>
                    {offers.map((o, index) =>
                        <Text>{index + 1}) {o.startDate} {o.endDate} {o.offeredAmount} {o.date}</Text>
                    )}

                    {
                        offers[offers.length - 1].feedback ?
                            <View>
                                <Button title="Approve" onPress={() => handleStatus("Approved")} />
                                <Button title="Decline" onPress={() => handleStatus("Declined")} />
                            </View> :
                            <View>
                                <TextInput
                                    value={feedback}
                                    onChangeText={(text) => setFeedBack(text)}
                                />
                                <Button title="Send Feedback" onPress={() => sendFeedback()} disabled={!feedback} />
                                <Button title="Approve" onPress={() => handleStatus("Approved")} disabled={!feedback} />
                                <Button title="Decline" onPress={() => handleStatus("Declined")} disabled={!feedback} />
                            </View>
                    }

                </View>
                : null}
        </View>
    )
}