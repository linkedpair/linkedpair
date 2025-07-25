import React from "react";
import { Text, View, TextInput, StyleSheet } from "react-native";

export default function CustomTextInput({
    ref,
    placeholder,
    value,
    onChangeText,
    returnKeyType,
    onSubmitEditing,
    autoCapitalize,
    onFocus,
    inputType,
    keyboardType,
    secureTextEntry,
}) {
  return(
    <View>
      <Text style={styles.FieldDescriptor}>{inputType || placeholder}</Text>
      <TextInput
        ref={ref || null}
        style={styles.TextInput}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType || "default"}
        autoCapitalize={autoCapitalize}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        onFocus={onFocus}
        secureTextEntry={secureTextEntry}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  FieldDescriptor: {
    position: 'absolute',
    color: '#999999',
    fontWeight: '250',
    left: 15,
    bottom: 52.5,
    paddingHorizontal: 7,
    zIndex: 1000,
    backgroundColor: 'white',
    fontFamily: 'SkModernist-Medium',
    fontSize: 14
  },
  TextInput: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 6,
    paddingHorizontal: 12,
    height: 58,
    fontSize: 18,
    width: '100%',
    flex: 1,
  },
})