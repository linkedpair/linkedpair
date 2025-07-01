import React, { useState, useRef } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Button,
  Alert,
  ScrollView,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";

import useLocation from "../../hooks/useLocation";
import EmailInput from "../../components/auth/EmailInput"
import PasswordInput from "../../components/auth/PasswordInput";
import ImageInput from "../../components/auth/ImageInput";
import SignUpService from "../../services/SignUpService"
import DropdownBar from "../../components/auth/DropdownBar";
import handleGenerateDescription from "../../utils/HandleGenerateDescription";
import DateInput from "../../components/auth/DateInput";

export default function SignUpScreen({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [male, setMale] = useState(null);
  const [date, setDate] = useState(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [major, setMajor] = useState("");
  const [image, setImage] = useState(null);
  const [downloadURL, setDownloadURL] = useState("")
  const [location, setLocation] = useState(null);
  const [traits, setTraits] = useState("");
  const [profileDescription, setProfileDescription] = useState("");
  const [loadingDesc, setLoadingDesc] = useState(false);

  const scrollViewRef = useRef();

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

  // Fetch location automatically
  useLocation({ setLocation })

  const generateDescription = () => {
    return handleGenerateDescription({ traits, setLoadingDesc, setProfileDescription })
  }
  
  const handleSignUp = async () => {
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      male === null ||
      !username ||
      !major ||
      !image ||
      !date ||
      !profileDescription ||
      !traits
    ) {
      alert("Please fill out all required fields.");
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

    if (!location) {
      Alert.alert("Location Error", "Location is required for signup.");
      return;
    }

    try {
      // Step 1: Create Firebase Auth account
      const user = await SignUpService({
        firstName,
        lastName,
        email,
        password,
        male,
        username,
        major,
        image,
        date,
        profileDescription,
        traits,
        location,
        downloadURL
      })

      console.log("User created:", user);
      alert("Account created successfully!");
    } catch (error) {
      console.error("Sign up error:", error);
      alert(error.message || "Failed to create account");
    }
  };

  return (
    <KeyboardAvoidingView style={styles.MainContainer}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        keyboardShouldPersistTaps="handled"
        ref={scrollViewRef}
      >
        <View style={styles.FormContainer}>
          <Text style={styles.SignUpText}>Sign Up</Text>
          <View style={styles.NameContainer}>
            <TextInput
              style={styles.NameInput}
              placeholder="First Name"
              value={firstName}
              onChangeText={setFirstName}
              keyboardType="default"
              autoCapitalize="words"
            />
            <TextInput
              style={styles.NameInput}
              placeholder="Last Name"
              value={lastName}
              onChangeText={setLastName}
              keyboardType="default"
              autoCapitalize="sentences"
            />
          </View>
          <View style={styles.GenderRow}>
            {/* I store gender as a boolean - Male is true and Female is false */}
            <MaleButton
              selected={male}
              onPress={() => {
                setMale(true);
              }}
            />
            <FemaleButton
              // ensures that when app starts, both buttons are unselected
              selected={male === false}
              onPress={() => {
                setMale(false);
              }}
            />
          </View>
          <DateInput
            date={date}
            setDate={setDate}
            scrollViewRef={scrollViewRef}
          />
          <DropdownBar 
            data={facultiesData}
            placeholder={"Select your Major"}
            value={major} 
            setValue={setMajor} 
          />
          <TextInput
            style={styles.TextInput}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            keyboardType="default"
            autoCapitalize="none"
          />
          <EmailInput
            value={email}
            onChangeText={setEmail}
          />
          <PasswordInput
            keyboardType="password"
            value={password}
            onChangeText={setPassword}
            checkPassword
          />
          <ImageInput image={image} setImage={setImage} setDownloadURL={setDownloadURL} />

          <TextInput
            placeholder="Enter traits (e.g. adventurous, kind, loves books)"
            value={traits}
            onChangeText={setTraits}
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              padding: 10,
            }}
          />

          <TouchableOpacity
            onPress={generateDescription}
            disabled={loadingDesc}
            style={{
              backgroundColor: "#28a745",
              padding: 12,
              alignItems: "center",
              borderRadius: 5,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              {loadingDesc ? "Generating..." : "Generate Profile Description"}
            </Text>
          </TouchableOpacity>

          {profileDescription ? (
            <View
              style={{
                marginTop: 15,
                padding: 10,
                backgroundColor: "#f0f0f0",
                borderRadius: 5,
              }}
            >
              <Text>{profileDescription}</Text>
            </View>
          ) : null}

          <SignUpButton onPress={handleSignUp} />
          <View style={styles.linkContainer}>
            <Text>
              Already Have an Account?{" "}
              <Text
                style={styles.RedirectToSignInText}
                onPress={() => navigation.navigate("SignIn")}
              >
                Sign In
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const MaleButton = ({ selected, onPress }) => {
  return (
    <TouchableOpacity
      style={
        selected
          ? [styles.GenderButton, { backgroundColor: "#4a98e0" }]
          : [styles.GenderButton, { backgroundColor: "white" }]
      }
      onPress={onPress}
    >
      <Text style={{ textAlign: "center" }}>Male</Text>
    </TouchableOpacity>
  );
};

const FemaleButton = ({ selected, onPress }) => {
  return (
    <TouchableOpacity
      style={
        selected
          ? [styles.GenderButton, { backgroundColor: "#fe6b75" }]
          : [styles.GenderButton, { backgroundColor: "white" }]
      }
      onPress={onPress}
    >
      <Text style={{ textAlign: "center" }}>Female</Text>
    </TouchableOpacity>
  );
};

const SignUpButton = (NextAction) => {
  return (
    <TouchableOpacity
      style={styles.CreateEmailButton}
      onPress={NextAction.onPress}
    >
      <Text style={styles.ButtonText}>Sign Up</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
  },
  FormContainer: {
    flexDirection: "column",
    gap: 12,
    paddingHorizontal: 20,
    width: "100%",
    paddingVertical: 60,
  },
  SignUpText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  NameContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  NameInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 6,
    paddingHorizontal: 12,
    height: 48,
    justifyContent: "center",
  },
  GenderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 6,
  },
  GenderButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 6,
    paddingHorizontal: 12,
    height: 48,
    justifyContent: "center",
  },
  TextInput: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 6,
    paddingHorizontal: 12,
    height: 48,
    fontSize: 16,
  },
  CreateEmailButton: {
    backgroundColor: "#1E90FF",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 4,
  },
  ButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  RedirectToSignInText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  linkContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  InputText: {
    flex: 1,
    textAlign: "left",
  },
  SelectedImage: {
    height: 50,
    width: 50,
  },
});
