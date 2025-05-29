import React, { useEffect, useState } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  FlatList,
} from 'react-native';

import { auth, db } from "../firebaseConfig";
import { 
  onSnapshot, 
  query, 
  orderBy, 
  collection, 
  where,
} from "firebase/firestore";


export default function ChatScreen({ navigation }) {

  const [chats, setChats] = useState([])

  useEffect(() => {
    const q = query(
      collection(db, "chats"),
      where("userIds", "array-contains", auth.currentUser.uid),
      orderBy("lastMessage.timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setChats(chatList);
    });

    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView style={styles.SafeAreaViewContainer}>
      <View style={styles.WhiteSpace} />
      <Header />
      <View style={{ flex: 1 }}>
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.ChatContainer}
              onPress={async () => {
                navigation.navigate("ChatDetails", {
                  chatId: item.id,
                  matchedUser: item.users[1]
                });
              }}
            >
              <Photo 
                photo={item.users[1].image || 
                  'https://milkmochabear.com/cdn/shop/files/mmb-carrots-a_2048x.jpg?v=1698799022'
                }
              />
              <View style={styles.TextDisplay}>
                <Text style={styles.NameText}>{item.users[1].firstName}</Text>  
                <Text 
                  style={styles.ContentText}
                  numberOfLines={1}
                  ellipsizeMode='tail'
                >
                {item.lastMessage?.text || "start chatting..."}
                </Text>
              </View>
              {/* <NotificationSymbol /> */}
            </TouchableOpacity>
            )}
          contentContainerStyle={{ flex: 1 }}
        />
      </View>
    </SafeAreaView>
  )
}


const Header = () => {
  return (
    <View style={{ flexDirection: 'row' }}>
      <Text style={styles.HeaderText}>Messages</Text>
    </View>
  )
}

const Photo = ({ photo }) => {
  return (
  <View style={styles.Circle}>
    {/* To extract image from database */}
    <Image 
      style={styles.Image}
      source={{ uri: photo }}/>
  </View>
  )
}

const NotificationSymbol = () => {
  return (
    <View style={styles.NotificationSymbol}>
      <Text style={styles.NotificationSymbolText}>1</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  SafeAreaViewContainer: {
    flex: 1, 
    backgroundColor: 'white'
  },
  MainContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'white'
  },
  WhiteSpace: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  HeaderText: {
    flex: 6,
    fontSize: 36,
    fontWeight: 'medium',
    color: '#FE6B75',
    marginLeft: 21,
    marginBottom: 33
  },
  Circle: {
    width: 57,
    height: 57,
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 20,
    marginHorizontal: 15
  },
  Image: {
    flex: 2,
    height: '100%', 
    width: '100%', 
    resizeMode: 'cover'
  },
  ChatContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: '2%'
  },
  TextDisplay: {
    justifyContent: 'center',
    flex: 8,
  },
  NameText: {
    flex: 1, 
    marginTop: '3%',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4A4A4A'
  },
  ContentText: {
    flex: 1, 
    marginBottom: '3%',
    fontSize: 18,
    fontWeight: 'regular',
    color: '#9B9B9B'
  }, 
  NotificationSymbol: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 15,
    alignSelf: 'center',
    backgroundColor: '#FE6B75',
    marginHorizontal: '4%',
    alignItems: 'center',
    justifyContent: 'center',

  },
  NotificationSymbolText: {
    color: 'white',
    fontSize: 14
  }
})