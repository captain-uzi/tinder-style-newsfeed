import React, { useState } from "react";
import {
  View,
  ScrollView,
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  Platform,
  Dimensions,
  StatusBar,
  SafeAreaView,
  ImageBackground,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  RefreshControl,
  Keyboard,
} from "react-native";
import MaskedView from "@react-native-community/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { Button, Avatar, ListItem } from "react-native-elements";
import TouchableScale from "react-native-touchable-scale";
import {
  Container,
  Left,
  Right,
  Header,
  Content,
  Thumbnail,
  Item,
  Input,
  Icon,
  Tab,
  Tabs,
  TabHeading,
} from "native-base";
import useStatusBar from "../hooks/useStatusBar";
import { useEffect } from "react";
import Default from "../utils/colors";
import Entity from "../components/Entity";
import * as firebase from "firebase";
import "@firebase/firestore";
import firebaseConfig from "../components/Firebase/firebaseConfig";
// Initialize Firebase App

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
export default function FollowingScreen({ route, navigation }) {
  useStatusBar("dark-content");
  const [userInfo, setUserInfo] = useState(route.params.info);
  const [peopleList, setPeopleList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadMore, setLoadMore] = useState(false);
  const [done, setDone] = useState(false);
  const [lastVisible, setLastVisible] = useState("");
  const page = route.params.page;
  function getPeopleList() {
    let userRef = {};
    if (page === "Followers") {
      userRef[page] = firebase
        .firestore()
        .collection("users")
        .doc(userInfo.id)
        .collection("follower");
    }
    if (page === "Following") {
      userRef[page] = firebase
        .firestore()
        .collection("users")
        .doc(userInfo.id)
        .collection("following");
    }
    if (loadMore === true && peopleList.length !== 0) {
      console.log("inside");
      userRef[page]
        .orderBy("index", "desc")
        .startAfter(lastVisible)
        .limit(10)
        .get()
        .then((documentSnapshots) => {
          // Get the last visible document
          setLastVisible(
            documentSnapshots.docs[documentSnapshots.docs.length - 1]
          );
          // console.log("last", lastVisible);

          // Construct a new query starting at this document,
          // get the next 25 cities.
          // var next = userRef
          //         .orderBy("clout")
          //         .startAfter(lastVisible)
          //         .limit(10);
          let idList = [];
          documentSnapshots.forEach((doc) => {
            idList.push(doc.data().id);
          });
          if (idList.length < 10) {
            setDone(true);
          }
          firebase
            .firestore()
            .collection("usernames")
            .where("id", "in", idList)
            .get()
            .then((querySnapshot) => {
              let tempList = peopleList;
              querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.data().name);

                // doc.data() is never undefined for query doc snapshots
                let temp = doc.data();
                temp["colors"] = [
                  "#00FF33", //green
                  "#0085FF", //blue
                  "#FFFB00",
                  "black",
                  "black",
                ];

                tempList.push(temp);
              });

              setPeopleList(tempList);
              setLoadMore(false);
            })
            .catch((error) => {
              console.log("Error getting documents: ", error);
            });
        })
        .catch((error) => {
          console.log("Error getting documents2: ", error);
        });
    }
    if (loading === true && peopleList.length === 0) {
      console.log("inside");
      userRef[page]
        .orderBy("index", "desc")
        .limit(10)
        .get()
        .then((documentSnapshots) => {
          // Get the last visible document
          setLastVisible(
            documentSnapshots.docs[documentSnapshots.docs.length - 1]
          );
          // console.log("last", lastVisible);

          // Construct a new query starting at this document,
          // get the next 25 cities.
          // var next = userRef
          //         .orderBy("clout")
          //         .startAfter(lastVisible)
          //         .limit(10);
          let idList = [];
          documentSnapshots.forEach((doc) => {
            idList.push(doc.data().id);
          });
          firebase
            .firestore()
            .collection("usernames")
            .where("id", "in", idList)
            .get()
            .then((querySnapshot) => {
              let tempList = [];
              querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.data().name);

                // doc.data() is never undefined for query doc snapshots
                let temp = doc.data();
                temp["colors"] = [
                  "#00FF33", //green
                  "#0085FF", //blue
                  "#FFFB00",
                  "black",
                  "black",
                ];

                tempList.push(temp);
              });
              if (tempList.length < 10) {
                setDone(true);
              }
              setPeopleList(tempList);
              setLoading(false);
            })
            .catch((error) => {
              console.log("Error getting documents: ", error);
            });
        })
        .catch((error) => {
          console.log("Error getting documents2: ", error);
        });
    }
    if (peopleList.length != 0) {
      return (
        <View>
          {peopleList.map((l, i) => (
            <ListItem
              containerStyle={{
                alignSelf: "center",
                width: "90%",
                height: 120,
                borderRadius: 10,
                marginVertical: 10,
                backgroundColor: "black",
              }}
              key={i}
              onPress={() => navigation.push("Person", l)}
              Component={TouchableScale}
              friction={90} //
              tension={100} // These props are passed to the parent component (here TouchableScale)
              activeScale={0.95} //
              // linearGradientProps={{
              //   colors: [getColors(l)],
              //   start: { x: 1, y: 0 },
              //   end: { x: 0.2, y: 0 },
              // }}
              // ViewComponent={LinearGradient} // Only if no expo
              bottomDivider
            >
              {l.dp === "" ? (
                <Avatar
                  rounded
                  large
                  icon={{
                    name: "user",
                    type: "font-awesome",
                  }}
                />
              ) : (
                <Avatar
                  rounded
                  large
                  source={{
                    uri: l.dp,
                  }}
                />
              )}

              <MaskedView
                style={{ flex: 1, flexDirection: "row", height: "100%" }}
                maskElement={
                  <View
                    style={{
                      // Transparent background because mask is based off alpha channel.
                      backgroundColor: "transparent",
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        fontSize: 18,
                      }}
                    >
                      {l.name}
                    </Text>
                    <Text
                      style={{
                        color: "#99AAAB",
                        fontSize: 15,
                      }}
                    >
                      {l.mentions} Mentions with Clout {l.clout}
                    </Text>
                  </View>
                }
              >
                <LinearGradient
                  colors={getColors(l)}
                  start={{ x: 1, y: 0 }}
                  end={{ x: 0, y: 0 }}
                  style={{ flex: 1 }}
                />
              </MaskedView>
              <ListItem.Chevron color="#99AAAB" />
            </ListItem>
          ))}
        </View>
      );
    }
    return <View />;
  }

  function getColors(l) {
    let reactionColors = [
      "#00FF33", //green
      "#0085FF", //blue
      "#FFFB00",
    ];
    firebase
      .database()
      .ref()
      .child("reactions")
      .child(l.username)
      .orderByValue()
      .limitToLast(3)
      .on("value", (snapshot) => {
        const data = Object.keys(snapshot.val());

        data.map((d, j) => {
          switch (d) {
            case "afraid":
              reactionColors[j] = Default.afraid; //black

              break;
            case "sad":
              reactionColors[j] = Default.sad; //grey

              break;
            case "angry":
              reactionColors[j] = Default.angry; //red

              break;
            case "wow":
              reactionColors[j] = Default.wow; //yellow

              break;
            case "happy":
              reactionColors[j] = Default.happy; //blue

              break;
            case "love":
              reactionColors[j] = Default.love; //green

              break;

            default:
              break;
          }
        });
      });
    // if (success) {
    //   firebase
    //     .database()
    //     .ref()
    //     .child("reactions")
    //     .child(l.id)
    //     .orderByValue()
    //     .limitToLast(3)
    //     .off();
    // }

    return reactionColors;
  }
  if (
    (page === "Followers" && userInfo.followerCount > 0) ||
    (page === "Following" && userInfo.followingCount > 0)
  ) {
    return (
      <Container
        style={{
          ...Platform.select({
            android: {
              marginTop: StatusBar.currentHeight,
            },
          }),
          backgroundColor: "white",
          flex: 1,
        }}
      >
        {/* <MyStatusBar backgroundColor="#444444" barStyle="light-content" /> */}
        <Content
          refreshControl={
            <RefreshControl
              refreshing={loadMore || loading || peopleList.length === 0}
              onRefresh={() => {
                setPeopleList([]);
                setDone(false);
                setLoading(true);
              }}
            />
          }
        >
          {getPeopleList()}
        </Content>
      </Container>
    );
  } else {
    return <View />;
  }
}
