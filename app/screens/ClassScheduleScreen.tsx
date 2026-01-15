import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ClassScheduleScreen({ navigation }: any) {
  const classes = [
    { name: 'Android Mobile Programming (4 Sks)', prof: 'Masria, M.Kom.' },
    { name: 'UI/UX Design Fundamental (4 Sks)', prof: 'Naufal Ramadhan, S.Kom.' },
    { name: 'Sistem Manajemen Basis Data (4 Sks)', prof: 'Dr. Andi Pratama, S.Kom.' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} /></TouchableOpacity>
        <Text style={styles.title}>Class Schedule</Text>
      </View>
      <ScrollView style={{padding: 20}}>
        {classes.map((item, idx) => (
          <TouchableOpacity key={idx} style={styles.card} onPress={() => navigation.navigate('MaterialList')}>
            <View style={styles.imgPlace} />
            <Text style={styles.className}>{item.name}</Text>
            <Text style={styles.profName}>Dosen : {item.prof}</Text>
            <View style={styles.infoRow}>
              <Text style={styles.info}>👤 17 Student</Text>
              <Text style={styles.info}>📖 32 Modul</Text>
              <Text style={styles.info}>🕒 2h 30m</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 25, paddingTop: 50 },
  title: { fontSize: 24, fontWeight: 'bold', marginLeft: 15 },
  card: { backgroundColor: 'white', borderRadius: 15, marginBottom: 20, padding: 15, elevation: 3, shadowOpacity: 0.1 },
  imgPlace: { height: 120, backgroundColor: '#E0E0E0', borderRadius: 10, marginBottom: 10 },
  className: { fontWeight: 'bold', fontSize: 16 },
  profName: { color: 'gray', fontSize: 12, marginVertical: 5 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  info: { fontSize: 11, color: 'gray' }
});