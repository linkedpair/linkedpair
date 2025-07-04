import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
} from "react-native";

export default function EmailInput({
  inputRef,
  value,
  onChangeText,
  returnKeyType
}) {
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const requirements = !emailRegex.test(value) && value;

  return (
    <View style={styles.MainContainer}>
      <TextInput
        ref={inputRef}
        style={styles.Input}
        placeholder="Email-address"
        keyboardType="email-address"
        value={value}
        onChangeText={onChangeText}
        returnKeyType={returnKeyType}
        autoCapitalize="none"
      />
      {requirements &&
        <Text style={styles.Warning}>Please Enter a Valid Email!</Text> 
      }
    </View>
  );
};

const styles = StyleSheet.create({
  MainContainer: {
    display: "flex",
    flexDirection: "column",
  },
  Input: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 6,
    paddingHorizontal: 12,
    height: 50,
    fontSize: 16,
    width: '100%',
  },
  Warning: {
    color: "red",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 8,
    marginBottom: 5,
  },
});
