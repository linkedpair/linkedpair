import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';

import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";

const Header = ({ navigation, chatId, matchedUser }) => {
  return (
    <TouchableOpacity 
      style={styles.Header} 
      onPress={() => navigation.navigate("ChatDetails", { chatId, matchedUser })}
    >
      <Ionicons style={styles.Icon} name="arrow-back-outline" size={30} color="#FE6B75" />
    </TouchableOpacity>
  )
}

export default Header

const styles = StyleSheet.create({
  Header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: responsiveWidth(6),
    paddingBottom: responsiveHeight(1.5)
  },
})