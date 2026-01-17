import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function DiscussionListScreen({ navigation }: any) {
  const [q, setQ] = useState('');

  const data = useMemo(
    () => [
      { id: '1', title: 'Sistem Manajemen Basis Data', last: 'Enter your message description here...', time: '12:25', unread: 0 },
      { id: '2', title: 'Framework Pemrograman', last: 'Please call me back on 08193843...', time: '12:25', unread: 0 },
      { id: '3', title: 'Android Mobile Programming', last: 'Enter your message description here...', time: '12:25', unread: 8, active: true },
    ].filter(x => x.title.toLowerCase().includes(q.toLowerCase())),
    [q]
  );

  return (
    <View style={styles.container}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Chat</Text>

        <View style={styles.searchWrap}>
          <Ionicons name="search" size={18} color="#9CA3AF" />
          <TextInput
            placeholder="Search Group Discussions..."
            value={q}
            onChangeText={setQ}
            style={styles.searchInput}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      <FlatList
        data={data}
        keyExtractor={(it) => it.id}
        contentContainerStyle={{ padding: 16, paddingTop: 8 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.row, item.active && styles.rowActive]}
            onPress={() => navigation.navigate('ChatDetail', { title: item.title })}
          >
            <View style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <View style={styles.rowTop}>
                <Text style={styles.rowTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
              <View style={styles.rowBottom}>
                <Text style={styles.last} numberOfLines={1}>{item.last}</Text>
                {item.unread > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.unread}</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  pageHeader: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 10 },
  pageTitle: { fontSize: 28, fontWeight: '900', color: '#111827', marginBottom: 14 },

  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  searchInput: { flex: 1, fontSize: 13, color: '#111827' },

  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 14 },
  rowActive: { backgroundColor: '#EFF6FF', borderLeftWidth: 3, borderLeftColor: '#003D79' },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#E5E7EB', marginRight: 12 },

  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowTitle: { fontWeight: '800', color: '#111827', maxWidth: '80%' },
  time: { fontSize: 12, color: '#9CA3AF' },

  rowBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  last: { fontSize: 12, color: '#6B7280', flex: 1, marginRight: 10 },

  badge: { minWidth: 22, height: 22, borderRadius: 11, backgroundColor: '#003D79', alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: 'white', fontWeight: '900', fontSize: 11 },

  sep: { height: 1, backgroundColor: '#F3F4F6', marginLeft: 70 },
});
