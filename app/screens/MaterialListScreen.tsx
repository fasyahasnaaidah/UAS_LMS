import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const MEETINGS = [
  { id: '1', title: 'Pertemuan Pertama (4 Sks)', sub: 'Installation React Native', files: '5 Modul', dur: '2h 30m' },
  { id: '2', title: 'Pertemuan Kedua (4 Sks)', sub: 'Using API', files: '3 Modul', dur: '2h 30m' },
  { id: '3', title: 'Pertemuan Ketiga (4 Sks)', sub: 'Using Side Menu & Tab', files: '10 Modul', dur: '2h 30m' },
];

export default function MaterialListScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <TouchableOpacity style={styles.heroBack} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={18} color="white" />
        </TouchableOpacity>
        <Text style={styles.heroTitle}>Android Mobile Programming</Text>
        <Text style={styles.heroSub}>18431 • 4 sks</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.bodyTop}>
          <Text style={styles.sectionTitle}>Teaching Materials</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('MaterialDetail', { title: 'Installation React Native' })}>
            <Text style={styles.addText}>+ add meeting</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={MEETINGS}
          keyExtractor={(it) => it.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('MaterialDetail', { title: item.sub })}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSub}>{item.sub}</Text>

                <View style={styles.metaRow}>
                  <View style={styles.meta}>
                    <Ionicons name="document-text-outline" size={14} color="#6B7280" />
                    <Text style={styles.metaText}>{item.files}</Text>
                  </View>
                  <View style={styles.meta}>
                    <Ionicons name="time-outline" size={14} color="#6B7280" />
                    <Text style={styles.metaText}>{item.dur}</Text>
                  </View>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  hero: { backgroundColor: '#0B4A8C', paddingTop: 52, paddingBottom: 22, paddingHorizontal: 16, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  heroBack: { width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  heroTitle: { color: 'white', fontSize: 18, fontWeight: '900' },
  heroSub: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 4 },

  body: { flex: 1, paddingHorizontal: 16, paddingTop: 14 },
  bodyTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 14, fontWeight: '900', color: '#111827' },
  addBtn: { backgroundColor: '#003D79', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999 },
  addText: { color: 'white', fontWeight: '900', fontSize: 12 },

  card: { backgroundColor: 'white', borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', padding: 14, marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
  cardTitle: { fontWeight: '900', color: '#111827', fontSize: 12 },
  cardSub: { color: '#111827', fontWeight: '800', marginTop: 4 },

  metaRow: { flexDirection: 'row', gap: 14, marginTop: 10 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 12, color: '#6B7280' },
});
