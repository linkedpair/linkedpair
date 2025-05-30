import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatListScreen from "../screens/ChatListScreen";
import ChatDetailsScreen from "../screens/ChatDetailsScreen";

const Stack = createNativeStackNavigator();

// This is a stack for all screens accessible in the Chat Tab
export default function ChatStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChatList" component={ChatListScreen} />
      <Stack.Screen name="ChatDetails" component={ChatDetailsScreen} />
    </Stack.Navigator>
  );
}
