import React, { useState } from "react";
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
  RefreshControl,
} from "react-native";
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
export default function PersonScreen({ route, navigation }) {
  useStatusBar("dark-content");
  const { width, height } = Dimensions.get("window");
  const [entities, setEntities] = useState([]);
  const [user, setUser] = useState(route.params);
  const [userInfo, setUserInfo] = useState("");
  const [me, setMe] = useState("");
  const [flag, setFlag] = useState(0);
  const [reactions, setReactions] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [isFollowing, setIsFollowing] = useState("");

  const handleUserStateChange = (u) => {
    setUserInfo(u);
    setRefresh(false);
  };

  const handleCloutStateChange = (u) => {
    setUser(u);
    setRefresh(false);
  };

  const handleMeUserStateChange = (u) => setMe(u);

  const handleEntityStateChange = (u) => setEntities(u);

  useEffect(() => {
    const subscriber = firestore
      .collection("users")
      .doc(user.id)
      .onSnapshot((documentSnapshot) => {
        console.log("User data: ", documentSnapshot.data());
        handleUserStateChange(documentSnapshot.data());
        handleEntityStateChange(documentSnapshot.data().entities);
      });
    return () => {
      subscriber();
      firebase.database().ref().child("reactions").child(user.username).off();
      console.log("unmount");
    };
  }, [navigation]);

  useEffect(() => {
    const cloutSubscriber = firestore
      .collection("usernames")
      .doc(user.id)
      .onSnapshot((documentSnapshot) => {
        console.log("Clout data: ", documentSnapshot.data());
        handleCloutStateChange(documentSnapshot.data());
      });
    return () => {
      cloutSubscriber();
      console.log("unmount");
    };
  }, [navigation]);

  useEffect(() => {
    if (me !== "") {
      const meSubscriber = firestore
        .collection("users")
        .doc(me.id)
        .onSnapshot((documentSnapshot) => {
          console.log("Me data: ", documentSnapshot.data());
          handleMeUserStateChange(documentSnapshot.data());
        });
      return () => {
        meSubscriber();
        console.log("unmount");
      };
    }
  }, [navigation]);

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

  const retrieveData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("userInfo");
      setMe(jsonValue != null ? JSON.parse(jsonValue) : null);
      let uid = me.id;
      firestore
        .collection("users")
        .doc(uid)
        .get()
        .then((doc) => {
          setMe(doc.data());
          firestore
            .collection("users")
            .doc(me.id)
            .collection("following")
            .where("id", "==", user.id)
            .get()
            .then((documentSnapshots) => {
              if (documentSnapshots.docs.length > 0) {
                setIsFollowing(true);
              }
              if (documentSnapshots.docs.length === 0) {
                setIsFollowing(false);
              }
            })
            .catch((error) => {
              console.log("Error adding document: ", error);
              setIsFollowing(false);
            });
          console.log("retrieve run2");
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });
      console.log("retrieve run2");
      firestore
        .collection("users")
        .doc(user.id)
        .get()
        .then((doc) => {
          setUserInfo(doc.data());
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });
      console.log("retrieve run2");
    } catch (error) {
      // Error retrieving data
      console.log(error);
    }
  };

  function getReactions() {
    if (
      Object.keys(reactions).length === 0 &&
      reactions.constructor === Object
    ) {
      firebase
        .database()
        .ref()
        .child("reactions")
        .child(userInfo.username)
        .on("value", (snapshot) => {
          console.log(snapshot.val());
          setReactions(snapshot.val());
        });
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
      .child(userInfo.username)
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
        {userInfo.dp === "" ? (
          <Avatar
            size={100}
            rounded
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
              uri: userInfo.dp,
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
  if (me === "" || userInfo === "" || isFollowing === "") {
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
          <Button title="Loading222" />
        </View>
      );
    } else {
      function getFollow() {
        if (isFollowing === true) {
          return (
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
              onPress={() =>
                Alert.alert(
                  "Unfollow ?",
                  "This will remove this account from your following",
                  [
                    {
                      text: "Cancel",
                      style: "cancel",
                    },
                    {
                      text: "Unfollow",
                      style: "destructive",
                      onPress: () => {
                        onUnFollow();
                        setRefresh(true);
                      },
                    },
                  ],
                  { cancelable: false }
                )
              }
            >
              <Text
                style={{
                  alignSelf: "center",
                  color: Default.primary,
                  fontWeight: "bold",
                }}
              >
                Following
              </Text>
            </TouchableOpacity>
          );
        } else {
          return (
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
              onPress={() => {
                onFollow();
                setRefresh(true);
              }}
            >
              <Text
                style={{
                  alignSelf: "center",
                  color: "black",
                  fontWeight: "bold",
                }}
              >
                + Follow
              </Text>
            </TouchableOpacity>
          );
        }
      }
      const onFollow = async () => {
        let followingDocument = {
          id: userInfo.id,
          index: new Date().getTime(),
        };
        let followerDocument = { id: me.id, index: new Date().getTime() };
        const followingRef = firebase
          .firestore()
          .collection("users")
          .doc(me.id)
          .collection("following");
        followingRef
          .add(followingDocument)
          .then((followingRef) => {
            firebase
              .firestore()
              .collection("users")
              .doc(me.id)
              .update({
                followingCount: firebase.firestore.FieldValue.increment(1),
              });
          })
          .catch((error) => {
            console.error("Error adding followingDocument: ", error);
          });
        const followerRef = firebase
          .firestore()
          .collection("users")
          .doc(userInfo.id)
          .collection("follower");
        followerRef
          .add(followerDocument)
          .then((followerRef) => {
            firebase
              .firestore()
              .collection("users")
              .doc(userInfo.id)
              .update({
                followerCount: firebase.firestore.FieldValue.increment(1),
              });
            setFlag(0);
            setMe("");
            retrieveData();
            setRefresh(true);
          })
          .catch((error) => {
            console.error("Error adding followerDocument: ", error);
          });
      };
      const onUnFollow = async () => {
        firebase
          .firestore()
          .collection("users")
          .doc(me.id)
          .collection("following")
          .where("id", "==", userInfo.id)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              console.log(doc.id);
              firebase
                .firestore()
                .collection("users")
                .doc(me.id)
                .collection("following")
                .doc(doc.id)
                .delete()
                .then(() => {
                  console.log("followingDocument successfully deleted!");
                  firebase
                    .firestore()
                    .collection("users")
                    .doc(me.id)
                    .update({
                      followingCount:
                        firebase.firestore.FieldValue.increment(-1),
                    });
                  setMe("");
                  retrieveData();
                })
                .catch((error) => {
                  console.error("Error removing followingDocument: ", error);
                });
            });
          })
          .catch((error) => {
            console.log("Error getting followingDocuments: ", error);
          });

        firebase
          .firestore()
          .collection("users")
          .doc(user.id)
          .collection("follower")
          .where("id", "==", me.id)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              console.log(doc.id);
              firebase
                .firestore()
                .collection("users")
                .doc(userInfo.id)
                .collection("follower")
                .doc(doc.id)
                .delete()
                .then(() => {
                  console.log("followerDocument successfully deleted!");
                  firebase
                    .firestore()
                    .collection("users")
                    .doc(userInfo.id)
                    .update({
                      followerCount:
                        firebase.firestore.FieldValue.increment(-1),
                    });
                  setFlag(0);
                  setRefresh(true);
                })
                .catch((error) => {
                  console.error("Error removing followerDocument: ", error);
                });
            });
          })
          .catch((error) => {
            console.log("Error getting followerDocuments: ", error);
          });
      };
      return (
        <Container style={styles.androidHeader}>
          <Content
            refreshControl={
              <RefreshControl
                refreshing={refresh || !flag}
                onRefresh={() => {
                  retrieveData();
                  setEntities([]);
                  setFlag(0);
                  setRefresh(false);
                  setMe("");
                  setIsFollowing("");
                }}
              />
            }
          >
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
                              (10 * Math.log10(user.clout) + Number.EPSILON) *
                                100
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
                <Text
                  style={{ fontSize: 15, paddingTop: 10, color: "#99AAAB" }}
                >
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
            {/* ----------------------------------FOLLOW-UNFOLLOW----------------------------- */}
            <View>{userInfo.id !== me.id ? getFollow() : <View />}</View>
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
                    {entities.length} Curations
                  </Text>
                </View>

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
            </View>
          </Content>
        </Container>
      );
    }
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
