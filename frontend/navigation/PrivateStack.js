import React, { useState, useEffect } from 'react';
import { Text, Image } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import ProfileStack from './ProfileStack';
import MatchScreen from '../screens/MatchScreen';

import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import ChatStack from './ChatStack';

import { db, auth } from "../firebaseConfig";
import { doc, getDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

const Tab = createBottomTabNavigator();

export default function MyTabs() {

  const [user, setUser] = useState(null)
  const [data, setData] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user)
        try {
          const userRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(userRef);

          if (docSnap.exists()) {
            setData(docSnap.data())
          } else {
            alert("Missing data!");
          }
        } catch (error) {
          alert("error fetching user data");
        }
      } else {
        setData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!data) {
      return <Text>Loading...</Text>;
  }

  return (
    <Tab.Navigator 
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Match') {
            iconName = focused 
              ? 'heart'
              : 'hearto'
            return <AntDesign name={iconName} size={size} color={color} />;
          } else if (route.name === 'Chat') {
            iconName = focused
              ? 'chatbubble-ellipses-sharp'
              : 'chatbubble-ellipses-outline'
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === 'You') {
            return (
              iconName = focused
                ? <Image 
                    source={{ uri: data.image }}
                    style={{ 
                      height: size,
                      width: size,
                      borderRadius: size / 2,
                      borderWidth: 1.5,
                      borderColor: '#FE6B75',
                      padding: 1
                    }}
                  />
                : <Image 
                    source={{ uri: data.image }}
                    style={{ 
                      height: size,
                      width: size,
                      borderRadius: size / 2,
                      borderWidth: 1,
                      borderColor: 'gray',
                      padding: 1
                    }}
                  />
            )
          };
        },

        tabBarActiveTintColor: '#FE6B75',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Match" component={MatchScreen} />
      <Tab.Screen name="Chat" component={ChatStack} />
      <Tab.Screen name="You" component={ProfileStack} />
    </Tab.Navigator>
  );
}
