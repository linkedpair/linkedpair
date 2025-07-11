import { useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView
} from 'react-native';
import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";

import { UserContext } from "../../contexts/UserContext";

import LoadingScreen from "../../components/LoadingScreen";
import Header from "../../components/profile/Header";
import UserAttribute from "../../components/profile/UserAttribute";
import PhotoAndName from "../../components/profile/PhotoAndName";

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

const PinkLineSeparator = () => <View style={styles.PinkLine}/>;

const AttributeLineSeparator = () => <View style={styles.GreyLine}/>;

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: "white",
    width: '100%',
  },
  FormContainer: {
    paddingHorizontal: responsiveWidth(6),
    paddingBottom: responsiveHeight(2),
    paddingTop: responsiveHeight(1),
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
  PinkLine: {
    backgroundColor: "#FFF0F0",
    height: 8,
  },
  GreyLine: {
    backgroundColor: "#D3D3D3",
    height: 0.7,
  },
});

