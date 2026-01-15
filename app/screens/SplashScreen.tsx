import React, { useEffect } from 'react';
import { Image, StatusBar, StyleSheet, Text, View } from 'react-native';

export default function SplashScreen({ navigation }: any) {
  useEffect(() => {
    setTimeout(() => navigation.replace('SignIn'), 2000);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Image source={{ uri: 'https://placeholder.com/logo_coursedu' }} style={styles.logo} />
      <Text style={styles.brand}>Coursedu</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#003D79', justifyContent: 'center', alignItems: 'center' },
  logo: { width: 100, height: 100, marginBottom: 10 },
  brand: { color: 'white', fontSize: 32, fontWeight: 'bold' }
});