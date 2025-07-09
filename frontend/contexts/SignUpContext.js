import React, { createContext, useState } from "react";

export const SignUpContext = createContext();

export const SignUpProvider = ({ children }) => {
  const [signUpData, setSignUpData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    dateOfBirth: null,
    image: "",
    gender: "",
    zodiac: "",
    hobbies: "",
    traits: "",
    profileDescription: "",
    faculty: "",
    stayOnCampus: null,
    yearOfStudy: "",
    courses: "",
    email: "",
    password: "",
  });

  const updateSignUpData = (newData) => {
    setSignUpData((prev) => ({
      ...prev,
      ...newData
    }));
  };

  return(
    <SignUpContext.Provider value={{ signUpData, updateSignUpData }}>
      {children}
    </SignUpContext.Provider>
  );
};