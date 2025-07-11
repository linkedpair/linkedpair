import React from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

import Ionicons from '@expo/vector-icons/Ionicons';
import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";

export default function Header({ onPress }) {
  return (
    <TouchableOpacity style={styles.Header} onPress={onPress}>
      <Ionicons style={styles.Icon} name="arrow-back-outline" size={30} color="#FE6B75" />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  Header: {
    position: 'absolute',
    marginTop: responsiveHeight(6),     
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    justifyContent: 'flex-start',
    paddingHorizontal: responsiveWidth(4.5),
    zIndex: 1000,             
  },
  Icon: {
    left: 0,
  }
})