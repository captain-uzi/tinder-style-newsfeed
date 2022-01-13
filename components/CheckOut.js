/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import styled from "styled-components";
import CombinationButton from "../components/CombinationButton";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-elements";
import ProfileStack from "../navigation/ProfileStack";
import Default from "../utils/colors";
import TextTicker from "react-native-text-ticker";
import { FlatList, Text, TouchableOpacity } from "react-native";
import { View } from "react-native";
const Tab = createBottomTabNavigator();
// const DATA = [
//   {
//     id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
//     title: "Trending",
//   },
//   {
//     id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
//     title: "Latest",
//   },
//   {
//     id: "58694a0f-3da1-471f-bd96-145571e29d72",
//     title: "For You",
//   },
// ];
// const Item = ({ title }) => (
//   <Text
//     style={{
//       fontSize: 24,
//       alignSelf: "flex-end",
//       color: "white",
//       marginBottom: 15,
//       marginHorizontal: 15,
//     }}
//   >
//     {title}
//   </Text>
// );
const CheckOut = ({ topHeight, onChange }) => {
  const renderItem = ({ item }) => <Item title={item.title} />;
  const [choice, setChoice] = useState(0);
  return (
    <Container {...{ topHeight }}>
      {/* <CreditCardInputList cards={creditCards} /> */}
      {/* <Box> */}
      {/* <Info>Delivery address</Info>
        <InfoBox>
          <Info mtp caption opacity={0.55}>
            Unit 15,YorkFarmBusiness Centre,{'\n'}Watling St.Towceter
          </Info>
          <Button
            label="Change"
            bgColor="transparent"
            paddingHorizontal={0}
            textStyle={{ color: colors.lightGrey2 }}
            onPress={() => true}
          />
        </InfoBox>
        <InfoBox>
          <Info mtp>
            Total Items <Text style={{ color: colors.lightGrey2 }}>(6)</Text>
          </Info>
          <Price mtp>$189.94</Price>
        </InfoBox>
        <InfoBox>
          <Info>Standard Delivery</Info>
          <Price>$12.00</Price>
        </InfoBox>
        <InfoBox>
          <Info>Total Payment</Info>
          <Price>$201.84</Price>
        </InfoBox> */}
      {/* <Wrapper>
          <CombinationButton label="Swipe to Pay $201.84" onPay={onChange} />
        </Wrapper>
      </Box> */}

      {/* <Tab.Navigator
        initialRouteName="Home"
        tabBarOptions={{
          activeTintColor: "#e91e63",
          inactiveTintColor: "#fff",
          style: {
            backgroundColor: "#222222",
            borderTopWidth: 0,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={ProfileStack}
          options={{
            tabBarLabel: "Couch",
            tabBarIcon: ({ color, size }) => (
              <Icon
                name="couch"
                type="font-awesome-5"
                color={color}
                size={size}
              />
            ),
          }}
          tabBarOptions={{
            keyboardHidesTabBar: true,
          }}
        />

        <Tab.Screen
          name="Profile"
          component={ProfileStack}
          tabBarOptions={{
            keyboardHidesTabBar: true,
          }}
          options={{
            tabBarLabel: "Clout",
            tabBarIcon: ({ color, size }) => (
              <Icon
                name="eye"
                type="font-awesome-5"
                color={color}
                size={size}
              />
            ),
          }}
        /> */}
      {/* <Tab.Screen
        name="My Cards"
        component={CardStack}
        options={{
          tabBarLabel: "My Cards",
          tabBarIcon: ({ color, size }) => (
            <Icon name="paperclip" type="evilicon" color={color} size={size} />
          ),
        }}
      /> */}
      {/* </Tab.Navigator> */}
      {/* <View
        style={{
          alignItems: "center",
          justifyContent: "space-around",
          flexDirection: "row",
        }}
      > */}
      {/* <FlatList
          data={DATA}
          renderItem={renderItem}
          horizontal={true}
          keyExtractor={(item) => item.id}
        /> */}
      {/* <TouchableOpacity onPress={() => setChoice(0)}>
          <Text
            style={
              choice === 0
                ? {
                    fontSize: 24,
                    alignSelf: "flex-end",
                    color: "#e91e63",
                    marginBottom: 15,
                    marginHorizontal: 15,
                  }
                : {
                    fontSize: 24,
                    alignSelf: "flex-end",
                    color: "white",
                    marginBottom: 15,
                    marginHorizontal: 15,
                  }
            }
          >
            Trending
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setChoice(1)}>
          <Text
            style={
              choice === 1
                ? {
                    fontSize: 24,
                    alignSelf: "flex-end",
                    color: "#e91e63",
                    marginBottom: 15,
                    marginHorizontal: 15,
                  }
                : {
                    fontSize: 24,
                    alignSelf: "flex-end",
                    color: "white",
                    marginBottom: 15,
                    marginHorizontal: 15,
                  }
            }
          >
            Latest
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setChoice(2)}>
          <Text
            style={
              choice === 2
                ? {
                    fontSize: 24,
                    alignSelf: "flex-end",
                    color: "#e91e63",
                    marginBottom: 15,
                    marginHorizontal: 15,
                  }
                : {
                    fontSize: 24,
                    alignSelf: "flex-end",
                    color: "white",
                    marginBottom: 15,
                    marginHorizontal: 15,
                  }
            }
          >
            For You
          </Text>
        </TouchableOpacity>
      </View> */}
    </Container>
  );
};

const Container = styled.View`
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

// const InfoBox = styled.View`
//   flex-direction: row;
//   justify-content: space-between;
//   align-items: center;

//   ${({ theme: { space } }) => ({
//     marginVertical: space.s2,
//   })}
// `;

// const Info = styled(Text)`
//   ${({ theme: { colors } }) => ({
//     color: colors.white,
//   })}
// `;

// const Price = styled(Text)`
//   ${({ theme: { colors } }) => ({
//     color: colors.primary,
//   })}
// `;

const Wrapper = styled.View`
  align-items: center;

  ${({ theme: { space } }) => ({
    padding: 18,
  })}
`;

export default CheckOut;
