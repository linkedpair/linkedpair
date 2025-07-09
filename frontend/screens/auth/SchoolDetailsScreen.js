import React, { useEffect, useState, useContext, useRef } from "react";
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
import Header from "../../components/auth/Header";

import { SignUpContext } from "../../contexts/SignUpContext";

export default function SchoolDetailsScreen({ navigation }) {
  const [faculty, setFaculty] = useState('');
  const [stayOnCampus, setStayOnCampus] = useState(null);
  const [yearOfStudy, setYearOfStudy] = useState('');
  const [courses, setCourses] = useState('');

  const { signUpData, updateSignUpData } = useContext(SignUpContext)

  const scrollViewRef = useRef();

  const handleNext = () => {
    if (!faculty || 
      stayOnCampus == null ||
      !yearOfStudy ||
      !courses
    ) {
      alert('Please fill in all required fields.');
      return;
    } else {
      try {
        updateSignUpData({
          faculty: faculty,
          stayOnCampus: stayOnCampus,
          yearOfStudy: yearOfStudy,
          courses: courses
        })
        navigation.navigate("Auth")
      } catch (error) {
        alert('An error has occured', 'Please try Again.')
      }
    }
  }

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
      <Header onPress={() => navigation.navigate("AdditionalDetails")} />
      <ScrollView 
        ref={scrollViewRef}
        style={styles.ScrollContainer} 
        contentContainerStyle={{ flexGrow: 1, gap: 5, paddingBottom: 30 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.Title}>Your Uni Life</Text>
        <Text style={styles.Subtitle}>Tell us what you study and more!</Text>
        <View style={styles.FormContainer}>
          <Text style={[styles.Subtitle, { fontSize: 22, color: 'black' }]}>
            Do you Stay on Campus?
          </Text>
          <View style={styles.OptionsContainer} >
            <CustomButton
              buttonText={"Yes"}
              isSelected={stayOnCampus == true}
              onPress={() => setStayOnCampus(true)}
            />
            <CustomButton
              buttonText={"No"}
              isSelected={stayOnCampus == false}
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
            placeholder="Current courses"
            value={courses}
            onChangeText={setCourses}
            autoCapitalize="words"
            returnKeyType="done"
            onFocus={() => (
              setTimeout(() => {
                scrollViewRef.current?.scrollTo({ x: 0, y: 2000, animated: true }); 
              }, 250)
            )}
          />
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
    paddingTop: responsiveHeight(12),
    paddingBottom: responsiveHeight(6),
    paddingHorizontal: responsiveWidth(9.5),
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
  OptionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
    width: '100%',
    paddingBottom: 20,
  },
  ButtonAndLinkContainer: {
    width: '100%',
    marginTop: 5,
  }
})