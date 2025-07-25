import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
} from "react-native";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";

import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import { UserContext } from "../../contexts/UserContext";

import LoadingScreen from "../../components/LoadingScreen";
import MatchedUserCard from "../../components/matching/MatchedUserCard";
import ActionButtons from "../../components/matching/ActionButtons";

import useMatch from "../../hooks/useMatch";

import {
  geolocationMatch,
  getDistanceFromLatLonInKm,
} from "../../utils/matching/MatchingAlgorithms";
import handleChat from "../../utils/matching/HandleChat";

export default function LocationMatch({ navigation }) {
  const [matchedUser, setMatchedUser] = useState(null);
  const [showNoUserFound, setShowNoUserFound] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const { user, userData } = useContext(UserContext);

  useMatch({
    matchAlgo: geolocationMatch,
    setShowNoUserFound,
    setMatchedUser,
    refresh,
    user,
    userData,
  });

  if (!matchedUser) {
    return showNoUserFound ? (
      <LoadingScreen loadingText={"No users found"} />
    ) : (
      <LoadingScreen loadingText={"Looking for a matching..."} />
    );
  }

  const distance = Math.ceil(
    getDistanceFromLatLonInKm(
      userData.location.latitude,
      userData.location.longitude,
      matchedUser.location.latitude,
      matchedUser.location.longitude
    )
  );

  const LocationFields = ({ matchedUser }) => {
    return (
      <>
        <View style={styles.FieldContainer}>
          <Ionicons name="school" size={20} color="#FF7A83" />
          <Text style={styles.PinkText}>
            {matchedUser.yearOfStudy} {matchedUser.faculty}
          </Text>
        </View>
        <View style={styles.FieldContainer}>
          <FontAwesome name="home" size={20} color="#FF7A83" />
          <Text style={styles.PinkText}>
            {matchedUser.stayOnCampus
              ? "Stays on Campus"
              : "Does not Stay on Campus"}
          </Text>
        </View>
        <View style={styles.FieldContainer}>
          <Ionicons name="location-outline" size={24} color="4CAF50" />
          <Text style={styles.LocationText}>{distance} km away from you</Text>
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.MainContainer}>
      <View style={styles.FormContainer}>
        <Text style={styles.HeaderText}>Location Match</Text>
        <Text style={styles.Subtitle}>Discover campus pals in your area.</Text>
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
          <MatchedUserCard
            fields={<LocationFields matchedUser={matchedUser} />}
            matchedUser={matchedUser}
            purpose="location"
          />
        </ScrollView>
        <ActionButtons
          setMatchedUser={setMatchedUser}
          setRefresh={setRefresh}
          handleChat={handleChat}
          matchedUser={matchedUser}
          user={user}
          userData={userData}
          navigation={navigation}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: "white",
    width: "100%",
  },
  FormContainer: {
    paddingTop:
      Platform.OS === "android" ? responsiveHeight(6) : responsiveHeight(1),
    paddingHorizontal: responsiveWidth(6),
    flex: 1,
  },
  HeaderText: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#FF7A83",
    marginBottom: 4,
  },
  Subtitle: {
    fontSize: 25,
    fontWeight: "400",
    alignSelf: "flex-start",
    color: "#FFA3AD",
    marginBottom: responsiveHeight(2.5),
  },
  FieldContainer: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  PinkText: {
    fontSize: 20,
    fontWeight: "500",
    color: "#FF7A83",
  },
  LocationText: {
    fontSize: 25,
    fontWeight: "500",
    color: "#4CAF50",
  },
});
