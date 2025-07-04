import { useState, useEffect, useContext } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
  SafeAreaView
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';

import { db } from '../firebaseConfig'
import { doc, updateDoc } from 'firebase/firestore'
import { UserContext } from "../contexts/UserContext";
import LoadingScreen from "../components/LoadingScreen";

export default function ProfileScreen({ navigation }) {

  const { user, userData } = useContext(UserContext)

  const [birthdate, setBirthdate] = useState(null)
  const [profilePhoto, setProfilePhoto] = useState(null)

  useEffect(() => {
    if (!birthdate) {
      setBirthdate(userData.dateOfBirth)
    } 
    if (!profilePhoto) {
      setProfilePhoto(userData.downloadURL)
    }
  }, []);

  // Placeholder screen
  if (!user || !userData) {
    return <LoadingScreen />
  }

  return (
    <SafeAreaView style={styles.SafeAreaViewContainer}>
      <ScrollView contentContainerStyle={styles.MainContainer}>
          <View style={styles.WhiteSpace} />
          <Header 
            navigation={navigation}
          />
          <PhotoAndName 
            username={userData.firstName}
            photo={profilePhoto}
            setPhoto={setProfilePhoto}
            user={user}
          />
          <PinkLineSeparator />
          <View style={styles.AboutContainer}>
            <Text style={styles.AboutText}>Public Profile</Text>
            <Text style={styles.DisclamerText}>This will be shown to others</Text>
          </View>
          <AttributeLineSeparator />
          <UserAttribute 
            type="first Name"
            displayType="First Name"
            initialValue={userData.firstName}
          />
          <AttributeLineSeparator />
          <UserAttribute
            type="last Name"
            displayType="Last Name"            
            initialValue={userData.lastName}
          />
          <AttributeLineSeparator />
          <UserAttribute
            type="username"
            displayType="Display Name"  
            initialValue={userData.username}
            user={user}
          />
          <AttributeLineSeparator />
          <UserAttribute
            type="age"
            displayType="Age"
            initialValue={calculateAge(birthdate)}
          />
          <AttributeLineSeparator />
          <UserAttribute
            type="major"
            displayType="Major"
            initialValue={userData.major}
          />
          <View style={styles.AboutContainer}>
            <Text style={styles.AboutText}>Private Profile</Text>
            <Text style={styles.DisclamerText}>This will not be shown to others</Text>
          </View>
          <AttributeLineSeparator />
          <UserAttribute
            type="gender"
            displayType="Gender"
            initialValue={userData.gender}
          />
          <AttributeLineSeparator />
          <UserAttribute
            type="email"
            displayType="Email"
            initialValue={userData.email}
            user={user}
          />
          <AttributeLineSeparator />
          <View style={styles.WhiteSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

const Header = ({ navigation }) => {
  return (
    <View style={{ flexDirection: "row" }}>
      <Text style={styles.HeaderText}>Profile</Text>
      <TouchableOpacity
        style={{ flex: 1, paddingTop: 8 }}
        onPress={() => navigation.navigate("Settings")}
      >
        <Ionicons name="settings-outline" size={24} color="gray" />
      </TouchableOpacity>
    </View>
  );
};

const Photo = ({ user, photo, setPhoto }) => {

  const PickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
    if (!result.canceled) {
      try {
        const userRef = doc(db, 'users', user.uid)
        await updateDoc(userRef, {image: result.assets[0].uri})
        setPhoto(result.assets[0].uri)
      } catch (error) {
        alert('Update Failed')
      }  
    }
  }

  return (
  <TouchableOpacity 
    style={styles.Photo}
    onPress={PickImage}
  >
    <Image 
      style={styles.Image}
      source={{ uri: photo }} 
    />
  </TouchableOpacity>
  )
}

const PhotoAndName = ({ username, photo, user, setPhoto }) => {
  return (
    <View style={styles.PhotoAndNameContainer}>
      <Photo 
        photo={photo}
        user={user}
        setPhoto={setPhoto}
      />
      <View>
        {/* To extract name from userDatabase */}
        <Text style={styles.NameText}>{username}</Text>
      </View>
      <Text style={styles.BelowNameText}>Looking for One Night Stand</Text>
    </View>
  );
};

const PinkLineSeparator = () => {
  return (
    <View
      style={{
        backgroundColor: "#FFF0F0",
        height: 8,
        marginHorizontal: 2,
      }}
    />
  );
};

const AttributeLineSeparator = () => {
  return (
    <View
      style={{
        backgroundColor: "#D3D3D3",
        height: 0.7,
        marginHorizontal: 24,
      }}
    />
  );
};

function calculateAge(birthday) {
  const birthDate = new Date(birthday);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

const UserAttribute = ({ type, displayType, initialValue, user }) => {

  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(initialValue ?? "-")

  const handleUpdate = async () => {
    setIsEditing(false)
    try {
      const userRef = doc(db, 'users', user.uid)
      await updateDoc(userRef, {[type]: value})
    } catch (error) {
      alert('Update Failed')
    }  
  }

  // If attribute is in the list below, we do not allow users to edit.
  // Otherwise, clicking on each attribute will turn it into a TextInput.
  const editableTypes = (type != "age" &&
    type != "gender" &&
    type != "first Name" &&
    type != "last Name" &&
    type != "major"
  )

  return (
    <View style={{ marginLeft: 24 }}>
      <View style={styles.AttributeContainer}>
        <View>
          {/* Type is fixed */}
          <Text style={styles.AttributeType}>{displayType}</Text>
        </View>
        {isEditing && editableTypes 
          ? (
          <TextInput
            style={styles.EditableAttributeValue}
            value={value}
            onChangeText={setValue}
            autoFocus={true}
            onBlur={handleUpdate}
            returnKeyType='done'
            onSubmitEditing={handleUpdate}
          />
        ) : (
          editableTypes ? (
            <TouchableOpacity 
              onPress={() => setIsEditing(true)}>
              {/* initialValue will be extracted from userDatabase */}
              <Text style={styles.EditableAttributeValue}>{value}</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.UneditableAttributeValue}>{value}</Text>
              <Image 
                style={styles.UneditableImage}
                source={require('../assets/CannotEdit.png')} 
              />
            </View>
            )
          )
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  SafeAreaViewContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  MainContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    backgroundColor: "white",
  },
  WhiteSpace: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  HeaderText: {
    flex: 6,
    fontSize: 36,
    fontWeight: "bold",
    color: "#FE6B75",
    marginLeft: 21,
    marginBottom: 33,
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
    marginBottom: 20,
  },
  Image: {
    height: "96%",
    width: "96%",
    borderRadius: "96%",
    resizeMode: "cover",
  },
  AboutContainer: {
    marginTop: 15,
    marginLeft: 24,
    marginBottom: 14,
  },
  AboutText: {
    color: "#FE6B75",
    fontSize: 26,
    fontWeight: "medium",
  },
  DisclamerText: {
    color: "#898989",
  },
  PhotoAndNameContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  NameText: {
    color: "#2C2C2C",
    fontSize: 30,
  },
  BelowNameText: {
    color: "#898989",
    fontSize: 16,
    marginTop: 5,
  },
  AttributeContainer: {
    flexDirection: "column",
    marginTop: 14,
  },
  AttributeType: {
    fontSize: 16,
    color: "#898989",
  },
  EditableAttributeValue: {
    marginVertical: 10,
    marginBottom: 15,
    fontSize: 16,
    color: "#2C2C2C",
  },
  UneditableAttributeValue: {
    marginVertical: 10,
    marginBottom: 15,
    fontSize: 16,
    color: "#898989",
    flex: 9,
  },
  UneditableImage: {
    width: 18,
    height: 18,
    flex: 1,
    resizeMode: "contain",
    marginRight: 15,
  },
});
