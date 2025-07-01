import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";

import { auth } from "../../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import EmailInput from "../../components/auth/EmailInput";
import PasswordInput from "../../components/auth/PasswordInput";

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.innerContainer}>
            <Text style={styles.title}>Sign In</Text>
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
            />
            <SignInButton handleSignIn={handleSignIn} />
            <View style={styles.linkWrapper}>
              <Text style={styles.linkText}>
                Don't have an account?{" "}
                <Text
                  style={styles.link}
                  onPress={() => navigation.navigate("MainDetails")}
                >
                  Sign Up
                </Text>
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const SignInButton = ({ handleSignIn }) => {
  return (
    <TouchableOpacity 
      style={styles.SignInButton} 
      onPress={handleSignIn}
    >
      <Text style={styles.ButtonText}>Sign In</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "column",
    gap: 12,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  customButton: {
    backgroundColor: "#1E90FF",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  linkWrapper: {
    marginTop: 32,
    alignItems: "center",
  },
  linkText: {
    color: "#000",
    fontSize: 14,
  },
  link: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  SignInButton: {
    borderRadius: 12,
    height: 55,
    backgroundColor: "#FE6B75",
    alignItems: 'center',
    justifyContent: 'center'
  },
  ButtonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: '600',
    fontFamily: 'Sk-Modernist',
  },
});
