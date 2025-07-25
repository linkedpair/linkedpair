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
  returnKeyType,
  onSubmitEditing,
}) {
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const requirements = !emailRegex.test(value) && value;

  return (
    <View style={styles.MainContainer}>
      <View style={styles.InputContainer}>
      <Text style={styles.FieldDescriptor}>Email-address</Text>
        <TextInput
          ref={inputRef}
          style={styles.Input}
          placeholder="Email-address"
          keyboardType="email-address"
          value={value}
          onChangeText={onChangeText}
          returnKeyType={returnKeyType}
          autoCapitalize="none"
          onSubmitEditing={onSubmitEditing}
        />
      </View>
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
  InputContainer: {
    position: 'relative',
  },
  Input: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 6,
    paddingHorizontal: 12,
    height: 58,
    fontSize: 18,
    width: '100%',
  },
  Warning: {
    color: "red",
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 8,
    marginBottom: 5,
  },
  FieldDescriptor: {
    position: 'absolute',
    color: '#888888',
    fontWeight: '250',
    left: 15,
    bottom: 52.5,
    paddingHorizontal: 7,
    zIndex: 1000,
    backgroundColor: 'white',
    fontFamily: 'SkModernist-Medium',
    fontSize: 14
  },  
});
