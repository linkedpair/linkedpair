import { useState, useEffect, useContext } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView
} from 'react-native';
import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";

import { db } from '../../config/firebaseConfig'
import { doc, updateDoc } from 'firebase/firestore'

import { UserContext } from "../../contexts/UserContext";

import LoadingScreen from "../../components/LoadingScreen";
import Header from "../../components/profile/Header";
import DropdownBar from "../../components/auth/DropdownBar"

import {
  facultiesData,
  yearsOfStudyData,
  yesNoData,
  zodiacSignsData
} from '../../constants/DropdownData';

import HandleImage from "../../utils/auth/HandleImage";
import calculateAge from "../../utils/dateFunctions/CalculateAge";

export default function ProfileScreen({ navigation }) {

  const { user, userData } = useContext(UserContext)

  // Placeholder screen
  if (!user || !userData) {
    return <LoadingScreen loadingText={"Loading user data..."}/>
  }

  return (
    <KeyboardAvoidingView behavior={"padding"} style={styles.MainContainer}>
      <SafeAreaView>
        <ScrollView 
          contentContainerStyle={styles.FormContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Header navigation={navigation}/>
          <PhotoAndName/>
          <PinkLineSeparator/>
          <View style={styles.SectionContainer}>
            <Text style={styles.SectionTitle}>Public Profile</Text>
            <Text style={styles.DisclamerText}>This will be shown to others</Text>
          </View>
          <AttributeLineSeparator />
          <UserAttribute
            type="username"
            displayType="Username"  
            initialValue={userData.username}
          />
          <AttributeLineSeparator />
          <UserAttribute
            type="age"
            displayType="Age"
            initialValue={calculateAge(userData.dateOfBirth)}
          />
          <AttributeLineSeparator />
          <UserAttribute
            type="gender"
            displayType="Gender"
            initialValue={userData.gender}
          />
          <AttributeLineSeparator />
          <UserAttribute
            type="hobbies"
            displayType="Hobbies"
            initialValue={userData.hobbies}
          />
          <AttributeLineSeparator />
          <UserAttribute
            type="zodiac"
            displayType="Zodiac"
            initialValue={userData.zodiac}
          />
          <View style={styles.SectionContainer}>
            <Text style={styles.SectionTitle}>School Profile</Text>
            <Text style={styles.DisclamerText}>This will be shown to others</Text>
          </View>
          <AttributeLineSeparator />
          <UserAttribute
            type="faculty"
            displayType="Faculty"
            initialValue={userData.faculty}
          />
          <AttributeLineSeparator />
          <UserAttribute
            type="stayOnCampus"
            displayType="Stay On Campus?"
            initialValue={userData.stayOnCampus ? "Yes" : "No"}
          />
          <AttributeLineSeparator />
          <UserAttribute
            type="yearOfStudy"
            displayType="Year Of Study"
            initialValue={userData.yearOfStudy}
          />
          <AttributeLineSeparator />
          <UserAttribute
            type="courses"
            displayType="Courses Taken"
            initialValue={userData.courses.split(' ').join('\n')}
          />
          <View style={styles.SectionContainer}>
            <Text style={styles.SectionTitle}>Private Profile</Text>
            <Text style={styles.DisclamerText}>This will not be shown to others</Text>
          </View>
          <AttributeLineSeparator />
          <UserAttribute 
            type="firstName"
            displayType="First Name"
            initialValue={userData.firstName}
          />
          <AttributeLineSeparator />
          <UserAttribute
            type="lastName"
            displayType="Last Name"            
            initialValue={userData.lastName}
          />
          <AttributeLineSeparator />
          <UserAttribute
            type="email"
            displayType="Email"
            initialValue={userData.email}
          />
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const PhotoAndName = () => {
  const { user, userData } = useContext(UserContext);

  const Photo = () => {
    const PickImage = async () => {
      try {
        const result = await HandleImage()
        if (!result) return;

        const { image, downloadURL } = result;
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, { image: downloadURL });
      } catch (error) {
        alert("Image upload failed. Please try again.");
      }
    }

    return (
    <TouchableOpacity style={styles.Photo} onPress={PickImage}>
      <Image style={styles.Image} source={{ uri: userData.image }}/>
    </TouchableOpacity>
    )
  }

  return (
    <View style={styles.AvatarSection}>
      <Photo/>
      <Text style={styles.UsernameText}>{userData.username}</Text>
      <Text style={[styles.LabelText, { textAlign: 'center' }]}>{userData.profileDescription}</Text>
    </View>
  );
};

const PinkLineSeparator = () => <View style={styles.PinkLine}/>;

const AttributeLineSeparator = () => <View style={styles.GreyLine}/>;

const UserAttribute = ({ type, displayType, initialValue }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(initialValue ?? "-")

  const { user, userData } = useContext(UserContext)

  const handleUpdate = async (newValue) => {
    setIsEditing(false)
    try {
      const userRef = doc(db, 'users', user.uid)
      await updateDoc(userRef, {[type]: newValue})
    } catch (error) {
      alert('Update Failed')
    }  
  }

  const displayTypeData = {
    zodiac: zodiacSignsData,
    faculty: facultiesData,
    stayOnCampus: yesNoData,
    yearOfStudy: yearsOfStudyData,
  };

  const TEXT_INPUT_TYPES = ['username', 'hobbies', 'courses', 'email'];
  const DROPDOWN_TYPES = ['zodiac', 'faculty', 'stayOnCampus', 'yearOfStudy'];
  const NON_EDITABLE_TYPES = ['firstName', 'lastName', 'age', 'gender', ];

  const isTextInput = TEXT_INPUT_TYPES.includes(type);
  const isDropdown = DROPDOWN_TYPES.includes(type);
  const isUneditable = NON_EDITABLE_TYPES.includes(type);

  return (
    <View style={styles.AttributeContainer}>
      <View>
        <Text style={styles.LabelText}>{displayType}</Text>
      </View>
      {isEditing ? (
        isTextInput ? (
          <TextInput
            style={styles.FieldRow}
            value={value}
            onChangeText={setValue}
            autoFocus={true}
            onBlur={() => handleUpdate(value)}
            returnKeyType='done'
            onSubmitEditing={() => handleUpdate(value)}
          />
        ) : null
      ) : isUneditable ? (
        <View style={styles.FieldRow}>
          <Text style={styles.LabelText}>{value}</Text>
          <Image 
            style={styles.UneditableImage}
            source={require('../assets/CannotEdit.png')} 
          />
        </View>
      ) : isDropdown ? (
        <DropdownBar
          data={displayTypeData[type]}
          value={value}
          setValue={setValue}
          purpose="profile"
          onChangeComplete={handleUpdate}
        />
      ) : (
        <TouchableOpacity
          onPress={() => setIsEditing(true)}
          style={styles.FieldRow}
        >
          <Text style={styles.ValueText}>{value}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: "white",
    width: '100%'
  },
  FormContainer: {
    paddingHorizontal: responsiveWidth(6),
    paddingBottom: responsiveHeight(2),
    paddingTop: responsiveHeight(1),
  },
  Header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: responsiveHeight(2.5)
  },
  HeaderText: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#FF7A83",
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
    borderRadius: "96%",
    resizeMode: "cover",
  },
  SectionContainer: {
    marginVertical: responsiveHeight(1.5),
    gap: 2,
  },
  SectionTitle: {
    color: "#FE6B75",
    fontSize: 24,
    fontWeight: "medium",
  },
  DisclamerText: {
    color: "#898989",
  },
  AvatarSection: {
    alignItems: "center",
    marginBottom: responsiveHeight(3),
    flex: 1,
    gap: responsiveHeight(1.5)
  },
  UsernameText: {
    color: "#2C2C2C",
    fontSize: 35,
  },
  AttributeContainer: {
    flexDirection: "column",
    marginTop: 14,
  },
  LabelText: {
    fontSize: 18,
    color: "#898989",
  },
  ValueText: {
    fontSize: 18,
    color: "#2C2C2C",
  },
  UneditableImage: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  FieldRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 15,
    fontSize: 18,
  },
  PinkLine: {
    backgroundColor: "#FFF0F0",
    height: 8,
  },
  GreyLine: {
    backgroundColor: "#D3D3D3",
    height: 0.7,
  },
});
