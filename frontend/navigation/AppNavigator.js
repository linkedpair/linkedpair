import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";

import PublicStack from "./PublicStack";
import PrivateStack from "./PrivateStack";

import { UserContext } from "../contexts/UserContext";

export default function AppNavigator() {
  
  const { user, userDataReady } = useContext(UserContext)

  return (
    <NavigationContainer>
      {user && userDataReady ? <PrivateStack /> : <PublicStack />}
    </NavigationContainer>
  );
}
