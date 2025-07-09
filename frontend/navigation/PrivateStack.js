import React, { useContext } from 'react';
import { Image } from 'react-native';
import { responsiveWidth } from 'react-native-responsive-dimensions';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import BuddyMatch from '../screens/matching/BuddyMatch';
import RomanticMatch from '../screens/matching/RomanticMatch';
import LocationMatch from '../screens/matching/LocationMatch';
import ChatStack from './ChatStack';
import ProfileStack from './ProfileStack';

import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';

import LoadingScreen from '../components/LoadingScreen'

import { UserContext } from '../contexts/UserContext';

const Tab = createBottomTabNavigator();

export default function MyTabs() {

  const { user, userData}  = useContext(UserContext);

  if (!user || !userData) {
      return <LoadingScreen loadingText={"Loading user data..."}/>
  }

  return (
    <Tab.Navigator 
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Buddy') {
            iconName = focused 
              ? 'people-sharp'
              : 'people-outline'
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === 'Romantic') {
            iconName = focused 
              ? 'heart'
              : 'hearto'
            return <AntDesign name={iconName} size={size} color={color} />;
          } else if (route.name === 'Location') {
            iconName = focused 
              ? 'location'
              : 'location-outline'
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === 'Chat') {
            iconName = focused
              ? 'chatbubble-ellipses-sharp'
              : 'chatbubble-ellipses-outline'
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === 'You') {
            return (
              iconName = focused
                ? <Image 
                    source={{ uri: userData.image }}
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
                    source={{ uri: userData.image }}
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
        tabBarStyle: {
          paddingHorizontal: responsiveWidth(1.5),
        },
      })}
    >
      <Tab.Screen name="Buddy" component={BuddyMatch} />
      <Tab.Screen name="Romantic" component={RomanticMatch} />
      <Tab.Screen name="Location" component={LocationMatch} />
      <Tab.Screen name="Chat" component={ChatStack} />
      <Tab.Screen name="You" component={ProfileStack} />
    </Tab.Navigator>
  );
}
