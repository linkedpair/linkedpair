import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignInScreen from "../screens/auth/SignInScreen";
import SignUpScreen from "../screens/auth/SignUpScreen";
import MainDetailsScreen from "../screens/auth/MainDetailsScreen";
import AdditionalDetailsScreen from "../screens/auth/AdditionalDetailsScreen";

const Stack = createNativeStackNavigator();

// This PublicStack component is used for the public routes of the application
export default function PublicStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainDetails" component={MainDetailsScreen} /> 
      <Stack.Screen name="AdditionalDetails" component={AdditionalDetailsScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
}

