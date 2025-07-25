import { useContext } from "react";
import { Text, View, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";

import Header from "../../components/chat/Header";
import LoadingScreen from "../../components/LoadingScreen";
import MatchedUserPhotoAndName from "../../components/chat/MatchedUserPhotoAndName";
import MatchedUserAttribute from "../../components/chat/MatchedUserAttribute";

import calculateAge from "../../utils/dateFunctions/CalculateAge";
import { useRoute } from "@react-navigation/native";

export default function ChatProfileScreen({ navigation }) {
  const route = useRoute();
  const { chatId, matchedUser } = route.params;

  // Placeholder screen
  if (!matchedUser) {
    return <LoadingScreen loadingText={"Loading profile data..."} />;
  }

  return (
    <SafeAreaView style={styles.MainContainer}>
      <Header
        navigation={navigation}
        chatId={chatId}
        matchedUser={matchedUser}
      />
      <ScrollView
        contentContainerStyle={styles.FormContainer}
        keyboardShouldPersistTaps="handled"
      >
        <MatchedUserPhotoAndName matchedUser={matchedUser} />
        <PinkLineSeparator />
        <View style={styles.SectionContainer}>
          <Text style={styles.SectionTitle}>
            {matchedUser.firstName}'s Public Profile
          </Text>
        </View>
        <AttributeLineSeparator />
        <MatchedUserAttribute
          type="username"
          displayType="Username"
          initialValue={matchedUser.username}
        />
        <AttributeLineSeparator />
        <MatchedUserAttribute
          type="age"
          displayType="Age"
          initialValue={calculateAge(matchedUser.dateOfBirth)}
        />
        <AttributeLineSeparator />
        <MatchedUserAttribute
          type="gender"
          displayType="Gender"
          initialValue={matchedUser.gender}
        />
        <AttributeLineSeparator />
        <MatchedUserAttribute
          type="hobbies"
          displayType="Hobbies"
          initialValue={matchedUser.hobbies}
        />
        <AttributeLineSeparator />
        <MatchedUserAttribute
          type="zodiac"
          displayType="Zodiac"
          initialValue={matchedUser.zodiac}
        />
        <AttributeLineSeparator />
        <MatchedUserAttribute
          type="faculty"
          displayType="Faculty"
          initialValue={matchedUser.faculty}
        />
        <AttributeLineSeparator />
        <MatchedUserAttribute
          type="stayOnCampus"
          displayType="Stay On Campus?"
          initialValue={matchedUser.stayOnCampus ? "Yes" : "No"}
        />
        <AttributeLineSeparator />
        <MatchedUserAttribute
          type="yearOfStudy"
          displayType="Year Of Study"
          initialValue={matchedUser.yearOfStudy}
        />
        <AttributeLineSeparator />
        <MatchedUserAttribute
          type="courses"
          displayType="Courses Taken"
          initialValue={matchedUser.courses}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const PinkLineSeparator = () => <View style={styles.PinkLine} />;

const AttributeLineSeparator = () => <View style={styles.GreyLine} />;

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: "white",
    width: "100%",
  },
  FormContainer: {
    paddingHorizontal: responsiveWidth(6),
    paddingBottom: responsiveHeight(2),
    paddingTop: responsiveHeight(1),
  },
  SectionContainer: {
    marginVertical: responsiveHeight(1.5),
    gap: 2,
  },
  SectionTitle: {
    color: "#FE6B75",
    fontSize: 24,
    fontWeight: "500",
  },
  DisclamerText: {
    color: "#898989",
  },
  PinkLine: {
    backgroundColor: "#FFF0F0",
    height: 8,
  },
  GreyLine: {
    backgroundColor: "#D3D3D3",
    height: 0.7,
  },
});
