import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Image,
  Button,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";

import { auth, firestore } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function SignUpScreen({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [male, setMale] = useState(null);
  const [date, setDate] = useState(new Date());
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);

  const handleSignUp = async () => {
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      male === null ||
      !username
    ) {
      alert("Please fill out all required fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Create a user document in Firestore
      await setDoc(doc(firestore, "users", user.uid), {
        firstName,
        lastName,
        gender: male ? "male" : "female",
        dateOfBirth: date.toISOString().split("T")[0], // Format date as YYYY-MM-DD
        username,
        email,
        createdAt: new Date().toISOString(),
      });

      console.log("User created:", user);
      alert("Account created successfully!");
    } catch (error) {
      console.error("Sign up error:", error);
      alert(error.message || "Failed to create account");
    }
  };

  return (
    <KeyboardAvoidingView style={styles.MainContainer}>
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
      <Button title="Select Date" onPress={() => setDatePickerOpen(true)} />
      {/* If datepicker is open, datetimepicker will be called */}
      {datePickerOpen && (
        <DateTimePicker
          mode="date"
          open={datePickerOpen}
          value={date}
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
});
