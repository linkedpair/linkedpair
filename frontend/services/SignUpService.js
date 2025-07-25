import React from "react";
import { auth, db } from "../config/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

import { generateEmbeddingFromProfile } from "../utils/auth/openai";
import getAgeString from "../utils/dateFunctions/GetAgeString";
import { parseToArray } from "../utils/stringUtils";

export default async function SignUpService(signUpData) {
  let user;

  const {
    firstName,
    lastName,
    username,
    dateOfBirth,
    location,
    image,
    gender,
    zodiac,
    hobbies,
    traits,
    profileDescription,
    faculty,
    stayOnCampus,
    yearOfStudy,
    courses,
    email,
    password,
  } = signUpData;

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    user = userCredential.user;
  } catch (error) {
    throw new Error("Email is already in use.");
  }

  // Parse inputs first
  const hobbiesArray = parseToArray(hobbies);
  const traitsArray = parseToArray(traits);
  const coursesArray = parseToArray(courses);

  // Then join arrays into strings for the profile text
  const hobbiesStr = hobbiesArray.join(", ");
  const traitsStr = traitsArray.join(", ");
  const coursesStr = coursesArray.join(", ");

  const ageString = getAgeString(dateOfBirth);
  const profileText = `${ageString}\ntraits: ${traitsStr}\nzodiac: ${zodiac}\nhobbies: ${hobbiesStr}\nstays on campus: ${stayOnCampus}\nyear of study: ${yearOfStudy}\ncourses currently taking: ${coursesStr}`;
  // Generate embedding for the profile text
  const embedding = await generateEmbeddingFromProfile(profileText);

  try {
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      firstName,
      lastName,
      username,
      dateOfBirth: dateOfBirth.toISOString().split("T")[0],
      location,
      image,
      gender,
      zodiac,
      hobbiesArray,
      hobbies: hobbiesStr,
      traitsArray,
      traits: traitsStr,
      profileDescription,
      faculty,
      stayOnCampus,
      yearOfStudy,
      coursesArray,
      courses: coursesStr,
      email,
      embedding,
      createdAt: serverTimestamp(),
      matchedWith: [],
    });
  } catch (error) {
    alert(error);
    throw new Error("Failed to send data to firebase.");
  }

  return user;
}
