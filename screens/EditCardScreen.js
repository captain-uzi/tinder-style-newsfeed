import React, { useState } from "react";
import * as firebase from "firebase";
import Colors from "../utils/colors";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Dimensions,
  TextInput,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import useStatusBar from "../hooks/useStatusBar";
import { logout } from "../components/Firebase/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import ProfilePic from "../components/ProfilePic";
import "@firebase/firestore";
import { storage } from "../components/Firebase/firebase";
import { Image, Card, Button, Avatar, Slider } from "react-native-elements";
// import Modal from "react-native-modal";
import IconButton from "../components/IconButton";
import firebaseConfig from "../components/Firebase/firebaseConfig";

// Initialize Firebase App

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
export default function EditCardScreen({ navigation }) {
  useStatusBar("dark-content");
  const { width, height } = Dimensions.get("window");
  const [entityText, setEntityText] = useState();
  const [heightOfInput, setHeight] = useState(42);
  const [entityColor, setEntityColor] = useState("black");
  const [entityFont, setEntityFont] = useState(20);
  const [background, setBackground] = useState();
  const [backgroundList, setBackgroundList] = useState();
  const [flag, setFlag] = useState(0);
  const [userInfo, setUserInfo] = useState("");

  const storeData = async (data) => {
    try {
      const jsonValue = JSON.stringify(data);
      const value = await AsyncStorage.setItem("userInfo", jsonValue);
      console.log("send run", value);
      console.log("I come after");

      navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  };

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

  const getBackgroundList = async () => {
    const imageRefs = await storage.ref().child("background/").listAll();
    const urls = await Promise.all(
      imageRefs.items.map((ref) => ref.getDownloadURL())
    );
    setBackgroundList(urls);
  };

  const onSave = async () => {
    if (!entityText) {
      Alert.alert(
        "No Content",
        "Empty card cannot be saved",
        [
          {
            text: "OK",
            style: "cancel",
          },
        ],
        { cancelable: false }
      );
    } else {
      const entityData = {
        entityAuthor: userInfo.id,
        entityText: entityText,
        entityColor: entityColor,
        entityFont: entityFont,
        background: background,
        likes: 0,
        curators: 1,
      };
      const entityRef = firebase.firestore().collection("entities");
      let entityId = null;
      entityRef
        .add(entityData)
        .then((docRef) => {
          console.log("Document written with ID: ", docRef.id);
          entityId = docRef.id;
          const userRef = firebase
            .firestore()
            .collection("users")
            .doc(userInfo.id);
          console.log(entityId);
          userRef.set(
            {
              entities: firebase.firestore.FieldValue.arrayUnion(entityId),
            },
            { merge: true }
          );
          userRef
            .get()
            .then((doc) => {
              if (doc.exists) {
                console.log("Document data:", doc.data());
                storeData(doc.data());
              } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
              }
            })
            .catch((error) => {
              console.log("Error getting document:", error);
            });
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });
    }
  };

  // console.log("before ref");
  // backgroundRef
  //   .listAll()
  //   .then((res) => {
  //     res.items.forEach(async (itemRef) => {
  //       itemRef.getDownloadURL().then(
  //         function (url) {
  //           newBackgroundList.push(url);
  //           if (newBackgroundList.length === 10) {
  //             updateNow(newBackgroundList);
  //             console.log(newBackgroundList);
  //           }
  //         },
  //         function (error) {
  //           console.log("Error in getting backgrounds");
  //         }
  //       );
  //     });
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });

  // const showModal = () => setVisible(true);

  // const hideModal = () => setVisible(false);

  if (!backgroundList) {
    if (flag === 0) {
      getBackgroundList();
      setFlag(1);
    }
    if (userInfo === "") {
      retrieveData();
    }
    return (
      <View style={styles.container}>
        <Button title="Loading" />
      </View>
    );
  } else {
    if (!background) {
      setBackground(backgroundList[0]);
    }
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignSelf: "center",
            width: "90%",
            height: 100,
          }}
        >
          <Button
            onPress={() =>
              Alert.alert(
                "Are You Sure?",
                "Progress will not be saved",
                [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  { text: "OK", onPress: () => navigation.goBack() },
                ],
                { cancelable: false }
              )
            }
            containerStyle={{
              alignSelf: "center",
              marginTop: 50,
              backgroundColor: "grey",
            }}
            title="Go back"
          />
          <Button
            onPress={() => onSave()}
            containerStyle={{
              alignSelf: "center",
              marginTop: 50,
              backgroundColor: "green",
            }}
            title="Save"
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            width: "100%",
            height: 30,
            marginTop: 5,
          }}
        >
          <Avatar
            rounded
            size="small"
            overlayContainerStyle={{ backgroundColor: "black" }}
            onPress={() => setEntityColor("black")}
            activeOpacity={0.7}
            containerStyle={{ marginLeft: 20 }}
            avatarStyle={{
              borderWidth: 2,
              borderColor: "black",
            }}
          />
          <Avatar
            rounded
            size="small"
            overlayContainerStyle={{ backgroundColor: "white" }}
            onPress={() => setEntityColor("white")}
            activeOpacity={0.7}
            containerStyle={{ marginLeft: 20 }}
            avatarStyle={{
              borderWidth: 2,
              borderColor: "black",
            }}
          />
          <Avatar
            rounded
            size="small"
            overlayContainerStyle={{ backgroundColor: "blue" }}
            onPress={() => setEntityColor("blue")}
            activeOpacity={0.7}
            containerStyle={{ marginLeft: 20 }}
            avatarStyle={{
              borderWidth: 2,
              borderColor: "black",
            }}
          />
          <Avatar
            rounded
            size="small"
            overlayContainerStyle={{ backgroundColor: "red" }}
            onPress={() => setEntityColor("red")}
            activeOpacity={0.7}
            containerStyle={{ marginLeft: 20 }}
            avatarStyle={{
              borderWidth: 2,
              borderColor: "black",
            }}
          />
          <Avatar
            rounded
            size="small"
            overlayContainerStyle={{ backgroundColor: "green" }}
            onPress={() => setEntityColor("green")}
            activeOpacity={0.7}
            containerStyle={{ marginLeft: 20 }}
            avatarStyle={{
              borderWidth: 2,
              borderColor: "black",
            }}
          />
        </View>

        <Card containerStyle={{ width: width - 30, height: 430 }}>
          <ImageBackground
            source={{ uri: background }}
            style={{ width: width - 60, height: 400 }}
          >
            <TouchableWithoutFeedback
              onPress={Keyboard.dismiss}
              accessible={false}
            >
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextInput
                  style={{
                    height: heightOfInput,
                    width: width - 60,
                    margin: 12,
                    color: entityColor,
                    fontSize: entityFont,
                  }}
                  onChangeText={(text) => setEntityText(text)}
                  placeholder="Tap to Edit Text"
                  placeholderTextColor={entityColor}
                  multiline={true}
                  textAlign={"center"}
                  numberOfLines={10}
                  value={entityText}
                  autoCorrect={false}
                  onContentSizeChange={(e) =>
                    setHeight(e.nativeEvent.contentSize.height)
                  }
                />
              </View>
            </TouchableWithoutFeedback>
          </ImageBackground>
        </Card>

        <Slider
          value={entityFont}
          maximumValue={50}
          minimumValue={10}
          step={5}
          onValueChange={(value) => setEntityFont(value)}
          allowTouchTrack={true}
          thumbTintColor={entityColor}
          thumbStyle={{
            borderWidth: 2,
            borderColor: "black",
          }}
        />

        <View style={styles.modal}>
          <ScrollView horizontal={true}>
            {backgroundList.map((url) => (
              <View key={url}>
                <Image
                  source={{ uri: url }}
                  style={{ width: 100, height: 100 }}
                  PlaceholderContent={<ActivityIndicator />}
                  onPress={() => setBackground(url)}
                />
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleText: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  bioText: {
    fontSize: 20,
    fontWeight: "normal",
  },
  modal: {
    marginBottom: 0,
    height: 110,
    flex: 0,
    bottom: 0,
    position: "absolute",
    width: "100%",
  },
  backButton: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
});
