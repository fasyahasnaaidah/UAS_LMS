import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import SplashScreen from './screens/SplashScreen';
import SignInScreen from './screens/SignInScreen';
import CreateAccountScreen from './screens/CreateAccountScreen';
import StudentNavigator from './student/index';
import InstructorNavigator from './instructor/index';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
      
      {/* Role Based Navigators */}
      <Stack.Screen name="StudentRoot" component={StudentNavigator} />
      <Stack.Screen name="InstructorRoot" component={InstructorNavigator} />
    </Stack.Navigator>
  );
}