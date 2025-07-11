import React from "react";
import {
  Text,
  View,
  StyleSheet,
} from 'react-native';

const MatchedUserAttribute = ({ displayType, initialValue }) => {
  return (
    <View style={styles.AttributeContainer}>
      <Text style={styles.LabelText}>{displayType}</Text>
      <Text style={styles.ValueText}>{initialValue}</Text>
    </View>
  );
};

export default MatchedUserAttribute

const styles = StyleSheet.create({
  AttributeContainer: {
    flexDirection: "column",
    marginTop: 10,
    marginBottom: 15,
    gap: 8,
  },
  LabelText: {
    fontSize: 18,
    color: "#898989",
  },
  ValueText: {
    fontSize: 18,
    color: "#2C2C2C",
  },
  UneditableImage: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
});