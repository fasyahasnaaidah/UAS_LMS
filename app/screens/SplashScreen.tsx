import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import { Image, StatusBar, StyleSheet, View } from 'react-native';

export default function SplashScreen({ navigation }: any) {
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const role = await AsyncStorage.getItem('userRole');

        // Add a small delay for branding effect, or remove if you want instant load
        setTimeout(() => {
          if (token) {
             if (role === 'student') {
                navigation.replace('StudentRoot');
             } else if (role === 'teacher') {
                navigation.replace('InstructorRoot');
             } else {
                 // Fallback
                navigation.replace('SignIn');
             }
          } else {
            navigation.replace('SignIn');
          }
        }, 2000);
      } catch {
        navigation.replace('SignIn');
      }
    };

    checkLogin();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Image 
        source={require('../../assets/images/logo.png')} 
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#003D79', justifyContent: 'center', alignItems: 'center' },
  logoContainer: { width: 100, height: 100, marginBottom: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20 },
  logo: { width: 100, height: 100, marginBottom: 10 },
  brand: { color: 'white', fontSize: 32, fontWeight: 'bold' }
});
