import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { SignUpProvider } from "../contexts/SignUpContext";

import SignInScreen from "../screens/auth/SignInScreen";
import SignUpScreen from "../screens/auth/SignUpScreen";
import MainDetailsScreen from "../screens/auth/MainDetailsScreen";
import PickImageScreen from "../screens/auth/PickImageScreen";
import AdditionalDetailsScreen from "../screens/auth/AdditionalDetailsScreen";
import SchoolDetailsScreen from "../screens/auth/SchoolDetailsScreen";
import AuthScreen from "../screens/auth/AuthScreen";

const Stack = createNativeStackNavigator();

// This PublicStack component is used for the public routes of the application
export default function PublicStack() {
  return (
    <SignUpProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainDetails" component={MainDetailsScreen} /> 
        <Stack.Screen name="PickImage" component={PickImageScreen} />
        <Stack.Screen name="AdditionalDetails" component={AdditionalDetailsScreen} />
        <Stack.Screen name="SchoolDetails" component={SchoolDetailsScreen} />
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
      </Stack.Navigator>
    </SignUpProvider>
  );
}

