import { Feather } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { Pressable } from "react-native";
import styled from "styled-components";
import Default from "../utils/colors";
import calendar from "../utils/calendar";
import Text from "../utils/Text";
import Image from "../utils/Image";
import { View, Modal, Alert } from "react-native";
import * as firebase from "firebase";
import "@firebase/firestore";
import firebaseConfig from "../components/Firebase/firebaseConfig";
const { CDCARD_WIDTH, CDCARD_HEIGHT } = calendar;
const plusBoxWidth = CDCARD_WIDTH * 0.75;
const plusBoxHeight = CDCARD_HEIGHT * 0.7;
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const CreditCardInput = ({ card, primary, onAddCard, onChangeCard }) => {
  const [selected, setSelected] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  // const [user, setUser] = useState("");
  // const [entity, setEntity] = useState("");
  // const [reload, setReload] = useState(false);
  // if (reload === true) {
  //   firebase
  //     .firestore()
  //     .collection("entitynames")
  //     .doc(card.entity)
  //     .get()
  //     .then((doc) => {
  //       if (doc.exists) {
  //         setEntity(doc.data());
  //         console.log(
  //           "erhgfiuerfgbhreuieruigbeibuiiuuurruguiruuirueurhuieueuihuhueuruirhuhureh",
  //           doc.data()
  //         );
  //         firebase
  //           .firestore()
  //           .collection("usernames")
  //           .doc(doc.data().author)
  //           .get()
  //           .then((doc2) => {
  //             if (doc2.exists) {
  //               setUser(doc2.data());
  //               setReload(false);
  //             } else {
  //               // doc2.data() will be undefined in this case
  //               console.log("No such document2!");
  //             }
  //           })
  //           .catch((error) => {
  //             console.log("Error getting document:", error);
  //           });
  //       } else {
  //         // doc.data() will be undefined in this case
  //         console.log("No such document!");
  //       }
  //     })
  //     .catch((error) => {
  //       console.log("Error getting document:", error);
  //     });
  // }
  const dateobject = new Date(parseInt(card.timestamp));
  const handlePress = () => {
    // setReload(true);
    if (!card) () => onAddCard();
    onChangeCard(card, selected);
    setSelected((prev) => !prev);
  };
  const handleLongPress = () => {
    setModalVisible(true);
  };
  function timeSince(timeStamp) {
    var now = new Date();
    let secondsPast = (now.getTime() - timeStamp) / 1000;
    if (secondsPast < 60) {
      return parseInt(secondsPast) + "s ago";
    }
    if (secondsPast < 3600) {
      return parseInt(secondsPast / 60) + "m ago";
    }
    if (secondsPast <= 86400) {
      return parseInt(secondsPast / 3600) + "h ago";
    }
    if (secondsPast > 86400) {
      let day = timeStamp.getDate();
      let month = timeStamp
        .toDateString()
        .match(/ [a-zA-Z]*/)[0]
        .replace(" ", "");
      let year =
        timeStamp.getFullYear() == now.getFullYear()
          ? ""
          : " " + timeStamp.getFullYear();
      return day + " " + month + year;
    }
  }
  function getEmoji(key) {
    switch (key) {
      case "afraid":
        return "😱";

        break;
      case "sad":
        return "😞";

        break;
      case "angry":
        return "😡";

        break;
      case "wow":
        return "😝";

        break;
      case "happy":
        return "😇";

        break;
      case "love":
        return "😍";

        break;

      default:
        break;
    }
  }
  function getReactions() {
    return (
      <View
        style={{
          marginVertical: 15,
          // marginHorizontal: 20,
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        {Object.keys(card.reactions).length !== 0 &&
        card.reactions.constructor === Object ? (
          Object.entries(card.reactions).map(([key, value]) => (
            <Text key={key} style={{ fontSize: 15, color: "#99AAAB" }}>
              {getEmoji(key)} {value}
            </Text>
          ))
        ) : (
          <View />
        )}
      </View>
    );
  }

  return (
    <Container>
      {selected && card && <Dot {...{ primary }} />}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 22,
          }}
        >
          <View
            style={{
              margin: 20,
              backgroundColor: "white",
              borderRadius: 20,
              padding: 35,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <Pressable
              style={[
                {
                  borderRadius: 20,
                  padding: 10,
                  elevation: 2,
                  marginBottom: 10,
                },
                {
                  backgroundColor: "#2196F3",
                },
              ]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text>Open Card</Text>
            </Pressable>
            <Pressable
              style={[
                {
                  borderRadius: 20,
                  padding: 10,
                  elevation: 2,
                  marginBottom: 10,
                },
                {
                  backgroundColor: "#00FF33",
                },
              ]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text>View Reactions</Text>
            </Pressable>
            <Pressable
              style={[
                {
                  borderRadius: 20,
                  padding: 10,
                  elevation: 2,
                },
                {
                  backgroundColor: "#e91e63",
                },
              ]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Pressable
        style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
        onPress={handlePress}
        onLongPress={handleLongPress}
      >
        {card && (
          <Box {...{ primary, selected }}>
            <View style={{ flexDirection: "row" }}>
              <Image
                logo
                {...{ primary }}
                resizeMode={!primary ? "contain" : "cover"}
                source={
                  primary
                    ? {
                        uri: card.user.dp,
                      }
                    : {
                        uri: card.user.dp,
                      }
                }
              />
              <View style={{ flexDirection: "column", marginLeft: 15 }}>
                <Info
                  style={{ fontWeight: "bold" }}
                  opacity={0.9}
                  {...{ primary }}
                >
                  {card.user.username}
                </Info>
                <Info caption opacity={0.7} {...{ primary }}>
                  Clout{" "}
                  {Math.round(
                    (20 * Math.log10(card.entity.curators) + Number.EPSILON) *
                      100
                  ) / 100}{" "}
                  dB, Created{" "}
                  {String(timeSince(new Date(parseInt(card.entity.timestamp))))}
                </Info>
              </View>
            </View>
            <InfoWrapper {...{ primary }}>
              <Info mtp mbt title3 {...{ primary }}>
                {card.entity !== ""
                  ? card.entity.text
                  : "Press to reload with current information!!!"}
              </Info>
            </InfoWrapper>
            {getReactions()}
            <InfoWrapper2>
              <Info opacity={0.9} {...{ primary }}>
                {card.entity !== "" ? card.entity.media.length : 0} Attached
                Files
              </Info>
              <Info caption opacity={0.7} {...{ primary }}>
                {card.entity.numberOfReplies} Replies, Curated{" "}
                {String(timeSince(dateobject))}
              </Info>
            </InfoWrapper2>
          </Box>
        )}
        {!card && (
          <PlusBox>
            <Feather name="plus" size={36} color={Default.white} />
          </PlusBox>
        )}
      </Pressable>
    </Container>
  );
};

const Container = styled.View`
  align-items: center;

  ${({ theme: { space } }) => ({
    marginRight: 18,
  })}
`;

const PlusBox = styled.View`
  width: ${plusBoxWidth}px;
  height: ${plusBoxHeight}px;
  justify-content: center;
  align-items: center;

  ${({ theme: { colors, radii } }) => ({
    backgroundColor: Default.white2,
    borderRadius: 10,
  })}
`;

const Box = styled.View`
  width: ${CDCARD_WIDTH}px;
  height: ${CDCARD_HEIGHT}px;

  ${({ primary, selected, theme: { colors, radii, space } }) => ({
    backgroundColor: primary ? Default.secondary : Default.white,
    borderRadius: 10,
    borderWidth: 2,
    padding: 12,
    opacity: selected ? 1 : 0.5,
  })}
`;

const Dot = styled.View`
  width: 10px;
  height: 10px;
  border-radius: 5px;

  ${({ primary, theme: { colors, space } }) => ({
    backgroundColor: primary ? Default.secondary : Default.black,
    marginVertical: 12,
  })}
`;

const InfoWrapper = styled.View`
  ${({ primary, theme: { space } }) => ({
    marginLeft: 12,
    marginTop: primary ? 4 : 0,
  })}
`;
const InfoWrapper2 = styled.View`
  ${({ primary, theme: { space } }) => ({
    marginLeft: 12,
    marginRight: 12,
    position: "absolute",
    bottom: primary ? 4 : 4,
    left: 12,
    right: 12,
  })}
`;
const Info = styled(Text)`
  ${({ primary, theme: { colors } }) => ({
    color: primary ? Default.white : Default.text,
  })}
`;

export default CreditCardInput;
