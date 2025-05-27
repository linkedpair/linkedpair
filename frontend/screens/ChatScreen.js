import React, { useEffect, useState } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
  Image,
  Button,
  ScrollView,
  SafeAreaView,
  FlatList,
} from 'react-native';


export default function ChatScreen() {

    const [chats, setChats] = useState([])

    // Eventually to be extracted from database, these are just placeholders
    useEffect(() => {
      setChats([
        { name: 'William', lastText: 'Hello!'}, 
        { name: 'Johnathon', lastText: 'Bye!'},
        { name: 'Lilly', lastText: 'What games do you like to play?'},
        { name: 'Monika', lastText: 'if we were socks we would make a great pair. This text is too long'},
        { name: 'Taylor', lastText: 'Wanna be Minecraft without the craft?'},
        { name: 'Katarina', lastText: "you're hot"},
        { name: 'Gina', lastText: 'Do you play league?'},        
      ])}, []);

    return (
      <SafeAreaView style={styles.SafeAreaViewContainer}>
        <View style={styles.WhiteSpace} />
        <Header />
        <View style={{ flex: 1 }}>
          <FlatList
            data={chats}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.ChatContainer}>
                <Photo />
                <View style={styles.TextDisplay}>
                  <Text style={styles.NameText}>{item.name}</Text>  
                  <Text 
                    style={styles.ContentText}
                    numberOfLines={1}
                    ellipsizeMode='tail'
                  >
                    {item.lastText}
                  </Text>
                </View>
                <NotificationSymbol />
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