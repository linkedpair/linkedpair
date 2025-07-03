import React from "react";
import { TextInput, StyleSheet } from "react-native";

export default function CustomTextInput({
    ref,
    placeholder,
    value,
    onChangeText,
    returnKeyType,
    onSubmitEditing,
    autoCapitalize,
}) {
  return(
    <TextInput
      ref={ref || null}
      style={styles.TextInput}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      keyboardType="default"
      autoCapitalize={autoCapitalize}
      returnKeyType={returnKeyType}
      onSubmitEditing={onSubmitEditing}
    />
  )
}

const styles = StyleSheet.create({
  TextInput: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 6,
    paddingHorizontal: 12,
    height: 50,
    fontSize: 16,
    width: '100%',
  },
})