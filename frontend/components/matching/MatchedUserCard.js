import React, { useEffect, useState } from "react";
import {
  Text,
  Image,
  View,
  StyleSheet,
} from "react-native";
import { responsiveHeight } from "react-native-responsive-dimensions";

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import calculateAge from "../../utils/dateFunctions/CalculateAge"
import GetRegionFromCoordinates from "../../utils/matching/GetRegionFromCoordinates";

const MatchedUserCard = ({ fields, matchedUser, purpose }) => {
  const [city, setCity] = useState('');

  useEffect(() => {
      if (matchedUser?.location) {
        GetRegionFromCoordinates(matchedUser.location, setCity);
      }
    }, []);
    
  return (
    <>
      <LineSeparator/>
      <View style={styles.ImageContainer}>
        <Image style={styles.Image} source={{ uri: matchedUser.image }} />
      </View>
      <View style={styles.InfoContainer}>
        <Text style={styles.BoldText}>
          {calculateAge(matchedUser.dateOfBirth)}, {city}
        </Text>
        {fields}
        {purpose != 'location' &&
          <View style={styles.FieldContainer}>
            <MaterialCommunityIcons 
              name="key-chain" 
              size={22} 
              color={matchedUser.compatibilityScore > 80 
                ? "green" 
                : matchedUser.compatibilityScore > 60
                ? "#FFC107"
                : "red"} 
            />
            <Text style={getScoreColor(matchedUser.compatibilityScore)}>
              Compatibility Score: {matchedUser.compatibilityScore}%
            </Text>
          </View>}
        <View style={styles.ProfileDescriptionContainer}>
          <Text style={styles.FieldText}>About me...</Text>
          <Text style={styles.p}>{matchedUser.profileDescription}</Text>
        </View>
      </View>
    </>
  )
}

const getScoreColor = (score) => {
  if (score > 80) return styles.GreenText;
  if (score > 60) return styles.YellowText;
  return styles.RedText;
};

const LineSeparator = () => <View style={styles.Line}/>;


export default MatchedUserCard

const styles = StyleSheet.create({
  ImageContainer: {
    width: '100%',
    height: responsiveHeight(45),
    padding: 15,
    backgroundColor: '#F8F8F8',
    overflow: 'hidden',
  },
  Image: {
    height: '100%',
    width: '100%',
    alignSelf: 'center',
    borderRadius: 20,
    resizeMode: 'cover',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  InfoContainer: {
    marginTop: 20,
    gap: 7,
  },
  BoldText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#3b3b3b'
  },
  GreenText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'green',
  },
  YellowText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFC107',
  },
  RedText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'red',
  },
  FieldContainer: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  FieldText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#3b3b3b',
  },
  p: {
    fontSize: 16,
    fontWeight: '400',
    color: '#3b3b3b',
  },
  ProfileDescriptionContainer: {
    marginTop: 18,
    gap: 5,
  },
  Line: {
    backgroundColor: "#d3d3d3",
    height: 2.5,
    shadowColor: '#d3d3d3',
    shadowRadius: 4,
    shadowOpacity: 1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  }
})