import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
} from "react-native";

import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";

import ImageInput from "../../components/auth/ImageInput";
import NextActionButton from "../../components/auth/NextActionButton";
import RedirectToSignInOrUp from "../../components/auth/RedirectToSignInOrUp";

export default function PickImageScreen({ navigation }) {
  const [image, setImage] = useState('');
  const [downloadURL, setDownloadURL] = useState('');
  
  const handleNext = () => {
    if (!image) {
      alert('Please Select your Profile Picture');
      return;
    } else {
      navigation.navigate("AdditionalDetails");
    }
  }

  return(
    <View style={styles.MainContainer}>
      <View style={styles.ContentContainer} >
        <Text style={styles.Title}>Profile Photo</Text>
        <Text style={styles.Subtitle}>Add a cute photo which shows your face</Text>
        <View style={styles.InputContainer}>
          <ImageInput 
            image={image}
            setImage={setImage}
            setDownloadURL={setDownloadURL}
          />
          <NextActionButton 
            handleNext={handleNext}
            buttonText={"Next"}
          />
        </View>
        <RedirectToSignInOrUp
          text={"Sign In"}
          onPress={() => navigation.navigate("SignIn")}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  MainContainer: {
    width: '100%',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  ContentContainer: {
    paddingTop: responsiveHeight(9),
    paddingBottom: responsiveHeight(6),
    paddingHorizontal: responsiveWidth(10),
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  Title: {
    fontSize: 32,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    color: '#FE6B75',
    marginBottom: 2,
  },
  Subtitle: {
    fontSize: 25,
    fontWeight: '400',
    alignSelf: 'flex-start',
    color: '#666',
    marginBottom: 50,
  },
  InputContainer: {
    width: '100%',
    gap: responsiveHeight(2.5),
  },
  ButtonAndLinkContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 0
  }
})