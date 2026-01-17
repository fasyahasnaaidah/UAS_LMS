import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.card}>
        <Text style={styles.name}>Pak Masria</Text>
        <Text style={styles.sub}>Instructor</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F7FB', paddingTop: 70, paddingHorizontal: 16 },
  title: { fontSize: 16, fontWeight: '900', color: '#003D79', marginBottom: 12 },
  card: { backgroundColor: 'white', borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', padding: 16 },
  name: { fontWeight: '900', color: '#111827', fontSize: 16 },
  sub: { color: '#6B7280', marginTop: 6, fontSize: 12 },
});
