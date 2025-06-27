import React from "react";
import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

import { generateEmbeddingFromProfile } from "../utils/openai";

import getAgeString from "../utils/GetAgeString";

export default async function SignUpService({
  firstName,
  lastName,
  email,
  password,
  male,
  username,
  major,
  image,
  date,
  profileDescription,
  traits,
  location,
  downloadURL
}) {
  let user;
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    user = userCredential.user;
  } catch (error) {
    throw new Error("failed to create user")
  }
      
  const ageString = getAgeString(date);
  const profileText = `${ageString}\ntraits: ${traits}`;

  const embedding = await generateEmbeddingFromProfile(profileText);

  try{
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      firstName,
      lastName,
      gender: male ? "Male" : "Female",
      //included undefined for testing
      dateOfBirth: date ? date.toISOString().split("T")[0] : undefined, 
      username,
      email,
      major,
      image,
      location,
      traits,
      profileDescription,
      embedding,
      downloadURL,
      createdAt: serverTimestamp(),
      matchedWith: [],
    });
  } catch (error) {
    throw new Error("failed to send data to firebase")
  }
  return user;
}