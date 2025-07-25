import React, { useState, useContext } from "react";
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
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { UserContext } from "../../contexts/UserContext";

import LoadingScreen from "../../components/LoadingScreen";
import MatchedUserCard from "../../components/matching/MatchedUserCard";
import ActionButtons from "../../components/matching/ActionButtons";

import useMatch from "../../hooks/useMatch";

import { aiRomanticMatch } from "../../utils/matching/MatchingAlgorithms";
import handleChat from "../../utils/matching/HandleChat";

export default function RomanticMatch({ navigation }) {
  const [matchedUser, setMatchedUser] = useState(null);
  const [showNoUserFound, setShowNoUserFound] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const { user, userData } = useContext(UserContext);

  useMatch({
    matchAlgo: aiRomanticMatch,
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

  const RomanticFields = ({ matchedUser }) => {
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
          <MaterialCommunityIcons
            name={`zodiac-${matchedUser.zodiac.toLowerCase()}`}
            size={20}
            color="#C77DFF"
          />
          <Text style={styles.ZodiacText}>
            Zodiac Sign: {matchedUser.zodiac}
          </Text>
        </View>
        <View style={styles.FieldContainer}>
          <Ionicons name="basketball" size={20} color="#4D96FF" />
          <Text style={styles.HobbiesText}>Likes {matchedUser.hobbies}</Text>
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.MainContainer}>
      <View style={styles.FormContainer}>
        <Text style={styles.HeaderText}>Romantic Match</Text>
        <Text style={styles.Subtitle}>Meet the special someone on campus.</Text>
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
          <MatchedUserCard
            fields={<RomanticFields matchedUser={matchedUser} />}
            matchedUser={matchedUser}
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
          purpose={"romantic"}
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
    gap: 8,
    alignItems: "center",
  },
  PinkText: {
    fontSize: 20,
    fontWeight: "500",
    color: "#FF7A83",
  },
  ZodiacText: {
    color: "#C77DFF",
    fontSize: 20,
    fontWeight: "500",
  },
  HobbiesText: {
    color: "#4D96FF",
    fontSize: 20,
    fontWeight: "500",
  },
});
