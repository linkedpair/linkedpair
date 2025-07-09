import React from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';

import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";

const Header = ({ navigation }) => {
  return (
    <View style={styles.Header}>
      <Text style={styles.HeaderText}>Profile</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("Settings")}
      >
      <Ionicons 
        name="settings-outline" 
        size={28} 
        color="gray" 
      />
      </TouchableOpacity>
    </View>
  );
};

export default Header

const styles = StyleSheet.create({
  Header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: responsiveHeight(2)
  },
  HeaderText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#FE6B75",
  },
})