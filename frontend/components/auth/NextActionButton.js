import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from "react-native";

const NextActionButton = ({ handleNext, buttonText }) => {

  return (
    <View style={styles.Container}>
      <TouchableOpacity 
        style={styles.Button} 
        onPress={handleNext}
        activeOpacity={0.7}
      >
        <Text style={styles.ButtonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NextActionButton

const styles = StyleSheet.create({
  Container: {
    width: '100%',
  },
  Button: {
    borderRadius: 12,
    height: 55,
    backgroundColor: "#FE6B75",
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  ButtonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: '600',
    fontFamily: 'Sk-Modernist',
  },
})