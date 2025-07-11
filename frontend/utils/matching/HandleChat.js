import { db } from "../../config/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

const handleChat = async (user, matchedUser, navigation) => {
  async function getOrCreateChat(currentUser, matchedUser) {
  // Query from db for chats where the chat contains the current user
    const chatQuery = query(
      collection(db, "chats"),
      where("users", "array-contains", currentUser.uid)
    );

    const snapshot = await getDocs(chatQuery);

    // Here we obtain the chat from the above query which has both the current
    // and matched user
    // similar to using a for each loop in java (for each docSnap in snapshot.docs)
    for (const docSnap of snapshot.docs) {
      const chat = docSnap.data();
      if (chat.userIds.includes(matchedUser.uid)) {
        return { id: docSnap.id, ...chat };
      }
    }

    // We enter here if we are unable to find a chat above. We create a chat here
    // I add users and userIds so we can retrieve the user object directly
    // for its data later
    const chatRef = await addDoc(collection(db, "chats"), {
      users: [
        {
          uid: currentUser.uid,
          firstName: currentUser.firstName,
          username: currentUser.username,
          dateOfBirth: currentUser.dateOfBirth,
          image: currentUser.image,
          gender: currentUser.gender,
          zodiac: currentUser.zodiac,
          hobbies: currentUser.hobbies,
          profileDescription: currentUser.profileDescription,
          faculty: currentUser.faculty,
          stayOnCampus: currentUser.stayOnCampus,
          yearOfStudy: currentUser.yearOfStudy,
          courses: currentUser.courses
        },
        {
          uid: matchedUser.uid,
          firstName: matchedUser.firstName,
          username: matchedUser.username,
          dateOfBirth: matchedUser.dateOfBirth,
          image: matchedUser.image,
          gender: matchedUser.gender,
          zodiac: matchedUser.zodiac,
          hobbies: matchedUser.hobbies,
          profileDescription: matchedUser.profileDescription,
          faculty: matchedUser.faculty,
          stayOnCampus: matchedUser.stayOnCampus,
          yearOfStudy: matchedUser.yearOfStudy,
          courses: matchedUser.courses
        },
      ],
      userIds: [currentUser.uid, matchedUser.uid],
      createdAt: new Date(),
      lastMessage: {
        text: null,
        timestamp: serverTimestamp(),
      },
    });

    return {
      id: chatRef.id,
      users: [currentUser, matchedUser],
      userIds: [currentUser.uid, matchedUser.uid],
    };
  }

  try {
    const chat = await getOrCreateChat(user, matchedUser);
    navigation.navigate("Chat", {
      screen: "ChatDetails",
      params: {
        chatId: chat.id,
        matchedUser: matchedUser,
      },
    });
  } catch (error) {
    console.error("Match error:", error);
  }
}

export default handleChat