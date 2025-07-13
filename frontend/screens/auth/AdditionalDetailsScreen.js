import React, { useState, useContext, useRef } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";

import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";

import CustomTextInput from "../../components/auth/CustomTextInput";
import DropdownBar from "../../components/auth/DropdownBar";
import CustomButton from "../../components/auth/CustomButton";
import NextActionButton from "../../components/auth/NextActionButton";
import RedirectToSignInOrUp from "../../components/auth/RedirectToSignInOrUp";
import Header from "../../components/auth/Header";

import { SignUpContext } from "../../contexts/SignUpContext";

import { zodiacSignsData } from "../../constants/DropdownData";

import handleGenerateDescription from "../../utils/auth/HandleGenerateDescription";

export default function AdditionalDetailsScreen({ navigation }) {
  const [zodiac, setZodiac] = useState('');
  const [gender, setGender] = useState('');
  const [hobbies, setHobbies] = useState('');
  const [traits, setTraits] = useState(""); 
  const [profileDescription, setProfileDescription] = useState("");
  const [loadingDesc, setLoadingDesc] = useState(false);

  const { signUpData, updateSignUpData } = useContext(SignUpContext)

  const traitsRef = useRef();
  const scrollViewRef = useRef();

  const handleNext = () => {
    if (!zodiac ||
      !hobbies ||
      !gender ||
      !traits
      //|| !profileDescription
    ) {
      alert('Please Fill in All Required Fields.');
      return;
    } else {
      try {
        updateSignUpData({
          zodiac: zodiac,
          hobbies: hobbies,
          gender: gender,
          traits: traits,
          profileDescription: profileDescription
        })
        navigation.navigate("SchoolDetails");
      } catch (error) {
        alert("upload failed. Please try again.")
      }
    }
  }

  const generateDescription = () => {
    return handleGenerateDescription({ traits, setLoadingDesc, setProfileDescription })
  }

  return(
    <KeyboardAvoidingView 
      style={styles.MainContainer} 
      behavior={"padding"}
    >
      <Header onPress={() => navigation.navigate("PickImage")} />
      <ScrollView 
        ref={scrollViewRef}
        style={styles.ScrollContainer} 
        contentContainerStyle={{ flexGrow: 1, gap: 5, paddingBottom: 30, }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.Title}>Additional Details</Text>
        <Text style={styles.Subtitle}>Tell Us More!</Text>
        <View style={styles.FormContainer}>
          <Text style={[styles.Subtitle, { color: 'black' }]}>I am a...</Text>
          <View style={styles.GenderContainer} >
            <CustomButton
              buttonText={"Male"}
              isSelected={gender == "Male"}
              onPress={() => setGender("Male")}
            />
            <CustomButton
              buttonText={"Female"}
              isSelected={gender == "Female"}
              onPress={() => setGender("Female")}
            />
          </View>
          <DropdownBar 
            data={zodiacSignsData}
            placeholder={"Select your Zodiac Sign"}
            value={zodiac} 
            setValue={setZodiac} 
          />
          <CustomTextInput
            inputType="Hobbies"
            placeholder="What are Some of your Hobbies?"
            value={hobbies}
            onChangeText={setHobbies}
            autoCapitalize="none"
            returnKeyType="done"
            onSubmitEditing={() => {
              traitsRef.current.focus()
              setTimeout(() => {
                scrollViewRef.current?.scrollTo({ x: 0, y: 2000, animated: true }); 
              }, 100);
            }}
          />
          <View style={styles.ProfileDescriptionContainer}>
            <CustomTextInput
              ref={traitsRef}
              inputType="Traits"
              placeholder="Enter traits (e.g. adventurous, kind, loves books)"
              value={traits}
              onChangeText={setTraits}
              autoCapitalize="none"
              returnKeyType="next"
            />
            <TouchableOpacity
              onPress={generateDescription}
              disabled={loadingDesc}
              style={styles.GenerateDescriptionButton}
            >
              <Text style={styles.GenerateDescriptionButtonText}>
                {loadingDesc ? "Generating..." : "Generate your AI Profile Description"}
              </Text>
            </TouchableOpacity>
            {profileDescription ? (
              <View style={styles.ProfileDescription}>
                <Text>{profileDescription}</Text>
              </View>
            ) : null}
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
    marginTop: 10,
  }
})