import { useContext } from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import { responsiveHeight } from "react-native-responsive-dimensions";

const MatchedUserPhotoAndName = ({ matchedUser }) => {
  return (
    <View style={styles.AvatarSection}>
      <View style={styles.Photo}>
        <Image style={styles.Image} source={{ uri: matchedUser.image }} />
      </View>
      <Text style={styles.UsernameText}>{matchedUser.username}</Text>
      <Text style={[styles.LabelText, { textAlign: "center" }]}>
        {matchedUser.profileDescription}
      </Text>
    </View>
  );
};

export default MatchedUserPhotoAndName;

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
  },
  LabelText: {
    fontSize: 18,
    color: "#898989",
  },
});
