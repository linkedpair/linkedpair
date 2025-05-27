import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatScreen from "../screens/ChatScreen";
import ChatDetailsScreen from "../screens/ChatDetailsScreen";

const Stack = createNativeStackNavigator();

export default function ChatStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="ChatDetails" component={ChatDetailsScreen} />
    </Stack.Navigator>
  );
}

// This is a stack for all screens accessible in the Chat Tab