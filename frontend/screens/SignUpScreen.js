import React, { useState, useEffect } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Image,
  Button,
  Alert,
  ScrollView,
} from "react-native";
import { generateProfileDescription } from "../utils/openai";
import { generateEmbeddingFromProfile } from "../utils/openai";

import DateTimePicker from "@react-native-community/datetimepicker";
import { Dropdown } from "react-native-element-dropdown";
import * as ImagePicker from "expo-image-picker";

import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

import useLocation from "../hooks/useLocation";

export default function SignUpScreen({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [male, setMale] = useState(null);
  const [date, setDate] = useState(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [major, setMajor] = useState("");
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [traits, setTraits] = useState("");
  const [profileDescription, setProfileDescription] = useState("");
  const [loadingDesc, setLoadingDesc] = useState(false);

  // Fetch location automatically
  useLocation({ setLocation })
  
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
      !date
    ) {
      alert("Please fill out all required fields.");
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
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Step 2: Build text to embed
      const ageString = getAgeString(date);
      const profileText = `${ageString}\nTraits: ${traits}`;

      // Step 3: Generate OpenAI embedding
      const embedding = await generateEmbeddingFromProfile(profileText);

      // Step 4: Create Firestore user document
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        firstName,
        lastName,
        gender: male ? "Male" : "Female",
        dateOfBirth: date.toISOString().split("T")[0], // Format date as YYYY-MM-DD
        username,
        email,
        major,
        image,
        location,
        traits,
        profileDescription,
        embedding,
        createdAt: serverTimestamp(),
        matchedWith: [],
      });

      console.log("User created:", user);
      alert("Account created successfully!");
    } catch (error) {
      console.error("Sign up error:", error);
      alert(error.message || "Failed to create account");
    }
  };

  const handleGenerateDescription = async () => {
    if (!traits.trim()) {
      alert("Please enter your traits first.");
      return;
    }
    try {
      setLoadingDesc(true);
      const description = await generateProfileDescription(traits);
      setProfileDescription(description);
    } catch (error) {
      alert("Failed to generate description. Please try again.");
    } finally {
      setLoadingDesc(false);
    }
  };

  function getAgeString(dob) {
    if (!dob) return "";

    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const dayDiff = today.getDate() - dob.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    return `Age: ${age}`;
  }

  return (
    <KeyboardAvoidingView style={styles.MainContainer}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.WhiteSpace} />
        <View style={styles.FormContainer}>
          <Text style={styles.SignUpText}>Sign Up</Text>
          <View style={styles.NameRow}>
            <NameInput
              type="First Name"
              value={firstName}
              onChangeText={setFirstName}
            />
            <NameInput
              type="Last Name"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>
          <View style={styles.GenderRow}>
            {/* I store gender as a boolean - Male is true and Female is false */}
            <MaleButton
              selected={male}
              onPress={() => {
                setMale(true);
                alert(`I am male`);
              }}
            />
            <FemaleButton
              // ensures that when app starts, both buttons are unselected
              selected={male === false}
              onPress={() => {
                setMale(false);
                alert(`I am female`);
              }}
            />
          </View>
          <DateInput
            date={date}
            setDate={setDate}
            datePickerOpen={datePickerOpen}
            setDatePickerOpen={setDatePickerOpen}
          />
          <MajorDropdownInput major={major} setMajor={setMajor} />
          <StandardInput
            type="Username"
            value={username}
            onChangeText={setUsername}
          />
          <StandardInput type="Email" value={email} onChangeText={setEmail} />
          <PasswordInput
            type="Password"
            value={password}
            onChangeText={setPassword}
            hidePassword={hidePassword}
            setHidePassword={setHidePassword}
          />
          <ImageInput image={image} setImage={setImage} />

          <TextInput
            placeholder="Enter traits (e.g. adventurous, kind, loves books)"
            value={traits}
            onChangeText={setTraits}
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              padding: 10,
              marginVertical: 10,
            }}
          />

          <TouchableOpacity
            onPress={handleGenerateDescription}
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
        <View style={styles.WhiteSpace} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const NameInput = ({ type, value, onChangeText }) => {
  return (
    <View style={styles.NameInput}>
      <TextInput
        style={styles.InputText}
        placeholder={`Enter your ${type}`}
        onChangeText={onChangeText}
        defaultValue={value}
        keyboardType={"default"}
      />
    </View>
  );
};

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

const DateInput = ({ date, setDate, datePickerOpen, setDatePickerOpen }) => {
  return (
    <View style={styles.StandardInput}>
      <Button
        title={date ? date.toDateString() : "Select Date"}
        onPress={() => setDatePickerOpen(true)}
      />
      {/* If datepicker is open, datetimepicker will be called */}
      {datePickerOpen && (
        <DateTimePicker
          mode="date"
          open={datePickerOpen}
          value={date || new Date()}
          onChange={(event, SelectedDate) => {
            setDatePickerOpen(false);
            if (SelectedDate) {
              setDate(SelectedDate);
              alert(`I have selected ${SelectedDate}`);
            }
          }}
        />
      )}
    </View>
  );
};

const StandardInput = ({ type, value, onChangeText }) => {
  return (
    <View style={styles.StandardInput}>
      <TextInput
        style={styles.InputText}
        placeholder={`Enter your ${type}`}
        onChangeText={onChangeText}
        defaultValue={value}
        keyboardType={type === "Email" ? "email-address" : "default"}
      />
    </View>
  );
};

const PasswordInput = ({
  type,
  value,
  onChangeText,
  hidePassword,
  setHidePassword,
}) => {
  return (
    <View>
      <View style={styles.StandardInput}>
        <TextInput
          style={styles.InputText}
          placeholder={`Enter your ${type}`}
          onChangeText={onChangeText}
          defaultValue={value}
          keyboardType={"default"}
          secureTextEntry={hidePassword}
        />
        <TouchableOpacity onPress={() => setHidePassword((prev) => !prev)}>
          <Image
            style={styles.PasswordImage}
            source={
              hidePassword
                ? require("../assets/PasswordShow.jpg")
                : require("../assets/PasswordHide.webp")
            }
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

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

const data = faculties.map((faculty) => ({
  label: faculty,
  value: faculty,
}));

const MajorDropdownInput = ({ major, setMajor }) => {
  return (
    <Dropdown
      style={styles.dropdown}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      inputSearchStyle={styles.inputSearchStyle}
      data={data}
      search
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder={"Select your Major"}
      searchPlaceholder="Search..."
      value={major}
      onChange={(item) => {
        setMajor(item.value);
      }}
    />
  );
};

const ImageInput = ({ image, setImage }) => {
  const PickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={!image ? styles.StandardInput : styles.SelectedImage}>
      {!image ? (
        <Button title="Pick an image from camera roll" onPress={PickImage} />
      ) : (
        <Image source={{ uri: image }} style={styles.SelectedImage} />
      )}
    </View>
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
  WhiteSpace: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  FormContainer: {
    flexDirection: "column",
    paddingHorizontal: 20,
    width: "100%",
  },
  SignUpText: {
    fontSize: 24,
    marginBottom: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  NameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 6,
    marginBottom: 12,
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
    marginBottom: 12,
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
  StandardInput: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 6,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  CreateEmailButton: {
    backgroundColor: "#1E90FF",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 16,
  },
  dropdown: {
    marginBottom: 12,
    height: 48,
    borderWidth: 1,
    borderColor: "#aaa",
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  placeholderStyle: {
    fontSize: 14,
    color: "#aaa",
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
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
    marginTop: 32,
    alignItems: "center",
  },
  PasswordImage: {
    width: 32,
    height: 32,
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
