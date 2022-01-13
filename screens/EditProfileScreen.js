import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Alert,
} from "react-native";
import { Button, ListItem, Icon } from "react-native-elements";
import useStatusBar from "../hooks/useStatusBar";
import { logout, firestore } from "../components/Firebase/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import ProfilePic from "../components/ProfilePic";
import Default from "../utils/colors";
export default function EditProfileScreen({ navigation }) {
  useStatusBar("dark-content");
  const { width, height } = Dimensions.get("window");
  const [userInfo, setUserInfo] = useState("");
  const [user, setUser] = useState("");
  const [heightOfInput, setHeight] = useState(42);

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
      let uid = userInfo.id;
      firestore
        .collection("users")
        .doc(uid)
        .get()
        .then((doc) => {
          setUserInfo(doc.data());
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });
      firestore
        .collection("usernames")
        .where("id", "==", userInfo.id)
        .limit(1)
        .get()
        .then((documentSnapshots) => {
          if (documentSnapshots.docs.length > 0) {
            documentSnapshots.forEach((doc) => {
              setUser(doc.data());
              setFlag(1);
            });
          }
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });
      console.log("retrieve run");
    } catch (error) {
      // Error retrieving data
      console.log(error);
    }
  };

  async function handleSignOut() {
    try {
      await logout();
    } catch (error) {
      console.log(error);
    }
  }

  if (userInfo === "") {
    retrieveData();
    return (
      <View style={styles.container}>
        <Button title="Sign Out" onPress={handleSignOut} />
      </View>
    );
  } else {
    const list = [
      {
        title: "Name    ",
        icon: "user",
        value: user.name,
      },
      {
        title: "Bio    ",
        icon: "address-card",
        value: userInfo.bio,
      },
      {
        title: "Website    ",
        icon: "link",
        value: userInfo.website,
      },
    ];
    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            position: "absolute",
            top: 20,
            left: 0,
            right: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={styles.container}>
            <ProfilePic uid={userInfo.id} />
          </View>
          <View style={{ width: "100%", marginTop: 15 }}>
            {list.map((item, i) => (
              <ListItem
                key={i}
                onPress={() => console.log("list")}
                bottomDivider
              >
                <Icon name={item.icon} type="font-awesome-5" />
                <ListItem.Content>
                  <ListItem.Title>
                    {item.title}
                    {item.value}
                  </ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
              </ListItem>
            ))}
          </View>
          <View style={{ width: "100%", marginTop: 15 }}>
            <Button onPress={() => navigation.goBack()} title="Done" />
            <Text>{"\n"}</Text>
          </View>
          <View style={{ width: "100%", marginTop: 15 }}>
            <Button title="Sign Out" onPress={handleSignOut} />
            <Text>
              {"\n"}
              {"\n"}
              {"\n"}
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  bioText: {
    fontSize: 20,
    fontWeight: "normal",
  },
});
