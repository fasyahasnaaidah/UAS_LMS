import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

// Import Screens
import ChatDiscussionScreen from './screens/ChatDiscussionScreen';
import CourseListScreen from './screens/CourseListScreen';
import DashboardScreen from './screens/DashboardScreen';
import DiscussionListScreen from './screens/DiscussionListScreen';
import MaterialDetailScreen from './screens/MaterialDetailScreen';
import AssignmentDetailScreen from './screens/AssignmentDetailScreen';
import CourseDetailScreen from './screens/CourseDetailScreen';
import ProfileScreen from './screens/ProfileScreen';
import ScheduleDetailScreen from './screens/ScheduleDetailScreen';

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
          if (route.name === 'DashboardScreen') iconName = 'home';
          else if (route.name === 'CourseListScreen') iconName = 'book';
          else if (route.name === 'DiscussionListScreen') iconName = 'chatbubbles';
          else if (route.name === 'ProfileScreen') iconName = 'person';
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="DashboardScreen" 
        component={DashboardScreen} 
        options={{ tabBarLabel: 'Dashboard' }}
      />
      <Tab.Screen 
        name="CourseListScreen" 
        component={CourseListScreen} 
        options={{ tabBarLabel: 'Course(s)' }} 
      />
      <Tab.Screen 
        name="DiscussionListScreen" 
        component={DiscussionListScreen} 
        options={{ tabBarLabel: 'Discussion' }}
      />
      <Tab.Screen 
        name="ProfileScreen" 
        component={ProfileScreen} 
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

/**
 * Struktur Navigasi Utama Aplikasi Student
 */
export default function StudentNavigator() {
  return (
    <Stack.Navigator 
      screenOptions={{ headerShown: false }} 
      initialRouteName="MainScreen"
    >
      {/* Alur Utama (Tabs) */}
      <Stack.Screen name="MainScreen" component={MainTabs} />

      {/* Alur Detail (Halaman tanpa menu bawah) */}
      <Stack.Screen name="CourseDetailScreen" component={CourseDetailScreen} />
      <Stack.Screen name="MaterialDetailScreen" component={MaterialDetailScreen} />
      <Stack.Screen name="ScheduleDetailScreen" component={ScheduleDetailScreen} />
      <Stack.Screen name="AssignmentDetailScreen" component={AssignmentDetailScreen} />
      <Stack.Screen name="ChatDiscussionScreen" component={ChatDiscussionScreen} />
    </Stack.Navigator>
  );
}
