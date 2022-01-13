import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "../screens/HomeScreen";
import PersonScreen from "../screens/PersonScreen";
import FollowingScreen from "../screens/FollowingScreen";
import ImagePickerScreen from "../screens/ImagePickerScreen";
const Stack = createStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator initialRouteName="Home" headerMode="screen">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ImagePicker"
        component={ImagePickerScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Person"
        component={PersonScreen}
        options={({ route }) => ({
          title: route.params.name,
          headerTitleAlign: "center",
          headerBackTitle: "Back",
          gestureEnabled: false,
        })}
      />
      <Stack.Screen
        name="Following"
        component={FollowingScreen}
        options={({ route }) => ({
          title: route.params.page,
          headerTitleAlign: "center",
          headerBackTitle: "Back",
          gestureEnabled: false,
        })}
      />
    </Stack.Navigator>
  );
}
