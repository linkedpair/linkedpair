import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";

import PublicStack from "./PublicStack";
import PrivateStack from "./PrivateStack";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function AppNavigator() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return null;

  return (
    <NavigationContainer>
      {user ? <PrivateStack /> : <PublicStack />}
    </NavigationContainer>
  );
}
