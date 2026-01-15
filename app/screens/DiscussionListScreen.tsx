import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const DATA = [
  { id: '1', title: 'Android Mobile Programming', msg: 'Masria: Assignment has been posted', time: '12:25', unread: 0 },
  { id: '2', title: 'Bahasa Indonesia', msg: 'Budi: Siap pak, terima kasih', time: 'Yesterday', unread: 0 },
  { id: '3', title: 'UI/UX Design Fundamental', msg: 'Alya: Apa bedanya UI dan UX sir?', time: '09:10', unread: 8 },
  { id: '4', title: 'Metodologi Penelitian', msg: 'Dosen: Silahkan cek modul 4', time: 'Monday', unread: 0 },
];

export default function DiscussionListScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <View style={styles.topHeader}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>
      
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#999" />
          <TextInput placeholder="Search discussions..." style={styles.searchInput} />
        </View>
      </View>

      <FlatList
        data={DATA}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.chatItem} 
            onPress={() => navigation.navigate('ChatDetail', { title: item.title })}
          >
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{item.title.charAt(0)}</Text>
            </View>
            <View style={styles.chatInfo}>
              <View style={styles.chatHeader}>
                <Text style={styles.chatTitle}>{item.title}</Text>
                <Text style={styles.timeText}>{item.time}</Text>
              </View>
              <Text style={styles.chatMsg} numberOfLines={1}>{item.msg}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  topHeader: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 10 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#333' },
  searchSection: { paddingHorizontal: 20, marginBottom: 15 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', paddingHorizontal: 15, borderRadius: 12, height: 45 },
  searchInput: { flex: 1, marginLeft: 10 },
  chatItem: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 15, alignItems: 'center' },
  avatarCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#E8F0FE', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 18, fontWeight: 'bold', color: '#003D79' },
  chatInfo: { flex: 1, marginLeft: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', paddingBottom: 15 },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  chatTitle: { fontSize: 16, fontWeight: '700', color: '#333' },
  timeText: { fontSize: 12, color: '#999' },
  chatMsg: { fontSize: 13, color: '#666', marginTop: 2 }
});