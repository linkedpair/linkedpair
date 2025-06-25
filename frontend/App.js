import React from "react";
import { UserProvider } from "./contexts/UserContext";
import AppNavigator from "./navigation/AppNavigator";

export default function App() {
  return (
    <UserProvider>
      <AppNavigator />
    </UserProvider>
  );
}
