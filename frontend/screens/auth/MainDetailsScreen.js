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

export default function MainDetailsScreen({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const [downloadURL, setDownloadURL] = useState(null)
  const [dateOfBirth, setDateOfBirth] = useState(null)

  const lastNameRef = useRef();
  const usernameRef = useRef();
  const emailRef = useRef();
  const scrollViewRef = useRef();

  return(
    <KeyboardAvoidingView 
      style={styles.MainContainer} 
      behavior={"padding"}
    >
      <ScrollView 
      style={{ flex: 1, width: '100%' }} 
      contentContainerStyle={{ flexGrow: 1, gap: 5 }}
      keyboardShouldPersistTaps="handled"
      ref={scrollViewRef}
      >
        <View style={styles.FormContainer}>
          <Text style={styles.Title}>Profile Details</Text>
          <Text style={styles.Subtitle}>Introduce Yourself to us!</Text>
          <View style={styles.InputContainer} >
            <ImageInput 
              image={image} 
              setImage={setImage}
              setDownloadURL={setDownloadURL}
            />
            <TextInput
              style={styles.TextInput}
              placeholder="First Name"
              value={firstName}
              onChangeText={setFirstName}
              keyboardType="default"
              autoCapitalize="words"
              returnKeyType="next"
              onSubmitEditing={() => lastNameRef.current.focus()}
            />
            <TextInput
              ref={lastNameRef}
              style={styles.TextInput}
              placeholder="Last Name"
              value={lastName}
              onChangeText={setLastName}
              keyboardType="default"
              autoCapitalize="words"
              returnKeyType="next"
              onSubmitEditing={() => usernameRef.current.focus()}
            />
            <TextInput
              ref={usernameRef}
              style={styles.TextInput}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              keyboardType="default"
              autoCapitalize="words"
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current.focus()}
            />
            <EmailInput
              inputRef={emailRef}
              value={email}
              onChangeText={setEmail}
              returnKeyType="done"
            />
            <DateInput 
              date={dateOfBirth}
              setDate={setDateOfBirth}
              scrollViewRef={scrollViewRef}
            />
            <SignUpButton navigation={navigation}/>
          </View>
          <View style={styles.linkContainer}>
            <Text style={styles.p}>Already Have an Account?{" "}</Text>
            <Text
              style={styles.RedirectToSignInText}
              onPress={() => navigation.navigate("SignIn")}
            >
              Sign In
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const SignUpButton = ({ navigation }) => {
  return (
    <TouchableOpacity 
      style={styles.NextScreenButton} 
      onPress={() => navigation.navigate("AdditionalDetails")}
    >
      <Text style={styles.ButtonText}>Next</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  MainContainer: {
    width: '100%',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  Title: {
    fontSize: 32,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    color: '#333',
    marginBottom: 2,
  },
  Subtitle: {
    fontSize: 25,
    fontWeight: '400',
    alignSelf: 'flex-start',
    color: '#666',
    marginBottom: 25,
  },
  FormContainer: {
    paddingVertical: responsiveHeight(8),
    paddingHorizontal: responsiveWidth(10),
  },
  InputContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    width: '100%',
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
  },
  RedirectToSignInText: {
    color: "#FE6B75",
    fontSize: 18,
    fontWeight: "bold",
    textDecorationLine: "underline",
    paddingLeft: 5,
  },
  linkContainer: {
    marginTop: 20,
    alignItems: "center",
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  p: {
    fontSize: 18,
  }
})