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

  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  
  const user = userCredential.user;
      
  const ageString = getAgeString(date);
  const profileText = `${ageString}\nTraits: ${traits}`;

  const embedding = await generateEmbeddingFromProfile(profileText);

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

  return user;
}