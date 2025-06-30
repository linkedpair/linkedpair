import React, { useState, useRef } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";

import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";

import ImageInput from "../../components/auth/ImageInput";
import EmailInput from "../../components/auth/EmailInput";
import DateInput from "../../components/auth/DateInput";
import DropdownBar from "../../components/auth/DropdownBar";

export default function AdditionalDetailsScreen({ navigation }) {
  const [zodiac, setZodiac] = useState('')
  const [faculty, setFaculty] = useState('')

  const zodiacSigns = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces"
  ]

  const zodiacSignsData = zodiacSigns.map((zodiac) => ({
    label: zodiac,
    value: zodiac,
  }));

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

  return(
    <KeyboardAvoidingView 
      style={styles.MainContainer} 
      behavior={"padding"}
    >
      <ScrollView 
      style={{ flex: 1, width: '100%' }} 
      contentContainerStyle={{ flexGrow: 1, gap: 5 }}
      keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.Title}>Additional Details</Text>
        <Text style={styles.Subtitle}>Tell Us More!</Text>
        <View style={styles.FormContainer}>
          <DropdownBar 
            data={zodiacSignsData}
            placeholder={"Select your Zodiac Sign"}
            value={zodiac} 
            setValue={setZodiac} 
          />
          <DropdownBar 
            data={facultiesData}
            placeholder={"Select your Faculty"}
            value={faculty} 
            setValue={setFaculty} 
          />
          <SignUpButton />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const SignUpButton = () => {
  return (
    <TouchableOpacity style={styles.NextScreenButton} onPress={() => navigation.navigate()}>
      <Text style={styles.ButtonText}>Next</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  MainContainer: {
    width: '100%',
    paddingVertical: responsiveHeight(8),
    paddingHorizontal: responsiveWidth(10),
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  Title: {
    fontSize: 32,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    color: '#333',
  },
  Subtitle: {
    fontSize: 25,
    fontWeight: '400',
    alignSelf: 'flex-start',
    color: '#666',
    marginBottom: 30,
  },
  FormContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    width: '100%',
    paddingBottom: 50,
  },
  TextInput: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 6,
    paddingHorizontal: 12,
    height: 50,
    fontSize: 16,
    width: '100%',
  },
  NextScreenButton: {
    marginTop: 10,
    borderRadius: 12,
    height: 55,
    backgroundColor: "#FE6B75",
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  ButtonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: '600',
    fontFamily: 'Sk-Modernist',
  }
})