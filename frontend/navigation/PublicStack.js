import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { SignUpProvider } from "../contexts/SignUpContext";

import SignInScreen from "../screens/auth/SignInScreen";
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
<<<<<<< HEAD
        <Stack.Screen name="MainDetails" component={MainDetailsScreen} /> 
        <Stack.Screen name="PickImage" component={PickImageScreen} />
        <Stack.Screen name="AdditionalDetails" component={AdditionalDetailsScreen} />
        <Stack.Screen name="SchoolDetails" component={SchoolDetailsScreen} />               
        <Stack.Screen name="Auth" component={AuthScreen} />
=======
>>>>>>> 1a3a01a7a933bd06d400e3dd29f3804bb438b339
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="MainDetails" component={MainDetailsScreen} />
        <Stack.Screen name="PickImage" component={PickImageScreen} />
        <Stack.Screen
          name="AdditionalDetails"
          component={AdditionalDetailsScreen}
        />
        <Stack.Screen name="SchoolDetails" component={SchoolDetailsScreen} />
        <Stack.Screen name="Auth" component={AuthScreen} />
      </Stack.Navigator>
    </SignUpProvider>
  );
}
