import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

// Import Semua Screen
import AttendanceScreen from './screens/AttendanceScreen';
import ChatDiscussionScreen from './screens/ChatDiscussionScreen';
import DashboardScreen from './screens/DashboardScreen';
import DiscussionListScreen from './screens/DiscussionListScreen';
import CourseListScreen from './screens/CourseListScreen';
import ScheduleDetailScreen from './screens/ScheduleDetailScreen';
import CourseDetailScreen from './screens/CourseDetailScreen';
import ProfileScreen from './screens/ProfileScreen';
import CreateMaterialScreen from './screens/CreateMaterialScreen';
import CreateScheduleScreen from './screens/CreateScheduleScreen';
import MaterialDetailScreen from './screens/MaterialDetailScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * Menu Navigasi Bawah (Bottom Tabs)
 */
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#003D79',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { 
          height: 70, 
          paddingBottom: 10, 
          paddingTop: 10,
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#EEE'
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: any;
          if (route.name === 'DashboardScreen') iconName = 'home';
          else if (route.name === 'CourseListScreen') iconName = 'book-outline';
          else if (route.name === 'DiscussionListScreen') iconName = 'chatbubbles-outline';
          else if (route.name === 'ProfileScreen') iconName = 'person-outline';
          
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
 * Konfigurasi Navigation Container Utama Instructor
 */
export default function InstructorNavigator() {
  return (
    <Stack.Navigator 
      screenOptions={{ headerShown: false }} 
      initialRouteName="MainScreen"
    >
      
      {/* 2. Menu Utama dengan Tab Bar */}
      <Stack.Screen name="MainScreen" component={MainTabs} />

      {/* 3. Detail Kelas & Materi (Membuka Full Screen) */}
      <Stack.Screen name="CourseDetailScreen" component={CourseDetailScreen} />
      <Stack.Screen name="MaterialDetailScreen" component={MaterialDetailScreen} />
      <Stack.Screen name="ScheduleDetailScreen" component={ScheduleDetailScreen} />
      <Stack.Screen name="CreateMaterialScreen" component={CreateMaterialScreen} />
      <Stack.Screen name="CreateScheduleScreen" component={CreateScheduleScreen} />
      
      {/* 4. Alur Manajemen Mahasiswa */}
      <Stack.Screen name="AttendanceScreen" component={AttendanceScreen} />

      {/* 5. Chat Detail (Membuka Full Screen agar Keyboard tidak menutupi Tab) */}
      <Stack.Screen name="ChatDiscussionScreen" component={ChatDiscussionScreen} />
      
    </Stack.Navigator>
  );
}
