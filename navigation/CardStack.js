import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import CardScreen from "../screens/CardScreen";
import EditCardScreen from "../screens/EditCardScreen";

const Stack = createStackNavigator();

export default function CardStack() {
  return (
    <Stack.Navigator initialRouteName="Card" headerMode="none">
      <Stack.Screen name="Card" component={CardScreen} />
      <Stack.Screen
        name="EditCard"
        component={EditCardScreen}
        options={{ gestureEnabled: false }}
      />
    </Stack.Navigator>
  );
}
