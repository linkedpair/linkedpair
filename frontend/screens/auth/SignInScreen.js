import React, { useState, useRef } from "react";
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

import { auth } from "../../config/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import EmailInput from "../../components/auth/EmailInput";
import PasswordInput from "../../components/auth/PasswordInput";
import NextActionButton from "../../components/auth/NextActionButton";
import RedirectToSignInOrUp from "../../components/auth/RedirectToSignInOrUp";

import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const passwordRef = useRef();

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }
    if (!isValidEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("User signed in:", user);
      Alert.alert("Success", "Signed in successfully!");
    } catch (error) {
      console.error("Error signing in:", error);
      Alert.alert("Error", "Failed to sign in. Please check your credentials.");
    }
  };

  return (
    <KeyboardAvoidingView style={styles.MainContainer} behavior={"padding"}>
      <ScrollView
        style={styles.ScrollContainer}
        contentContainerStyle={{ flexGrow: 1, gap: 5 }}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.FormContainer}>
            <Text style={styles.Title}>Welcome! Let's get you signed in.</Text>
            <View style={styles.CenteredContent}>
              <View style={styles.InputContainer}>
                <EmailInput
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  returnKeyType={"next"}
                  onSubmitEditing={() => passwordRef.current.focus()}
                />
                <PasswordInput
                  ref={passwordRef}
                  value={password}
                  onChangeText={setPassword}
                  returnKeyType={"done"}
                />
                <View style={styles.ButtonAndLinkContainer}>
                  <NextActionButton
                    handleNext={handleSignIn}
                    buttonText={"Sign In"}
                  />
                  <RedirectToSignInOrUp
                    text={"Sign Up"}
                    onPress={() => navigation.navigate("MainDetails")}
                  />
                </View>
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
    width: "100%",
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "white",
  },
  ScrollContainer: {
    flex: 1,
    width: "100%",
  },
  Title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#3b3b3b",
    marginVertical: 50,
    textAlign: "center",
  },
  FormContainer: {
    paddingVertical: responsiveHeight(6),
    paddingHorizontal: responsiveWidth(10),
    flex: 1,
    width: "100%",
  },
  CenteredContent: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  InputContainer: {
    flexDirection: "column",
    width: "100%",
    gap: 20,
  },
  ButtonAndLinkContainer: {
    width: "100%",
    marginTop: 15,
  },
});
