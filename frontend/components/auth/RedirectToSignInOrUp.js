import React from "react";
import {
  Text,
  View,
  StyleSheet,
} from "react-native";

export default function RedirectToSignInOrUp({ text, onPress }) {
  return(
    <View style={styles.linkContainer}>
        <Text style={styles.p}>Already Have an Account?{" "}</Text>
        <Text
        style={styles.RedirectToSignInText}
        onPress={onPress}
        >
        {text}
        </Text>
    </View>
  )
}

const styles = StyleSheet.create({
   RedirectToSignInText: {
    color: "#FE6B75",
    fontSize: 18,
    fontWeight: "bold",
    textDecorationLine: "underline",
    paddingLeft: 5,
  },
  linkContainer: {
    marginTop: 22,
    alignItems: "center",
    flexDirection: 'row',
    justifyContent: 'center',
  },
  p: {
    fontSize: 18,
    color: '#3b3b3b'
  }
})