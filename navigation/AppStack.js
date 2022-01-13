import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-elements";

const Tab = createBottomTabNavigator();

import HomeStack from "../navigation/HomeStack";
import ProfileStack from "../navigation/ProfileStack";
// import CardStack from "../navigation/CardStack";

export default function AppStack(props) {
  return (
    <Tab.Navigator
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
        component={HomeStack}
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
            <Icon name="eye" type="font-awesome-5" color={color} size={size} />
          ),
        }}
      />
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
    </Tab.Navigator>
  );
}
