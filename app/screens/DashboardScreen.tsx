import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function DashboardScreen({ navigation }: any) {
  const [q, setQ] = useState('');

  const COURSES = useMemo(
    () => [
      { id: '1', title: 'Android Mobile Programming (4 Sks)', code: '18431', people: 30 },
      { id: '2', title: 'Framework Pemrograman (4 Sks)', code: '18411', people: 22 },
      { id: '3', title: 'Sistem Manajemen Basis Data (2 Sks)', code: '18421', people: 10 },
    ].filter((x) => x.title.toLowerCase().includes(q.toLowerCase())),
    [q]
  );

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <View style={styles.topRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greet}>Halo, Pak Masria! 👋</Text>
            <Text style={styles.role}>Monitor Student Progress And Assignments Here.</Text>
          </View>

          <TouchableOpacity style={styles.bellBtn}>
            <Ionicons name="notifications-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchBar}>
          <TextInput
            placeholder="search for a group or topic..."
            placeholderTextColor="rgba(255,255,255,0.8)"
            value={q}
            onChangeText={setQ}
            style={styles.searchInput}
          />
          <TouchableOpacity style={styles.searchBtn}>
            <Ionicons name="search" size={18} color="#0B4A8C" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Today Course Schedule</Text>

      <FlatList
        data={COURSES}
        keyExtractor={(it) => it.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 18 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.cardCode}>{item.code}</Text>

              <View style={styles.metaRow}>
                <Ionicons name="people-outline" size={14} color="#9CA3AF" />
                <Text style={styles.metaText}>{item.people} People</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.manageBtn}
              onPress={() => navigation.navigate('MaterialList')}
            >
              <Text style={styles.manageText}>Manage Course</Text>
            </TouchableOpacity>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  top: {
    backgroundColor: '#0B4A8C',
    paddingTop: 56,
    paddingHorizontal: 16,
    paddingBottom: 22,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  topRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  greet: { color: 'white', fontSize: 18, fontWeight: '900' },
  role: { color: 'rgba(255,255,255,0.85)', marginTop: 4, fontSize: 12 },

  bellBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  searchBar: {
    marginTop: 14,
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: 22,
    paddingLeft: 14,
    paddingRight: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchInput: { flex: 1, color: 'white', fontSize: 13, paddingVertical: 8 },
  searchBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },

  sectionTitle: {
    marginTop: 16,
    marginBottom: 10,
    marginLeft: 16,
    fontSize: 13,
    fontWeight: '900',
    color: '#111827',
  },

  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardTitle: { fontWeight: '900', color: '#111827', fontSize: 13 },
  cardCode: { color: '#9CA3AF', fontSize: 11, marginTop: 4 },

  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  metaText: { color: '#9CA3AF', fontSize: 11, fontWeight: '700' },

  manageBtn: {
    backgroundColor: '#111827',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    marginLeft: 12,
  },
  manageText: { color: 'white', fontWeight: '900', fontSize: 11 },
});
