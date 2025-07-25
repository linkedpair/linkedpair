import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../../config/firebaseConfig";
import { parseToArray } from "../../utils/stringUtils";
import { UserContext } from "../../contexts/UserContext";
import DropdownBar from "../../components/auth/DropdownBar";
import {
  yearsOfStudyWithAnyData,
  zodiacSignsWithAnyData,
} from "../../constants/DropdownData";
import Header from "../../components/auth/Header";
import { responsiveHeight } from "react-native-responsive-dimensions";

export default function SettingsScreen({ navigation }) {
  const { user, userDataReady } = useContext(UserContext);
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");
  const [zodiac, setZodiac] = useState("");
  const [stayOnCampus, setStayOnCampus] = useState("any");
  const [hobbies, setHobbies] = useState("");
  const [courses, setCourses] = useState("");

  useEffect(() => {
    if (!user) return;

    const fetchFilters = async () => {
      const ref = doc(db, "filters", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setMinAge(data.minAge?.toString() || "");
        setMaxAge(data.maxAge?.toString() || "");
        setYearOfStudy(data.yearOfStudy || "");
        setZodiac(data.zodiac || "");
        setStayOnCampus(
          data.stayOnCampus === true
            ? "true"
            : data.stayOnCampus === false
            ? "false"
            : "any"
        );
        setHobbies(data.hobbies?.join(", ") || "");
        setCourses(data.courses?.join(", ") || "");
      }
    };

    fetchFilters();
  }, [user]);

  const handleSaveFilters = async () => {
    try {
      if (!user) return;

      if (
        (minAge.trim() !== "" && isNaN(parseInt(minAge))) ||
        (maxAge.trim() !== "" && isNaN(parseInt(maxAge)))
      ) {
        Alert.alert("Invalid Age", "Please enter valid numbers for age.");
        return;
      }

      const filterData = {
        yearOfStudy,
        zodiac,
        hobbies: parseToArray(hobbies),
        courses: parseToArray(courses),
      };

      if (minAge.trim() !== "") filterData.minAge = parseInt(minAge);
      if (maxAge.trim() !== "") filterData.maxAge = parseInt(maxAge);

      if (stayOnCampus === "true") filterData.stayOnCampus = true;
      else if (stayOnCampus === "false") filterData.stayOnCampus = false;

      const ref = doc(db, "filters", user.uid);
      await setDoc(ref, filterData);

      Alert.alert("Filters Saved", "Your matching filters were saved.");
    } catch (error) {
      console.error("Error saving filters:", error);
      Alert.alert("Error", "Failed to save filters.");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      Alert.alert("Signed Out", "You have been signed out.");
    } catch (error) {
      console.error("Sign-out error:", error);
      Alert.alert("Error", "Failed to sign out.");
    }
  };

  if (!user || !userDataReady) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading settings...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.headerBackground} />
      <Header onPress={() => navigation.navigate("Profile")} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.screenTitle}>Settings</Text>

            {/* User Info */}
            <View style={styles.userInfoContainer}>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>

            {/* Filters Section */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Matching Filters</Text>
              <Text style={styles.sectionSubtitle}>
                Customise your preferences to improve your matches.
              </Text>

              <View style={styles.ageContainer}>
                <View style={styles.ageInputWrapper}>
                  <Text style={[styles.label, { marginTop: 0 }]}>Min Age</Text>
                  <TextInput
                    value={minAge}
                    onChangeText={setMinAge}
                    style={styles.input}
                    placeholder="e.g. 18"
                    keyboardType="numeric"
                    inputMode="numeric"
                    maxLength={2}
                  />
                </View>

                <View style={styles.ageSeparator}>
                  <Text>to</Text>
                </View>

                <View style={styles.ageInputWrapper}>
                  <Text style={[styles.label, { marginTop: 0 }]}>Max Age</Text>
                  <TextInput
                    value={maxAge}
                    onChangeText={setMaxAge}
                    style={styles.input}
                    placeholder="e.g. 30"
                    keyboardType="numeric"
                    inputMode="numeric"
                    maxLength={2}
                  />
                </View>
              </View>

              <Text style={styles.label}>Year of Study</Text>
              <DropdownBar
                data={yearsOfStudyWithAnyData}
                placeholder={"Select your Year of Study"}
                value={yearOfStudy}
                setValue={setYearOfStudy}
              />

              <Text style={styles.label}>Zodiac</Text>
              <DropdownBar
                data={zodiacSignsWithAnyData}
                placeholder={"Select your Zodiac Sign"}
                value={zodiac}
                setValue={setZodiac}
              />

              <Text style={styles.label}>Staying on Campus?</Text>
              <View style={styles.toggleGroup}>
                {["any", "true", "false"].map((val) => (
                  <TouchableOpacity
                    key={val}
                    style={[
                      styles.toggleButton,
                      stayOnCampus === val && styles.toggleButtonSelected,
                    ]}
                    onPress={() => setStayOnCampus(val)}
                  >
                    <Text
                      style={[
                        styles.toggleButtonText,
                        stayOnCampus === val && styles.toggleButtonTextSelected,
                      ]}
                    >
                      {val === "any" ? "Any" : val === "true" ? "Yes" : "No"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Hobbies (comma-separated)</Text>
              <TextInput
                value={hobbies}
                onChangeText={setHobbies}
                style={styles.input}
                placeholder="e.g. gaming, jogging, cooking"
                autoCapitalize="none"
              />

              <Text style={styles.label}>Courses (comma-separated)</Text>
              <TextInput
                value={courses}
                onChangeText={setCourses}
                style={styles.input}
                placeholder="e.g. CS1101S, MA1522, GEA1000"
                autoCapitalize="characters"
              />

              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSaveFilters}
              >
                <Text style={styles.buttonText}>Save Filters</Text>
              </TouchableOpacity>
            </View>

            {/* Account Section */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Account</Text>
              <Text style={styles.sectionSubtitle}>
                Manage your account settings.
              </Text>

              <TouchableOpacity
                style={[styles.button, styles.signOutButton]}
                onPress={handleSignOut}
              >
                <Text style={styles.buttonText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: responsiveHeight(6) + 50,
    backgroundColor: "#f7f8fa",
    zIndex: 999,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  safeContainer: {
    flex: 1,
    backgroundColor: "#f7f8fa",
  },
  scrollContainer: {
    paddingTop:
      Platform.OS === "android"
        ? responsiveHeight(11) + 50
        : responsiveHeight(6) + 50,
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: "center",
  },
  screenTitle: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 16,
    color: "#222",
  },
  userInfoContainer: {
    marginBottom: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#e0e7ff",
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  userEmail: {
    fontSize: 18,
    fontWeight: "600",
    color: "#334155",
  },
  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 20,
    width: "100%",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 6,
    color: "#1e293b",
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 10,
  },
  ageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  ageInputWrapper: {
    flex: 4,
  },
  ageSeparator: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 14,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#f8fafc",
    marginBottom: 5,
  },
  toggleGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 14,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#f1f5f9",
  },
  toggleButtonSelected: {
    backgroundColor: "#3b82f6",
    borderColor: "#2563eb",
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4,
  },
  toggleButtonText: {
    color: "#475569",
    fontWeight: "600",
    fontSize: 16,
  },
  toggleButtonTextSelected: {
    color: "#fff",
  },
  button: {
    paddingVertical: 16,
    borderRadius: 14,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  saveButton: {
    backgroundColor: "#2563eb",
  },
  signOutButton: {
    backgroundColor: "#ef4444",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
