import React, { useState, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TextInput,
  Image,
  TouchableOpacity,
  ImageBackground,
  Keyboard,
  Platform,
  ScrollView,
  Alert,
  StatusBar,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import styled from "styled-components";
import calendar from "../utils/calendar";
import TopCurve from "../components/TopCurve";
import CreditCardInput from "../components/CreditCardInput";
import PressFooter from "../components/PressFooter";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import image from "./Themes/Images";
import {
  Container,
  Header,
  Left,
  Right,
  Content,
  Card,
  Tab,
  Tabs,
  Icon,
  TabHeading,
} from "native-base";
import { Button, ListItem, Avatar } from "react-native-elements";
import useStatusBar from "../hooks/useStatusBar";
import SegmentedTextInput, {
  PATTERN_MENTION,
  PATTERN_HASHTAG,
} from "../components/SegmentedTextInput";
import { logout, firestore } from "../components/Firebase/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

const { FOOTER_HEIGHT } = calendar;

export default function ProfileScreen({ navigation }) {
  useStatusBar("dark-content");
  const { width, height } = Dimensions.get("window");
  const [entities, setEntities] = useState([]);
  const [timestamps, setTimestamps] = useState([]);
  const [lastTimestamp, setLastTimestamp] = useState(0);
  const [userInfo, setUserInfo] = useState("");
  const [user, setUser] = useState("");
  const [flag, setFlag] = useState(0);
  const [reactions, setReactions] = useState({});
  const [valid, setValid] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [creditCards, setCreditCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const handleUserStateChange = (u) => {
    setUserInfo(u);
    //setRefresh(false);
  };
  // const handleCloutStateChange = (u) => setUser(u);
  // const handleEntityStateChange = (u) => setEntities(u);
  const ref = useRef();
  const [value, onChange] = useState(["", []]);
  const [_, { length: numberOfSegments }] = value;
  // useEffect(() => {
  //   if (userInfo !== "") {
  //     console.log("1:", userInfo);
  //     const subscriber = firestore
  //       .collection("users")
  //       .doc(userInfo.id)
  //       .onSnapshot((documentSnapshot) => {
  //         console.log("User data: ", documentSnapshot.data());
  //         handleUserStateChange(documentSnapshot.data());
  //         handleEntityStateChange(userInfo.entities);
  //       });
  //     return () => {
  //       subscriber();
  //       console.log("unmount");
  //     };
  //   }
  // }, []);
  // useEffect(() => {
  //   if (userInfo !== "") {
  //     if (userInfo.username !== "") {
  //       console.log("2:", userInfo);
  //       const subscriber = firestore
  //         .collection("usernames")
  //         .doc(userInfo.id)
  //         .onSnapshot((documentSnapshot) => {
  //           console.log("User data: ", documentSnapshot.data());
  //           handleCloutStateChange(documentSnapshot.data());
  //         });
  //       return () => {
  //         subscriber();
  //         console.log("unmount");
  //       };
  //     }
  //   }
  // }, []);
  // const handleReactionsStateChange = (r) => setReactions(r);

  // useEffect(() => {
  //   if (userInfo != "") {
  //     const reactSubscriber = firebase
  //       .database()
  //       .ref()
  //       .child("reactions")
  //       .child(userInfo.id)
  //       .on("value", (snapshot) => {
  //         handleReactionsStateChange(snapshot.val());
  //       });

  //     // Stop listening for updates when no longer required
  //     return () => {
  //       reactSubscriber();
  //       console.log("unmount2");
  //     };
  //   }
  // }, []);

  const afterRetrieveData = async () => {
    let uid = userInfo.id;
    console.log("3:", userInfo);
    firestore
      .collection("users")
      .doc(uid)
      .get()
      .then(async (doc) => {
        setUserInfo(doc.data());
        const creditCards = [];
        setEntities(doc.data().entities);
        setFlag(1);
        console.log(userInfo, "Have I changed");
        if (doc.data().username !== "") {
          console.log("4:", userInfo);
          firestore
            .collection("usernames")
            .doc(doc.data().id)
            .get()
            .then((doc2) => {
              setUser(doc2.data());
              //setRefresh(false);
            })
            .catch((error) => {
              console.error("Error adding document: ", error);
            });
        }
        if (doc.data().entities.length !== 0) {
          setTimestamps(doc.data().timestamps);
          setLastTimestamp(doc.data().lastTimestamp);
          await Promise.all(
            doc.data().timestamps.map(async (obj, index) => {
              let arr = obj.split(" ");
              let doc3 = await firebase
                .firestore()
                .collection("entitynames")
                .doc(arr[0])
                .get();
              //.then(async (doc3) => {
              if (doc3.exists) {
                const entity = doc3.data();
                console.log(
                  "erhgfiuerfgbhreuieruigbeibuiiuuurruguiruuirueurhuieueuihuhueuruirhuhureh",
                  doc3.data()
                );

                let doc2 = await firebase
                  .firestore()
                  .collection("usernames")
                  .doc(doc3.data().author)
                  .get();
                //.then(async (doc2) => {
                if (doc2.exists) {
                  const user = doc2.data();
                  firebase
                    .database()
                    .ref()
                    .child("reactions")
                    .child(entity.id)
                    .orderByValue()
                    .limitToLast(4)
                    .on("value", (snapshot) => {
                      console.log(snapshot.val());
                      const reactions = snapshot.val();
                      let creditCard = {
                        id: index,
                        type: "MASTER",
                        entity: entity,
                        reactions: reactions,
                        user: user,
                        timestamp: arr[1],
                      };
                      creditCards.push(creditCard);
                    });
                } else {
                  // doc2.data() will be undefined in this case
                  console.log("No such document2!");
                }
                // })
                // .catch((error) => {
                //   console.log("Error getting document:", error);
                // });
              } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
              }
              // })
              // .catch((error) => {
              //   console.log("Error getting document:", error);
              // });
            })
          );
          setCreditCards(creditCards);
          setRefresh(false);
        }
        if (doc.data().entities.length === 0) {
          setCreditCards(creditCards);
          setRefresh(false);
        }
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
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

  function noUsername() {
    if (userInfo.username === "") {
      console.log(value.toString());
      const findUsername = async (str) => {
        console.log("str " + str);
        // await new Promise((resolve) => setTimeout(resolve, 2000));
        if (/^@?(\w){5,15}$/.test(str) === true) {
          console.log("if is true");
          let documentSnapshots = await firebase
            .firestore()
            .collection("usernames")
            .where("username", ">=", str)
            .where("username", "<=", str + "\uf8ff")
            .orderBy("username")
            .limit(1)
            .get();
          console.log("inside");
          if (documentSnapshots.docs.length === 0) {
            setValid(true);
            return [];
          } else {
            setValid(false);
            return [];
          }
        } else {
          console.log("inside2");
          setValid(false);
          return [];
        }
      };
      const claimUsername = async () => {
        // await new Promise((resolve) => setTimeout(resolve, 2000));
        try {
          const data = {
            username: value.toString().slice(0, -1),
            id: userInfo.id,
            clout: 0,
            mentions: 0,
            dp: userInfo.dp,
            name: userInfo.name,
          };
          await firebase
            .firestore()
            .collection("usernames")
            .doc(userInfo.id)
            .set(data);
          await firebase
            .firestore()
            .collection("users")
            .doc(userInfo.id)
            .set(
              {
                username: value.toString().slice(0, -1),
              },
              { merge: true }
            );
          console.log("set");
          firebase
            .database()
            .ref("reactions/" + value.toString().slice(0, -1))
            .set({
              love: 0,
              happy: 0,
              wow: 0,
              angry: 0,
              sad: 0,
              afraid: 0,
            });
          setRefresh(true);
          setFlag(0);
          setUserInfo("");
          afterRetrieveData();
        } catch (error) {
          console.log(error);
        }
      };
      const conditionedStatements = () => {
        if (value.toString() === ",") {
          if (valid === true) setValid(false);
        } else if (!value.toString().startsWith("@") && numberOfSegments < 1) {
          if (valid === true) setValid(false);
          return (
            <Text style={{ fontSize: 26, color: "red" }}>
              Username must start with an @
            </Text>
          );
        } else if (
          /^@?(\w){5,15}$/.test(value.toString().slice(0, -1)) === false ||
          (value.toString().slice(0, -1).startsWith("__") &&
            value.toString().slice(0, -1).endsWith("__")) === true
        ) {
          if (valid === true) setValid(false);
          return (
            <Text style={{ fontSize: 26, color: "red" }}>
              Username must be between 5 and 15 characters and contain only
              letters, numbers, and underscores and no spaces.
            </Text>
          );
        } else if (valid === false) {
          return (
            <Text style={{ fontSize: 26, color: "red" }}>
              Username has already been taken :(
            </Text>
          );
        }
        if (valid === true) {
          return (
            <View>
              <Text style={{ fontSize: 26, color: "green" }}>
                Username Valid!!
              </Text>
              <Button
                style={{ marginTop: 25 }}
                title="Claim"
                onPress={claimUsername}
              />
            </View>
          );
        }
      };
      const invalidCondition = (str) => !str.startsWith("@");
      return (
        <SafeAreaView>
          <View style={{ padding: 15 }}>
            <SegmentedTextInput
              multiline
              numberOfLines={2}
              ref={ref}
              value={value}
              max={1}
              // patterns={
              //   /* a twitter @mention */
              //   (["/(^|[^@w])@(w{1,15})\b/"] = () => (
              //     <Text style={[{ fontSize: 28 }, { fontWeight: "bold" }]}>
              //       {value.toString().slice(0, -1)}
              //     </Text>
              //   ))
              // }
              minSuggestionLength={6}
              shouldRenderInvalid={invalidCondition}
              onChange={onChange}
              disabled={numberOfSegments >= 1}
              placeholder="Choose a unique @username to participate"
              onSuggest={findUsername}
            />
            {conditionedStatements()}
            <Button
              style={{ marginTop: 25 }}
              title="Cancel"
              onPress={Keyboard.dismiss}
            />
          </View>
        </SafeAreaView>
      );
    }
  }

  function getReactions() {
    if (
      Object.keys(reactions).length === 0 &&
      reactions.constructor === Object
    ) {
      firebase
        .database()
        .ref()
        .child("reactions")
        .child(user.username)
        .on("value", (snapshot) => {
          console.log(snapshot.val());
          setReactions(snapshot.val());
        });
      // const subscriber = firestore
      //   .collection("users")
      //   .doc(userInfo.id)
      //   .onSnapshot((documentSnapshot) => {
      //     console.log("User data: ", documentSnapshot.data());
      //     handleUserStateChange(documentSnapshot.data());
      //     handleEntityStateChange(userInfo.entities);
      //   });
    } else {
      console.log(reactions);
      return (
        <View
          style={{
            marginVertical: 15,
            marginHorizontal: 20,
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 15, color: "#99AAAB" }}>
            😍 {reactions.love}
          </Text>
          <Text style={{ fontSize: 15, color: "#99AAAB" }}>
            😇 {reactions.happy}
          </Text>
          <Text style={{ fontSize: 15, color: "#99AAAB" }}>
            😝 {reactions.wow}
          </Text>
          <Text style={{ fontSize: 15, color: "#99AAAB" }}>
            😡 {reactions.angry}
          </Text>
          <Text style={{ fontSize: 15, color: "#99AAAB" }}>
            😞 {reactions.sad}
          </Text>
          <Text style={{ fontSize: 15, color: "#99AAAB" }}>
            😱 {reactions.afraid}
          </Text>
        </View>
      );
    }
    return <View />;
  }

  function getDP() {
    let reactionColors = [
      "#00FF33", //green
      "#0085FF", //blue
      "#FFFB00",
    ];
    firebase
      .database()
      .ref()
      .child("reactions")
      .child(user.username)
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
    return (
      <LinearGradient
        colors={reactionColors}
        start={{ x: 0.0, y: 1.0 }}
        end={{ x: 1.0, y: 0.0 }}
        style={{
          height: 110,
          width: 110,
          borderRadius: 55,
          alignItems: "center",
          justifyContent: "center",
          marginHorizontal: 10,
        }}
      >
        {user.dp === "" ? (
          <Avatar
            rounded
            size={100}
            icon={{
              name: "user",
              type: "font-awesome",
            }}
            avatarStyle={{
              height: 100,
              width: 100,
              borderRadius: 50,
              borderWidth: 1,
              borderColor: "white",
            }}
            containerStyle={{
              height: 100,
              width: 100,
              borderRadius: 50,
              marginHorizontal: 10,
            }}
          />
        ) : (
          <Avatar
            rounded
            source={{
              uri: user.dp,
            }}
            avatarStyle={{
              height: 100,
              width: 100,
              borderRadius: 50,
              borderWidth: 1,
              borderColor: "white",
            }}
            containerStyle={{
              height: 100,
              width: 100,
              borderRadius: 50,
              marginHorizontal: 10,
            }}
          />
        )}
      </LinearGradient>
    );
  }
  async function _removeCards(coins, curators, replies, power, replyingTo) {
    await Promise.all(
      selectedCards.map(async (obj, index) => {
        if (curators[obj.entity.id] > 1) {
          await firebase
            .firestore()
            .collection("entitynames")
            .doc(obj.entity.id)
            .set(
              {
                curators: firebase.firestore.FieldValue.increment(-1),
              },
              { merge: true }
            );
          await firebase
            .firestore()
            .collection("locations")
            .doc(obj.entity.city.replace(/[^A-Za-z0-9]/g, ""))
            .set(
              {
                clout: firebase.firestore.FieldValue.increment(
                  1 - 2 * curators[obj.entity.id]
                ),
              },
              { merge: true }
            );
          await firebase
            .firestore()
            .collection("usernames")
            .doc(obj.entity.author)
            .set(
              {
                clout: firebase.firestore.FieldValue.increment(
                  1 - 2 * curators[obj.entity.id]
                ),
              },
              { merge: true }
            );
          if (obj.entity.tag.length !== 0) {
            await firebase
              .firestore()
              .collection("hashtags")
              .doc(obj.entity.tag[0])
              .set(
                {
                  clout: firebase.firestore.FieldValue.increment(
                    1 - 2 * curators[obj.entity.id]
                  ),
                },
                { merge: true }
              );
          }
          if (obj.entity.mentions.length !== 0) {
            obj.entity.mentions.forEach((mention) => {
              firebase
                .firestore()
                .collection("usernames")
                .where("username", "==", mention)
                .get()
                .then((documentSnapshots) => {
                  documentSnapshots.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    firebase
                      .firestore()
                      .collection("usernames")
                      .doc(doc.data().id)
                      .set(
                        {
                          clout: firebase.firestore.FieldValue.increment(
                            1 - 2 * curators[obj.entity.id]
                          ),
                        },
                        { merge: true }
                      );
                  });
                })
                .catch((error) => {
                  console.log("No username ", mention, error);
                });
            });
          }
          let newEntities = entities.filter(
            (entity) => entity !== obj.entity.id
          );
          setEntities(newEntities);

          let newTimestamps = timestamps.filter((ele) => {
            let arr = ele.split(" ");
            return arr[0] !== obj.entity.id;
          });
          setTimestamps(newTimestamps);
          if (lastTimestamp === obj.timestamp) {
            let newLastTimestamp = 0;
            timestamps.forEach((tim) => {
              if (tim > newLastTimestamp) {
                newLastTimestamp = tim;
              }
            });
            setLastTimestamp(newLastTimestamp);
          }
          await firebase.firestore().collection("users").doc(userInfo.id).set(
            {
              coins: coins,
              entities: entities,
              lastTimestamp: lastTimestamp,
              timestamps: timestamps,
            },
            { merge: true }
          );
        } else if (curators[obj.entity.id] === 1) {
          await firebase
            .firestore()
            .collection("locations")
            .doc(obj.entity.city.replace(/[^A-Za-z0-9]/g, ""))
            .get()
            .then((doc) => {
              if (doc.exists) {
                console.log("Am I being called many times?");
                if (doc.data().cards === 1) {
                  await firebase
                    .firestore()
                    .collection("locations")
                    .doc(obj.entity.city.replace(/[^A-Za-z0-9]/g, ""))
                    .delete()
                    .then(() => {
                      console.log("Document successfully deleted!");
                    })
                    .catch((error) => {
                      console.error("Error removing document: ", error);
                    });
                } else {
                  await firebase
                    .firestore()
                    .collection("locations")
                    .doc(obj.entity.city.replace(/[^A-Za-z0-9]/g, ""))
                    .set(
                      {
                        cards: firebase.firestore.FieldValue.increment(
                          1 - 2 * curators[obj.entity.id]
                        ),
                        clout: firebase.firestore.FieldValue.increment(
                          1 - 2 * curators[obj.entity.id]
                        ),
                      },
                      { merge: true }
                    );
                }
              } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
              }
            })
            .catch((error) => {
              console.error("Error getting document:", error);
            });

          await firebase
            .firestore()
            .collection("usernames")
            .doc(obj.entity.author)
            .set(
              {
                mentions: firebase.firestore.FieldValue.increment(
                  1 - 2 * curators[obj.entity.id]
                ),
                clout: firebase.firestore.FieldValue.increment(
                  1 - 2 * curators[obj.entity.id]
                ),
              },
              { merge: true }
            );
          if (obj.entity.tag.length !== 0) {
            await firebase
              .firestore()
              .collection("hashtags")
              .doc(obj.entity.tag[0])
              .get()
              .then((doc) => {
                if (doc.exists) {
                  console.log("Am I being called many times?");
                  if (doc.data().cards === 1) {
                    await firebase
                      .firestore()
                      .collection("hashtags")
                      .doc(obj.entity.tag[0])
                      .delete()
                      .then(() => {
                        console.log("Document successfully deleted!");
                      })
                      .catch((error) => {
                        console.error("Error removing document: ", error);
                      });
                  } else {
                    await firebase
                      .firestore()
                      .collection("hashtags")
                      .doc(obj.entity.tag[0])
                      .set(
                        {
                          cards: firebase.firestore.FieldValue.increment(
                            1 - 2 * curators[obj.entity.id]
                          ),
                          clout: firebase.firestore.FieldValue.increment(
                            1 - 2 * curators[obj.entity.id]
                          ),
                        },
                        { merge: true }
                      );
                  }
                } else {
                  // doc.data() will be undefined in this case
                  console.log("No such document!");
                }
              })
              .catch((error) => {
                console.error("Error getting document:", error);
              });
          }
          if (obj.entity.mentions.length !== 0) {
            obj.entity.mentions.forEach((mention) => {
              firebase
                .firestore()
                .collection("usernames")
                .where("username", "==", mention)
                .get()
                .then((documentSnapshots) => {
                  documentSnapshots.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    firebase
                      .firestore()
                      .collection("usernames")
                      .doc(doc.data().id)
                      .set(
                        {
                          mentions: firebase.firestore.FieldValue.increment(
                            1 - 2 * curators[obj.entity.id]
                          ),
                          clout: firebase.firestore.FieldValue.increment(
                            1 - 2 * curators[obj.entity.id]
                          ),
                        },
                        { merge: true }
                      );
                  });
                })
                .catch((error) => {
                  console.log("No username ", mention, error);
                });
            });
          }
          let newEntities = entities.filter(
            (entity) => entity !== obj.entity.id
          );
          setEntities(newEntities);

          let newTimestamps = timestamps.filter((ele) => {
            let arr = ele.split(" ");
            return arr[0] !== obj.entity.id;
          });
          setTimestamps(newTimestamps);
          if (lastTimestamp === obj.timestamp) {
            let newLastTimestamp = 0;
            timestamps.forEach((tim) => {
              if (tim > newLastTimestamp) {
                newLastTimestamp = tim;
              }
            });
            setLastTimestamp(newLastTimestamp);
          }
          await firebase.firestore().collection("users").doc(userInfo.id).set(
            {
              coins: coins,
              entities: entities,
              lastTimestamp: lastTimestamp,
              timestamps: timestamps,
            },
            { merge: true }
          );
          if (replies[obj.entity.id] === 0) {
            // if (power[obj.entity.id] !== []) {
            //   await Promise.all(
            //     power[obj.entity.id].map(async (ele, index) => {
            //       await firebase
            //         .firestore()
            //         .collection("entitynames")
            //         .doc(ele)
            //         .delete()
            //         .then(() => {
            //           console.log("Document successfully deleted!");
            //         })
            //         .catch((error) => {
            //           console.error("Error removing document: ", error);
            //         });
            //     })
            //   );
            // } else
            //if (replyingTo[obj.entity.id] !== []) {
            // await firebase
            //   .firestore()
            //   .collection("entitynames")
            //   .doc(replyingTo[obj.entity.id][0])
            //   .get()
            //   .then((doc) => {
            //     if (doc.exists) {
            //       console.log("Am I being called many times?");
            //       if (
            //         doc.data().numberOfReplies === 2 &&
            //         doc.data().curators === 0
            //       ) {
            //         let initialPower = doc.data().power;
            //         let finalPower = initialPower.push(
            //           replyingTo[obj.entity.id][0]
            //         );
            //         await firebase
            //           .firestore()
            //           .collection("entitynames")
            //           .where(
            //             "replyingTo",
            //             "array-contains",
            //             replyingTo[obj.entity.id][0]
            //           )
            //           .get()
            //           .then((documentSnapshots) => {
            //             documentSnapshots.forEach((doc) => {
            //               // doc.data() is never undefined for query doc snapshots
            //               if (doc.data().id !== obj.entity.id) {
            //                 firebase
            //                   .firestore()
            //                   .collection("usernames")
            //                   .doc(doc.data().id)
            //                   .set(
            //                     {
            //                       power:
            //                         firebase.firestore.FieldValue.arrayUnion(
            //                           finalPower
            //                         ),
            //                     },
            //                     { merge: true }
            //                   );
            //               }
            //             });
            //           })
            //           .catch((error) => {
            //             console.log("No username ", error);
            //           });
            //       }
            //     } else {
            //       // doc.data() will be undefined in this case
            //       console.log("No such document!");
            //     }
            //   })
            //   .catch((error) => {
            //     console.error("Error getting document:", error);
            //   });
            //   await firebase
            //     .firestore()
            //     .collection("entitynames")
            //     .doc(replyingTo[obj.entity.id][0])
            //     .set(
            //       {
            //         numberOfReplies:
            //           firebase.firestore.FieldValue.increment(-1),
            //       },
            //       { merge: true }
            //     );
            // }
            // await firebase
            //   .firestore()
            //   .collection("entitynames")
            //   .doc(obj.entity.id)
            //   .delete()
            //   .then(() => {
            //     console.log("Document successfully deleted!");
            //   })
            //   .catch((error) => {
            //     console.error("Error removing document: ", error);
            //   });
          }
        }
      })
    );
  }
  function _renderRemove() {
    return (
      <View style={{ flexDirection: "row", alignSelf: "flex-end" }}>
        {/* <TouchableOpacity onPress={() => setRefresh(true)}>
          <Text
            style={{
              fontSize: 20,
              alignSelf: "flex-end",
              color: "cyan",
              // marginBottom: 15,
              marginTop: 20,
              marginHorizontal: 15,
            }}
          >
            Reload
          </Text>
        </TouchableOpacity> */}
        {userInfo.entities.length !== 0 ? (
          <TouchableOpacity
            onPress={async () => {
              if (selectedCards.length === 0) {
                Alert.alert(
                  "No Cards Selected",
                  "Select some cards that you want to remove to see how many coins can be claimed from them!",
                  [
                    {
                      text: "OK",
                      style: "cancel",
                    },
                  ],
                  { cancelable: false }
                );
              } else {
                console.log(selectedCards);
                let totalCoins = 0;
                let curators = {};
                let replies = {};
                let power = {};
                let replyingTo = {};
                await Promise.all(
                  selectedCards.map(async (obj, index) => {
                    let doc3 = await firebase
                      .firestore()
                      .collection("entitynames")
                      .doc(obj.entity.id)
                      .get();
                    //.then(async (doc3) => {
                    if (doc3.exists) {
                      totalCoins +=
                        Math.round(
                          (20 * Math.log10(doc3.data().curators) +
                            Number.EPSILON) *
                            100
                        ) / 100;
                      curators[doc3.data().id] = doc3.data().curators;
                      replies[doc3.data().id] = doc3.data().numberOfReplies;
                      power[doc3.data().id] = doc3.data().power;
                      replyingTo[doc3.data().id] = doc3.data().replyingTo;
                    } else {
                      // doc.data() will be undefined in this case
                      console.log("No such document!");
                    }
                  })
                );
                if (selectedCards.length > 1) {
                  Alert.alert(
                    String(selectedCards.length) +
                      " Cards Selected, " +
                      String(Math.round(totalCoins * 100) / 100) +
                      " Coins",
                    "You are going to claim " +
                      String(Math.round(totalCoins * 100) / 100) +
                      " coins on the removal of the selected cards. Press OK to continue.",
                    [
                      {
                        text: "OK",
                        onPress: _removeCards(
                          Math.round(totalCoins * 100) / 100,
                          curators,
                          replies,
                          power,
                          replyingTo
                        ),
                        style: "destructive",
                      },
                      {
                        text: "Cancel",
                        style: "cancel",
                      },
                    ],
                    { cancelable: false }
                  );
                } else if (selectedCards.length === 1) {
                  Alert.alert(
                    String(selectedCards.length) +
                      " Card Selected, " +
                      String(Math.round(totalCoins * 100) / 100) +
                      " Coins",
                    "You are going to claim " +
                      String(Math.round(totalCoins * 100) / 100) +
                      " coins on the removal of the selected card. Press OK to continue.",
                    [
                      {
                        text: "OK",
                        onPress: _removeCards(
                          Math.round(totalCoins * 100) / 100,
                          curators
                        ),
                        style: "destructive",
                      },
                      {
                        text: "Cancel",
                        style: "cancel",
                      },
                    ],
                    { cancelable: false }
                  );
                }
              }
            }}
          >
            <Text
              style={{
                fontSize: 20,
                alignSelf: "flex-end",
                color: "red",
                // marginBottom: 15,
                marginTop: 20,
                marginHorizontal: 15,
              }}
            >
              Claim Coins by Removing Cards
            </Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}
      </View>
    );
  }
  function renderContent() {
    if (user === "") {
      return <View>{noUsername()}</View>;
    } else {
      return (
        <View>
          <Card transparent style={{ marginTop: 20 }}>
            <View
              style={{
                flexDirection: "row",
                marginLeft: 10,
                justifyContent: "space-evenly",
              }}
            >
              <View style={{ marginRight: 20, flex: 2 }}>{getDP()}</View>
              <View style={{ flex: 4, justifyContent: "center" }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    alignItems: "flex-end",
                  }}
                >
                  <View>
                    <Text
                      style={{
                        fontSize: 40,
                        fontWeight: "bold",
                        alignSelf: "center",
                      }}
                    >
                      {user.clout === 0
                        ? user.clout
                        : Math.round(
                            (10 * Math.log10(user.clout) + Number.EPSILON) * 100
                          ) / 100}
                    </Text>

                    <Text
                      style={{
                        fontSize: 15,
                        color: "#99AAAB",
                        fontWeight: "bold",
                        alignSelf: "center",
                      }}
                    >
                      dB Clout
                    </Text>
                  </View>
                  <View>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.push("Following", {
                          info: userInfo,
                          page: "Followers",
                        })
                      }
                    >
                      <Text
                        style={{
                          fontSize: 30,
                          fontWeight: "bold",
                          alignSelf: "center",
                        }}
                      >
                        {userInfo.followerCount}
                      </Text>
                      <Text style={{ fontSize: 15, color: "#99AAAB" }}>
                        Followers
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.push("Following", {
                          info: userInfo,
                          page: "Following",
                        })
                      }
                    >
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: "bold",
                          alignSelf: "center",
                        }}
                      >
                        {userInfo.followingCount}
                      </Text>
                      <Text style={{ fontSize: 15, color: "#99AAAB" }}>
                        Following
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </Card>
          {/* ----------------------------------NAME AND BIO------------------------ */}
          <Card transparent>
            <View style={{ marginHorizontal: 20 }}>
              <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                {user.name}
              </Text>
              <Text style={{ fontSize: 15, paddingTop: 10, color: "black" }}>
                {user.username}
              </Text>
              <Text style={{ fontSize: 15, paddingTop: 10, color: "#99AAAB" }}>
                <Text style={{ fontWeight: "bold", color: "black" }}>
                  🗣 {user.mentions}
                </Text>{" "}
                Mentions
              </Text>
              <Text style={{ fontSize: 15, paddingTop: 10, color: "#99AAAB" }}>
                <Text style={{ fontWeight: "bold", color: "black" }}>
                  🏦 {userInfo.coins}
                </Text>{" "}
                CloutCoins
              </Text>
              {userInfo.bio !== "" ? (
                <Text style={{ fontSize: 15, paddingTop: 10 }}>
                  💁 {userInfo.bio}
                </Text>
              ) : (
                <View />
              )}
              {userInfo.website !== "" ? (
                <Text style={{ fontSize: 15, paddingTop: 10 }}>
                  🌐 {userInfo.website}
                </Text>
              ) : (
                <View />
              )}
            </View>
          </Card>
          {/* ----------------------------------EDIT PROFILE----------------------------- */}
          <View>
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderRadius: 6,
                borderColor: "#99AAAB",
                justifyContent: "center",
                marginHorizontal: 15,
                marginTop: 20,
                paddingVertical: 5,
              }}
              onPress={() => navigation.navigate("EditProfile")}
            >
              <Text
                style={{
                  alignSelf: "center",
                  color: "black",
                  fontWeight: "bold",
                }}
              >
                Edit Profile
              </Text>
            </TouchableOpacity>
          </View>
          {/* ------------------------------HIGHLIGHTS------------------------- */}
          {getReactions()}
          {/* ------------------------------CARD-SLOTS------------------------- */}
          <View>
            <View
              style={{
                marginTop: 0,
                flex: 1,
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <View style={styles.tabView}>
                <Text style={styles.tabText}>
                  {entities.length} out of 5 Curation Slots Used
                </Text>
              </View>
              {_renderRemove()}
              <Container2>
                <CardsList horizontal showsHorizontalScrollIndicator={false}>
                  {/* <CreditCardInput onAddCard={() => true} /> */}
                  {console.log("fbhuef", creditCards)}
                  {creditCards.map((card) => (
                    <CreditCardInput
                      key={card.id}
                      card={card}
                      primary={card.type === "VISA"}
                      onChangeCard={(card, notselected) => {
                        if (notselected === false) {
                          let arr = selectedCards;
                          arr.push(card);
                          setSelectedCards(arr);
                        }
                        if (notselected === true) {
                          let arr = selectedCards;
                          arr.pop(card);
                          setSelectedCards(arr);
                        }
                      }}
                    />
                  ))}
                </CardsList>
              </Container2>

              {/* <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                pagingEnabled={true}
              >
                {entities.map((entity) => (
                  <View key={entity}>
                    <Entity entity={entity} uid={userInfo.id} />
                  </View>
                ))}
              </ScrollView> */}
            </View>
          </View>
        </View>
      );
    }
  }

  if (userInfo === "") {
    retrieveData();
    return (
      <View style={styles.container}>
        <Button title="Loading" />
      </View>
    );
  } else {
    if (!flag) {
      afterRetrieveData();
      return (
        <View style={styles.container}>
          <Button title="Loading" />
        </View>
      );
    } else {
      return (
        <Container style={styles.androidHeader}>
          <Content
            refreshControl={
              <RefreshControl
                refreshing={refresh || !flag}
                onRefresh={() => {
                  //setUserInfo("");
                  setRefresh(true);
                  setEntities([]);
                  setCreditCards([]);
                  //setFlag(0);
                  setUser("");
                  afterRetrieveData();
                  // setRefresh(false);
                }}
              />
            }
          >
            {renderContent()}
          </Content>
          <TopCurve />
          <FooterBox>
            <PressFooter
              height={FOOTER_HEIGHT}
              label="Add to Favorites"
              onPress={() => {
                list.current.animateNextTransition();
                setOutfits(outfits.filter((outfit) => !outfit.selected));
              }}
            />
          </FooterBox>
        </Container>
      );
    }
  }
}

const FooterBox = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
`;

const Container2 = styled.View`
  ${({ theme: { space } }) => ({
    marginTop: 14,
    marginLeft: 24,
    height: calendar.CDCARD_HEIGHT + 32,
    marginVertical: 100,
  })}
`;

const CardsList = styled.ScrollView``;

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
  tabText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  tabView: {
    width: "100%",
    backgroundColor: "black",
    marginTop: 0,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  androidHeader: {
    ...Platform.select({
      android: {
        marginTop: StatusBar.currentHeight,
      },
    }),
    backgroundColor: "white",
  },
});
