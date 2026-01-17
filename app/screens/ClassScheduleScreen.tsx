import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const COURSES = [
  { id: '1', title: 'Android Mobile Programming (4 Sks)', code: '18431', people: 30, day: 'Monday & Thursday' },
  { id: '2', title: 'Sistem Manajemen Basis Data (2 Sks)', code: '18421', people: 10, day: 'Friday' },
  { id: '3', title: 'Framework Pemrograman (4 Sks)', code: '18411', people: 22, day: 'Monday & Thursday' },
];

export default function ClassScheduleScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Course List</Text>
          <Text style={styles.sub}>Manage your classes and students</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('MaterialList')}>
          <Text style={styles.addText}>+ add class</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={COURSES}
        keyExtractor={(it) => it.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.code}>{item.code}</Text>

            <View style={styles.metaRow}>
              <View style={styles.meta}>
                <Ionicons name="people-outline" size={14} color="#6B7280" />
                <Text style={styles.metaText}>{item.people} People</Text>
              </View>
              <View style={styles.meta}>
                <Ionicons name="calendar-outline" size={14} color="#6B7280" />
                <Text style={styles.metaText}>{item.day}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.openBtn}
              onPress={() => navigation.navigate('MaterialList')}
            >
              <Text style={styles.openText}>Open Course</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  header: { paddingTop: 56, paddingHorizontal: 16, paddingBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 10 },
  backBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '900', color: '#111827' },
  sub: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  addBtn: { backgroundColor: '#003D79', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999 },
  addText: { color: 'white', fontWeight: '900', fontSize: 12 },

  card: { backgroundColor: 'white', borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', padding: 16, marginBottom: 12 },
  cardTitle: { fontWeight: '900', color: '#111827' },
  code: { fontSize: 12, color: '#9CA3AF', marginTop: 4 },

  metaRow: { flexDirection: 'row', gap: 14, marginTop: 10 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 12, color: '#6B7280' },

  openBtn: { marginTop: 14, backgroundColor: '#111827', paddingVertical: 10, borderRadius: 999, alignItems: 'center' },
  openText: { color: 'white', fontWeight: '900', fontSize: 12 },
});
