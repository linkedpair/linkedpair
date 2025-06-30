import React from "react";
import {
  Text,
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
  checkPassword
}) {
  
  const [hidePassword, setHidePassword] = useState(true);
  const requirements = value.length > 1 && value.length < 8 && checkPassword

  return (
    <View style={styles.MainContainer}>
      <View style={styles.InputContainer}>
        <TextInput
          style={styles.Input}
          keyboardType="default"
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={hidePassword}
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
    height: 48,
  },
  Input: {
    flex: 1,
    fontSize: 16,
  },
  PasswordImage: {
    paddingRight: '1%'
  },
  Warning: {
    color: "red",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 8,
  },
});
