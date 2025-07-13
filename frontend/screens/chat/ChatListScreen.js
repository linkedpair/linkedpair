import React, { useEffect, useState, useContext } from "react";
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

import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";

import { auth, db } from "../../config/firebaseConfig";

import {
  onSnapshot,
  query,
  orderBy,
  collection,
  where,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import { UserContext } from "../../contexts/UserContext";

import NoProfilePicture from "../../assets/images/NoPicture.jpg";

import FormatTimestamp from "../../utils/dateFunctions/FormatTimestamp";

export default function ChatListScreen({ navigation }) {
  // Turning off an error because i need my flatlist to be in a
  // scrollview else it refuses to scroll
  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);

  const [chats, setChats] = useState([]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        subscribeToChats(user.uid);
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

  const { user, userData } = useContext(UserContext);

  return (
    <SafeAreaView style={styles.MainContainer}>
      <ScrollView
        contentContainerStyle={styles.FormContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.HeaderText}>Messages</Text>
        <View style={{ flex: 1 }}>
          <FlatList
            data={chats}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const matchedUser = Array.isArray(item.users)
                ? item.users.find((otherUser) => otherUser.uid !== user.uid)
                : null;

              if (!matchedUser) return null;

              const lastMessageTime = item.lastMessage?.timestamp
                ? FormatTimestamp(item.lastMessage.timestamp)
                : "";
              return (
                <>
                  <TouchableOpacity
                    style={styles.ChatContainer}
                    onPress={async () => {
                      navigation.navigate("ChatDetails", {
                        chatId: item.id,
                        matchedUser: matchedUser,
                      });
                    }}
                  >
                    <Photo photo={matchedUser.image || NoProfilePicture} />
                    <View style={styles.TextDisplay}>
                      <Text style={styles.NameText}>
                        {matchedUser.firstName}
                      </Text>
                      <Text
                        style={styles.ContentText}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {item.lastMessage?.text || "start chatting..."}
                      </Text>
                    </View>
                    <Text style={styles.Timestamp}>{lastMessageTime}</Text>
                    {/* <NotificationSymbol /> */}
                  </TouchableOpacity>
                  <View style={styles.GreyLine} />
                </>
              );
            }}
            contentContainerStyle={styles.FlatListContainer}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
  MainContainer: {
    flex: 1,
    backgroundColor: "white",
    width: "100%",
  },
  FormContainer: {
    paddingHorizontal: responsiveWidth(8),
    paddingBottom: responsiveHeight(2),
    paddingTop: responsiveHeight(1),
  },
  FlatListContainer: {
    flex: 1,
    marginVertical: responsiveHeight(2),
  },
  HeaderText: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#FF7A83",
  },
  Circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  Image: {
    height: "100%",
    width: "100%",
    resizeMode: "cover",
  },
  ChatContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginVertical: 10,
  },
  TextDisplay: {
    flex: 1,
    justifyContent: "center",
    gap: 5,
  },
  NameText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4A4A4A",
  },
  ContentText: {
    fontSize: 18,
    fontWeight: "regular",
    color: "#9B9B9B",
  },
  GreyLine: {
    backgroundColor: "#D3D3D3",
    height: 0.25,
  },
  Timestamp: {
    alignSelf: "flex-start",
    fontSize: 15,
    fontWeight: "500",
    color: "#999999",
    paddingTop: 10,
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
