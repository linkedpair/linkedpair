import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileStack from './ProfileStack';
import ChatScreen from '../screens/ChatScreen';
import MatchScreen from '../screens/MatchScreen';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Image, StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();

export default function MyTabs() {
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
                    source={require('../assets/TestPhoto.jpeg')}
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
                    source={require('../assets/TestPhoto.jpeg')}
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
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="You" component={ProfileStack} />
    </Tab.Navigator>
  );
}
