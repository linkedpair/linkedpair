import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatListScreen from "../screens/chat/ChatListScreen";
import ChatDetailsScreen from "../screens/chat/ChatDetailsScreen";
import ChatProfileScreen from "../screens/chat/ChatProfileScreen";

const Stack = createNativeStackNavigator();

// This is a stack for all screens accessible in the Chat Tab
export default function ChatStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChatList" component={ChatListScreen} />
      <Stack.Screen name="ChatDetails" component={ChatDetailsScreen} />
      <Stack.Screen name="ChatProfile" component={ChatProfileScreen} />
    </Stack.Navigator>
  );
}
