import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

// Import Screens
import ChatDetailScreen from './screens/ChatDetailScreen';
import ClassScheduleScreen from './screens/ClassScheduleScreen';
import CreateAccountScreen from './screens/CreateAccountScreen';
import DashboardScreen from './screens/DashboardScreen';
import DiscussionListScreen from './screens/DiscussionListScreen';
import MaterialDetailScreen from './screens/MaterialDetailScreen';
import MaterialListScreen from './screens/MaterialListScreen';
import ProfileScreen from './screens/ProfileScreen';
import SignInScreen from './screens/SignInScreen';
import SplashScreen from './screens/SplashScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * Navigasi Tab Utama (Halaman yang ada menu bawahnya)
 */
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#003D79', // Warna biru sesuai desain
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { height: 60, paddingBottom: 10 },
        tabBarIcon: ({ color, size }) => {
          let iconName: any;
          if (route.name === 'Dashboard') iconName = 'home';
          else if (route.name === 'Class') iconName = 'book';
          else if (route.name === 'Discussion') iconName = 'chatbubbles';
          else if (route.name === 'Profile') iconName = 'person';
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Class" component={ClassScheduleScreen} />
      <Tab.Screen name="Discussion" component={DiscussionListScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

/**
 * Struktur Navigasi Utama Aplikasi
 */
export default function App() {
  return (
    <Stack.Navigator 
      screenOptions={{ headerShown: false }} 
      initialRouteName="Splash"
    >
      {/* Alur Splash & Auth */}
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />

      {/* Alur Utama (Tabs) */}
      <Stack.Screen name="Main" component={MainTabs} />

      {/* Alur Detail (Halaman tanpa menu bawah) */}
      <Stack.Screen name="MaterialList" component={MaterialListScreen} />
      <Stack.Screen name="MaterialDetail" component={MaterialDetailScreen} />
      <Stack.Screen name="ChatDetail" component={ChatDetailScreen} />
    </Stack.Navigator>
  );
}