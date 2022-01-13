import React, { useState, useEffect } from "react";
import * as firebase from "firebase";
import "@firebase/firestore";
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  Alert,
} from "react-native";
import { Button, Card, ListItem, Icon } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firebaseConfig from "../components/Firebase/firebaseConfig";
// Initialize Firebase App

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
export default function Entity({ entity, uid }) {
  const [entityData, setEntityData] = useState();
  const [entityNameData, setEntityNameData] = useState();
  const [deleteEntity, setDeleteEntity] = useState(0);
  const { width, height } = Dimensions.get("window");
  const entityRef = firebase.firestore().collection("entities");
  const userRef = firebase.firestore().collection("users").doc(uid);
  useEffect(() => {
    const subscriber = entityRef.doc(entity).onSnapshot((documentSnapshot) => {
      console.log("Entity data: ", documentSnapshot.data());
      setEntityData(documentSnapshot.data());
    });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, []);
  useEffect(() => {
    const subscriber = firebase
      .firestore()
      .collection("entitynames")
      .doc(entity)
      .onSnapshot((documentSnapshot) => {
        console.log("Entity data: ", documentSnapshot.data());
        setEntityNameData(documentSnapshot.data());
      });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, []);

  const storeData = async (data) => {
    try {
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem("userInfo", jsonValue);
      console.log("send run");
    } catch (error) {
      console.log(error);
    }
  };
  const _onDelete = () => {
    userRef.set(
      {
        entities: firebase.firestore.FieldValue.arrayRemove(entity),
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

    entityRef
      .doc(entity)
      .get()
      .then((doc) => {
        if (doc.exists) {
          console.log("Am I being called many times?");
          if (doc.data().curators === 1) {
            setDeleteEntity(1);
          }
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.error("Error getting document:", error);
      });
  };

  if (deleteEntity) {
    firebase
      .firestore()
      .collection("entities")
      .doc(entity)
      .delete()
      .then(() => {
        console.log("Document successfully deleted!");
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  }

  //   if (!entityData) {
  //     entityRef
  //       .doc(entity)
  //       .get()
  //       .then((doc) => {
  //         if (doc.exists) {
  //           console.log("Am I being called many times?");
  //           setEntityData(doc.data());
  //         } else {
  //           // doc.data() will be undefined in this case
  //           console.log("No such document!");
  //         }
  //       })
  //       .catch((error) => {
  //         console.error("Error getting document:", error);
  //       });
  //   }

  if (!entityData || !entityNameData) {
    return (
      <View
        style={{
          width: width - 30,
          height: 460,
          justifyContent: "center",
          alignItems: "center",
        }}
      ></View>
    );
  } else {
    const list = [
      {
        title: "Curators: ",
        icon: "paperclip",
        value: entityNameData.curators,
      },
    ];
    return (
      <View
        style={{
          width: width,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card containerStyle={{ width: width - 30, height: 540 }}>
          {/* <ImageBackground
            source={{ uri: entityData.background }}
            style={{
              width: width - 60,
              height: 400,
              marginTop: 20,
              marginLeft: 0,
            }}
          > */}
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
            <Text
              style={{
                width: width - 60,
                margin: 12,
                textAlign: "center",
                fontSize: entityData.entityFont,
                color: entityData.entityColor,
              }}
            >
              {entityData.text}
            </Text>
          </View>

          <View>
            {list.map((item, i) => (
              <ListItem key={i}>
                <Icon name={item.icon} type="evilicon" />
                <ListItem.Content>
                  <ListItem.Title>
                    {item.title}
                    {item.value}
                  </ListItem.Title>
                </ListItem.Content>
              </ListItem>
            ))}
          </View>
        </Card>

        <Button
          containerStyle={{
            alignSelf: "center",
            marginTop: 50,
            backgroundColor: "red",
          }}
          onPress={() =>
            Alert.alert(
              "Note",
              "Even if the card is deleted, it will remain as long as someone is curating it. Hit Refresh to see changes",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                { text: "OK", onPress: () => _onDelete() },
              ],
              { cancelable: false }
            )
          }
          title="Claim Clout"
        />
        <Text>
          {"\n"}
          {"\n"}
        </Text>
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
});
