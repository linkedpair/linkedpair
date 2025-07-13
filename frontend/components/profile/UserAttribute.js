import { useState, useContext } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
  Image,
} from 'react-native';

import { db } from '../../config/firebaseConfig'
import { doc, updateDoc } from 'firebase/firestore'

import { UserContext } from "../../contexts/UserContext";

import DropdownBar from "../../components/auth/DropdownBar"

import {
  facultiesData,
  yearsOfStudyData,
  yesNoData,
  zodiacSignsData
} from '../../constants/DropdownData';

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
      <Text style={styles.LabelText}>{displayType}</Text>
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
            source={require('../../assets/images/CannotEdit.png')} 
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

export default UserAttribute

const styles = StyleSheet.create({
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
});