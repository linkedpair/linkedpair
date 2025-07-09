import React from "react";
import {
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { responsiveHeight } from "react-native-responsive-dimensions";

import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function ActionButtons({
  setMatchedUser,
  setRefresh,
  handleChat,
  matchedUser,
  user,
  userData,
  navigation,
  purpose
}) {
  return (
    <View style={styles.ButtonContainer}>
      <TouchableOpacity
        style={[styles.OverlayButton, styles.NoButton]}
        onPress={() => {
          setMatchedUser(null);
          setRefresh(prev => prev + 1);
        }}
      >
        <Entypo name="cross" size={45} color="#FE6B75" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.OverlayButton, styles.YesButton]}
        onPress={() => {
          handleChat({ ...user, ...userData }, matchedUser, navigation);
          setMatchedUser(null);
          setRefresh(prev => prev + 1);
        }}
      >
        {purpose === 'romantic' 
          ? <AntDesign name="heart" size={32} color="white" />
          : <Ionicons name="chatbubble-sharp" size={35} color="white" />}
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  ButtonContainer: {
    position: 'absolute',
    bottom: responsiveHeight(2.5),
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    zIndex: 10,
    paddingHorizontal: 15,
  },
  OverlayButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  NoButton: {
    backgroundColor: '#FFE4E7',
  },
  YesButton: {
    backgroundColor: '#FF7A83',
  },
})