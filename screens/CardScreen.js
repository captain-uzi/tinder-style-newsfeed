import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Dimensions,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import useStatusBar from "../hooks/useStatusBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firestore } from "../components/Firebase/firebase";
import { Button } from "react-native-elements";

import Entity from "../components/Entity";

export default function CardScreen() {
  useStatusBar("dark-content");

  const [entities, setEntities] = useState([]);
  const [userInfo, setUserInfo] = useState("");
  const [flag, setFlag] = useState(0);

  useEffect(() => {
    if (userInfo != "") {
      const subscriber = firestore
        .collection("users")
        .doc(userInfo.id)
        .onSnapshot((documentSnapshot) => {
          console.log("User data: ", documentSnapshot.data());
          setUserInfo(documentSnapshot.data());
        });

      // Stop listening for updates when no longer required
      return () => subscriber();
    }
  }, []);

  const retrieveData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("userInfo");
      setUserInfo(jsonValue != null ? JSON.parse(jsonValue) : null);
      console.log("retrieve run");
    } catch (error) {
      // Error retrieving data
      console.log(error);
    }
  };

  if (userInfo === "") {
    retrieveData();
    return (
      <View style={styles.container}>
        <Button title="Loading" />
      </View>
    );
  } else {
    if (!flag) {
      setEntities(userInfo.entities);
      setFlag(1);
      return (
        <View style={styles.container}>
          <Button title="Loading" />
        </View>
      );
    } else {
      return (
        // <ScrollView
        //   contentContainerStyle={{
        //     // position: "absolute",
        //     // top: 20,
        //     // left: 0,
        //     // right: 0,
        //     justifyContent: "flex-start",
        //     alignItems: "center",
        //   }}
        // refreshControl={
        //   <RefreshControl
        //     refreshing={!flag}
        //     onRefresh={() => {
        //       setEntities([]);
        //       setFlag(0);
        //       setUserInfo("");
        //     }}
        //   />
        // }
        // >
        <View style={styles.container}>
          <Text style={styles.titleText}>
            {">"}Spill the Tea! {"\n"}
            {">"}Snatch it from someone else while it's still Hot!
          </Text>
          <Text style={styles.bioText}>
            You have used {entities.length} out of 5 Card Slots!
          </Text>

          <Button
            title="Refresh"
            raised="true"
            onPress={() => {
              setEntities([]);
              setFlag(0);
              setUserInfo("");
            }}
            containerStyle={{
              alignSelf: "center",
              marginTop: 20,
              marginBottom: 20,
              backgroundColor: "grey",
            }}
          />

          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            pagingEnabled={true}
          >
            {entities.map((entity) => (
              <View key={entity}>
                <Entity entity={entity} uid={userInfo.id} />
              </View>
            ))}
          </ScrollView>
        </View>
        // </ScrollView>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleText: {
    fontSize: 20,
    marginTop: 5,
    textAlign: "left",
    color: "green",
  },
  bioText: {
    fontSize: 20,
    marginTop: 5,
    color: "red",
    fontWeight: "normal",
  },
});
