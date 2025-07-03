import React, { useState, useContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
} from "react-native";

import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";

import EmailInput from "../../components/auth/EmailInput";
import PasswordInput from "../../components/auth/PasswordInput";
import NextActionButton from "../../components/auth/NextActionButton";
import RedirectToSignInOrUp from "../../components/auth/RedirectToSignInOrUp";

import { SignUpContext } from "../../contexts/SignUpContext";

import SignUpService from "../../services/SignUpService";

export default function AuthScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signUpData, updateSignUpData } = useContext(SignUpContext);

  const handleSignUp = async () => {
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }
    if (password.length < 8) {
      alert("Password too Short!")
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    } 
    try {
      const user = await SignUpService({
        ...signUpData,
        email: email,
        password: password,
      });
      console.log("User created:", user);
      alert("Account created successfully!");
    } catch (error) {
      console.error("Sign up error:", error);
      alert(error.message || "Failed to create account");
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.MainContainer} 
      behavior={"padding"}
    >
      <ScrollView
        style={styles.ScrollContainer} 
        contentContainerStyle={{ flexGrow: 1, gap: 5 }}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.FormContainer}>
            <Text style={styles.Title}>Create an Account with us!</Text>
            <View style={styles.CenteredContent}>
              <View style={styles.InputContainer} >
                <EmailInput
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                />
                <PasswordInput
                  keyboardType="password"
                  placeholder="Enter your Password"
                  value={password}
                  onChangeText={setPassword}
                  checkPassword
                />
              </View>
              <View style={styles.ButtonAndLinkContainer}>
                <NextActionButton 
                  handleNext={handleSignUp} 
                  buttonText={"Create Account"}
                />
              <RedirectToSignInOrUp
                text={"Sign Up"}
                onPress={() => navigation.navigate("AdditionalDetails")}
              />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
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
  },
  Title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3b3b3b',
    marginVertical: 50,
    textAlign: 'center',
  },
  FormContainer: {
    paddingVertical: responsiveHeight(6),
    paddingHorizontal: responsiveWidth(10),
    flex: 1,
    width: '100%',
  },
  CenteredContent: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  InputContainer: {
    flexDirection: 'column',
    width: '100%',
    gap: 20,
  },
  ButtonAndLinkContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 0
  }
})