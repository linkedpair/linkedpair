import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import ProfilePage from "../screens/ProfilePage";

const Stack = createNativeStackNavigator();

export default function PrivateStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfilePage} />
    </Stack.Navigator>
  );
}
// This PrivateStack component is used for the private routes of the application
