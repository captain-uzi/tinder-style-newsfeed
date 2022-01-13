import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ProfileScreen from "../screens/ProfileScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import FollowingScreen from "../screens/FollowingScreen";
import PersonScreen from "../screens/PersonScreen";

const Stack = createStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator initialRouteName="Profile" headerMode="screen">
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ headerShown: false, gestureEnabled: false }}
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
    </Stack.Navigator>
  );
}
