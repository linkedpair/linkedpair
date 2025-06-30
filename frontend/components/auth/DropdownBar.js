import React from "react";
import { StyleSheet } from "react-native";

import { Dropdown } from "react-native-element-dropdown";

export default function DropdownBar({
    data,
    placeholder,
    value,
    setValue
}) {
  return (
    <Dropdown
      style={styles.Dropdown}
      placeholderStyle={styles.PlaceholderStyle}
      selectedTextStyle={styles.SelectedTextStyle}
      inputSearchStyle={styles.InputSearchStyle}
      data={data}
      search
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder={placeholder}
      searchPlaceholder="Search..."
      value={value}
      onChange={(event) => {
        setValue(event.value);
      }}
    />
  );
};

const styles = StyleSheet.create({
  Dropdown: {
    height: 48,
    borderWidth: 1,
    borderColor: "#aaa",
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  PlaceholderStyle: {
      fontSize: 16,
      color: "#aaa",
      fontWeight: '500',
  },
  SelectedTextStyle: {
      fontSize: 16,
  },
  InputSearchStyle: {
      height: 40,
      fontSize: 16,
  },
})