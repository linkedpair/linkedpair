import React, { useEffect, useState, useRef } from "react";
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

import CustomTextInput from "../../components/auth/CustomTextInput";
import DateInput from "../../components/auth/DateInput";
import useLocation from "../../hooks/useLocation";
import NextActionButton from "../../components/auth/NextActionButton";
import RedirectToSignInOrUp from "../../components/auth/RedirectToSignInOrUp";

export default function MainDetailsScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(null)

  const lastNameRef = useRef();
  const usernameRef = useRef();
  const scrollViewRef = useRef();

  const handleNext = () => {
    if (!firstName ||
      !lastName ||
      !username ||
      !dateOfBirth
    ) {
      alert('Please Fill in All Required Fields.');
      return;
    } else {
      navigation.navigate("PickImage");
    }
  }

  // Automatically Collect Location at the Start.
  useLocation({ setLocation });
  
  return(
    <KeyboardAvoidingView 
      style={styles.MainContainer} 
      behavior={"padding"}
    >
      <ScrollView 
      style={styles.ScrollContainer} 
      contentContainerStyle={{ 
        flexGrow: 1, 
        gap: 5, 
        paddingBottom: responsiveHeight(6) 
      }}
      keyboardShouldPersistTaps="handled"
      ref={scrollViewRef}
      >
        <Text style={styles.Title}>Profile Details</Text>
        <Text style={styles.Subtitle}>Introduce Yourself to us!</Text>
        <View style={styles.InputContainer} >
          <CustomTextInput
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
            returnKeyType="next"
            onSubmitEditing={() => lastNameRef.current.focus()}
          />
          <CustomTextInput
            ref={lastNameRef}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
            returnKeyType="next"
            onSubmitEditing={() => usernameRef.current.focus()}
          />
          <CustomTextInput
            ref={usernameRef}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            returnKeyType="next"
          />
          <DateInput 
            date={dateOfBirth}
            setDate={setDateOfBirth}
            scrollViewRef={scrollViewRef}
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
  },
  ScrollContainer: {
    flex: 1, 
    width: '100%',
    paddingTop: responsiveHeight(9),
    paddingHorizontal: responsiveWidth(10),
  },
  Title: {
    fontSize: 32,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    color: '#FE6B75',
    marginBottom: 2,
  },
  Subtitle: {
    fontSize: 25,
    fontWeight: '400',
    alignSelf: 'flex-start',
    color: '#666',
    marginBottom: 50,
  },
  InputContainer: {
    flex: 1,
    flexDirection: 'column',
    gap: responsiveHeight(2.5),    
    width: '100%',
  },
  ButtonAndLinkContainer: {
    width: '100%',
    alignSelf: 'flex-end',
  }
})