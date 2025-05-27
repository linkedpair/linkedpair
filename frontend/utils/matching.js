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

// Buddy Match: same gender AND same major
export async function buddyMatch(currentUser) {
  const usersRef = collection(db, "users");

  const q = query(
    usersRef,
    where("major", "==", currentUser.major),
    where("gender", "==", currentUser.gender),
    where("uid", "!=", currentUser.uid)
  );

  const querySnapshot = await getDocs(q);

  for (const docSnap of querySnapshot.docs) {
    const candidate = docSnap.data();
    const matched = await tryMatch(currentUser, candidate);
    if (matched) return matched;
  }

  return null;
}

// Romantic Match: different gender AND different major
export async function romanticMatch(currentUser) {
  const usersRef = collection(db, "users");

  const q = query(usersRef, where("gender", "!=", currentUser.gender)); // Only one inequality allowed

  const querySnapshot = await getDocs(q);

  for (const docSnap of querySnapshot.docs) {
    const candidate = docSnap.data();

    // Filter out in app logic
    const isDifferentMajor = candidate.major !== currentUser.major;
    const isNotCurrentUser = candidate.uid !== currentUser.uid;

    if (isDifferentMajor && isNotCurrentUser) {
      const matched = await tryMatch(currentUser, candidate);
      if (matched) return matched;
    }
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
