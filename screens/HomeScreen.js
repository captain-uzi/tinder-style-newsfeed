import React, { useEffect, useState, useRef } from "react";
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
  KeyboardAvoidingView,
  TextInput,
  ActivityIndicator,
  FlatList,
} from "react-native";
import CartContainer from "../components/CartContainer";
import CreditCardInputList from "../components/CreditCardInputList";
import CheckOut from "../components/CheckOut";
import nlp from "compromise";
import { firestore } from "../components/Firebase/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinkPreview } from "@flyerhq/react-native-link-preview";
import Modal from "react-native-modalbox";
import Carousel from "react-native-snap-carousel";
import AnimatedLoader from "react-native-animated-loader";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import MapView from "react-native-maps";
import { Marker, Heatmap } from "react-native-maps";
import Default from "../utils/colors";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-community/masked-view";
import { Avatar, ListItem } from "react-native-elements";
import TouchableScale from "react-native-touchable-scale";
import image from "./Themes/Images";
import useStatusBar from "../hooks/useStatusBar";
import SwipeCards from "../components/SwipeCards";
import FlipCard from "react-native-flip-card";
import CombinationButton from "../components/CombinationButton";
import clamp from "clamp";
import {
  Container,
  Left,
  Right,
  Header,
  Input,
  Content,
  Thumbnail,
  Item,
  Icon,
  Button,
  Tab,
  Tabs,
  TabHeading,
  Spinner,
} from "native-base";
import * as firebase from "firebase";
import styled from "styled-components";
import "@firebase/firestore";
import firebaseConfig from "../components/Firebase/firebaseConfig";
import { Alert } from "react-native";
// Initialize Firebase App

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const userRef = firebase.firestore().collection("usernames");
const tagRef = firebase.firestore().collection("hashtags");
const { width, height } = Dimensions.get("window");
const SWIPE_THRESHOLD = 120;
function Entity() {
  return (
    <View style={[styles.card, { backgroundColor: "white" }]}>
      <ImageBackground
        style={{
          width: 260,
          height: 360,
          alignItems: "center",
        }}
        source={{
          uri: "https://api.memegen.link/images/afraid/The_vaccine_guy_ran_away/but_that's_none_of_my_business.png?height=450&width=300",
        }}
      >
        {/* <Avatar
          rounded
          onPress={() => console.log("Press")}
          onLongPress={() => console.log("Long Press")}
          source={{
            uri:
              "https://firebasestorage.googleapis.com/v0/b/uns-app-testing.appspot.com/o/1LPCfxZkIEZWQ5cvYUneeuwMXnH3?alt=media&token=be91ee4c-4efd-4a88-9fe6-60a184cfa39c",
          }}
          avatarStyle={{
            height: 100,
            width: 100,
            borderRadius: 50,
          }}
          containerStyle={{
            height: 100,
            width: 100,
            borderRadius: 50,
            marginTop: -60,
          }}
        /> */}

        {/* <Text
          style={{
            color: "white",
            backgroundColor: "black",
            width: "100%",
            height: 30,
            marginTop: 370,
            marginBottom: 0,
            justifyContent: "center",
            fontSize: 20,
          }}
        >
          Sparkles ✨
        </Text> */}
      </ImageBackground>
    </View>
  );
}

function StatusCard({ text }) {
  return (
    <View>
      <Text style={styles.cardsText}>{text}</Text>
    </View>
  );
}

