import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignInScreen from "../screens/auth/SignInScreen";
import SignUpScreen from "../screens/auth/SignUpScreen";
import MainDetailsScreen from "../screens/auth/MainDetailsScreen";
import PickImageScreen from "../screens/auth/PickImageScreen";
import AdditionalDetailsScreen from "../screens/auth/AdditionalDetailsScreen";
import SchoolDetailsScreen from "../screens/auth/SchoolDetailsScreen";

const Stack = createNativeStackNavigator();

// This PublicStack component is used for the public routes of the application
export default function PublicStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SchoolDetails" component={SchoolDetailsScreen} />
      <Stack.Screen name="AdditionalDetails" component={AdditionalDetailsScreen} />
      <Stack.Screen name="MainDetails" component={MainDetailsScreen} /> 
      <Stack.Screen name="PickImage" component={PickImageScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
}

