import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";

import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";

import CustomButton from "../../components/auth/CustomButton";
import DropdownBar from "../../components/auth/DropdownBar";
import NextActionButton from "../../components/auth/NextActionButton";
import RedirectToSignInOrUp from "../../components/auth/RedirectToSignInOrUp";
import CustomTextInput from "../../components/auth/CustomTextInput";

export default function SchoolDetailsScreen({ navigation }) {
  const [faculty, setFaculty] = useState('');
  const [stayOnCampus, setStayOnCampus] = useState(null);
  const [yearOfStudy, setYearOfStudy] = useState('');
  const [courses, setCourses] = useState('');

  const handleNext = () => {}
  
  const faculties = [
    "Arts and Social Sciences",
    "Business",
    "Computing",
    "Continuing and Lifelong Education",
    "Dentistry",
    "Design and Engineering",
    "Duke-NUS",
    "Law",
    "Medicine",
    "Music",
    "NUS College",
    "NUS Graduate School",
    "Public Health",
    "Public Policy",
    "Science",
    "Yale-NUS",
  ];

  const facultiesData = faculties.map((faculty) => ({
    label: faculty,
    value: faculty,
  }));

  const yearsOfStudy = [
    "Year 1",
    "Year 2",
    "Year 3",
    "Year 4",
    "Year 5",
  ];

  const yearsOfStudyData = yearsOfStudy.map((year) => ({
    label: year,
    value: year,
  }));

  return(
    <KeyboardAvoidingView 
      style={styles.MainContainer} 
      behavior={"padding"}
    >
      <ScrollView 
      style={styles.ScrollContainer} 
      contentContainerStyle={{ flexGrow: 1, gap: 5 }}
      keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.Title}>Hello</Text>
        <Text style={styles.Subtitle}>Penguin</Text>
        <View style={styles.FormContainer}>
          <Text style={[styles.Subtitle, { fontSize: 22, color: 'black' }]}>
            Do you Stay on Campus?
          </Text>
          <View style={styles.GenderContainer} >
            <CustomButton
              buttonText={"Yes"}
              isSelected={stayOnCampus}
              onPress={() => setStayOnCampus(true)}
            />
            <CustomButton
              buttonText={"No"}
              isSelected={!stayOnCampus}
              onPress={() => setStayOnCampus(false)}
            />
          </View>
          <DropdownBar 
            data={facultiesData}
            placeholder={"Select your Faculty"}
            value={faculty} 
            setValue={setFaculty} 
          />
          <DropdownBar 
            data={yearsOfStudyData}
            placeholder={"Select your Year of Study"}
            value={yearOfStudy} 
            setValue={setYearOfStudy} 
          />
          <CustomTextInput
            placeholder="What are Some Courses you are Taking"
            value={courses}
            onChangeText={setCourses}
            autoCapitalize="words"
            returnKeyType="next"
          />
        </View>
        <View style={styles.ButtonAndLinkContainer}>
          <NextActionButton 
            handleNext={handleNext}
            buttonText={"Next"}
          />
          <RedirectToSignInOrUp
          text={"Sign In"}
          onPress={() => navigation.navigate("SignIn")}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  MainContainer: {
    width: '100%',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  ScrollContainer: {
    flex: 1, 
    flexDirection: 'column',
    width: '100%',
    paddingTop: responsiveHeight(9),
    paddingBottom: responsiveHeight(6),
    paddingHorizontal: responsiveWidth(10),
  },
  Title: {
    fontSize: 32,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    color: '#FE6B75',
  },
  Subtitle: {
    fontSize: 25,
    fontWeight: '400',
    alignSelf: 'flex-start',
    color: '#666',
  },
  FormContainer: {
    paddingTop: responsiveHeight(4),
    display: 'flex',
    flexDirection: 'column',
    gap: responsiveHeight(2.5),
    width: '100%',
  },
  GenderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
    width: '100%'
  },
  ProfileDescriptionContainer: {
    width: '100%',
    gap: 15,
  },
  GenerateDescriptionButton: {
    backgroundColor: "#74aa9c",
    padding: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  GenerateDescriptionButtonText: {
    color: "#fff", 
    fontWeight: "bold",
    fontSize: 16
  },
  ProfileDescription:{
    padding: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  ButtonAndLinkContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 0
  }
})