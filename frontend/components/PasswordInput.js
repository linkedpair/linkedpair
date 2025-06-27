import React from "react";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
} from "react-native";
import Feather from '@expo/vector-icons/Feather';

export default function PasswordInput({
  placeholder,
  value,
  onChangeText,
  hidePassword,
  setHidePassword,
}) {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          keyboardType="default"
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={hidePassword}
        />
        <TouchableOpacity onPress={() => setHidePassword((prev) => !prev)}>
            <Feather
                name={hidePassword ? "eye" : "eye-off"}
                size={16}
                color={'gray'}
                style={styles.PasswordImage}
            />
        </TouchableOpacity>
      </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  PasswordImage: {
    paddingRight: '1%'
  },
});
