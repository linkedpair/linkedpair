import React from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet
} from "react-native";

export default function CustomButton({ buttonText, isSelected, onPress }) {

  return (
    <TouchableOpacity
      style={isSelected
        ? styles.SelectedButton 
        : styles.UnselectedButton}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={isSelected 
        ? styles.SelectedButtonText 
        : styles.UnselectedButtonText}
      >
        {buttonText}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  UnselectedButton: {
    backgroundColor: '#F9F9F9', 
    borderColor: '#DDD',
    borderWidth: 0.5,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  SelectedButton: {
    backgroundColor: "#FE6B75",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    shadowColor: "#FE6B75",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  UnselectedButtonText: {
    fontSize: 20,
    color: '#3b3b3b',
    fontWeight: '600',
  },
  SelectedButtonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: '600',
  }
});