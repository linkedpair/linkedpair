import React, { useEffect, useState } from 'react';
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

export default function ChatDetailsScreen({ navigation }) {

  const [messages, setMessages] = useState('')

  useEffect(() => {
    setMessages([
      { id: 1, text: 'hello!', sender: 'me' },      
      { id: 2, text: 'hi!', sender: 'them' },
      { id: 3, text: 'where are you from?', sender: 'me' }, 
      { id: 4, text: "I'm from Germany.", sender: 'them' },  
      { id: 5, text: 'me too!', sender: 'me' },  
      { id: 6, text: 'Can I follow you? My mother always told me to follow my dreams', sender: 'them' },
      { id: 7, text: 'Thats creepy no thanks.', sender: 'me' },  
    ])}, []);

  return (
    <KeyboardAvoidingView style={styles.SafeAreaViewContainer}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.WhiteSpace} />
        <Header
          navigation={navigation}
        />
        <Messages 
          messages={messages}
        />
        <TextBox 
          onChangeText={setMessages}
          value={messages}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}

const Header = ({ navigation }) => {
  return(
    <View style={styles.HeaderContainer}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Chat")}>
        <AntDesign 
          name="arrowleft" 
          size={28} 
          color="black" 
          style={styles.BackButton}
        />
      </TouchableOpacity>
      <Photo />
      <Text style={styles.HeaderText}>
        Germaine
      </Text>
    </View>
  )
}

const Photo = () => {
  return (
  <View style={styles.Circle}>
    {/* To extract image from database */}
    <Image 
      style={styles.Image}
      source={require('../assets/TestPhoto.jpeg')} />
  </View>
  )
}

const Messages = ({ messages }) => {
  return (
    <FlatList
      inverted
      data={messages}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        item.sender === 'me'
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

const TextBox = ({ onChangeText, value }) => {
  return (
    <View style={styles.TextBoxContainer}> 
      <TextInput
        style={styles.TextBox}
        placeholder={'Type Something...'}
        onChangeText={onChangeText}
        defaultValue={value}
      />
      <TouchableOpacity style={styles.SendMessageButton}>
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
    paddingLeft: '6%',
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
    padding: 14,
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
    padding: 14,
    borderRadius: 20,
    marginLeft: '6%',
    marginBottom: '4%',
    alignItems: 'center',
  }
})