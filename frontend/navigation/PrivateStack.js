import React, { useContext } from 'react';
import { Image } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import ProfileStack from './ProfileStack';
import MatchScreen from '../screens/MatchScreen';

import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import ChatStack from './ChatStack';

import LoadingScreen from '../components/LoadingScreen'
import { UserContext } from '../contexts/UserContext';

const Tab = createBottomTabNavigator();

export default function MyTabs() {

  const { user, userData}  = useContext(UserContext);

  if (!user || !userData) {
      return <LoadingScreen />
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
                    source={{ uri: userData.downloadURL }}
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
                    source={{ uri: userData.downloadURL }}
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
