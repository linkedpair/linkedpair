import React from 'react';
import { Text, View, ActivityIndicator, StyleSheet } from 'react-native';

export default function LoadingScreen({ loadingText }) {
    return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FE6B75" />
            <Text style={styles.loadingText}>{loadingText}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
  loadingContainer: {
    backgroundColor: "white",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  ActivityIndicator: {
    size: "large",
    color: "#FE6B75",
  },
  loadingText: {
    fontSize: 22,
    margin: 20,
    fontWeight: 'bold',
    color: "#FE6B75",
  }
})