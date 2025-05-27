import { useState, useEffect } from 'react';
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

import { auth, firestore } from '../firebaseConfig'
import { doc, getDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

export default function ProfileScreen({ navigation }) {

  const [data, setData] = useState(null)
  const [birthdate, setBirthdate] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = doc(firestore, 'users', user.uid)
          const docSnap = await getDoc(userRef)

          if (docSnap.exists()) {
            setData(docSnap.data())
            setBirthdate(docSnap.data().dateOfBirth)
          } else {
            alert('Missing data!')
          }
        } catch (error) {
          alert('error fetching user data')
        }
      } else {
        setData(null)
      }
    })

    return () => unsubscribe()
  }, [])

  // Just a placeholder screen to ensure that the data loads before the program 
  // runs data.firstName below to prevent it from accessing a null object.
  // In theory we will never reach this screen.
  if (!data) {
    return (
      <Text>Loading...</Text>
    )
  }

  return (
    <SafeAreaView style={styles.SafeAreaViewContainer}>
      <ScrollView contentContainerStyle={styles.MainContainer}>
          <View style={styles.WhiteSpace} />
          <Header 
            navigation={navigation}
          />
          <PhotoAndName />
          <PinkLineSeparator />
          <View style={styles.AboutContainer}>
            <Text style={styles.AboutText}>Public Profile</Text>
            <Text style={styles.DisclamerText}>This will be shown to others</Text>
          </View>
          <AttributeLineSeparator />
          <UserAttribute 
            type="First Name"
            initialValue={data.firstName}
          />
          <AttributeLineSeparator />
          <UserAttribute
            type="Last Name"
            initialValue={data.lastName}
          />
          <AttributeLineSeparator />
          <UserAttribute
            type="Display Name"
            initialValue={data.username}
          />
          <AttributeLineSeparator />
          <UserAttribute
            type="Age"
            initialValue={calculateAge(birthdate)}
          />
          <View style={styles.AboutContainer}>
            <Text style={styles.AboutText}>Private Profile</Text>
            <Text style={styles.DisclamerText}>This will not be shown to others</Text>
          </View>
          <AttributeLineSeparator />
          <UserAttribute
            type="Gender"
            initialValue={data.gender}
          />
          <AttributeLineSeparator />
          <UserAttribute
            type="Email"
            initialValue={data.email}
          />
          <AttributeLineSeparator />
          <View style={styles.WhiteSpace} />
      </ScrollView>
    </SafeAreaView>
  )
}

function calculateAge(birthday) {
  const birthDate = new Date(birthday)
  const today = new Date()
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

const Header = ({ navigation }) => {
  return (
    <View style={{ flexDirection: 'row' }}>
      <Text style={styles.HeaderText}>Profile</Text>
      <TouchableOpacity 
        style={{ flex: 1, paddingTop: 8 }}
        onPress={() => navigation.navigate("Settings")}
      >
        <Ionicons name="settings-outline" size={24} color="gray" />
      </TouchableOpacity>
    </View>
  )
}

const Circle = () => {
  return (
  <View style={styles.Circle}>
    {/* To extract image from database */}
    <Image 
      style={styles.Image}
      source={require('../assets/TestPhoto.jpeg')} />
  </View>
  )
}

const PhotoAndName = () => {
  return (
    <View style={styles.PhotoAndNameContainer}>
      <Circle />
      <View>
        {/* To extract name from database */}
        <Text style={styles.NameText}>Carrot</Text>
      </View>
      <Text style={styles.BelowNameText}>Looking for One Night Stand</Text>
    </View>
  )
}

const PinkLineSeparator = () => {
  return (
    <View style={{ 
      backgroundColor: "#FFF0F0", 
      height: 8, 
      marginHorizontal: 2
    }} />
  )
}

const AttributeLineSeparator = () => {
  return (
    <View style={{ 
      backgroundColor: "#D3D3D3",
      height: 0.7,
      marginHorizontal: 24
    }} />
  )
}

const UserAttribute = ({type, initialValue}) => {

  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(initialValue ?? "-")

  // If attribute is "Age" or "Gender", we do not allow users to edit, 
  // Otherwise, clicking on each attribute will turn it into a TextInput
  return (
    <View style={{ marginLeft: 24 }}>
      <View style={styles.AttributeContainer}>
        <View>
          {/* Type is fixed */}
          <Text style={styles.AttributeType}>{type}</Text>
        </View>
          {isEditing && (type != "Age" || type != "Gender" 
          || type != "First Name" || type != "Last Name") ? (
            <TextInput
              style={styles.EditableAttributeValue}
              value={value}
              onChangeText={setValue}
              autoFocus={true}
              onBlur={() => setIsEditing(false)}
              returnKeyType='done'
              onSubmitEditing={() => setIsEditing(false)}
            />
          ) : (
            (type != "Age" && type != "Gender" && type != "First Name" && type != "Last Name") ? (
              <TouchableOpacity 
                onPress={() => setIsEditing(true)}>
                {/* initialValue will be extracted from database */}
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
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  SafeAreaViewContainer: {
    flex: 1, 
    backgroundColor: 'white'
  },
  MainContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'white'
  },
  WhiteSpace: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  HeaderText: {
    flex: 6,
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FE6B75',
    marginLeft: 21,
    marginBottom: 33
  },
  Circle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: '#FE6B75',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 20
  },
  Image: {
    height: '96%', 
    width: '96%', 
    borderRadius: '96%',
    resizeMode: 'cover'
  },
  AboutContainer: {
    marginTop: 15,
    marginLeft: 24,
    marginBottom: 14
  },
  AboutText: {
    color: '#FE6B75',
    fontSize: 26,
    fontWeight: 'medium'
  },
  DisclamerText: {
    color: '#898989'
  },
  PhotoAndNameContainer: {
    alignItems: 'center', 
    marginBottom: 40 
  },
  NameText: {
    color: '#2C2C2C', 
    fontSize: 30
  },
  BelowNameText: {
    color: '#898989', 
    fontSize: 16,
    marginTop: 5
  },
  AttributeContainer: {
    flexDirection: 'column', 
    marginTop: 14
  },
  AttributeType: {
    fontSize: 16, 
    color: '#898989'
  },
  EditableAttributeValue: {
    marginVertical: 10, 
    marginBottom: 15,
    fontSize: 16, 
    color: '#2C2C2C'
  },
  UneditableAttributeValue: {
    marginVertical: 10, 
    marginBottom: 15,
    fontSize: 16, 
    color: '#898989',
    flex: 9
  },
  UneditableImage: {
    width: 18,
    height: 18,
    flex: 1,
    resizeMode: 'contain',
    marginRight: 15
  }
})