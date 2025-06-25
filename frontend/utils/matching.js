import { db } from "../firebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

// Helper: Calculate distance between two coords in km (Haversine formula)
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
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

// Match 1 user who satisfies criteria and has not matched with currentUser yet
async function tryMatch(currentUser, candidate) {
  if (
    !candidate.matchedWith?.includes(currentUser.uid) &&
    !currentUser.matchedWith?.includes(candidate.uid)
  ) {
    // Update both users' matchedWith arrays
    await updateDoc(doc(db, "users", currentUser.uid), {
      matchedWith: arrayUnion(candidate.uid),
    });
    await updateDoc(doc(db, "users", candidate.uid), {
      matchedWith: arrayUnion(currentUser.uid),
    });
    return candidate;
  }
  return null;
}

// AI Buddy Match: same gender AND same major
export async function aiBuddyMatch(currentUser) {
  const usersRef = collection(db, "users");

  const q = query(
    usersRef,
    where("major", "==", currentUser.major),
    where("gender", "==", currentUser.gender),
    where("uid", "!=", currentUser.uid)
  );

  const querySnapshot = await getDocs(q);

  let bestMatch = null;
  let bestSimilarity = -Infinity;

  for (const docSnap of querySnapshot.docs) {
    const candidate = docSnap.data();

    // Skip if already matched
    if (
      currentUser.matchedWith?.includes(candidate.uid) ||
      candidate.matchedWith?.includes(currentUser.uid)
    ) {
      continue;
    }

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
    // Save mutual match
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
export async function aiRomanticMatch(currentUser) {
  const usersRef = collection(db, "users");

  const q = query(usersRef, where("gender", "!=", currentUser.gender)); // Only one inequality allowed

  const querySnapshot = await getDocs(q);

  let bestMatch = null;
  let bestSimilarity = -Infinity;

  for (const docSnap of querySnapshot.docs) {
    const candidate = docSnap.data();

    // Filter out in app logic
    const isDifferentMajor = candidate.major !== currentUser.major;
    const isNotCurrentUser = candidate.uid !== currentUser.uid;

    if (
      isDifferentMajor &&
      isNotCurrentUser &&
      !currentUser.matchedWith?.includes(candidate.uid) &&
      !candidate.matchedWith?.includes(currentUser.uid)
    ) {
      const similarity = cosineSimilarity(
        currentUser.embedding,
        candidate.embedding
      );

      if (similarity > bestSimilarity) {
        bestSimilarity = similarity;
        bestMatch = candidate;
      }
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
export async function geolocationMatch(currentUser) {
  if (
    !currentUser.location ||
    !currentUser.location.latitude ||
    !currentUser.location.longitude
  ) {
    return null; // Cannot match without location
  }

  const usersRef = collection(db, "users");
  const q = query(usersRef, where("uid", "!=", currentUser.uid));

  const querySnapshot = await getDocs(q);

  for (const docSnap of querySnapshot.docs) {
    const candidate = docSnap.data();

    if (
      !candidate.location ||
      !candidate.location.latitude ||
      !candidate.location.longitude
    )
      continue;

    // Calculate distance
    const dist = getDistanceFromLatLonInKm(
      currentUser.location.latitude,
      currentUser.location.longitude,
      candidate.location.latitude,
      candidate.location.longitude
    );

    if (dist <= 5) {
      // within 5 km
      const matched = await tryMatch(currentUser, candidate);
      if (matched) return matched;
    }
  }

  return null;
}
