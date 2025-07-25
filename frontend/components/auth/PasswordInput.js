import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
} from "react-native";
import Feather from '@expo/vector-icons/Feather';

export default function PasswordInput({
  value,
  onChangeText,
  checkPassword,
  ref,
  returnKeyType,
}) {
  
  const [hidePassword, setHidePassword] = useState(true);
  const requirements = value.length > 1 && value.length < 8 && checkPassword

  return (
    <View style={styles.MainContainer}>
      <View style={styles.InputContainer}>
        <Text style={styles.FieldDescriptor}>Password</Text>
        <TextInput
          ref={ref}
          style={styles.Input}
          keyboardType="default"
          placeholder="Password"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={hidePassword}
          returnKeyType={returnKeyType}
        />
        <TouchableOpacity 
          onPress={() => setHidePassword((prev) => !prev)}
          accessibilityRole="button" // for testing
        >
          <Feather
            name={hidePassword ? "eye" : "eye-off"}
            size={16}
            color={'gray'}
            style={styles.PasswordImage}
          />
        </TouchableOpacity>
      </View>
      {requirements &&
        <Text style={styles.Warning}>Password too Short!</Text> 
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 6,
    paddingHorizontal: 12,
    height: 58,
  },
  Input: {
    flex: 1,
    fontSize: 18,
  },
  PasswordImage: {
    paddingRight: '1%'
  },
  Warning: {
    color: "red",
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 8,
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
