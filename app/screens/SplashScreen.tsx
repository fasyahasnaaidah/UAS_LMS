import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function SplashScreen({ navigation }: any) {
  useEffect(() => {
    const t = setTimeout(() => navigation.replace('SignIn'), 1200);
    return () => clearTimeout(t);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.logoBox}>
        <Ionicons name="school-outline" size={52} color="white" />
      </View>
      <Text style={styles.brand}>Coursedu</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#003D79', alignItems: 'center', justifyContent: 'center' },
  logoBox: {
    width: 86, height: 86, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    marginBottom: 12,
  },
  brand: { color: 'white', fontSize: 20, fontWeight: '800' },
});
