import { db } from "../../config/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import calculateAge from "../dateFunctions/CalculateAge";

// Helper: Calculate distance between two coords in km (Haversine formula)
export function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Helper: Calculate cosine similarity between two vectors
function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return -1;

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] ** 2;
    normB += vecB[i] ** 2;
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Converts cosine similarity (-1 to 1) to compatibility score (0 to 100)
function similarityToScore(similarity) {
  return Math.round(((similarity + 1) / 2) * 100);
}

// Helper: Get the opposite gender
function oppositeGender(gender) {
  if (gender === "Male") return "Female";
  if (gender === "Female") return "Male";
  return null;
}

// Helper: Filter users based on various criteria
async function filterUsersSmart(filters = {}) {
  const usersRef = collection(db, "users");
  const snapshot = await getDocs(usersRef);

  const {
    gender,
    faculty,
    yearOfStudy,
    minAge,
    maxAge,
    zodiac,
    hobbies,
    stayOnCampus,
    courses,
  } = filters;

  const result = [];

  snapshot.forEach((docSnap) => {
    const user = docSnap.data();
    const age = calculateAge(user.dateOfBirth);

    // Apply filters
    if (gender && user.gender !== gender) return;
    if (faculty && user.faculty !== faculty) return;
    if (yearOfStudy && user.yearOfStudy !== yearOfStudy) return;
    if (minAge && age < minAge) return;
    if (maxAge && age > maxAge) return;
    if (zodiac && user.zodiac !== zodiac) return;
    if (stayOnCampus !== undefined && user.stayOnCampus !== stayOnCampus)
      return;

    // Check hobbies overlap (if filter provided)
    if (hobbies?.length > 0) {
      const match = hobbies.some((h) =>
        user.hobbiesArray?.includes(h.toLowerCase())
      );
      if (!match) return;
    }

    // Check courses overlap (if filter provided)
    if (courses?.length > 0) {
      const match = courses.some((c) =>
        user.coursesArray?.includes(c.toLowerCase())
      );
      if (!match) return;
    }

    // If passed all filters, add to result
    result.push(user);
  });

  return result;
}

// AI Buddy Match: same gender AND same major
export async function aiBuddyMatch(currentUser, filters = {}) {
  const filteredUsers = await filterUsersSmart({
    ...filters,
    gender: currentUser.gender,
    faculty: currentUser.faculty,
  });

  const candidates = filteredUsers.filter(
    (u) =>
      u.uid !== currentUser.uid &&
      !currentUser.matchedWith?.includes(u.uid) &&
      !u.matchedWith?.includes(currentUser.uid)
  );

  let bestMatch = null;
  let bestSimilarity = -Infinity;

  for (const candidate of candidates) {
    const similarity = cosineSimilarity(
      currentUser.embedding,
      candidate.embedding
    );
    if (similarity > bestSimilarity) {
      bestSimilarity = similarity;
      bestMatch = candidate;
    }
  }

  if (bestMatch) {
    await updateDoc(doc(db, "users", currentUser.uid), {
      matchedWith: arrayUnion(bestMatch.uid),
    });
    await updateDoc(doc(db, "users", bestMatch.uid), {
      matchedWith: arrayUnion(currentUser.uid),
    });

    return {
      match: bestMatch,
      compatibilityScore: similarityToScore(bestSimilarity),
    };
  }

  return null;
}

// AI Romantic Match: different gender AND different major
export async function aiRomanticMatch(currentUser, filters = {}) {
  const filteredUsers = await filterUsersSmart({
    ...filters,
    gender: oppositeGender(currentUser.gender),
  });

  const candidates = filteredUsers.filter(
    (u) =>
      u.faculty !== currentUser.faculty &&
      u.uid !== currentUser.uid &&
      !currentUser.matchedWith?.includes(u.uid) &&
      !u.matchedWith?.includes(currentUser.uid)
  );

  let bestMatch = null;
  let bestSimilarity = -Infinity;

  for (const candidate of candidates) {
    const similarity = cosineSimilarity(
      currentUser.embedding,
      candidate.embedding
    );
    if (similarity > bestSimilarity) {
      bestSimilarity = similarity;
      bestMatch = candidate;
    }
  }

  if (bestMatch) {
    await updateDoc(doc(db, "users", currentUser.uid), {
      matchedWith: arrayUnion(bestMatch.uid),
    });
    await updateDoc(doc(db, "users", bestMatch.uid), {
      matchedWith: arrayUnion(currentUser.uid),
    });

    return {
      match: bestMatch,
      compatibilityScore: similarityToScore(bestSimilarity),
    };
  }

  return null;
}

// Geolocation Match: within 5km radius
export async function geolocationMatch(currentUser, filters = {}) {
  if (!currentUser.location?.latitude || !currentUser.location?.longitude)
    return null;

  const filteredUsers = await filterUsersSmart(filters);

  for (const candidate of filteredUsers) {
    if (
      candidate.uid === currentUser.uid ||
      currentUser.matchedWith?.includes(candidate.uid) ||
      candidate.matchedWith?.includes(currentUser.uid) ||
      !candidate.location?.latitude ||
      !candidate.location?.longitude
    ) {
      continue;
    }

    const dist = getDistanceFromLatLonInKm(
      currentUser.location.latitude,
      currentUser.location.longitude,
      candidate.location.latitude,
      candidate.location.longitude
    );

    if (dist <= 5) {
      await updateDoc(doc(db, "users", currentUser.uid), {
        matchedWith: arrayUnion(candidate.uid),
      });
      await updateDoc(doc(db, "users", candidate.uid), {
        matchedWith: arrayUnion(currentUser.uid),
      });

      return candidate;
    }
  }

  return null;
}
