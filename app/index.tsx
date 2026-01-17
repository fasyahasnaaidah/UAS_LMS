<<<<<<< HEAD
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
=======
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

// Screens
import SignInScreen from './screens/SignInScreen';
import SplashScreen from './screens/SplashScreen';

import ChatDetailScreen from './screens/ChatDetailScreen';
import ClassScheduleScreen from './screens/ClassScheduleScreen';
import DashboardScreen from './screens/DashboardScreen';
import DiscussionListScreen from './screens/DiscussionListScreen';
import ProfileScreen from './screens/ProfileScreen';

import MaterialDetailScreen from './screens/MaterialDetailScreen';
import MaterialListScreen from './screens/MaterialListScreen';
import UploadMaterialScreen from './screens/UploadMaterialScreen';

export type RootStackParamList = {
  Splash: undefined;
  SignIn: undefined;
  CreateAccount: undefined;
  Main: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

// ✅ Stack per Tab
const DashboardStack = createNativeStackNavigator();
const ClassStack = createNativeStackNavigator();
const DiscussionStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

function DashboardStackScreen() {
  return (
    <DashboardStack.Navigator screenOptions={{ headerShown: false }}>
      <DashboardStack.Screen name="DashboardHome" component={DashboardScreen} />
      {/* kalau dashboard perlu masuk materi juga, taruh di sini */}
      <DashboardStack.Screen name="MaterialList" component={MaterialListScreen} />
      <DashboardStack.Screen name="MaterialDetail" component={MaterialDetailScreen} />
      <DashboardStack.Screen name="UploadMaterial" component={UploadMaterialScreen} />
    </DashboardStack.Navigator>
  );
}

function ClassStackScreen() {
  return (
    <ClassStack.Navigator screenOptions={{ headerShown: false }}>
      {/* ✅ INI yang harus tampil saat klik Class */}
      <ClassStack.Screen name="CourseList" component={ClassScheduleScreen} />
      <ClassStack.Screen name="MaterialList" component={MaterialListScreen} />
      <ClassStack.Screen name="MaterialDetail" component={MaterialDetailScreen} />
      <ClassStack.Screen name="UploadMaterial" component={UploadMaterialScreen} />
    </ClassStack.Navigator>
  );
}

function DiscussionStackScreen() {
  return (
    <DiscussionStack.Navigator screenOptions={{ headerShown: false }}>
      <DiscussionStack.Screen name="DiscussionList" component={DiscussionListScreen} />
      {/* ✅ ChatDetail hanya ada di Discussion */}
      <DiscussionStack.Screen name="ChatDetail" component={ChatDetailScreen} />
    </DiscussionStack.Navigator>
  );
}

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileHome" component={ProfileScreen} />
    </ProfileStack.Navigator>
  );
}

function MainTabs() {
  const iconMap: Record<string, any> = {
    Dashboard: { on: 'home', off: 'home-outline' },
    Class: { on: 'book', off: 'book-outline' },
    Discussion: { on: 'chatbubble', off: 'chatbubble-outline' },
    Profile: { on: 'person', off: 'person-outline' },
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#111827',
        tabBarInactiveTintColor: '#D1D5DB',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
        tabBarStyle: {
          height: 70,
          paddingTop: 8,
          paddingBottom: 12,
          borderTopWidth: 1,
          borderTopColor: '#EEF2F7',
          backgroundColor: 'white',
        },
        tabBarIcon: ({ color, focused }) => {
          const pack = iconMap[route.name];
          const iconName = focused ? pack.on : pack.off;
          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardStackScreen} />

      {/* ✅ PENTING: unmountOnBlur supaya setiap klik Class balik ke CourseList */}
      <Tab.Screen
        name="Class"
        component={ClassStackScreen}
        options={{ unmountOnBlur: true }}
      />

      <Tab.Screen name="Discussion" component={DiscussionStackScreen} />
      <Tab.Screen name="Profile" component={ProfileStackScreen} />
    </Tab.Navigator>
  );
}

export default function Index() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
      <RootStack.Screen name="Splash" component={SplashScreen} />
      <RootStack.Screen name="SignIn" component={SignInScreen} />
      <RootStack.Screen name="Main" component={MainTabs} />
    </RootStack.Navigator>
>>>>>>> 550b655 (initial commit)
  );
}
