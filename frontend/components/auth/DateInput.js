import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Button,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import AntDesign from '@expo/vector-icons/AntDesign';

const DateInput = ({ date, setDate, scrollViewRef }) => {
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());

  const handleOpen = () => {
    setTempDate(date || new Date());
    setDatePickerOpen(prev => !prev);
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ x: 0, y: 2000, animated: true }); 
    }, 100);
  }

  const handleConfirm = () => {
    setDate(tempDate);
    setDatePickerOpen(false);
  };

  return (
    <>
      <TouchableOpacity 
        style={styles.Container}
        onPress={handleOpen}
      >
        <AntDesign name="calendar" size={24} color="#FE6B75" />
        <Text style={styles.Description}>
          {date 
          ? date.toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            }) 
          : 'Choose your Birthday'}
        </Text>
      </TouchableOpacity>
      {datePickerOpen && (
        <View style={styles.DateTimePickerContainer}>
          <DateTimePicker
            style={styles.DateTimePicker}
            mode="date"
            display="spinner"
            value={tempDate}
            maximumDate={new Date()}
            onChange={(event, selectedDate) => {
              if (selectedDate) {
                setTempDate(selectedDate);
              }
            }}
          />
          <Button 
            style={styles.ConfirmButton}
            title="Confirm" 
            onPress={handleConfirm} 
          />        
        </View>
      )}
    </>
  );
};

export default DateInput

const styles = StyleSheet.create({
  Container: {
    height: 60,
    backgroundColor: '#FAEBEE',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 25,
    gap: 25,
  },
  Description: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FE6B75',
  },
  DateTimePickerContainer: {
    margin: 0,
    padding: 0
  },
  DateTimePicker: {
    margin: 0,
    padding: 0,
  },
})

