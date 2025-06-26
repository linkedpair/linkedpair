import React, { useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  FlatList,
  ScrollView,
  LogBox,
} from "react-native";

import { auth, db } from "../firebaseConfig";
import {
  onSnapshot,
  query,
  orderBy,
  collection,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function ChatListScreen({ navigation }) {
  // Turning off an error because i need my flatlist to be in a
  // scrollview else it refuses to scroll
  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);

  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        subscribeToChats(user.uid);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const subscribeToChats = (uid) => {
    // Here we sort the chats in order of descending last message,
    // latest message should appear first
    const q = query(
      collection(db, "chats"),
      where("userIds", "array-contains", uid),
      orderBy("lastMessage.timestamp", "desc")
    );

    const unsubscribeChats = onSnapshot(q, (snapshot) => {
      const chatList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChats(chatList);
    });

    return unsubscribeChats;
  };

  return (
    <SafeAreaView style={styles.SafeAreaViewContainer}>
      <ScrollView>
        <View style={styles.WhiteSpace} />
        <Header />
        <View style={{ flex: 1 }}>
          <FlatList
            data={chats}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const matchedUser = item.users.find(
                (otherUser) => otherUser.uid != user.uid
              );

              return (
                <TouchableOpacity
                  style={styles.ChatContainer}
                  onPress={async () => {
                    navigation.navigate("ChatDetails", {
                      chatId: item.id,
                      matchedUser: matchedUser,
                    });
                  }}
                >
                  <Photo
                    photo={
                      matchedUser.downloadURL ||
                      "https://milkmochabear.com/cdn/shop/files/mmb-carrots-a_2048x.jpg?v=1698799022"
                    }
                  />
                  <View style={styles.TextDisplay}>
                    <Text style={styles.NameText}>{matchedUser.firstName}</Text>
                    <Text
                      style={styles.ContentText}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.lastMessage?.text || "start chatting..."}
                    </Text>
                  </View>
                  {/* <NotificationSymbol /> */}
                </TouchableOpacity>
              );
            }}
            contentContainerStyle={{ flex: 1 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const Header = () => {
  return (
    <View style={{ flexDirection: "row" }}>
      <Text style={styles.HeaderText}>Messages</Text>
    </View>
  );
};

const Photo = ({ photo }) => {
  return (
    <View style={styles.Circle}>
      <Image style={styles.Image} source={{ uri: photo }} />
    </View>
  );
};

const NotificationSymbol = () => {
  return (
    <View style={styles.NotificationSymbol}>
      <Text style={styles.NotificationSymbolText}>1</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  SafeAreaViewContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  MainContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    backgroundColor: "white",
  },
  WhiteSpace: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  HeaderText: {
    flex: 6,
    fontSize: 36,
    fontWeight: "medium",
    color: "#FE6B75",
    marginLeft: 21,
    marginBottom: 33,
  },
  Circle: {
    width: 57,
    height: 57,
    borderRadius: 29,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 20,
    marginHorizontal: 15,
  },
  Image: {
    flex: 2,
    height: "100%",
    width: "100%",
    resizeMode: "cover",
  },
  ChatContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginRight: "2%",
  },
  TextDisplay: {
    justifyContent: "center",
    flex: 8,
  },
  NameText: {
    flex: 1,
    marginTop: "3%",
    fontSize: 22,
    fontWeight: "bold",
    color: "#4A4A4A",
  },
  ContentText: {
    flex: 1,
    marginBottom: "3%",
    fontSize: 18,
    fontWeight: "regular",
    color: "#9B9B9B",
  },
  NotificationSymbol: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 15,
    alignSelf: "center",
    backgroundColor: "#FE6B75",
    marginHorizontal: "4%",
    alignItems: "center",
    justifyContent: "center",
  },
  NotificationSymbolText: {
    color: "white",
    fontSize: 14,
  },
});
