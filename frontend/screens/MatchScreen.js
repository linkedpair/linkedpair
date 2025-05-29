import React, { useState, useEffect } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";

import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { 
  doc, 
  collection, 
  getDocs, 
  query, 
  where, 
  addDoc, 
  getDoc, 
  serverTimestamp, 
} from "firebase/firestore";

import { buddyMatch, romanticMatch, geolocationMatch } from "../utils/matching";

export default function MatchScreen({ navigation }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [initialising, setInitialising] = useState(true);

  const [matchedUser, setMatchedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [matchType, setMatchType] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            setCurrentUser({ uid: user.uid, ...userDocSnap.data() });
          } else {
            setCurrentUser({ uid: user.uid });
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        setCurrentUser(null);
      }
      setInitialising(false);
    });

    return () => unsubscribe();
  }, []);

  if (initialising) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FE6B75" />
        <Text>Loading user data...</Text>
      </View>
    );
  }

  if (!currentUser) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Please sign in to use the matching feature.</Text>
      </View>
    );
  }

  async function handleMatch(type) {
    setLoading(true);
    setMatchType(type);
    setMatchedUser(null);

    try {
      let result = null;
      if (type === "Buddy") {
        result = await buddyMatch(currentUser);
      } else if (type === "Romantic") {
        result = await romanticMatch(currentUser);
      } else if (type === "Geolocation") {
        result = await geolocationMatch(currentUser);
      }
      
      if (result) {
        setMatchedUser(result);
        const chat = await getOrCreateChat(currentUser, result)
        navigation.navigate("Chat", {
          screen: "ChatDetails",
          params: {
            chatId: chat.id,
            matchedUser: result
          }
        })
      }
    } catch (error) {
      console.error("Match error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function getOrCreateChat(currentUser, matchedUser) {
    
    // Query from db for chats where the chat contains the current user
    const chatQuery = query(
      collection(db, 'chats'),
      where('users', 'array-contains', currentUser.uid)
    )

    const snapshot = await getDocs(chatQuery)

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
    const chatRef = await addDoc(collection(db, 'chats'), {
      users: [currentUser, matchedUser],
      userIds: [currentUser.uid, matchedUser.uid],
      createdAt: new Date(),
      lastMessage: {
        text: null,
        timestamp: serverTimestamp()
      }
    })

    return { 
      id: chatRef.id, 
      users: [currentUser, matchedUser],
      userIds: [currentUser.uid, matchedUser.uid] 
    };
  }

  return (
    <KeyboardAvoidingView style={styles.MainContainer}>
      <View style={styles.WhiteSpace} />
      <View style={styles.FormContainer}>
        <MatchButton type="Buddy" onPress={() => handleMatch("Buddy")} />
        <MatchButton type="Romantic" onPress={() => handleMatch("Romantic")} />
        <MatchButton
          type="Geolocation"
          onPress={() => handleMatch("Geolocation")}
        />

        <View style={styles.matchResultContainer}>
          {loading && <ActivityIndicator size="large" color="#FE6B75" />}
          {!loading &&
            matchType !== "" &&
            (matchedUser ? (
              <View style={styles.matchCard}>
                <Text style={styles.matchHeading}>
                  {matchType} Match Found!
                </Text>
                <Text>UID: {matchedUser.uid}</Text>
                <Text>Gender: {matchedUser.gender}</Text>
                <Text>Major: {matchedUser.major}</Text>
                {matchedUser.location && (
                  <Text>
                    Location: {matchedUser.location.latitude.toFixed(3)},{" "}
                    {matchedUser.location.longitude.toFixed(3)}
                  </Text>
                )}
              </View>
            ) : (
              <Text style={styles.noMatchText}>
                No {matchType} match found.
              </Text>
            ))}
        </View>
      </View>
      <View style={styles.WhiteSpace} />
    </KeyboardAvoidingView>
  );
}

const MatchButton = ({ type, onPress }) => {
  return (
    <TouchableOpacity style={styles.MatchButton} onPress={onPress}>
      <Text style={styles.ButtonText}>{type} Match</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
  },
  WhiteSpace: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  FormContainer: {
    flex: 1,
    flexDirection: "column",
    paddingHorizontal: 20,
    width: "100%",
    alignItems: "center",
  },
  MatchButton: {
    borderColor: "#aaa",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    margin: "3%",
    width: "80%",
    borderRadius: 10,
  },
  ButtonText: {
    color: "#FE6B75",
    fontSize: 16,
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  matchResultContainer: {
    marginTop: 30,
    alignItems: "center",
  },
  matchCard: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#FE6B75",
    borderRadius: 8,
  },
  matchHeading: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#FE6B75",
  },
  noMatchText: {
    color: "#FE6B75",
    fontSize: 16,
  },
});