export default function HomeScreen({ navigation, route }) {
  useStatusBar("light-content");
  const [cards, setCards] = useState([
    { text: "Tomato", backgroundColor: "red" },
    { text: "Aubergine", backgroundColor: "purple" },
    { text: "Courgette", backgroundColor: "green" },
    { text: "Blueberry", backgroundColor: "blue" },
    { text: "Umm...", backgroundColor: "cyan" },
    { text: "orange", backgroundColor: "orange" },
  ]);

  const [search, setSearch] = useState("");
  const [panResetAnime, setPanResetAnime] = useState(null);
  const [inputModal, setInputModal] = useState(false);
  const [address, setAddress] = useState(["", ""]);
  const [myFeed, setMyFeed] = useState(true);
  const [swipeDeck, setSwipeDeck] = useState(true);
  const [trending, setTrending] = useState(false);
  const [location, setLocation] = useState(false);
  const [goBack, setGoBack] = useState(0.725);
  const [suggestionsData, setSuggestionsData] = useState([]);
  const [peopleList, setPeopleList] = useState([]);
  const [trendsList, setTrendsList] = useState([]);
  const [peopleListener, setPeopleListener] = useState(false);
  const [trendsListener, setTrendsListener] = useState(false);
  const [mentionListener, setMentionListener] = useState(true);
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [currLocation, setCurrLocation] = useState(null);
  const [userInfo, setUserInfo] = useState("");
  const [reload, setReload] = useState(false);
  const [creditCards, setCreditCards] = useState([]);
  const [charCount, setCharCount] = useState(140);
  const [mentionsList, setMentionsList] = useState([]);
  const [tagsList, setTagsList] = useState([]);
  const [chirpMedia, setChirpMedia] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [text, setText] = useState("");
  const [choice, setChoice] = useState(0);
  const [chirpPosting, setChirpPosting] = useState(false);
  let currentIndex = {};
  let guid = 0;
  const pan = useRef(new Animated.ValueXY(0)).current;
  const enter = useRef(new Animated.Value(0.5)).current;
  const mapTransition = useRef(new Animated.Value(0)).current;
  const suggestionRowHeight = useRef(new Animated.Value(0)).current;
  const _map = useRef(null);
  const selectedCards = useRef([]);
  // const tapPosition = useRef({
  //   coordinate: {
  //     latitude: 46.93642431399722,
  //     longitude: -90.70079684257507,
  //   },
  //   position: {
  //     x: 119.50010681152344,
  //     y: 331.5001220703125,
  //   },
  //   target: 643,
  // });
  let card = useRef(cards[currentIndex[guid]]).current;
  let lastX = 0;
  let lastY = 0;
  let cardAnimation = null;

  const ref = useRef();

  const items = [
    {
      id: 0,
      colors: [
        "#00FF33", //green
        "#0085FF", //blue
        "#FFFB00", //yellow
      ],
      picture:
        "https://firebasestorage.googleapis.com/v0/b/uns-app-testing.appspot.com/o/1LPCfxZkIEZWQ5cvYUneeuwMXnH3?alt=media&token=be91ee4c-4efd-4a88-9fe6-60a184cfa39c",
      //colors: ["lime","cobalt",],
      author: "Uzair Sayed",
    },
    {
      id: 1,
      colors: [
        "#00FF33", //green

        "#FFFFFF", //grey
        "#000000",
      ],
      picture:
        "https://firebasestorage.googleapis.com/v0/b/uns-app-testing.appspot.com/o/1LPCfxZkIEZWQ5cvYUneeuwMXnH3?alt=media&token=be91ee4c-4efd-4a88-9fe6-60a184cfa39c",
      author: "Uzair Sayed",
    },
    {
      id: 2,
      colors: [
        "#00FF33", //green
        "#0085FF", //blue

        "#000000",
      ],
      picture:
        "https://firebasestorage.googleapis.com/v0/b/uns-app-testing.appspot.com/o/1LPCfxZkIEZWQ5cvYUneeuwMXnH3?alt=media&token=be91ee4c-4efd-4a88-9fe6-60a184cfa39c",
      author: "Uzair Sayed",
    },
    {
      id: 3,
      colors: [
        "#00FF33", //green

        "#FFFB00", //yellow

        "#FFFFFF", //grey
      ],
      picture:
        "https://firebasestorage.googleapis.com/v0/b/uns-app-testing.appspot.com/o/1LPCfxZkIEZWQ5cvYUneeuwMXnH3?alt=media&token=be91ee4c-4efd-4a88-9fe6-60a184cfa39c",
      author: "Uzair Sayed",
    },
    {
      id: 4,
      colors: [
        "#00FF33", //green

        "#FF0000", //red
        "#000000",
      ],
      picture:
        "https://firebasestorage.googleapis.com/v0/b/uns-app-testing.appspot.com/o/1LPCfxZkIEZWQ5cvYUneeuwMXnH3?alt=media&token=be91ee4c-4efd-4a88-9fe6-60a184cfa39c",
      author: "Uzair Sayed",
    },
    {
      id: 5,
      colors: [
        "#00FF33", //green
        "#0085FF", //blue
        "#000000",
      ],
      picture:
        "https://firebasestorage.googleapis.com/v0/b/uns-app-testing.appspot.com/o/1LPCfxZkIEZWQ5cvYUneeuwMXnH3?alt=media&token=be91ee4c-4efd-4a88-9fe6-60a184cfa39c",
      author: "Uzair Sayed",
    },
    {
      id: 6,
      colors: [
        "#00FF33", //green
        "#FFFFFF", //grey
        "#000000",
      ],
      picture:
        "https://firebasestorage.googleapis.com/v0/b/uns-app-testing.appspot.com/o/1LPCfxZkIEZWQ5cvYUneeuwMXnH3?alt=media&token=be91ee4c-4efd-4a88-9fe6-60a184cfa39c",
      author: "Uzair Sayed",
    },
    {
      id: 7,
      colors: [
        "#00FF33", //green
        "#0085FF", //blue

        "#FFFFFF", //grey
      ],
      picture:
        "https://firebasestorage.googleapis.com/v0/b/uns-app-testing.appspot.com/o/1LPCfxZkIEZWQ5cvYUneeuwMXnH3?alt=media&token=be91ee4c-4efd-4a88-9fe6-60a184cfa39c",
      author: "Uzair Sayed",
    },
    {
      id: 8,
      colors: [
        "#00FF33", //green

        "#FF0000", //red
        "#FFFFFF", //grey
      ],
      picture:
        "https://firebasestorage.googleapis.com/v0/b/uns-app-testing.appspot.com/o/1LPCfxZkIEZWQ5cvYUneeuwMXnH3?alt=media&token=be91ee4c-4efd-4a88-9fe6-60a184cfa39c",
      author: "Uzair Sayed",
    },
    {
      id: 9,
      colors: [
        "#00FF33", //green
        "#0085FF", //blue

        "#000000",
      ],
      picture:
        "https://firebasestorage.googleapis.com/v0/b/uns-app-testing.appspot.com/o/1LPCfxZkIEZWQ5cvYUneeuwMXnH3?alt=media&token=be91ee4c-4efd-4a88-9fe6-60a184cfa39c",
      author: "Uzair Sayed",
    },
    {
      id: 10,
      colors: [
        "#FF0000", //red
        "#FFFFFF", //grey
        "#000000",
      ],
      picture:
        "https://firebasestorage.googleapis.com/v0/b/uns-app-testing.appspot.com/o/1LPCfxZkIEZWQ5cvYUneeuwMXnH3?alt=media&token=be91ee4c-4efd-4a88-9fe6-60a184cfa39c",
      author: "Uzair Sayed",
    },
    {
      id: 11,
      colors: [
        "#00FF33", //green
        "#0085FF", //blue
        "#FFFB00", //yellow
      ],
      picture:
        "https://firebasestorage.googleapis.com/v0/b/uns-app-testing.appspot.com/o/1LPCfxZkIEZWQ5cvYUneeuwMXnH3?alt=media&token=be91ee4c-4efd-4a88-9fe6-60a184cfa39c",
      author: "Uzair Sayed",
    },
    {
      id: 12,
      colors: [
        "#00FF33", //green
        "#0085FF", //blue
        "#000000",
      ],
      picture:
        "https://firebasestorage.googleapis.com/v0/b/uns-app-testing.appspot.com/o/1LPCfxZkIEZWQ5cvYUneeuwMXnH3?alt=media&token=be91ee4c-4efd-4a88-9fe6-60a184cfa39c",
      author: "Uzair Sayed",
    },
  ];

  // replace with real remote data fetching

  useEffect(() => {
    guid += 1;
    if (!currentIndex[guid]) currentIndex[guid] = 0;

    setTimeout(() => {
      setCards([
        { text: "Tomato", backgroundColor: "red" },
        { text: "Aubergine", backgroundColor: "purple" },
        { text: "Courgette", backgroundColor: "green" },
        { text: "Blueberry", backgroundColor: "blue" },
        { text: "Umm...", backgroundColor: "cyan" },
        { text: "orange", backgroundColor: "orange" },
      ]);
    }, 3000);

    _animateEntrance();
  }, []);

  useEffect(() => {
    (async () => {
      // let { status } = await Permissions.askAsync(
      //   Permissions.LOCATION_FOREGROUND
      // );
      // if (status !== "granted") {
      //   setErrorMsg("Permission to access location was denied");
      //   return;
      // }
      // const last = await Location.getLastKnownPositionAsync();
      // if (last) {
      //   setCurrLocation(last);
      //   console.log("are you here");
      // } else {
      // if (currLocation === null) {
      console.log("useefect location update");
      let currloc = await Location.getCurrentPositionAsync({});
      setCurrLocation(currloc);
      // }
      // }
      // }
    })();
  }, []);

  const retrieveData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("userInfo");
      console.log("retrieve run");
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      // Error retrieving data
      console.log(error);
    }
  };
  (async () => {
    if (userInfo === "" || reload === true) {
      let useinf = await retrieveData();
      firebase
        .firestore()
        .collection("users")
        .doc(useinf.id)
        .get()
        .then((doc) => {
          if (doc.exists) {
            setUserInfo(doc.data());
            const creditCards = [];

            if (doc.data().entities.length !== 0) {
              doc.data().timestamps.forEach(async (obj, index) => {
                let arr = obj.split(" ");
                firebase
                  .firestore()
                  .collection("entitynames")
                  .doc(arr[0])
                  .get()
                  .then(async (doc3) => {
                    if (doc3.exists) {
                      const entity = doc3.data();
                      console.log(
                        "erhgfiuerfgbhreuieruigbeibuiiuuurruguiruuirueurhuieueuihuhueuruirhuhureh",
                        doc3.data()
                      );

                      firebase
                        .firestore()
                        .collection("usernames")
                        .doc(doc3.data().author)
                        .get()
                        .then(async (doc2) => {
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
                        })
                        .catch((error) => {
                          console.log("Error getting document:", error);
                        });
                    } else {
                      // doc.data() will be undefined in this case
                      console.log("No such document!");
                    }
                  })
                  .catch((error) => {
                    console.log("Error getting document:", error);
                  });
              });
              setCreditCards(creditCards);
              setReload(false);
            }
            if (doc.data().entities.length === 0) {
              setCreditCards(creditCards);
              setReload(false);
            }
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
    }
  })();

  React.useEffect(() => {
    if (route.params?.data) {
      // data updated, do something with `route.params.data`
      // For example, send the data to the server
      setChirpMedia(route.params.data);
      console.log(route.params.data);
    }
  }, [route.params?.data]);
  function _changeChoice(c) {
    setChoice(c);
    console.log(c);
  }
  // const CheckOut = ({ topHeight }) => {
  //   if (userInfo === "") return <View />;
  //   else {
  //     // const creditCards = [
  //     //   {
  //     //     id: 1,
  //     //     type: "VISA",
  //     //     last4Digits: 5467,
  //     //     expiration: "05/24",
  //     //   },
  //     //   {
  //     //     id: 2,
  //     //     type: "MASTER",
  //     //     last4Digits: 2620,
  //     //     expiration: "05/24",
  //     //   },
  //     //   {
  //     //     id: 3,
  //     //     type: "VISA",
  //     //     last4Digits: 2620,
  //     //     expiration: "05/24",
  //     //   },
  //     // ];
  //     function _renderRemove() {
  //       return (
  //         <View style={{ flexDirection: "row", alignSelf: "flex-end" }}>
  //           <TouchableOpacity onPress={() => setReload(true)}>
  //             <Text
  //               style={{
  //                 fontSize: 20,
  //                 alignSelf: "flex-end",
  //                 color: "cyan",
  //                 // marginBottom: 15,
  //                 marginTop: 20,
  //                 marginHorizontal: 15,
  //               }}
  //             >
  //               Reload
  //             </Text>
  //           </TouchableOpacity>
  //           {userInfo.entities.length !== 0 ? (
  //             <TouchableOpacity
  //               onPress={() => console.log(selectedCards.current)}
  //             >
  //               <Text
  //                 style={{
  //                   fontSize: 20,
  //                   alignSelf: "flex-end",
  //                   color: "red",
  //                   // marginBottom: 15,
  //                   marginTop: 20,
  //                   marginHorizontal: 15,
  //                 }}
  //               >
  //                 Remove
  //               </Text>
  //             </TouchableOpacity>
  //           ) : (
  //             <View />
  //           )}
  //         </View>
  //       );
  //     }
  //     return (
  //       <Container2 {...{ topHeight }}>
  //         {/* {_renderRemove()} */}

  //         {/* {reload === false ? (
  //           <Box>
  //             <CreditCardInputList
  //               cards={creditCards}
  //               changeSelection={(x) => (selectedCards.current = x)}
  //             />
  //             <Wrapper2>
  //               <CombinationButton
  //                 label="Swipe to Pay $201.84"
  //                 onPay={() => true}
  //               />
  //             </Wrapper2>
  //           </Box>
  //         ) : (
  //           <ActivityIndicator />
  //         )} */}
  //         {/* <View
  //           style={{
  //             alignItems: "center",
  //             justifyContent: "space-around",
  //             flexDirection: "row",
  //           }}
  //         >
  //           <TouchableOpacity
  //             onPress={() => {
  //               _forceAngrySwipe();
  //             }}
  //           >
  //             <View
  //               style={{
  //                 width: 50,
  //                 height: 50,
  //                 alignItems: "center",
  //                 justifyContent: "flex-start",
  //               }}
  //             >
  //               <ImageBackground
  //                 style={{
  //                   width: "100%",
  //                   height: undefined,
  //                   aspectRatio: 1,
  //                   position: "absolute",
  //                   bottom: 0,
  //                   right: 0,
  //                 }}
  //                 source={image.angry_eyes}
  //               >
  //                 <Image
  //                   style={{
  //                     width: "100%",
  //                     height: undefined,
  //                     aspectRatio: 1,
  //                     position: "absolute",
  //                     bottom: 0,
  //                     right: 0,
  //                   }}
  //                   source={image.angry_face}
  //                 />
  //               </ImageBackground>
  //             </View>
  //           </TouchableOpacity>
  //           <TouchableOpacity
  //             onPress={() => {
  //               _forceSadSwipe();
  //             }}
  //           >
  //             <View
  //               style={{
  //                 width: 50,
  //                 height: 50,
  //                 alignItems: "center",
  //                 justifyContent: "flex-start",
  //               }}
  //             >
  //               <ImageBackground
  //                 style={{
  //                   width: "100%",
  //                   height: undefined,
  //                   aspectRatio: 1,
  //                   position: "absolute",
  //                   bottom: 5,
  //                   right: 1,
  //                 }}
  //                 source={image.sad_eyes}
  //               >
  //                 <Image
  //                   style={{
  //                     width: "100%",
  //                     height: undefined,
  //                     aspectRatio: 1,
  //                     position: "absolute",
  //                     bottom: 0,
  //                     right: -1,
  //                   }}
  //                   source={image.sad_face}
  //                 />
  //               </ImageBackground>
  //             </View>
  //           </TouchableOpacity>
  //           <TouchableOpacity
  //             onPress={() => {
  //               _forceAfraidSwipe();
  //             }}
  //           >
  //             <View
  //               style={{
  //                 width: 50,
  //                 height: 50,
  //                 alignItems: "center",
  //                 justifyContent: "flex-start",
  //               }}
  //             >
  //               <ImageBackground
  //                 style={{
  //                   width: "100%",
  //                   height: undefined,
  //                   aspectRatio: 1,
  //                   position: "absolute",
  //                   bottom: 5,
  //                   right: 0,
  //                 }}
  //                 source={image.afraid_eyes}
  //               >
  //                 <Image
  //                   style={{
  //                     width: "100%",
  //                     height: undefined,
  //                     aspectRatio: 1,
  //                     position: "absolute",
  //                     bottom: 0,
  //                     right: 0,
  //                   }}
  //                   source={image.afraid_face}
  //                 />
  //               </ImageBackground>
  //             </View>
  //           </TouchableOpacity>
  //           <TouchableOpacity
  //             onPress={() => {
  //               _forceWowSwipe();
  //             }}
  //           >
  //             <View
  //               style={{
  //                 width: 50,
  //                 height: 50,
  //                 alignItems: "center",
  //                 justifyContent: "flex-start",
  //               }}
  //             >
  //               <ImageBackground
  //                 style={{
  //                   width: "100%",
  //                   height: undefined,
  //                   aspectRatio: 1,
  //                   position: "absolute",
  //                   bottom: -4,
  //                   right: -2,
  //                 }}
  //                 source={image.wow_eyes}
  //               >
  //                 <Image
  //                   style={{
  //                     width: "100%",
  //                     height: undefined,
  //                     aspectRatio: 1,
  //                     position: "absolute",
  //                     bottom: 4,
  //                     right: 2,
  //                   }}
  //                   source={image.wow_face}
  //                 />
  //               </ImageBackground>
  //             </View>
  //           </TouchableOpacity>
  //           <TouchableOpacity
  //             onPress={() => {
  //               _forceHappySwipe();
  //             }}
  //           >
  //             <View
  //               style={{
  //                 width: 50,
  //                 height: 50,
  //                 alignItems: "center",
  //                 justifyContent: "flex-start",
  //               }}
  //             >
  //               <ImageBackground
  //                 style={{
  //                   width: "100%",
  //                   height: undefined,
  //                   aspectRatio: 1,
  //                   position: "absolute",
  //                   bottom: 0,
  //                   right: 0,
  //                 }}
  //                 source={image.happy_eyes}
  //               >
  //                 <Image
  //                   style={{
  //                     width: "100%",
  //                     height: undefined,
  //                     aspectRatio: 1,
  //                     position: "absolute",
  //                     bottom: 0,
  //                     right: 0,
  //                   }}
  //                   source={image.happy_face}
  //                 />
  //               </ImageBackground>
  //             </View>
  //           </TouchableOpacity>
  //           <TouchableOpacity
  //             onPress={() => {
  //               _forceLoveSwipe();
  //             }}
  //           >
  //             <View
  //               style={{
  //                 width: 50,
  //                 height: 50,
  //                 alignItems: "center",
  //                 justifyContent: "flex-start",
  //               }}
  //             >
  //               <ImageBackground
  //                 style={{
  //                   width: "100%",
  //                   height: undefined,
  //                   aspectRatio: 1,
  //                   position: "absolute",
  //                   bottom: 0,
  //                   right: 0,
  //                 }}
  //                 source={image.love_eyes}
  //               >
  //                 <Image
  //                   style={{
  //                     width: "100%",
  //                     height: undefined,
  //                     aspectRatio: 1,
  //                     position: "absolute",
  //                     bottom: 0,
  //                     right: 0,
  //                   }}
  //                   source={image.love_face}
  //                 />
  //               </ImageBackground>
  //             </View>
  //           </TouchableOpacity>
  //         </View> */}
  //       </Container2>
  //     );
  //   }
  // };
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        if (Math.abs(gestureState.dx) > 3 || Math.abs(gestureState.dy) > 3) {
          return true;
        }
        return true;
      },
      onPanResponderGrant: (e, gestureState) => {
        // pan.setOffset({
        //   x: pan.x._value,
        //   y: pan.y._value,
        // });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderMove: Animated.event(
        [
          null,
          {
            dx: pan.x,
            dy: pan.y,
          },
        ],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: async (e, { vx, vy, dx, dy }) => {
        pan.flattenOffset();
        let velocity;

        if (Math.abs(dx) <= 5 && Math.abs(dy) <= 5) {
          //meaning the gesture did not cover any distance
          console.log("tapped");
        }

        if (vx > 0) {
          velocity = clamp(vx, 3, 5);
        } else if (vx < 0) {
          velocity = clamp(vx * -1, 3, 5) * -1;
        } else {
          velocity = dx < 0 ? -3 : 3;
        }

        const hasSwipedHorizontally = Math.abs(pan.x._value) > SWIPE_THRESHOLD;
        const hasSwipedVertically = Math.abs(pan.y._value) > SWIPE_THRESHOLD;
        if (hasSwipedHorizontally || (hasSwipedVertically && false)) {
          const hasMovedRight = hasSwipedHorizontally && pan.x._value > 0;
          const hasMovedLeft = hasSwipedHorizontally && pan.x._value < 0;
          const hasMovedUp = hasSwipedVertically && pan.y._value < 0;

          let cancelled = false;
          if (hasMovedRight) {
            cancelled = !(await handleYup(card));
          } else if (hasMovedLeft) {
            cancelled = !(await handleNope(card));
          } else if (hasMovedUp && hasMaybeAction) {
            cancelled = !(await handleMaybe(card));
          } else {
            cancelled = true;
          }

          //Yup or nope was cancelled, return the card to normal.
          if (cancelled) {
            _resetPan();
            return;
          }

          // cardRemoved(currentIndex[guid]);

          if (false) {
            _advanceState();
          } else {
            cardAnimation = Animated.decay(pan, {
              velocity: { x: velocity, y: vy },
              deceleration: 0.98,
              useNativeDriver: true,
            });
            cardAnimation.start((status) => {
              if (status.finished) _advanceState();
              else _resetState();

              cardAnimation = null;
            });
          }
        } else {
          _resetPan();
        }
      },
    })
  ).current;

  function _forceAngrySwipe() {
    cardAnimation = Animated.timing(pan, {
      toValue: { x: -500, y: -500 },
      useNativeDriver: true,
    }).start((status) => {
      if (status.finished) _advanceState();
      else _resetState();

      cardAnimation = null;
    });
    //cardRemoved(currentIndex[guid]);
  }

  function _forceSadSwipe() {
    cardAnimation = Animated.timing(pan, {
      toValue: { x: -500, y: 0 },
      useNativeDriver: true,
    }).start((status) => {
      if (status.finished) _advanceState();
      else _resetState();

      cardAnimation = null;
    });
    //cardRemoved(currentIndex[guid]);
  }

  function _forceAfraidSwipe() {
    cardAnimation = Animated.timing(pan, {
      toValue: { x: -500, y: 500 },
      useNativeDriver: true,
    }).start((status) => {
      if (status.finished) _advanceState();
      else _resetState();

      cardAnimation = null;
    });
    //cardRemoved(currentIndex[guid]);
  }

  function _forceUpSwipe() {
    cardAnimation = Animated.timing(pan, {
      toValue: { x: 0, y: -500 },
      useNativeDriver: true,
    }).start((status) => {
      if (status.finished) _advanceState();
      else _resetState();

      cardAnimation = null;
    });
    //cardRemoved(currentIndex[guid]);
  }

  function _forceDownSwipe() {
    cardAnimation = Animated.timing(pan, {
      toValue: { x: 0, y: 500 },
      useNativeDriver: true,
    }).start((status) => {
      if (status.finished) _advanceState();
      else _resetState();

      cardAnimation = null;
    });
    //cardRemoved(currentIndex[guid]);
  }

  function _forceLoveSwipe() {
    cardAnimation = Animated.timing(pan, {
      toValue: { x: 500, y: -500 },
      useNativeDriver: true,
    }).start((status) => {
      if (status.finished) _advanceState();
      else _resetState();

      cardAnimation = null;
    });
    //cardRemoved(currentIndex[guid]);
  }
  function _forceHappySwipe() {
    cardAnimation = Animated.timing(pan, {
      toValue: { x: 500, y: 0 },
      useNativeDriver: true,
    }).start((status) => {
      if (status.finished) _advanceState();
      else _resetState();

      cardAnimation = null;
    });
    //cardRemoved(currentIndex[guid]);
  }
  function _forceWowSwipe() {
    cardAnimation = Animated.timing(pan, {
      toValue: { x: 500, y: 500 },
      useNativeDriver: true,
    }).start((status) => {
      if (status.finished) _advanceState();
      else _resetState();

      cardAnimation = null;
    });
    //cardRemoved(currentIndex[guid]);
  }

  function _goToNextCard() {
    currentIndex[guid]++;

    // Checks to see if last card.
    // If props.loop=true, will start again from the first card.
    if (
      currentIndex[guid] > cards.length - 1 &&
      true //this.props.loop
    ) {
      //this.props.onLoop();
      currentIndex[guid] = 0;
    }
    //card.setValue(cards[currentIndex[guid]]);
  }

  function _goToPrevCard() {
    pan.setValue({ x: 0, y: 0 });
    enter.setValue(0);
    _animateEntrance();

    currentIndex[guid]--;

    if (currentIndex[guid] < 0) {
      currentIndex[guid] = 0;
    }

    //card.setValue(cards[currentIndex[guid]]);
  }

  function _animateEntrance() {
    Animated.spring(enter, {
      toValue: 1,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }

  function _animateMapEntrance() {
    Animated.spring(mapTransition, {
      toValue: 1,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }

  function _animateMapExit() {
    Animated.spring(mapTransition, {
      toValue: 0,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }

  function _resetPan() {
    if (panResetAnime) setPanResetAnime(null);
    const anime = Animated.spring(pan, {
      toValue: { x: 0, y: 0 },
      friction: 4,
      useNativeDriver: true,
    });
    setPanResetAnime(anime);
    anime.start();
  }

  function _resetState() {
    pan.setValue({ x: 0, y: 0 });
    enter.setValue(0);
    _animateEntrance();
  }

  function _advanceState() {
    pan.setValue({ x: 0, y: 0 });
    enter.setValue(0);
    _animateEntrance();
    _goToNextCard();
  }

  function getCurrentCard() {
    return cards[currentIndex[guid]];
  }

  function renderNoMoreCards() {
    return <StatusCard text="No more cards..." />;
  }

  function renderCard() {
    // if (!card) {
    //   return renderNoMoreCards();
    // }

    let [translateX, translateY] = [pan.x, pan.y];

    let rotate = pan.x.interpolate({
      inputRange: [-200, 0, 200],
      outputRange: ["-30deg", "0deg", "30deg"],
    });
    let opacity = pan.x.interpolate({
      inputRange: [-100, 0, 100],
      outputRange: [0.5, 1, 0.5],
    });

    let scale = enter;

    let animatedCardStyles = {
      transform: [{ translateX }, { translateY }, { rotate }, { scale }],
      opacity,
    };

    return (
      <Animated.View
        key={0}
        style={[styles.card, { backgroundColor: "white" }, animatedCardStyles]}
        {...panResponder.panHandlers}
      >
        <Entity />
      </Animated.View>
    );
  }

  function renderAngry() {
    let nopeOpacity = pan.x.interpolate({
      inputRange: [-SWIPE_THRESHOLD, -(SWIPE_THRESHOLD / 2)],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });
    let nopeScale = pan.y.interpolate({
      inputRange: [(-1 * height) / 4, (-1 * height) / 5],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });
    let animatedNopeStyles = {
      transform: [{ scale: nopeScale }],
      opacity: nopeOpacity,
    };

    if (true) {
      const inner = (
        <View style={styles.reaction}>
          <ImageBackground
            style={{
              width: "100%",
              height: undefined,
              aspectRatio: 1,
              position: "absolute",
              bottom: 2,
              right: 0,
            }}
            source={image.angry_eyes}
          >
            <Image
              style={{
                width: "100%",
                height: undefined,
                aspectRatio: 1,
                position: "absolute",
                bottom: -2,
                right: 0,
              }}
              source={image.angry_face}
            />
          </ImageBackground>
        </View>
      );

      return (
        <Animated.View style={[styles.angry, animatedNopeStyles]}>
          {inner}
        </Animated.View>
      );
    }
  }

  function renderSad() {
    let nopeOpacity = pan.x.interpolate({
      inputRange: [-SWIPE_THRESHOLD, -(SWIPE_THRESHOLD / 2)],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });
    let nopeScale = pan.y.interpolate({
      inputRange: [(-1 * height) / 5, 0, height / 6],
      outputRange: [0, 1, 0],
      extrapolate: "clamp",
    });
    let animatedNopeStyles = {
      transform: [{ scale: nopeScale }],
      opacity: nopeOpacity,
    };

    if (true) {
      const inner = (
        <View style={styles.reaction}>
          <ImageBackground
            style={{
              width: "100%",
              height: undefined,
              aspectRatio: 1,
              position: "absolute",
              bottom: 0,
              right: 1,
            }}
            source={image.sad_eyes}
          >
            <Image
              style={{
                width: "100%",
                height: undefined,
                aspectRatio: 1,
                position: "absolute",
                bottom: 0,
                right: -1,
              }}
              source={image.sad_face}
            />
          </ImageBackground>
        </View>
      );

      return (
        <Animated.View style={[styles.sad, animatedNopeStyles]}>
          {inner}
        </Animated.View>
      );
    }
  }

  function renderAfraid() {
    let nopeOpacity = pan.x.interpolate({
      inputRange: [-SWIPE_THRESHOLD, -(SWIPE_THRESHOLD / 2)],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });
    let nopeScale = pan.y.interpolate({
      inputRange: [height / 6, height / 4],
      outputRange: [0, 1],
      extrapolate: "clamp",
    });
    let animatedNopeStyles = {
      transform: [{ scale: nopeScale }],
      opacity: nopeOpacity,
    };

    if (true) {
      const inner = (
        <View style={styles.reaction}>
          <ImageBackground
            style={{
              width: "100%",
              height: undefined,
              aspectRatio: 1,
              position: "absolute",
              bottom: 2,
              right: 0,
            }}
            source={image.afraid_eyes}
          >
            <Image
              style={{
                width: "100%",
                height: undefined,
                aspectRatio: 1,
                position: "absolute",
                bottom: -2,
                right: 0,
              }}
              source={image.afraid_face}
            />
          </ImageBackground>
        </View>
      );

      return (
        <Animated.View style={[styles.afraid, animatedNopeStyles]}>
          {inner}
        </Animated.View>
      );
    }
  }

  function renderLove() {
    let yupOpacity = pan.x.interpolate({
      inputRange: [SWIPE_THRESHOLD / 2, SWIPE_THRESHOLD],
      outputRange: [0, 1],
      extrapolate: "clamp",
    });
    let yupScale = pan.y.interpolate({
      inputRange: [(-1 * height) / 4, (-1 * height) / 5],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });
    let animatedYupStyles = {
      transform: [{ scale: yupScale }],
      opacity: yupOpacity,
    };
    if (true) {
      const inner = (
        <View style={styles.reaction}>
          <ImageBackground
            style={{
              width: "100%",
              height: undefined,
              aspectRatio: 1,
              position: "absolute",
              bottom: -1,
              right: 0,
            }}
            source={image.love_eyes}
          >
            <Image
              style={{
                width: "100%",
                height: undefined,
                aspectRatio: 1,
                position: "absolute",
                bottom: 1,
                right: 0,
              }}
              source={image.love_face}
            />
          </ImageBackground>
        </View>
      );

      return (
        <Animated.View style={[styles.love, animatedYupStyles]}>
          {inner}
        </Animated.View>
      );
    }
  }

  function renderHappy() {
    let yupOpacity = pan.x.interpolate({
      inputRange: [SWIPE_THRESHOLD / 2, SWIPE_THRESHOLD],
      outputRange: [0, 1],
      extrapolate: "clamp",
    });
    let yupScale = pan.y.interpolate({
      inputRange: [(-1 * height) / 5, 0, height / 6],
      outputRange: [0, 1, 0],
      extrapolate: "clamp",
    });
    let animatedYupStyles = {
      transform: [{ scale: yupScale }],
      opacity: yupOpacity,
    };
    if (true) {
      const inner = (
        <View style={styles.reaction}>
          <ImageBackground
            style={{
              width: "100%",
              height: undefined,
              aspectRatio: 1,
              position: "absolute",
              bottom: 0,
              right: 1,
            }}
            source={image.happy_eyes}
          >
            <Image
              style={{
                width: "100%",
                height: undefined,
                aspectRatio: 1,
                position: "absolute",
                bottom: 0,
                right: -1,
              }}
              source={image.happy_face}
            />
          </ImageBackground>
        </View>
      );

      return (
        <Animated.View style={[styles.happy, animatedYupStyles]}>
          {inner}
        </Animated.View>
      );
    }
  }

  function renderWow() {
    let yupOpacity = pan.x.interpolate({
      inputRange: [SWIPE_THRESHOLD / 2, SWIPE_THRESHOLD],
      outputRange: [0, 1],
      extrapolate: "clamp",
    });
    let yupScale = pan.y.interpolate({
      inputRange: [height / 6, height / 4],
      outputRange: [0, 1],
      extrapolate: "clamp",
    });
    let animatedYupStyles = {
      transform: [{ scale: yupScale }],
      opacity: yupOpacity,
    };
    if (true) {
      const inner = (
        <View style={styles.reaction}>
          <ImageBackground
            style={{
              width: "100%",
              height: undefined,
              aspectRatio: 1,
              position: "absolute",
              bottom: -9,
              right: -4,
            }}
            source={image.wow_eyes}
          >
            <Image
              style={{
                width: "100%",
                height: undefined,
                aspectRatio: 1,
                position: "absolute",
                bottom: 9,
                right: 4,
              }}
              source={image.wow_face}
            />
          </ImageBackground>
        </View>
      );

      return (
        <Animated.View style={[styles.wow, animatedYupStyles]}>
          {inner}
        </Animated.View>
      );
    }
  }

  function getTrendsList(peopleSearch) {
    if (peopleSearch !== "" && peopleListener === true) {
      console.log("inside2");
      if (peopleSearch.startsWith("#")) {
        peopleSearch = peopleSearch.substring(1);
      }
      tagRef
        .where("username", ">=", peopleSearch)
        .where("username", "<=", peopleSearch + "\uf8ff")
        .orderBy("username")
        .limit(10)
        .get()
        .then((documentSnapshots) => {
          // Get the last visible document
          //var lastVisible =
          //documentSnapshots.docs[documentSnapshots.docs.length - 1];
          // console.log("last", lastVisible);

          // Construct a new query starting at this document,
          // get the next 25 cities.
          // var next = userRef
          //         .orderBy("clout")
          //         .startAfter(lastVisible)
          //         .limit(10);
          console.log(documentSnapshots.docs.length);
          let tempList = [];
          documentSnapshots.forEach((doc) => {
            console.log(doc.data().username);
            // doc.data() is never undefined for query doc snapshots
            let temp = doc.data();
            temp["colors"] = [
              "#00FF33", //green
              "#0085FF", //blue
              "#FFFB00",
            ];
            tempList.push(temp);
          });
          setTrendsList(tempList);
          setPeopleListener(false);
        });
    }
    if (peopleSearch === "" && trendsList.length === 0) {
      console.log("inside");
      tagRef
        .orderBy("clout", "desc")
        .limit(10)
        .get()
        .then((documentSnapshots) => {
          // Get the last visible document
          //var lastVisible =
          //documentSnapshots.docs[documentSnapshots.docs.length - 1];
          // console.log("last", lastVisible);

          // Construct a new query starting at this document,
          // get the next 25 cities.
          // var next = userRef
          //         .orderBy("clout")
          //         .startAfter(lastVisible)
          //         .limit(10);
          let tempList = [];
          documentSnapshots.forEach((doc) => {
            console.log(doc.data().username);
            // doc.data() is never undefined for query doc snapshots
            let temp = doc.data();
            temp["colors"] = [
              "#00FF33", //green
              "#0085FF", //blue
              "#FFFB00",
            ];

            tempList.push(temp);
          });
          setTrendsList(tempList);
        });
    }
    if (trendsList.length != 0) {
      return (
        <View>
          {trendsList.map((l, i) => (
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
              //onPress={() => navigation.push("Person", l)}
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
                      #{l.username}
                    </Text>
                    <Text
                      style={{
                        color: "#99AAAB",
                        fontSize: 15,
                      }}
                    >
                      {l.cards} Cards with Clout{" "}
                      {l.clout === 0
                        ? l.clout
                        : Math.round(
                            (10 * Math.log10(l.clout) + Number.EPSILON) * 100
                          ) / 100}{" "}
                      dB
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
            </ListItem>
          ))}
        </View>
      );
    }
    return <View />;
  }

  function getPeopleList(peopleSearch) {
    if (peopleSearch !== "" && peopleListener === true) {
      console.log("inside2");
      if (!peopleSearch.startsWith("@")) {
        peopleSearch = "@" + peopleSearch;
      }
      userRef
        .where("username", ">=", peopleSearch)
        .where("username", "<=", peopleSearch + "\uf8ff")
        .orderBy("username")
        .limit(10)
        .get()
        .then((documentSnapshots) => {
          // Get the last visible document
          //var lastVisible =
          //documentSnapshots.docs[documentSnapshots.docs.length - 1];
          // console.log("last", lastVisible);

          // Construct a new query starting at this document,
          // get the next 25 cities.
          // var next = userRef
          //         .orderBy("clout")
          //         .startAfter(lastVisible)
          //         .limit(10);
          console.log(documentSnapshots.docs.length);
          let tempList = [];
          documentSnapshots.forEach((doc) => {
            console.log(doc.data().name);
            // doc.data() is never undefined for query doc snapshots
            let temp = doc.data();
            temp["colors"] = [
              "#00FF33", //green
              "#0085FF", //blue
              "#FFFB00",
            ];
            tempList.push(temp);
          });
          setPeopleList(tempList);
          setPeopleListener(false);
        });
    }
    if (peopleSearch === "" && peopleList.length === 0) {
      console.log("inside");
      userRef
        .orderBy("clout", "desc")
        .limit(10)
        .get()
        .then((documentSnapshots) => {
          // Get the last visible document
          //var lastVisible =
          //documentSnapshots.docs[documentSnapshots.docs.length - 1];
          // console.log("last", lastVisible);

          // Construct a new query starting at this document,
          // get the next 25 cities.
          // var next = userRef
          //         .orderBy("clout")
          //         .startAfter(lastVisible)
          //         .limit(10);
          let tempList = [];
          documentSnapshots.forEach((doc) => {
            console.log(doc.data().name);
            // doc.data() is never undefined for query doc snapshots
            let temp = doc.data();
            temp["colors"] = [
              "#00FF33", //green
              "#0085FF", //blue
              "#FFFB00",
            ];

            tempList.push(temp);
          });
          setPeopleList(tempList);
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
                  xlarge
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
                      {l.username}
                    </Text>
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
                      {l.mentions} Mentions with Clout{" "}
                      {l.clout === 0
                        ? l.clout
                        : Math.round(
                            (10 * Math.log10(l.clout) + Number.EPSILON) * 100
                          ) / 100}{" "}
                      dB
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
    console.log("got here");
    let reactionColors = [
      "#00FF33", //green
      "#0085FF", //blue
      "#FFFB00",
      // "black",
      // "black",
      // "black",
      // "black",
      // "black",
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
              reactionColors[j] = Default.afraid; //purple

              break;
            case "sad":
              reactionColors[j] = Default.sad; //blue

              break;
            case "angry":
              reactionColors[j] = Default.angry; //red

              break;
            case "wow":
              reactionColors[j] = Default.wow; //yellow

              break;
            case "happy":
              reactionColors[j] = Default.happy; //orange

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
    console.log("complete");
    return reactionColors;
  }

  function renderTrending() {
    if (trending) {
      return (
        <Container>
          <Tabs
            tabBarUnderlineStyle={{ backgroundColor: "black" }}
            initialPage={0}
            locked={true}
          >
            <Tab
              heading={
                <TabHeading style={{ backgroundColor: "white" }}>
                  <Text style={{ fontSize: 21, fontWeight: "bold" }}>
                    Trending
                  </Text>
                </TabHeading>
              }
              tabStyle={{ backgroundColor: "white" }}
              textStyle={{ color: "black" }}
              activeTabStyle={{ backgroundColor: "white" }}
              activeTextStyle={{ color: "black" }}
            >
              <Content
                refreshControl={
                  <RefreshControl
                    refreshing={trendsList.length === 0}
                    onRefresh={() => {
                      setTrendsList([]);
                      if (search != "") {
                        setPeopleListener(true);
                      }
                    }}
                  />
                }
              >
                {getTrendsList(search)}
              </Content>
            </Tab>

            <Tab
              heading={
                <TabHeading style={{ backgroundColor: "white" }}>
                  <Text style={{ fontSize: 21, fontWeight: "bold" }}>
                    People
                  </Text>
                </TabHeading>
              }
              tabStyle={{ backgroundColor: "white" }}
              textStyle={{ color: "black" }}
              activeTabStyle={{ backgroundColor: "white" }}
              activeTextStyle={{ color: "black" }}
            >
              <Content
                refreshControl={
                  <RefreshControl
                    refreshing={peopleList.length === 0}
                    onRefresh={() => {
                      setPeopleList([]);
                      if (search != "") {
                        setPeopleListener(true);
                      }
                    }}
                  />
                }
              >
                {getPeopleList(search)}
              </Content>
            </Tab>
          </Tabs>
        </Container>
      );
    }
  }

  const points = [
    { latitude: 40.7828, longitude: -74.0065, weight: 1 },
    { latitude: 41.7121, longitude: -74.0042, weight: 2 },
    { latitude: 40.7102, longitude: -75.006, weight: 3 },
    { latitude: 40.7123, longitude: -74.0052, weight: 4 },
    { latitude: 40.7032, longitude: -74.0042, weight: 5 },
    { latitude: 40.7198, longitude: -74.0024, weight: 6 },
    { latitude: 41.7223, longitude: -74.0053, weight: 7 },
    { latitude: 40.7181, longitude: -74.0042, weight: 8 },
    { latitude: 40.7124, longitude: -74.0023, weight: 9 },
    { latitude: 40.7648, longitude: -74.0012, weight: 110 },
    { latitude: 41.7128, longitude: -74.0027, weight: 11 },
    { latitude: 40.7223, longitude: -74.0153, weight: 12 },
    { latitude: 40.7193, longitude: -74.0052, weight: 13 },
    { latitude: 40.7241, longitude: -75.0013, weight: 14 },
    { latitude: 41.7518, longitude: -74.0085, weight: 15 },
    { latitude: 40.7599, longitude: -74.0093, weight: 52 },
    { latitude: 41.7523, longitude: -74.0021, weight: 16 },
    { latitude: 40.7342, longitude: -74.0152, weight: 17 },
    { latitude: 40.7484, longitude: -75.0042, weight: 18 },
    { latitude: 40.7929, longitude: -75.0023, weight: 19 },
    { latitude: 40.7292, longitude: -74.0013, weight: 21 },
    { latitude: 40.794, longitude: -74.0048, weight: 31 },
    { latitude: 40.7874, longitude: -74.0052, weight: 41 },
    { latitude: 40.7824, longitude: -74.0024, weight: 51 },
    { latitude: 40.7232, longitude: -74.0094, weight: 61 },
    { latitude: 41.7342, longitude: -74.0152, weight: 71 },
    { latitude: 41.7484, longitude: -74.0012, weight: 81 },
    { latitude: 41.7929, longitude: -74.0073, weight: 91 },
    { latitude: 41.7292, longitude: -74.0013, weight: 101 },
    { latitude: 41.794, longitude: -74.0058, weight: 111 },
    { latitude: 41.7874, longitude: -74.0352, weight: 111 },
    { latitude: 41.7824, longitude: -74.0024, weight: 111 },
    { latitude: 41.7232, longitude: -74.0094, weight: 122 },
    { latitude: 41.0342, longitude: -75.0152, weight: 133 },
    { latitude: 41.0484, longitude: -75.0012, weight: 144 },
    { latitude: 41.0929, longitude: -75.0073, weight: 155 },
    { latitude: 41.0292, longitude: -74.0013, weight: 166 },
    { latitude: 41.094, longitude: -74.0068, weight: 177 },
    { latitude: 41.0874, longitude: -74.0052, weight: 188 },
    { latitude: 41.0824, longitude: -74.0024, weight: 199 },
    { latitude: 41.0232, longitude: -74.0014, weight: 147 },
  ];

  const coordinates = [
    {
      name: "Palestine",
      latitude: 37.8025259,
      longitude: -122.4351431,
      image: image.angry_face,
    },
    {
      name: "New Zealand",
      latitude: 37.7946386,
      longitude: -122.421646,
      image: image.sad_face,
    },
    {
      name: "Israel",
      latitude: 37.7665248,
      longitude: -122.4165628,
      image: image.afraid_face,
    },
    {
      name: "New York",
      latitude: 37.7834153,
      longitude: -122.4527787,
      image: image.love_face,
    },
    {
      name: "Chicago",
      latitude: 37.7948105,
      longitude: -122.4596065,
      image: image.wow_face,
    },
  ];
  const renderCarouselItem = ({ item, index }) => {
    return (
      <View style={styles.carouselContainer}>
        <Text style={styles.carouselTitle}>{item.name}</Text>
      </View>
    );
  };

  const onCarouselItemChange = (index) => {
    let location = coordinates[index];

    _map.current.animateToRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.09,
      longitudeDelta: 0.035,
    });
  };

  const _handleMapPress = (e) => {
    console.log(e.nativeEvent);
  };

  function renderLocation() {
    if (location) {
      let initialRegion = {
        latitude: 41.0232,
        longitude: -74.0014,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      let opacity = mapTransition;
      let scaleY = mapTransition;
      let animatedMapStyles = {
        transform: [{ scaleY }],
        opacity,
      };

      return (
        <KeyboardAvoidingView
          behavior="position"
          contentContainerStyle={{
            // ...Platform.select({
            //   android: {
            //     marginTop: StatusBar.currentHeight,
            //   },
            // }),
            height:
              Dimensions.get("window").height -
              Platform.select({
                ios: 64,
                android: 80, //56,
              }) -
              79,
            width: Dimensions.get("window").width,
            backgroundColor: "transparent",
          }}
          keyboardVerticalOffset={Platform.select({
            ios: 64,
            android: 80, //56,
          })}
        >
          <Animated.View style={animatedMapStyles}>
            <MapView
              style={styles.mapStyle}
              provider={MapView.PROVIDER_GOOGLE}
              ref={_map}
              showsUserLocation={true}
              initialRegion={initialRegion}
              minZoomLevel={3}
              maxZoomLevel={15}
              rotateEnabled={false}
              loadingEnabled={true}
              zoomTapEnabled={false}
              onPress={_handleMapPress}
              onRegionChangeComplete={(center) => {
                let northeast = {
                    latitude: center.latitude + center.latitudeDelta / 2,
                    longitude: center.longitude + center.longitudeDelta / 2,
                  },
                  southwest = {
                    latitude: center.latitude - center.latitudeDelta / 2,
                    longitude: center.longitude - center.longitudeDelta / 2,
                  };

                console.log("edges", center, northeast, southwest);
              }}
            >
              <Marker coordinate={{ latitude: 41.794, longitude: -74.0058 }}>
                <Thumbnail
                  source={{ uri: items[0].picture }}
                  style={{
                    borderColor: "black",
                    borderWidth: 1,
                  }}
                />
                <Text>Uzair Sayed</Text>
              </Marker>

              <Heatmap
                points={points}
                radius={50}
                opacity={0.5}
                gradient={{
                  colors: [
                    Default.happy,
                    Default.wow,
                    Default.love,
                    Default.sad,
                    Default.afraid,
                    Default.angry,
                  ],
                  startPoints:
                    Platform.OS === "ios"
                      ? [0.01, 0.04, 0.1, 0.25, 0.45, 0.5]
                      : [0.1, 0.2, 0.4, 0.6, 0.8, 1],
                  colorMapSize: 2000,
                }}
              ></Heatmap>
            </MapView>
            <Carousel
              // ref={(c) => {
              //   console.log(c);
              // }}
              data={coordinates}
              containerCustomStyle={{
                position: "absolute",
                bottom: 0,
                marginBottom: 15,
              }}
              renderItem={renderCarouselItem}
              sliderWidth={Dimensions.get("window").width}
              itemWidth={300}
              removeClippedSubviews={false}
              onSnapToItem={(index) => onCarouselItemChange(index)}
            />
          </Animated.View>
        </KeyboardAvoidingView>

        // <MapView
        //   style={{
        //     width: Dimensions.get("window").width,
        //     // flex: 1,
        //     // marginTop: Platform.select({
        //     //   ios: 64,
        //     //   android: 56,
        //     // }),
        //     // marginBottom: useBottomTabBarHeight(),
        //     height:
        //       height -
        //       Platform.select({
        //         ios: 64,
        //         android: 56,
        //       }) -
        //       useBottomTabBarHeight(),
        //   }}
        //   provider={MapView.PROVIDER_GOOGLE}
        // />
        // </View>
      );
    }
  }
  function renderMyFeed() {
    if (myFeed) {
      return (
        <View
          style={{
            alignItems: "center",
            justifyContent: "space-around",
            flexDirection: "row",
            backgroundColor: "#fff",
          }}
        >
          {/* <FlatList
          data={DATA}
          renderItem={renderItem}
          horizontal={true}
          keyExtractor={(item) => item.id}
        /> */}
          <TouchableOpacity onPress={() => _changeChoice(0)}>
            <Text
              style={
                choice === 0
                  ? {
                      fontSize: 24,
                      alignSelf: "flex-end",
                      color: "#e91e63",
                      marginBottom: 15,
                      marginTop: 15,
                      marginHorizontal: 15,
                    }
                  : {
                      fontSize: 24,
                      alignSelf: "flex-end",
                      color: Default.primary,
                      marginBottom: 15,
                      marginTop: 15,
                      marginHorizontal: 15,
                    }
              }
            >
              Trending
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => _changeChoice(1)}>
            <Text
              style={
                choice === 1
                  ? {
                      fontSize: 24,
                      alignSelf: "flex-end",
                      color: "#e91e63",
                      marginBottom: 15,
                      marginTop: 15,
                      marginHorizontal: 15,
                    }
                  : {
                      fontSize: 24,
                      alignSelf: "flex-end",
                      color: Default.primary,
                      marginBottom: 15,
                      marginTop: 15,
                      marginHorizontal: 15,
                    }
              }
            >
              Latest
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => _changeChoice(2)}>
            <Text
              style={
                choice === 2
                  ? {
                      fontSize: 24,
                      alignSelf: "flex-end",
                      color: "#e91e63",
                      marginBottom: 15,
                      marginTop: 15,
                      marginHorizontal: 15,
                    }
                  : {
                      fontSize: 24,
                      alignSelf: "flex-end",
                      color: Default.primary,
                      marginBottom: 15,
                      marginTop: 15,
                      marginHorizontal: 15,
                    }
              }
            >
              For You
            </Text>
          </TouchableOpacity>
        </View>
        // <View>
        //   <View
        //     style={{
        //       flexDirection: "row",
        //       justifyContent: "flex-start",
        //       paddingHorizontal: 10,
        //       paddingVertical: 5,
        //       backgroundColor: "white",
        //     }}
        //   >
        //     <Text style={{ fontWeight: "bold", fontSize: 12 }}>EXPOSÉ</Text>
        //   </View>
        //   <View
        //     style={{
        //       backgroundColor: "white",
        //     }}
        //   >
        //     <ScrollView
        //       contentContainerStyle={{
        //         paddingHorizontal: 5,
        //       }}
        //       showsHorizontalScrollIndicator={false}
        //       horizontal
        //     >
        //       {items.map((story) => (
        //         <View key={story.id} styles={{ alignItems: "center" }}>
        //           <TouchableOpacity>
        //             <LinearGradient
        //               colors={story.colors}
        //               // "#00FF33", //green
        //               //   "#0085FF", //blue
        //               //   "#FFFB00", //yellow
        //               //   "#FF0000", //red
        //               //   "#FFFFFF", //grey
        //               //   "#000000", //black
        //               start={{ x: 0.0, y: 1.0 }}
        //               end={{ x: 1.0, y: 0.0 }}
        //               style={{
        //                 height: 60,
        //                 width: 60,
        //                 borderRadius: 30,
        //                 alignItems: "center",
        //                 justifyContent: "center",
        //                 marginHorizontal: 5,
        //               }}
        //             >
        //               <Thumbnail
        //                 source={{ uri: story.picture }}
        //                 style={{
        //                   borderColor: "white",
        //                   borderWidth: 1,
        //                 }}
        //               />
        //             </LinearGradient>

        //             <Text style={{ fontSize: 10, textAlign: "center" }}>
        //               {story.author}
        //             </Text>
        //           </TouchableOpacity>
        //         </View>
        //       ))}
        //     </ScrollView>
        //   </View>
        // </View>
      );
    } else {
      return <View />;
    }
  }

  function renderSwipeDeck() {
    if (swipeDeck) {
      let animatedBackground = {
        transform: [
          {
            rotate: enter.interpolate({
              inputRange: [0, 1],
              outputRange: ["-60deg", "0deg"],
            }),
          },
          { scale: enter },
        ],
        opacity: pan.x.interpolate({
          inputRange: [
            -SWIPE_THRESHOLD / 2,
            -(SWIPE_THRESHOLD / 3),
            SWIPE_THRESHOLD / 3,
            SWIPE_THRESHOLD / 2,
          ],
          outputRange: [0, 1, 1, 0],
          extrapolate: "clamp",
        }),
      };
      return (
        <CartContainer CheckOutComponent={CheckOut}>
          <Wrapper>
            {renderMyFeed()}
            <View style={{ flex: 1, backgroundColor: "white" }}>
              <View style={styles.container}>
                <Animated.Image
                  style={[
                    {
                      width: "100%",
                      height: undefined,
                      aspectRatio: 1,
                      position: "absolute",
                      top: 0,
                      bottom: 0,
                      right: 0,
                      left: 0,
                    },
                    animatedBackground,
                  ]}
                  source={image.background}
                />
                <View
                  style={{
                    position: "absolute",
                    top: 50,
                    left: 5,
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity onPress={_forceAngrySwipe}>
                    <Animated.View style={[styles.reaction, angryBackground]}>
                      <ImageBackground
                        style={{
                          width: "100%",
                          height: undefined,
                          aspectRatio: 1,
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                        }}
                        source={image.angry_eyes}
                      >
                        <Animated.Image
                          style={[
                            {
                              width: "100%",
                              height: undefined,
                              aspectRatio: 1,
                              position: "absolute",
                              bottom: 0,
                              right: 0,
                            },
                            angryEyes,
                          ]}
                          source={image.angry_face}
                        />
                      </ImageBackground>
                    </Animated.View>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    position: "absolute",
                    bottom: 144,
                    left: 5,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity onPress={_forceSadSwipe}>
                    <Animated.View style={[styles.reaction, sadBackground]}>
                      <ImageBackground
                        style={{
                          width: "100%",
                          height: undefined,
                          aspectRatio: 1,
                          position: "absolute",
                          bottom: 0,
                          right: 1,
                        }}
                        source={image.sad_eyes}
                      >
                        <Image
                          style={{
                            width: "100%",
                            height: undefined,
                            aspectRatio: 1,
                            position: "absolute",
                            bottom: 0,
                            right: -1,
                          }}
                          source={image.sad_face}
                        />
                      </ImageBackground>
                    </Animated.View>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 5,
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity onPress={_forceAfraidSwipe}>
                    <Animated.View style={[styles.reaction, afraidBackground]}>
                      <ImageBackground
                        style={{
                          width: "100%",
                          height: undefined,
                          aspectRatio: 1,
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                        }}
                        source={image.afraid_eyes}
                      >
                        <Animated.Image
                          style={[
                            {
                              width: "100%",
                              height: undefined,
                              aspectRatio: 1,
                              position: "absolute",
                              bottom: 0,
                              right: 0,
                            },
                            afraidEyes,
                          ]}
                          source={image.afraid_face}
                        />
                      </ImageBackground>
                    </Animated.View>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    position: "absolute",
                    top: 50,
                    right: 5,
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity onPress={_forceLoveSwipe}>
                    <Animated.View style={[styles.reaction, loveBackground]}>
                      <ImageBackground
                        style={{
                          width: "100%",
                          height: undefined,
                          aspectRatio: 1,
                          position: "absolute",
                          bottom: -1,
                          right: 0,
                        }}
                        source={image.love_eyes}
                      >
                        <Animated.Image
                          style={[
                            {
                              width: "100%",
                              height: undefined,
                              aspectRatio: 1,
                              position: "absolute",
                              bottom: 1,
                              right: 0,
                            },
                            loveEyes,
                          ]}
                          source={image.love_face}
                        />
                      </ImageBackground>
                    </Animated.View>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    position: "absolute",
                    bottom: 144,
                    right: 5,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity onPress={_forceHappySwipe}>
                    <Animated.View style={[styles.reaction, happpyBackground]}>
                      <ImageBackground
                        style={{
                          width: "100%",
                          height: undefined,
                          aspectRatio: 1,
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                        }}
                        source={image.happy_eyes}
                      >
                        <Animated.Image
                          style={[
                            {
                              width: "100%",
                              height: undefined,
                              aspectRatio: 1,
                              position: "absolute",
                              bottom: 0,
                              right: 0,
                            },
                            happyEyes,
                          ]}
                          source={image.happy_face}
                        />
                      </ImageBackground>
                    </Animated.View>
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 5,
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity onPress={_forceWowSwipe}>
                    <Animated.View style={[styles.reaction, wowBackground]}>
                      <ImageBackground
                        style={{
                          width: "100%",
                          height: undefined,
                          aspectRatio: 1,
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                        }}
                        source={image.wow_eyes}
                      >
                        <Animated.Image
                          style={[
                            {
                              width: "100%",
                              height: undefined,
                              aspectRatio: 1,
                              position: "absolute",
                              bottom: 0,
                              right: 0,
                            },
                            wowEyes,
                          ]}
                          source={image.wow_face}
                        />
                      </ImageBackground>
                    </Animated.View>
                  </TouchableOpacity>
                </View>
                {cards ? (
                  <View style={styles.cardContainer}>
                    {renderCard()}
                    {renderAngry()}
                    {renderSad()}
                    {renderAfraid()}
                    {renderLove()}
                    {renderHappy()}
                    {renderWow()}
                  </View>
                ) : (
                  <StatusCard text="Loading..." />
                )}
              </View>
              <View
                style={{
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "space-around",
                  flexDirection: "row",
                  marginTop: 15,

                  paddingHorizontal: 5,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    _forceAngrySwipe();
                  }}
                >
                  <View
                    style={{
                      width: width / 7,
                      height: undefined,
                      aspectRatio: 1,
                      alignItems: "center",
                      justifyContent: "flex-start",
                    }}
                  >
                    <ImageBackground
                      style={{
                        width: "100%",
                        height: undefined,
                        aspectRatio: 1,
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                      }}
                      source={image.angry_eyes}
                    >
                      <Image
                        style={{
                          width: "100%",
                          height: undefined,
                          aspectRatio: 1,
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                        }}
                        source={image.angry_face}
                      />
                    </ImageBackground>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    _forceSadSwipe();
                  }}
                >
                  <View
                    style={{
                      width: width / 7,
                      height: undefined,
                      aspectRatio: 1,
                      alignItems: "center",
                      justifyContent: "flex-start",
                    }}
                  >
                    <ImageBackground
                      style={{
                        width: "100%",
                        height: undefined,
                        aspectRatio: 1,
                        position: "absolute",
                        bottom: 5,
                        right: 1,
                      }}
                      source={image.sad_eyes}
                    >
                      <Image
                        style={{
                          width: "100%",
                          height: undefined,
                          aspectRatio: 1,
                          position: "absolute",
                          bottom: 0,
                          right: -1,
                        }}
                        source={image.sad_face}
                      />
                    </ImageBackground>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    _forceAfraidSwipe();
                  }}
                >
                  <View
                    style={{
                      width: width / 7,
                      height: undefined,
                      aspectRatio: 1,
                      alignItems: "center",
                      justifyContent: "flex-start",
                    }}
                  >
                    <ImageBackground
                      style={{
                        width: "100%",
                        height: undefined,
                        aspectRatio: 1,
                        position: "absolute",
                        bottom: 5,
                        right: 0,
                      }}
                      source={image.afraid_eyes}
                    >
                      <Image
                        style={{
                          width: "100%",
                          height: undefined,
                          aspectRatio: 1,
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                        }}
                        source={image.afraid_face}
                      />
                    </ImageBackground>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    _forceWowSwipe();
                  }}
                >
                  <View
                    style={{
                      width: width / 7,
                      height: undefined,
                      aspectRatio: 1,
                      alignItems: "center",
                      justifyContent: "flex-start",
                    }}
                  >
                    <ImageBackground
                      style={{
                        width: "100%",
                        height: undefined,
                        aspectRatio: 1,
                        position: "absolute",
                        bottom: -4.5,
                        right: -2,
                      }}
                      source={image.wow_eyes}
                    >
                      <Image
                        style={{
                          width: "100%",
                          height: undefined,
                          aspectRatio: 1,
                          position: "absolute",
                          bottom: 4.5,
                          right: 2,
                        }}
                        source={image.wow_face}
                      />
                    </ImageBackground>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    _forceHappySwipe();
                  }}
                >
                  <View
                    style={{
                      width: width / 7,
                      height: undefined,
                      aspectRatio: 1,
                      alignItems: "center",
                      justifyContent: "flex-start",
                    }}
                  >
                    <ImageBackground
                      style={{
                        width: "100%",
                        height: undefined,
                        aspectRatio: 1,
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                      }}
                      source={image.happy_eyes}
                    >
                      <Image
                        style={{
                          width: "100%",
                          height: undefined,
                          aspectRatio: 1,
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                        }}
                        source={image.happy_face}
                      />
                    </ImageBackground>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    _forceLoveSwipe();
                  }}
                >
                  <View
                    style={{
                      width: width / 7,
                      height: undefined,
                      aspectRatio: 1,
                      alignItems: "center",
                      justifyContent: "flex-start",
                    }}
                  >
                    <ImageBackground
                      style={{
                        width: "100%",
                        height: undefined,
                        aspectRatio: 1,
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                      }}
                      source={image.love_eyes}
                    >
                      <Image
                        style={{
                          width: "100%",
                          height: undefined,
                          aspectRatio: 1,
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                        }}
                        source={image.love_face}
                      />
                    </ImageBackground>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </Wrapper>
        </CartContainer>
      );
    } else {
      return <View />;
    }
  }

  function handleYup(card) {
    //console.log(`Yup for ${card.text}`);
    return true; // return false if you wish to cancel the action
  }
  function handleNope(card) {
    //console.log(`Nope for ${card.text}`);
    return true;
  }
  function handleMaybe(card) {
    //console.log(`Maybe for ${card.text}`);
    return true;
  }
  const MyStatusBar = ({ backgroundColor, ...props }) => (
    <View style={[styles.statusBar, { backgroundColor }]}>
      <SafeAreaView>
        <StatusBar translucent backgroundColor={backgroundColor} {...props} />
      </SafeAreaView>
    </View>
  );

  let angryBackground = {
    transform: [
      {
        translateX: pan.x.interpolate({
          inputRange: [-200, 0, 200],
          outputRange: [-4, 0, 2],
          extrapolate: "clamp",
        }),
      },
      {
        translateY: pan.y.interpolate({
          inputRange: [-200, 0, 200],
          outputRange: [-2, 1, 2],
          extrapolate: "clamp",
        }),
      },
    ],
    opacity: pan.x.interpolate({
      inputRange: [
        -SWIPE_THRESHOLD,
        -(SWIPE_THRESHOLD / 2),
        SWIPE_THRESHOLD / 2,
        SWIPE_THRESHOLD,
      ],
      outputRange: [1, 0, 0, 1],
      extrapolate: "clamp",
    }),
  };
  let angryEyes = {
    transform: [
      {
        translateX: pan.x.interpolate({
          inputRange: [-200, 0, 200],
          outputRange: [4, 0, -2],
          extrapolate: "clamp",
        }),
      },
      {
        translateY: pan.y.interpolate({
          inputRange: [-200, 0, 200],
          outputRange: [2, -1, -2],
          extrapolate: "clamp",
        }),
      },
    ],
    opacity: pan.x.interpolate({
      inputRange: [
        -SWIPE_THRESHOLD,
        -(SWIPE_THRESHOLD / 2),
        SWIPE_THRESHOLD / 2,
        SWIPE_THRESHOLD,
      ],
      outputRange: [1, 0, 0, 1],
      extrapolate: "clamp",
    }),
  };

  let sadBackground = {
    opacity: pan.x.interpolate({
      inputRange: [
        -SWIPE_THRESHOLD,
        -(SWIPE_THRESHOLD / 2),
        SWIPE_THRESHOLD / 2,
        SWIPE_THRESHOLD,
      ],
      outputRange: [1, 0, 0, 1],
      extrapolate: "clamp",
    }),
  };

  let afraidBackground = {
    transform: [
      {
        translateX: pan.x.interpolate({
          inputRange: [-200, 0, 200],
          outputRange: [-4, 0, 2],
          extrapolate: "clamp",
        }),
      },
      {
        translateY: pan.y.interpolate({
          inputRange: [-200, 0, 200],
          outputRange: [-3, -2, 1],
          extrapolate: "clamp",
        }),
      },
    ],
    opacity: pan.x.interpolate({
      inputRange: [
        -SWIPE_THRESHOLD,
        -(SWIPE_THRESHOLD / 2),
        SWIPE_THRESHOLD / 2,
        SWIPE_THRESHOLD,
      ],
      outputRange: [1, 0, 0, 1],
      extrapolate: "clamp",
    }),
  };
  let afraidEyes = {
    transform: [
      {
        translateX: pan.x.interpolate({
          inputRange: [-200, 0, 200],
          outputRange: [4, 0, -2],
          extrapolate: "clamp",
        }),
      },
      {
        translateY: pan.y.interpolate({
          inputRange: [-200, 0, 200],
          outputRange: [3, 2, -1],
          extrapolate: "clamp",
        }),
      },
    ],
    opacity: pan.x.interpolate({
      inputRange: [
        -SWIPE_THRESHOLD,
        -(SWIPE_THRESHOLD / 2),
        SWIPE_THRESHOLD / 2,
        SWIPE_THRESHOLD,
      ],
      outputRange: [1, 0, 0, 1],
      extrapolate: "clamp",
    }),
  };

  let happpyBackground = {
    transform: [
      {
        translateX: pan.x.interpolate({
          inputRange: [-200, 0, 200],
          outputRange: [-2, -1, 2],
          extrapolate: "clamp",
        }),
      },
      {
        translateY: pan.y.interpolate({
          inputRange: [-200, 0, 200],
          outputRange: [-1, 0, 1],
          extrapolate: "clamp",
        }),
      },
    ],
    opacity: pan.x.interpolate({
      inputRange: [
        -SWIPE_THRESHOLD,
        -(SWIPE_THRESHOLD / 2),
        SWIPE_THRESHOLD / 2,
        SWIPE_THRESHOLD,
      ],
      outputRange: [1, 0, 0, 1],
      extrapolate: "clamp",
    }),
  };
  let happyEyes = {
    transform: [
      {
        translateX: pan.x.interpolate({
          inputRange: [-200, 0, 200],
          outputRange: [2, 1, -2],
          extrapolate: "clamp",
        }),
      },
      {
        translateY: pan.y.interpolate({
          inputRange: [-200, 0, 200],
          outputRange: [1, 0, -1],
          extrapolate: "clamp",
        }),
      },
    ],
    opacity: pan.x.interpolate({
      inputRange: [
        -SWIPE_THRESHOLD,
        -(SWIPE_THRESHOLD / 2),
        SWIPE_THRESHOLD / 2,
        SWIPE_THRESHOLD,
      ],
      outputRange: [1, 0, 0, 1],
      extrapolate: "clamp",
    }),
  };

  let wowBackground = {
    transform: [
      {
        translateX: pan.x.interpolate({
          inputRange: [-200, 0, 200],
          outputRange: [2, 4, 7],
          extrapolate: "clamp",
        }),
      },
      {
        translateY: pan.y.interpolate({
          inputRange: [-200, 0, 200],
          outputRange: [8, 9, 11],
          extrapolate: "clamp",
        }),
      },
    ],
    opacity: pan.x.interpolate({
      inputRange: [
        -SWIPE_THRESHOLD,
        -(SWIPE_THRESHOLD / 2),
        SWIPE_THRESHOLD / 2,
        SWIPE_THRESHOLD,
      ],
      outputRange: [1, 0, 0, 1],
      extrapolate: "clamp",
    }),
  };
  let wowEyes = {
    transform: [
      {
        translateX: pan.x.interpolate({
          inputRange: [-200, 0, 200],
          outputRange: [-2, -4, -7],
          extrapolate: "clamp",
        }),
      },
      {
        translateY: pan.y.interpolate({
          inputRange: [-200, 0, 200],
          outputRange: [-8, -9, -11],
          extrapolate: "clamp",
        }),
      },
    ],
    opacity: pan.x.interpolate({
      inputRange: [
        -SWIPE_THRESHOLD,
        -(SWIPE_THRESHOLD / 2),
        SWIPE_THRESHOLD / 2,
        SWIPE_THRESHOLD,
      ],
      outputRange: [1, 0, 0, 1],
      extrapolate: "clamp",
    }),
  };

  let loveBackground = {
    transform: [
      {
        translateX: pan.x.interpolate({
          inputRange: [-200, 0, 200],
          outputRange: [-1, 0, 4],
          extrapolate: "clamp",
        }),
      },
    ],
    opacity: pan.x.interpolate({
      inputRange: [
        -SWIPE_THRESHOLD,
        -(SWIPE_THRESHOLD / 2),
        SWIPE_THRESHOLD / 2,
        SWIPE_THRESHOLD,
      ],
      outputRange: [1, 0, 0, 1],
      extrapolate: "clamp",
    }),
  };
  let loveEyes = {
    transform: [
      {
        translateX: pan.x.interpolate({
          inputRange: [-200, 0, 200],
          outputRange: [1, 0, -4],
          extrapolate: "clamp",
        }),
      },
    ],
    opacity: pan.x.interpolate({
      inputRange: [
        -SWIPE_THRESHOLD,
        -(SWIPE_THRESHOLD / 2),
        SWIPE_THRESHOLD / 2,
        SWIPE_THRESHOLD,
      ],
      outputRange: [1, 0, 0, 1],
      extrapolate: "clamp",
    }),
  };
  useStatusBar("dark-content");

  function mapFromHome() {
    if (currLocation !== null) {
      enter.setValue(0);
      setMyFeed(false);
      setSwipeDeck(false);
      setGoBack(0.75);
      mapTransition.setValue(0);
      setLocation(true);
      _animateMapEntrance();
    }
  }

  function trendFromMap() {
    if (search !== "") {
      setPeopleListener(true);
    }
    setTrending(true);
    Keyboard.dismiss();
    mapTransition.setValue(1);
    _animateMapExit();
    setLocation(false);
  }

  function mapFromTrend() {
    setTrending(false);
    Keyboard.dismiss();
    mapTransition.setValue(0);
    setLocation(true);
    _animateMapEntrance();
  }

  function trendFromHome() {
    // if (search != "") {
    //   setPeopleListener(true);
    // }

    enter.setValue(0);
    setMyFeed(false);
    setSwipeDeck(false);
    setTrending(true);
    setPeopleList([]);
    setGoBack(0.75);
  }

  function textChange(e) {
    setSearch(e);
    if (e === "") {
      setPeopleList([]);
      setPeopleListener(false);
    } else {
      setPeopleListener(true);
    }
  }

  function backHome() {
    setSearch("");
    Keyboard.dismiss();
    if (location) {
      mapTransition.setValue(1);
      _animateMapExit();
      setLocation(false);
    }
    if (trending) {
      setTrending(false);
    }
    setPeopleList([]);
    setGoBack(0.725);
    setMyFeed(true);
    setSwipeDeck(true);
    pan.setValue({ x: 0, y: 0 });
    _animateEntrance();
  }

  async function getAddress() {
    let currloc = await Location.getCurrentPositionAsync({});
    setCurrLocation(currloc);
    let address = await Location.reverseGeocodeAsync(currLocation.coords);
    let actualAdd = address[0];
    console.log(actualAdd);
    setAddress(actualAdd);
  }

  const bottomHeight = 64; //useBottomTabBarHeight();
  if (currLocation !== null && address[0] === "") {
    getAddress();
  }

  // const allTags = Object.keys(nlp("").world.tags);
  const [inputData, setInputData] = useState("");

  const getMedia = async () => {
    if (chirpMedia.length !== 0) {
      let media = [];
      for (const obj of chirpMedia) {
        const blob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = function () {
            resolve(xhr.response);
          };
          xhr.onerror = function (e) {
            console.log(e);
            reject(new TypeError("Network request failed"));
          };
          xhr.responseType = "blob";
          xhr.open("GET", obj.uri, true);
          xhr.send(null);
        });
        const ref = firebase.storage().ref().child(String(Date.now()));
        const snapshot = await ref.put(blob);

        // We're done with the blob, close and release it
        blob.close();

        let mediaURL = await snapshot.ref.getDownloadURL();
        media.push(mediaURL);
      }
      return media;
    }
    if (chirpMedia.length === 0) return [];
  };

  const _chirpPost = async () => {
    let mentioned = words
      .filter(
        (obj) => obj.tags.includes("AtMention") || obj.text.startsWith("@")
      )
      .map((obj) => obj.text);
    mentioned = [...new Set(mentioned)];
    let tagged = words
      .filter((obj) => obj.tags.includes("HashTag") || obj.text.startsWith("#"))
      .map((obj) => obj.text)
      .map((obj) => obj.substring(1));
    tagged = [...new Set(tagged)];
    if (!inputData) {
      setChirpPosting(false);
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
    } else if (tagged.length > 1 || mentioned.length > 3) {
      setChirpPosting(false);
      Alert.alert(
        "Crossed #Tags and @Mentions limit",
        "You can tag into at most one trending #HashTag and can mention at most 3 @usernames",
        [
          {
            text: "OK",
            style: "cancel",
          },
        ],
        { cancelable: false }
      );
    } else if (
      tagged.length === 0 ||
      (/^@?(\w){5,15}$/.test(tagged[0]) === true &&
        (tagged[0].startsWith("__") && tagged[0].endsWith("__")) === false)
    ) {
      let userInfo = await retrieveData();
      let media = await getMedia();

      firebase
        .firestore()
        .collection("users")
        .doc(userInfo.id)
        .get()
        .then((doc) => {
          if (doc.exists) {
            console.log("Document data:", doc.data());
            if (doc.data().entities.length > 4) {
              setChirpPosting(false);
              Alert.alert(
                "Curation Slots Full",
                "You have used 5 of 5 Curation Slots. Clear a slot to add a new card to your curations",
                [
                  {
                    text: "OK",
                    style: "cancel",
                  },
                ],
                { cancelable: false }
              );
            } else {
              let timestamp = Date.now();
              const entityDetails = {
                author: userInfo.id,
                text: inputData,
                media: media,
                replyingTo: [],
                numberOfReplies: 0,
                latitude: currLocation.coords.latitude,
                longitude: currLocation.coords.longitude,
                city: address.city,
                country: address.country,
                mentions: mentioned,
                tag: tagged,
                curators: 1,
                timestamp: timestamp,
              };
              const entityRef = firebase.firestore().collection("entitynames");
              let entityId = null;
              entityRef.add(entityDetails).then((docRef) => {
                console.log("Document written with ID: ", docRef.id);
                entityId = docRef.id;
                let curation = String(entityId).concat(" ", String(timestamp));
                firebase
                  .firestore()
                  .collection("users")
                  .doc(userInfo.id)
                  .set(
                    {
                      entities:
                        firebase.firestore.FieldValue.arrayUnion(entityId),
                      timestamps:
                        firebase.firestore.FieldValue.arrayUnion(curation),
                      lastTimestamp: timestamp,
                    },
                    { merge: true }
                  );
                firebase
                  .firestore()
                  .collection("entitynames")
                  .doc(entityId)
                  .set(
                    {
                      id: entityId,
                    },
                    { merge: true }
                  );
                firebase
                  .database()
                  .ref("reactions/" + entityId)
                  .set({
                    love: 0,
                    happy: 0,
                    wow: 0,
                    angry: 0,
                    sad: 0,
                    afraid: 0,
                  });
                firebase
                  .database()
                  .ref("users/" + userInfo.id + "/" + entityId)
                  .set({
                    love: 0,
                    happy: 0,
                    wow: 0,
                    angry: 0,
                    sad: 0,
                    afraid: 0,
                  });
              });

              if (tagged.length !== 0) {
                firebase
                  .firestore()
                  .collection("hashtags")
                  .doc(tagged[0])
                  .set(
                    {
                      username: tagged[0],
                      cards: firebase.firestore.FieldValue.increment(1),
                      clout: firebase.firestore.FieldValue.increment(1),
                    },
                    { merge: true }
                  );
                firebase
                  .database()
                  .ref("hashtags/" + tagged[0])
                  .once("value")
                  .then((snapshot) => {
                    if (!snapshot.val()) {
                      // data doesnt exist, do something
                      firebase
                        .database()
                        .ref("hashtags/" + tagged[0])
                        .set({
                          love: 0,
                          happy: 0,
                          wow: 0,
                          angry: 0,
                          sad: 0,
                          afraid: 0,
                        });
                    }
                  });
              }
              if (mentioned.length !== 0) {
                mentioned.forEach((mention) => {
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
                              mentions:
                                firebase.firestore.FieldValue.increment(1),
                              clout: firebase.firestore.FieldValue.increment(1),
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
              firebase
                .firestore()
                .collection("usernames")
                .doc(userInfo.id)
                .set(
                  {
                    mentions: firebase.firestore.FieldValue.increment(1),
                    clout: firebase.firestore.FieldValue.increment(1),
                  },
                  { merge: true }
                );
              if (address.city.replace(/[^A-Za-z0-9]/g, "") !== "") {
                firebase
                  .firestore()
                  .collection("locations")
                  .doc(address.city.replace(/[^A-Za-z0-9]/g, ""))
                  .set(
                    {
                      city: address.city,
                      country: address.country,
                      cards: firebase.firestore.FieldValue.increment(1),
                      clout: firebase.firestore.FieldValue.increment(1),
                    },
                    { merge: true }
                  );
                firebase
                  .database()
                  .ref("locations/" + address.city.replace(/[^A-Za-z0-9]/g, ""))
                  .once("value")
                  .then((snapshot) => {
                    if (!snapshot.val()) {
                      // data doesnt exist, do something
                      firebase
                        .database()
                        .ref(
                          "locations/" +
                            address.city.replace(/[^A-Za-z0-9]/g, "")
                        )
                        .set({
                          love: 0,
                          happy: 0,
                          wow: 0,
                          angry: 0,
                          sad: 0,
                          afraid: 0,
                        });
                    }
                  });
              }
              setChirpPosting(false);
              setCharCount(140);
              setInputModal(false);
              if (replyingTo !== null) setReplyingTo(null);
            }
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
    } else {
      setChirpPosting(false);
      Alert.alert(
        "Not a valid HashTag",
        "Your #tag must be between 5 and 15 characters and contain only letters, numbers, and underscores and no spaces.",
        [
          {
            text: "OK",
            style: "cancel",
          },
        ],
        { cancelable: false }
      );
    }
  };

  const words = React.useMemo(() => {
    let dump = nlp(inputData);
    let json = dump.json();
    if (json.length === 0) return [];
    else {
      let termArray = json.map((obj) => obj.terms);
      termArray = [].concat.apply([], termArray);
      console.log("dump:", termArray);
      let mentioned = termArray
        .filter(
          (obj) => obj.tags.includes("AtMention") || obj.text.startsWith("@")
        )
        .map((obj) => obj.text);
      let tagged = termArray
        .filter(
          (obj) => obj.tags.includes("HashTag") || obj.text.startsWith("#")
        )
        .map((obj) => obj.text);
      console.log("mentioned", mentioned);
      console.log("mentionList", mentionsList);
      console.log(tagged);
      if (
        JSON.stringify(tagsList) !== JSON.stringify(tagged) &&
        mentionListener === true
      ) {
        let currentEdit = tagged.filter(function (obj) {
          return tagsList.indexOf(obj) == -1;
        });
        console.log(currentEdit[0]);
        setText(currentEdit[0]);
        console.log(text);
        if (currentEdit[0] !== undefined) {
          tagRef
            .where("username", ">=", currentEdit[0].substring(1))
            .where("username", "<=", currentEdit[0].substring(1) + "\uf8ff")
            .orderBy("username")
            .limit(5)
            .get()
            .then((documentSnapshots) => {
              // Get the last visible document
              //var lastVisible =
              //documentSnapshots.docs[documentSnapshots.docs.length - 1];
              // console.log("last", lastVisible);

              // Construct a new query starting at this document,
              // get the next 25 cities.
              // var next = userRef
              //         .orderBy("clout")
              //         .startAfter(lastVisible)
              //         .limit(10);
              console.log(documentSnapshots.docs.length);
              let tempList = [];
              documentSnapshots.forEach((doc) => {
                console.log(doc.data().username);
                // doc.data() is never undefined for query doc snapshots
                let temp = doc.data();
                temp["colors"] = [
                  "#00FF33", //green
                  "#0085FF", //blue
                  "#FFFB00",
                ];
                temp["type"] = "tag";
                tempList.push(temp);
              });
              setSuggestionsData(tempList);
              setMentionListener(false);
              setTagsList(tagged);
              if (suggestionRowHeight._value === 0) {
                openSuggestionsPanel(140);
              }
            });
          // if (selectedMention !== "") {
          //   let remaining = selectedMention.replace(currentEdit[0], "");
          //   let input = inputData;
          //   input =
          //     input.slice(0, selection.start) +
          //     remaining +
          //     " " +
          //     input.slice(selection.end);
          //   setInputData(input);
          //   setSelectedMention("");
          // }
        } else {
          if (suggestionRowHeight._value !== 0) {
            closeSuggestionsPanel();
          }
        }
      } else {
        if (suggestionRowHeight._value !== 0) {
          closeSuggestionsPanel();
        }
      }

      if (
        JSON.stringify(mentionsList) !== JSON.stringify(mentioned) &&
        mentionListener === true
      ) {
        let currentEdit = mentioned.filter(function (obj) {
          return mentionsList.indexOf(obj) == -1;
        });
        setText(currentEdit[0]);
        // console.log(text);
        if (currentEdit[0] !== undefined) {
          userRef
            .where("username", ">=", currentEdit[0])
            .where("username", "<=", currentEdit[0] + "\uf8ff")
            .orderBy("username")
            .limit(5)
            .get()
            .then((documentSnapshots) => {
              // Get the last visible document
              //var lastVisible =
              //documentSnapshots.docs[documentSnapshots.docs.length - 1];
              // console.log("last", lastVisible);

              // Construct a new query starting at this document,
              // get the next 25 cities.
              // var next = userRef
              //         .orderBy("clout")
              //         .startAfter(lastVisible)
              //         .limit(10);
              console.log(documentSnapshots.docs.length);
              let tempList = [];
              documentSnapshots.forEach((doc) => {
                console.log(doc.data().name);
                // doc.data() is never undefined for query doc snapshots
                let temp = doc.data();
                temp["colors"] = [
                  "#00FF33", //green
                  "#0085FF", //blue
                  "#FFFB00",
                ];
                temp["type"] = "mention";
                tempList.push(temp);
              });
              setSuggestionsData(tempList);
              setMentionListener(false);
              setMentionsList(mentioned);
              if (suggestionRowHeight._value === 0) {
                openSuggestionsPanel(140);
              }
            });
          // if (selectedMention !== "") {
          //   let remaining = selectedMention.replace(currentEdit[0], "");
          //   let input = inputData;
          //   input =
          //     input.slice(0, selection.start) +
          //     remaining +
          //     " " +
          //     input.slice(selection.end);
          //   setInputData(input);
          //   setSelectedMention("");
          // }
        } else {
          if (suggestionRowHeight._value !== 0) {
            closeSuggestionsPanel();
          }
        }
      } else {
        if (suggestionRowHeight._value !== 0) {
          closeSuggestionsPanel();
        }
      }
      return termArray;
    }
    // return dump.words().map((word) => ({
    //   currentEdit[0]: word.text ? word.text().trim() : "",
    //   id: word.list[0] ? word.list[0].start : "",
    //   tags: word.json() ? word.json()[0].terms[0].tags : [],
    // }));
  }, [inputData]);

  const _chirpOutput = () => {
    if (words.length === 0) return <Text></Text>;
    else {
      return (
        <Text>
          {words.map(({ text, tags, pre, post }, index) => {
            if (tags.includes("AtMention") || text.startsWith("@")) {
              return (
                <Text key={index} style={{ color: "blue" }}>
                  {pre}
                  {text}
                  {post}
                </Text>
              );
            } else if (tags.includes("HashTag") || text.startsWith("#")) {
              return (
                <Text key={index} style={{ color: "green" }}>
                  {pre}
                  {text}
                  {post}
                </Text>
              );
            } else if (tags.includes("Url")) {
              return (
                <Text key={index} style={{ color: "orange" }}>
                  {pre}
                  {text}
                  {post}
                </Text>
              );
            } else {
              return (
                <Text key={index} style={{ color: "black" }}>
                  {pre}
                  {text}
                  {post}
                </Text>
              );
            }
          })}
        </Text>
      );
    }
  };

  const _chirpInput = (inputText) => {
    if (mentionListener === false) setMentionListener(true);
    setInputData(inputText);
  };

  function closeSuggestionsPanel() {
    if (suggestionsData.length !== 0) setSuggestionsData([]);
    Animated.timing(suggestionRowHeight, {
      toValue: 0,
      duration: 100,
      useNativeDriver: false,
    }).start();
  }

  function openSuggestionsPanel(height) {
    // console.log("trying?");
    Animated.timing(suggestionRowHeight, {
      toValue: height != null ? height : height,
      duration: 100,
      useNativeDriver: false,
    }).start();
  }

  const _handleSelectionChange = ({
    nativeEvent: {
      selection: { start, end },
    },
  }) => {
    setSelection({ start, end });
    console.log(selection);
  };

  function renderSuggestionsRow(rowItem) {
    let l = rowItem.item;
    console.log("here", l, suggestionRowHeight);
    if (l.type === "mention") {
      return (
        <ListItem
          containerStyle={{
            alignSelf: "center",
            width: 0.7 * width,
            height: 120,
            borderRadius: 10,
            marginHorizontal: 10,
            marginVertical: 10,
            backgroundColor: "black",
          }}
          key={l.id}
          onPress={() => {
            // let mentioned = words
            //   .filter(
            //     (obj) =>
            //       obj.tags.includes("AtMention") || obj.text.startsWith("@")
            //   )
            //   .map((obj) => obj.text);
            // let text = mentioned.filter(function (obj) {
            //   return mentionsList.indexOf(obj) == -1;
            // });
            // text = text[0];
            let remaining = l.username.replace(text, "");
            let input = inputData;
            input =
              input.slice(0, selection.start) +
              remaining +
              " " +
              input.slice(selection.end);
            setInputData(input);
            let newMentionsList = mentionsList;
            newMentionsList[mentionsList.indexOf(text)] = l.username;
            setMentionsList(newMentionsList);
          }}
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
              xlarge
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
                  {l.username}
                </Text>
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
                  {l.mentions} Mentions with Clout{" "}
                  {l.clout === 0
                    ? l.clout
                    : Math.round(
                        (10 * Math.log10(l.clout) + Number.EPSILON) * 100
                      ) / 100}{" "}
                  dB
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
        </ListItem>
      );
    }
    if (l.type === "tag") {
      return (
        <ListItem
          containerStyle={{
            alignSelf: "center",
            width: 0.7 * width,
            height: 120,
            borderRadius: 10,
            marginHorizontal: 10,
            marginVertical: 10,
            backgroundColor: "black",
          }}
          key={l.username}
          onPress={() => {
            // let mentioned = words
            //   .filter(
            //     (obj) =>
            //       obj.tags.includes("AtMention") || obj.text.startsWith("@")
            //   )
            //   .map((obj) => obj.text);
            // let text = mentioned.filter(function (obj) {
            //   return mentionsList.indexOf(obj) == -1;
            // });
            // text = text[0];
            console.log("text:", text);
            let remaining = l.username.replace(text.substring(1), "");
            let input = inputData;
            input =
              input.slice(0, selection.start) +
              remaining +
              " " +
              input.slice(selection.end);
            setInputData(input);
            let newTagsList = tagsList;
            newTagsList[tagsList.indexOf(text)] = l.username;
            setTagsList(newTagsList);
          }}
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
                  #{l.username}
                </Text>
                <Text
                  style={{
                    color: "#99AAAB",
                    fontSize: 15,
                  }}
                >
                  {l.cards} Cards with Clout{" "}
                  {l.clout === 0
                    ? l.clout
                    : Math.round(
                        (10 * Math.log10(l.clout) + Number.EPSILON) * 100
                      ) / 100}{" "}
                  dB
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
        </ListItem>
      );
    }
  }
  // const [value, onChange] = useState([
  //   "",
  //   [
  //     ["@cawfree", PATTERN_MENTION],
  //     ["#cawfree", PATTERN_HASHTAG],
  //   ],
  // ]);
  // const [_, { length: numberOfSegments }] = value;
  // console.log(`Number of segments: ${numberOfSegments}.`);
  function renderChirpMedia() {
    if (chirpMedia.length !== 0)
      return (
        <View
          style={{
            marginBottom: 0,
            height: 110,
            flex: 0,
            width: "100%",
          }}
        >
          <ScrollView style={{ width: "100%" }} horizontal={true}>
            {chirpMedia.map((obj, index) => (
              <View key={obj.id}>
                {/* <Button
                  rounded
                  style={{
                    color: "black",
                    height: 50,
                    width: 50,
                    alignSelf: "flex-end",
                    justifyContent: "center",
                  }}
                  onPress={() => console.log("Pressed")}
                  danger
                >
                  <Icon name="close" style={{ color: "red" }} />
                </Button> */}
                {obj.mediaType === "photo" ? (
                  <ImageBackground
                    source={{ uri: obj.uri }}
                    style={{ width: 100, height: 100 }}
                    PlaceholderContent={<ActivityIndicator />}
                    //
                  >
                    <Button
                      transparent
                      style={{
                        height: 35,
                        width: 50,
                        alignSelf: "flex-end",
                        justifyContent: "center",
                      }}
                      onPress={() => {
                        let imgList = chirpMedia;
                        setChirpMedia(imgList.filter((item) => item !== obj));
                      }}
                    >
                      <Icon
                        name="close"
                        style={{ color: "red", fontSize: 25 }}
                      />
                    </Button>
                  </ImageBackground>
                ) : (
                  <ImageBackground
                    source={{ uri: obj.uri }}
                    style={{ width: 100, height: 100 }}
                    PlaceholderContent={<ActivityIndicator />}
                    //
                  >
                    <Button
                      transparent
                      style={{
                        height: 35,
                        width: 50,
                        alignSelf: "flex-end",
                        justifyContent: "center",
                      }}
                      onPress={() => {
                        let imgList = chirpMedia;
                        setChirpMedia(imgList.filter((item) => item !== obj));
                      }}
                    >
                      <Icon
                        name="close"
                        style={{ color: "red", fontSize: 25 }}
                      />
                    </Button>
                    <Icon
                      name="play"
                      style={{
                        color: "white",
                        fontSize: 25,
                        alignSelf: "center",
                      }}
                    />
                  </ImageBackground>
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      );
    else return <View />;
  }
  return (
    <View
      style={{
        //   ...Platform.select({
        //     android: {
        //       marginTop: StatusBar.currentHeight,
        //     },
        //   }),
        flex: 1,
      }}
    >
      {/* <MyStatusBar backgroundColor="#444444" barStyle="light-content" /> */}
      {renderLocation()}

      <KeyboardAvoidingView
        behavior="position"
        keyboardVerticalOffset={Platform.select({
          ios: 0,
          android: 20, //56,
        })}
      >
        <Header
          searchBar
          rounded
          autoCorrect={false}
          autoCapitalize="none"
          toolbarDefaultBg="#222222"
          style={
            location === true
              ? { backgroundColor: Default.primary }
              : { backgroundColor: Default.white }
          }
          androidStatusBarColor="#222222"
          toolbarBtnColor="#222222"
          transparent
        >
          {goBack === 0.75 ? (
            <Left style={{ flex: 0.1 }}>
              <Button iconLeft transparent onPress={backHome}>
                <Icon
                  name="chevron-back-outline"
                  style={
                    location === false
                      ? { color: Default.primary }
                      : { color: Default.white }
                  }
                />
              </Button>
            </Left>
          ) : (
            <View></View>
          )}

          <Item style={{ flex: goBack }}>
            <Icon name="eye-outline" />
            <Input
              autoCapitalize="words"
              onChangeText={textChange} // <-- Here
              placeholder="Search"
              value={search}
              onFocus={trendFromHome}
            />
            <Icon name="flame-outline" />
          </Item>

          {goBack === 0.75 ? (
            <Right style={{ flex: 0.15 }}>
              {location === false ? (
                <Button iconLeft transparent onPress={mapFromTrend}>
                  <Icon name="ios-pin" style={{ color: Default.primary }} />
                </Button>
              ) : (
                <Button iconLeft transparent onPress={trendFromMap}>
                  <Icon name="flame" style={{ color: Default.white }} />
                </Button>
              )}
            </Right>
          ) : (
            <Right style={{ flex: 0.275 }}>
              <Button iconLeft transparent onPress={mapFromHome}>
                <Icon name="ios-pin" style={{ color: Default.primary }} />
              </Button>
              <Button
                iconLeft
                transparent
                onPress={() => {
                  if (address[0] !== "") {
                    setInputModal(true);
                  }
                }}
              >
                <Icon name="md-create" style={{ color: Default.primary }} />
              </Button>
            </Right>
          )}
        </Header>
      </KeyboardAvoidingView>
      <Modal
        backdrop={true}
        style={[
          styles.modal,
          {
            position: "absolute",
            bottom: bottomHeight,
            top: 60,
          },
        ]}
        isOpen={inputModal}
        onClosed={() => setInputModal(false)}
      >
        <View
          style={{
            alignSelf: "flex-start",
            alignItems: "center",
            flexDirection: "row",
            padding: 5,
            paddingRight: 10,
          }}
        >
          <Button
            transparent
            onPress={() => {
              setCharCount(140);
              setInputModal(false);
              if (replyingTo !== null) setReplyingTo(null);
            }}
          >
            <Icon name="close" style={{ color: "black", fontSize: 32 }} />
          </Button>
          <View style={{ flex: 1 }} />
          {chirpPosting === true ? <Spinner /> : null}
          {charCount > 0 ? (
            <Button
              rounded
              style={{
                color: "black",
                height: 40,
                width: 94,
                justifyContent: "center",
              }}
              onPress={() => {
                setChirpPosting(true);
                _chirpPost();
              }}
              dark
            >
              <Text
                style={{ color: "white", fontSize: 15, fontWeight: "bold" }}
              >
                Chirp
              </Text>
            </Button>
          ) : (
            <Button
              rounded
              style={{
                color: "black",
                height: 40,
                width: 94,
                justifyContent: "center",
              }}
              disabled
            >
              <Text
                style={{ color: "white", fontSize: 15, fontWeight: "bold" }}
              >
                Chirp
              </Text>
            </Button>
          )}
          {/* <Button
            rounded
            style={{
              color: "black",
              height: 40,
              width: 94,
              justifyContent: "center",
            }}
            onPress={() => console.log("New Tweet")}
            dark
          >
            <Text style={{ color: "white", fontSize: 15, fontWeight: "bold" }}>
              Chirp
            </Text>
          </Button> */}
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "flex-start",
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            style={{
              flex: 1,
              width: "100%",
              marginBottom: 34 + bottomHeight,
            }}
          >
            <TextInput
              style={{
                flex: 1,
                width: "100%",
                height: "10%",
                fontSize: 24,
                alignContent: "flex-start",
                justifyContent: "flex-start",
                textAlignVertical: "top",
                margin: 5,
                paddingHorizontal: 5,
              }}
              multiline={true}
              numberOfLines={6}
              autoFocus={true}
              onChangeText={_chirpInput}
              placeholder="What's happening?"
              onSelectionChange={_handleSelectionChange}
            >
              {_chirpOutput()}
            </TextInput>
            <Animated.View
              style={[
                styles.suggestionsPanelStyle,
                { height: suggestionRowHeight },
              ]}
            >
              <FlatList
                keyboardShouldPersistTaps="always"
                horizontal={true}
                ListEmptyComponent={Spinner}
                data={suggestionsData}
                keyExtractor={(item) => item.username}
                renderItem={(rowData) => {
                  return renderSuggestionsRow(rowData);
                }}
              />
            </Animated.View>
            {chirpMedia.length === 0 ? (
              <LinkPreview renderText={(text) => <Text />} text={inputData} />
            ) : (
              <View />
            )}
          </ScrollView>
          {/* <SegmentedTextInput
            style={{
              width: width - 30,
              fontSize: 24,
              alignContent: "flex-start",
              justifyContent: "flex-start",
              textAlignVertical: "top",
              margin: 5,
              paddingHorizontal: 5,
            }}
            multiline
            numberOfLines={6}
            ref={ref}
            value={value}
            onChange={onChange}
            placeholder="" //"Awaiting your 50 word Précis..."
            onSuggest={(str) =>
              new Promise((resolve) => setTimeout(resolve, 2000)).then(() => [
                `${str}0`,
                `${str}1`,
                `${str}2`,
              ])
            }
          /> */}
        </View>
        <KeyboardAvoidingView
          behavior="position"
          contentContainerStyle={[
            // styles.modalFooter,
            { width: "100%" },
          ]}
          keyboardVerticalOffset={Platform.select({
            ios: -20,
            android: -20, //56,
          })}
        >
          {renderChirpMedia()}
          <View style={[styles.modalFooter, { height: 90 + bottomHeight }]}>
            <Button
              onPress={() => {
                Keyboard.dismiss();
                navigation.navigate("ImagePicker");
              }}
              transparent
            >
              <Icon name="ios-image" style={{ color: Default.primary }} />
            </Button>
            <View style={{ flex: 1 }} />
            <Button onPress={getAddress} transparent>
              <Text style={{ color: Default.primary, fontSize: 15 }}>
                {address.city}
                {", "}
                {address.country}
              </Text>
            </Button>
            <View style={{ flex: 1 }} />
            <Button transparent>
              <Text style={{ color: "#222222", fontSize: 15, marginRight: 15 }}>
                {140 - inputData.length}
              </Text>
            </Button>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      {renderTrending()}

      {renderSwipeDeck()}
    </View>
  );
}
const Wrapper2 = styled.View`
  align-items: center;

  ${({ theme: { space } }) => ({
    padding: 18,
  })}
`;
const Container2 = styled.View`
  flex: 1;

  ${({ topHeight, theme: { Default } }) => ({
    backgroundColor: "#222222",
    paddingTop: topHeight,
  })}
`;
const Box = styled.ScrollView`
  ${({ theme: { space } }) => ({
    paddingHorizontal: 24,
    paddingVertical: 12,
  })}
`;
const Wrapper = styled.View`
  flex: 1;
  z-index: -1;
  overflow: hidden;

  ${({ theme: { space, radii } }) => ({
    borderBottomRightRadius: 75,
    borderBottomLeftRadius: 75,
    paddingBottom: 40 + 4,
  })}
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    zIndex: 0,
    backgroundColor: "white",
  },
  statusBar: {
    height: StatusBar.currentHeight,
  },

  card: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
    width: width * 0.8,
    height: width * 1.05,
  },
  cardsText: {
    fontSize: 22,
  },
  reaction: {
    width: 120,
    height: 120,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  reaction2: {
    width: 20,
    height: 20,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "flex-start",
    borderColor: Default.love,
    borderWidth: 2,
    borderRadius: 5,
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  carouselContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    height: 90,
    width: 300,
    padding: 24,
    borderRadius: 24,
    justifyContent: "center",
  },
  carouselImage: {
    height: 120,
    width: 300,
    bottom: 0,
    position: "absolute",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  carouselTitle: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    alignSelf: "center",
  },
  carouselSubtitle: {
    color: "#99AAAB",
    fontSize: 15,
    alignSelf: "center",
  },
  love: {
    borderColor: Default.love,
    borderWidth: 2,
    position: "absolute",
    padding: 20,
    bottom: 20,
    borderRadius: 5,
    right: 0,
  },
  happy: {
    borderColor: Default.happy,
    borderWidth: 2,
    position: "absolute",
    padding: 20,
    bottom: 20,
    borderRadius: 5,
    right: 0,
  },
  wow: {
    borderColor: Default.wow,
    borderWidth: 2,
    position: "absolute",
    padding: 20,
    bottom: 20,
    borderRadius: 5,
    right: 0,
  },
  yupText: {
    fontSize: 16,
    color: "green",
  },
  maybe: {
    borderColor: "blue",
    borderWidth: 2,
    position: "absolute",
    padding: 20,
    bottom: 20,
    borderRadius: 5,
    right: 20,
  },
  maybeText: {
    fontSize: 16,
    color: "blue",
  },
  angry: {
    borderColor: Default.angry,
    borderWidth: 2,
    position: "absolute",
    bottom: 20,
    padding: 20,
    borderRadius: 5,
    left: 0,
  },
  sad: {
    borderColor: Default.sad,
    borderWidth: 2,
    position: "absolute",
    bottom: 20,
    padding: 20,
    borderRadius: 5,
    left: 0,
  },
  afraid: {
    borderColor: Default.afraid,
    borderWidth: 2,
    position: "absolute",
    bottom: 20,
    padding: 20,
    borderRadius: 5,
    left: 0,
  },
  nopeText: {
    fontSize: 16,
    color: "red",
  },
  androidHeader: {
    ...Platform.select({
      android: {
        marginTop: StatusBar.currentHeight,
      },
    }),
    backgroundColor: "white",
    flex: 0.18,
    height: "100%",
  },
  mapStyle: {
    width: Dimensions.get("window").width,
    height: "100%",
    // ...StyleSheet.absoluteFillObject,
  },
  modalFooter: {
    backgroundColor: "white",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0.2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 5,
  },
  suggestionsPanelStyle: { backgroundColor: "rgba(100,100,100,0.1)" },
  modal: {
    justifyContent: "flex-start",
    alignItems: "center",
    position: "absolute",
    zIndex: 4,
    elevation: 4,
  },
});
