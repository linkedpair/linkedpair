import React from "react";
import { UserProvider } from "./contexts/UserContext";
import AppNavigator from "./navigation/AppNavigator";
import * as Font from "expo-font";

export default function App() {
  const [fontsLoaded] = Font.useFonts({
    "SkModernist-Light": require("./assets/fonts/Sk-Modernist Light.otf"),
    "SkModernist-Medium": require("./assets/fonts/Sk-Modernist-Regular.otf"),
    "SkModernist-Bold": require("./assets/fonts/Sk-Modernist-Bold.otf"),
  });

  return (
    <UserProvider>
      <AppNavigator />
    </UserProvider>
  );
}
