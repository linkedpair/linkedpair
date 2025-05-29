import React, { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';

import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  SafeAreaView,
  Image,
  TextInput,
  FlatList,
} from 'react-native';


import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { auth, db } from "../firebaseConfig";
import { 
  onSnapshot, 
  query, 
  orderBy, 
  collection, 
  addDoc, 
  doc, 
  serverTimestamp, 
  setDoc, 
} from "firebase/firestore";

export default function ChatDetailsScreen({ navigation }) {

  const [messages, setMessages] = useState('')
  const [textContent, setTextContent] = useState('')

  const route = useRoute();
  const { chatId, matchedUser } = route.params;

  const userId = auth.currentUser.uid

  useEffect(() => {
  
    const q = query(
    collection(db, "chats", chatId, "messages"),
    orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })))
    })

  return () => unsubscribe();
  }, []);

  return (
    <KeyboardAvoidingView style={styles.SafeAreaViewContainer}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.WhiteSpace} />
        <Header
          navigation={navigation}
          matchedUser={matchedUser}
        />
        <Messages 
          messages={messages}
          userId={userId}
        />
        <TextBox 
          textContent={textContent}
          setTextContent={setTextContent}
          chatId={chatId}
          userId={userId}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}

const SendMessage = async (chatId, text, senderId, setTextContent) => {
    
  await addDoc(collection(db, "chats", chatId, "messages"), {
      text,
      senderId,
      timestamp: serverTimestamp(),
    })

    // Set Last Message
    await setDoc(doc(db, "chats", chatId), {
      lastMessage: { 
        text, 
        timestamp: new Date() }
    }, { merge: true });

    setTextContent('')
  }


const Header = ({ matchedUser, navigation }) => {
  return(
    <View style={styles.HeaderContainer}>
      <TouchableOpacity
        onPress={() => navigation.navigate("ChatList")}>
        <AntDesign 
          name="arrowleft" 
          size={28} 
          color="black" 
          style={styles.BackButton}
        />
      </TouchableOpacity>
      <Photo 
        image={matchedUser.image}
      />
      <Text style={styles.HeaderText}>
        {matchedUser.firstName}
      </Text>
    </View>
  )
}

const Photo = ({ image }) => {
  return (
  <View style={styles.Circle}>
    {/* To extract image from database */}
    <Image 
      style={styles.Image}
      source={{ uri: image || 
        'https://milkmochabear.com/cdn/shop/files/mmb-carrots-a_2048x.jpg?v=1698799022' 
      }} />
  </View>
  )
}

const Messages = ({ messages, userId }) => {
  return (
    <FlatList
    inverted
      data={messages}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        item.senderId === userId
          ? <View style={styles.MessageSentByMe}>
              <Text style={{fontSize: 16}}>{item.text}</Text>
            </View>
          : <View style={styles.MessageNotSentByMe}>
              <Text style={{fontSize: 16}}>{item.text}</Text>
            </View>
      )}
      contentContainerStyle={{ justifyContent:'flex-start', flexDirection:'column' }}
    />
  )
}

const TextBox = ({ chatId, textContent, setTextContent, userId }) => {
  return (
    <View style={styles.TextBoxContainer}> 
      <TextInput
        style={styles.TextBox}
        placeholder={'Type Something...'}
        onChangeText={setTextContent}
        defaultValue={textContent}
      />
      <TouchableOpacity 
        style={styles.SendMessageButton}
        onPress={() => SendMessage(chatId, textContent, userId, setTextContent)}
        >
      <MaterialIcons name="navigate-next" size={24} color="#B9B9B9" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  SafeAreaViewContainer: {
    flex: 1, 
    backgroundColor: 'white',
    flexDirection: 'column',
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
  BackButton: {
    marginRight: '8%'
  },
  HeaderContainer: {
    flexDirection: 'row',
    marginLeft: '5%',
    marginTop: '4%',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  Circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  Image: {
    height: '100%', 
    width: '100%', 
    resizeMode: 'cover',
    alignSelf: 'center',
  },
  HeaderText: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#fe969d',
    marginLeft: '3%'
  },
  TextBoxContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  TextBox: {
    width: '67%',
    backgroundColor: '#F1F1F1',
    height: 50,
    borderRadius: 30,
    marginLeft: '4%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '6%',
    paddingHorizontal: '6%',
    fontSize: 20
  },
  SendMessageButton: {
    width: '18%',
    backgroundColor: '#F1F1F1',
    height: 50,
    borderRadius:25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  MessageSentByMe: {
    backgroundColor: '#FFF0F0',
    maxWidth: '80%',
    minWidth: '10%',
    alignSelf: 'flex-end',
    padding: 17,
    borderRadius: 20,
    marginRight: '6%',
    marginBottom: '4.5%',
    alignItems: 'center',
  },
  MessageNotSentByMe: {
    backgroundColor: '#F1F1F1',
    maxWidth: '70%',
    minWidth: '10%',
    alignSelf: 'flex-start',
    padding: 16,
    borderRadius: 20,
    marginLeft: '6%',
    marginBottom: '4%',
    alignItems: 'center',
  }
})