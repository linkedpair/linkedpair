import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import AntDesign from '@expo/vector-icons/AntDesign';

const DateInput = ({ date, setDate, scrollViewRef }) => {
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const handleOpen = () => {
    setDatePickerOpen(true);
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ x: 0, y: 2000, animated: true }); // changed***
    }, 100);
  }

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
        <DateTimePicker
          style={styles.DateTimePicker}
          mode="date"
          display="inline"
          value={date || new Date()}
          onChange={(event, SelectedDate) => {
            setDatePickerOpen(false);
            if (SelectedDate) {
              setDate(SelectedDate);
            }
          }}
        />
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
    marginVertical: 10,
  },
  Description: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FE6B75',
  },
})

