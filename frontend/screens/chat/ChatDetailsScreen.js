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
  Platform
} from 'react-native';
import { responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';

import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { auth, db } from "../../config/firebaseConfig";
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

import NoProfilePicture from "../../assets/NoPicture.jpg"

export default function ChatDetailsScreen({ navigation }) {

  const [messages, setMessages] = useState('')
  const [textContent, setTextContent] = useState('')

  const route = useRoute();
  const { chatId, matchedUser } = route.params;

  const userId = auth.currentUser.uid

  useEffect(() => {
  
    // We query and extract the messages in descending order
    const q = query(
    collection(db, "chats", chatId, "messages"),
    orderBy("timestamp", "desc")
    );

    // Here we map each chat document to the id and its data
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })))
    })

  return () => unsubscribe();
  }, []);

  return (
    <KeyboardAvoidingView 
      style={styles.SafeAreaViewContainer}
      // Allows the screen to rise above the keyboard when it appears
      // * remember to change if we do implement android
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset
    >
      <SafeAreaView style={styles.MainContainer}>
        <View style={styles.WhiteSpace} />
        <Header
          navigation={navigation}
          matchedUser={matchedUser}
          chatId={chatId}
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
  
  if (!text) {
    return;
  }

  // Upon sending a message add it to the corresponding document
  await addDoc(collection(db, "chats", chatId, "messages"), {
      text,
      senderId,
      timestamp: serverTimestamp(),
    })

    // Here we set the last message to the corresponding chat document for easy access
    await setDoc(doc(db, "chats", chatId), {
      lastMessage: { 
        text, 
        timestamp: new Date() }
    }, { merge: true });

    // Reset the current text content to null
    setTextContent('')
  }


const Header = ({ chatId, matchedUser, navigation }) => {
  return(
    <View style={styles.HeaderContainer}>
      <TouchableOpacity
        onPress={() => navigation.navigate("ChatList")}>
        <AntDesign 
          name="arrowleft" 
          size={28} 
          color="#FE6B75" 
          style={styles.BackButton}
        />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.ImageAndNameContainer}
        onPress={() => navigation.navigate("ChatProfile", { chatId, matchedUser })}
      >
        <Photo image={matchedUser.image}/>
        <Text style={styles.HeaderText}>{matchedUser.firstName}</Text>
      </TouchableOpacity>
    </View>
  )
}

const Photo = ({ image }) => {
  return (
  <View style={styles.Circle}>
    <Image 
      style={styles.Image}
      source={{ uri: image || 
        NoProfilePicture
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
          ? <View style={[
              styles.MessageContainer, 
              { backgroundColor: '#FFF0F0', alignSelf: 'flex-end'}
            ]}>
              <Text style={styles.Message}>{item.text}</Text>
            </View>
          : <View style={[
              styles.MessageNotSentByMe,
              { backgroundColor: '#F1F1F1', alignSelf: 'flex-start'}
            ]}>
              <Text style={styles.Message}>{item.text}</Text>
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
    backgroundColor: 'white',
  },
  BackButton: {
    marginRight: responsiveWidth(8)
  },
  HeaderContainer: {
    flexDirection: 'row',
    paddingLeft: responsiveWidth(5),
    paddingTop: responsiveHeight(1),
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  ImageAndNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FE6B75',
    marginLeft: 20
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
    marginLeft: responsiveWidth(5),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: responsiveHeight(3),
    paddingHorizontal: 24,
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
  MessageContainer: {
    maxWidth: responsiveWidth(80),
    minWidth: responsiveWidth(15),
    padding: 16,
    borderRadius: 20,
    marginRight: responsiveWidth(6),
    marginBottom: 15,
    alignItems: 'center',
  },
  Message: {
    fontSize: 16,
  }
})