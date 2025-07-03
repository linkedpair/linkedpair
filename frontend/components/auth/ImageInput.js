import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from "../../firebaseConfig"

const ImageInput = ({ image, setImage, setDownloadURL }) => {
  const PickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      uploadImageAsync(uri);
    }
  };

  const uploadImageAsync = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const filename = uri.substring(uri.lastIndexOf('/') + 1);
      const storageRef = ref(storage, `images/${filename}`);

      await uploadBytes(storageRef, blob);

      const url = await getDownloadURL(storageRef);
      setDownloadURL(url);
      alert('set url');
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image");
    }
  };


  return (
    <View style={styles.Container}>
      {!image ? (
        <>
          <Text style={styles.Title}>Add a Profile Photo!</Text>
          <TouchableOpacity style={styles.Input} onPress={PickImage}>
            <MaterialCommunityIcons 
              style={styles.SelectImageIcon}
              name="camera-plus-outline" 
              size={50} 
              color="#FE6B75" />
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.Title}>How Others See You.</Text>
          <TouchableOpacity onPress={PickImage}>
            <Image source={{ uri: image }} style={styles.SelectedImage} />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default ImageInput

const styles = StyleSheet.create({
  Container: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 50,
    backgroundColor: '#FAEBEE',
    borderRadius: 25,
    marginBottom: 10,
  },
  Title: {
    fontSize: 20,
    color: '#FE6B75',
    marginBottom: 20, 
    fontWeight: '600',
    textAlign: 'center',
  },
  Input: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: "#FE6B75",
    borderRadius: 20,
    height: 100,
    width: 100,
    backgroundColor: 'white',
    padding: 20,
    paddingBottom: 25, 
    marginBottom: 10, 
    shadowColor: '#FE6B75',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  SelectedImage: {
    height: 125,
    width: 125,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FE6B75",
  },
});

