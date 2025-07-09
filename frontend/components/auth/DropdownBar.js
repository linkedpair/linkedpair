import React from "react";
import { StyleSheet } from "react-native";

import { Dropdown } from "react-native-element-dropdown";

export default function DropdownBar({
    data,
    placeholder,
    value,
    setValue,
    purpose,
    onChangeComplete
}) {

  return (
    <Dropdown
      style={purpose == "profile" ? styles.ProfileDropdown : styles.AuthDropdown}
      placeholderStyle={styles.PlaceholderStyle}
      selectedTextStyle={styles.SelectedTextStyle}
      inputSearchStyle={styles.InputSearchStyle}
      data={data}
      search
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder={value || placeholder}
      searchPlaceholder={"Search..."}
      value={value}
      onChange={(event) => {
        setValue(event.value);
        if (onChangeComplete) {
          onChangeComplete(event.value);
        }
      }}
    />
  );
};

const styles = StyleSheet.create({
  ProfileDropdown: {
    fontSize: 18,
    borderWidth: 0,
    marginTop: 10,
    marginBottom: 15,
  },
  AuthDropdown: {
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
      fontSize: 18,
  },
  InputSearchStyle: {
      height: 40,
      fontSize: 16,
  },
})