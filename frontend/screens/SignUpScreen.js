import React, { useState } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView
} from 'react-native';

export default function SignUpScreen({ navigation }) {
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSignIn = () => {
    console.log("username:", username);
    console.log("Email:", email);
    console.log("Password:", password);
    alert("Sign Up Clicked!");
  }

  return (
    <KeyboardAvoidingView style={styles.MainContainer}>
      <View style={styles.WhiteSpace} />
      <View style={styles.WhiteSpace}>
        <Text style={styles.SignUpText}>Sign Up</Text>
        <Typeable 
        type="Username" 
        value={username}
        onChangeText={setUsername}
        />
        <Typeable 
        type="Email"
        value={email}
        onChangeText={setEmail}
        />
        <Typeable 
        type="Password"
        value={password}
        onChangeText={setPassword}
        />
        <SignUpButton onPress={handleSignIn}/>
        <View style={styles.linkContainer}>
        <Text>Already Have an Account? {" "}
          <Text 
          style={styles.RedirectToSignInText}
          onPress={() => navigation.navigate("SignIn")}>
            Sign In
          </Text>
        </Text>
        </View>
      </View>
      <View style={styles.WhiteSpace} />
    </KeyboardAvoidingView>
  )
}

const Typeable = WhatToType => {
  return (
    <View style={styles.Typeable}>
      <TextInput
        placeholder={`Enter your ${WhatToType.type}`}
        onChangeText={WhatToType.onChangeText}
        defaultValue={WhatToType.value}
        keyboardType={WhatToType.type === "Email" 
          ? "email-address"
          : "default"}
      />
    </View>
  )
}

const SignUpButton = NextAction => {
  const buttonPressed = () => {
    console.log('Button pressed')
  };
  return (
    <View style={styles.CreateEmailButton}>
      <TouchableOpacity onPress={NextAction.onPress}>
        <Text style={styles.ButtonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  WhiteSpace: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  SignUpText: {
    fontSize: 24,
    marginBottom: 24,
    fontWeight: "bold",
    textAlign: "center"
  },
  Typeable: {
    width: '90%',
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 6,
    marginBottom: 12,
    paddingHorizontal: 12,
    height: 48,
    fontSize: 16,
    justifyContent: 'center'
  },
  CreateEmailButton: {
    backgroundColor: "#1E90FF",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 16,
    width: '90%'
  },
  ButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600"
  },
  RedirectToSignInText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "bold",
    textDecorationLine: "underline"
  },
  linkContainer: {
    marginTop: 32,
    alignItems: "center"
  }
});
