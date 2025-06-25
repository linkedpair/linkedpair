import React, { useEffect } from "react";
import{ Alert } from "react-native";

import * as Location from "expo-location";

export default function useLocation({ setLocation }) {
    useEffect(() => {
        (async () => {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== "granted") {
            Alert.alert(
              "Permission Denied",
              "Location permission is required to match you with nearby users."
            );
            return;
          }
    
          const currentLocation = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Highest,
          });
    
          setLocation({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
          });
        })();
      }, []
    );
}