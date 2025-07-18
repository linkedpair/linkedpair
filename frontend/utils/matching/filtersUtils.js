import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";

export async function getUserFilters(userId) {
  try {
    const filtersRef = doc(db, "filters", userId);
    const snapshot = await getDoc(filtersRef);

    if (snapshot.exists()) {
      return snapshot.data();
    } else {
      // console.warn("No filters found for user:", userId);
      return {}; // Default to no filters
    }
  } catch (error) {
    console.error("Error fetching filters:", error);
    return {};
  }
}
