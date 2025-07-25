import { useContext } from "react";
import { Text, TouchableOpacity, View, StyleSheet, Image } from "react-native";
import { responsiveHeight } from "react-native-responsive-dimensions";

import { db } from "../../config/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

import { UserContext } from "../../contexts/UserContext";

import HandleImage from "../../utils/auth/HandleImage";

const PhotoAndName = () => {
  const { user, userData } = useContext(UserContext);

  const Photo = () => {
    const PickImage = async () => {
      try {
        const result = await HandleImage();
        if (!result) return;

        const { image, downloadURL } = result;
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { image: downloadURL });
      } catch (error) {
        alert("Image upload failed. Please try again.");
      }
    };

    return (
      <TouchableOpacity style={styles.Photo} onPress={PickImage}>
        <Image style={styles.Image} source={{ uri: userData.image }} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.AvatarSection}>
      <Photo />
      <Text style={styles.UsernameText}>{userData.username}</Text>
      <Text style={[styles.LabelText, { textAlign: "center" }]}>
        {userData.profileDescription}
      </Text>
    </View>
  );
};

export default PhotoAndName;

const styles = StyleSheet.create({
  AvatarSection: {
    alignItems: "center",
    marginBottom: responsiveHeight(3),
    flex: 1,
    gap: responsiveHeight(1.5),
  },
  Photo: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: "#FE6B75",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: responsiveHeight(1),
  },
  Image: {
    height: "96%",
    width: "96%",
    borderRadius: 72,
    resizeMode: "cover",
  },
  UsernameText: {
    color: "#2C2C2C",
    fontSize: 35,
    fontFamily: "CircularStd-Medium",
    fontWeight: "light",
  },
  LabelText: {
    fontSize: 18,
    color: "#898989",
    fontFamily: "CircularStd-Medium",
  },
});
