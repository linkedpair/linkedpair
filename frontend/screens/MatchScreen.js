import React, { useState } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
  Image,
  Button,
  ScrollView,
  KeyboardAvoidingView
} from 'react-native';

export default function MatchScreen() {

  // Placeholder Screens with nothing for now
  return (
    <KeyboardAvoidingView style={styles.MainContainer}>
      <View style={styles.WhiteSpace} />
        <View style={styles.FormContainer}>
          <MatchButton 
            type={'Buddy'}/>
          <MatchButton 
            type={'Romantic'}/>
          <MatchButton 
            type={'Geolocation'}/>
        </View>
      <View style={styles.WhiteSpace} />
    </KeyboardAvoidingView>
  )
}

const MatchButton = ({ type }) => {
  return (
    <TouchableOpacity
      style={styles.MatchButton}
      onPress={()=>null}
    >
      <Text style={styles.ButtonText}>{type} Match</Text>
    </TouchableOpacity>
  )

}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
  },
  WhiteSpace: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  FormContainer: {
    flex: 1,
    flexDirection: "column",
    paddingHorizontal: 20,
    width: "100%",
    alignItems: 'center'
  },
  MatchButton: {
    flex: 1,
    borderColor: '#aaa',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    margin: '3%',
    width: '80%',
    borderRadius: 10,
  },
  ButtonText: {
    color: '#FE6B75',
    fontSize: 16,
    fontWeight: 'medium'
  }
})