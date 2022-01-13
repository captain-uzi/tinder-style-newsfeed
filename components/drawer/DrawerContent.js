import { DrawerContentScrollView } from "@react-navigation/drawer";
import React, { useState } from "react";
import { Alert } from "react-native";
import Animated, {
  Extrapolate,
  interpolateNode,
} from "react-native-reanimated";
import styled from "styled-components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import colors from "../../utils/colors";
import drawerMenu from "./drawerMenu";
import View from "../../utils/View";
import Avatar from "./Avatar";
import HeaderBar from "./HeaderBar";
import DrawerItem from "./DrawerItem";
import ImgFooter from "./ImgFooter";
import "@firebase/firestore";
import firebaseConfig from "../components/Firebase/firebaseConfig";
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const DrawerContent = ({ progress, ...rest }) => {
  const [userInfo, setUserInfo] = useState("");
  const routeKey = rest.state.routes[0].key;

  const scale = interpolateNode(progress, {
    inputRange: [0, 1],
    outputRange: [0.5, 1],
    extrapolate: Extrapolate.CLAMP,
  });
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
    if (userInfo === "") {
      let useinf = await retrieveData();
      firebase
        .firestore()
        .collection("usernames")
        .doc(useinf.id)
        .get()
        .then((doc) => {
          if (doc.exists) {
            setUserInfo(doc.data());
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
    } else {
      return (
        <View container>
          <View heading>
            <HeaderBar
              dark
              white
              title="my profile"
              left={{
                icon: "chevron-left",
                onPress: () => rest.navigation.closeDrawer(),
              }}
              right={{ icon: "lock-pattern", onPress: () => true }}
            />
          </View>
          <View bdBox />

          <Medium>
            <Avatar userInfo={userInfo} />
            <Menu>
              <DrawerContentScrollView
                {...rest}
                showsVerticalScrollIndicator={false}
              >
                <Animated.View style={{ transform: [{ scale }] }}>
                  {drawerMenu.map((item, i) => (
                    <DrawerItem
                      key={i}
                      label={item.label}
                      color={item.color}
                      focused={
                        item.title ===
                        rest.descriptors[routeKey].options.headerTitle
                      }
                      icon={item.icon}
                      onPress={() => rest.navigation.navigate(item.screen)}
                    />
                  ))}
                </Animated.View>
              </DrawerContentScrollView>
            </Menu>
            <Seperator />
            <Logout>
              <DrawerItem
                label="LogOut"
                color={colors.secondary}
                icon="logout"
                onPress={() => Alert.alert("Logout")}
              />
            </Logout>
          </Medium>
          <ImgFooter />
        </View>
      );
    }
  })();
};

const Medium = styled.View`
  flex: 1;
  margin-top: -75px;
  margin-bottom: -75px;

  ${({ theme: { colors, radii, space } }) => ({
    backgroundColor: colors.white,
    borderTopLeftRadius: radii.xl,
    borderBottomRightRadius: radii.xl,
    padding: space.l1,
    paddingBottom: space.n,
  })};
`;

const Menu = styled.View`
  margin-top: 45px;
  flex: 1;
`;

const Seperator = styled.View`
  height: 1px;

  ${({ theme: { colors, space } }) => ({
    backgroundColor: colors.violet,
    marginBottom: space.s1,
    marginHorizontal: space.m1,
  })}
`;

const Logout = styled.View`
  border-top-width: 1px;
  overflow: hidden;

  ${({ theme: { colors, space, radii } }) => ({
    borderColor: colors.violet,
    borderRadius: radii.m2,
    marginBottom: space.m1,
  })}
`;

export default DrawerContent;
