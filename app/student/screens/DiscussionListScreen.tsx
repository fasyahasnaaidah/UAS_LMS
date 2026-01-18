import { API_URL } from '@/config/api';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';


export default function DiscussionListScreen({ navigation }: any) {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCourses = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      const response = await fetch(`${API_URL}/api/student/courses/enrolled`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCourses();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchCourses();
  }, []);

  const formatLastMessageTime = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '-';
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMessageDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diffDays = Math.floor((startOfToday.getTime() - startOfMessageDay.getTime()) / 86400000);
    if (diffDays === 0) {
      return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    }
    if (diffDays === 1) {
      return 'Yesterday';
    }
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  };

  const filteredCourses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return courses;
    return courses.filter((course) =>
      String(course.title || '').toLowerCase().includes(query)
    );
  }, [courses, searchQuery]);

  if (loading && !refreshing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#003D79" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topHeader}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>
      
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#999" />
          <TextInput
            placeholder="Search discussions..."
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <FlatList
        data={filteredCourses}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20, color: 'gray' }}>
            No enrolled courses found.
          </Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.chatItem} 
            onPress={() =>
              navigation.navigate('ChatDiscussionScreen', {
                title: item.title,
                courseId: item.id,
                studentCount: item.student_count
              })
            }
          >
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{String(item.title || '').charAt(0)}</Text>
            </View>
            <View style={styles.chatInfo}>
              <View style={styles.chatHeader}>
                <Text style={styles.chatTitle}>{item.title}</Text>
                <Text style={styles.timeText}>{formatLastMessageTime(item.last_message_time)}</Text>
              </View>
              <Text style={styles.chatMsg} numberOfLines={1}>
                {item.last_message
                  ? `${item.last_sender || 'Unknown'}: ${item.last_message}`
                  : 'Belum ada diskusi'}
              </Text>
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
  chatItem: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 15, alignItems: 'flex-start' },
  avatarCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#E8F0FE', justifyContent: 'center', alignItems: 'center', marginTop: 2 },
  avatarText: { fontSize: 18, fontWeight: 'bold', color: '#003D79' },
  chatInfo: { flex: 1, marginLeft: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', paddingBottom: 15, paddingTop: 2 },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  chatTitle: { fontSize: 16, fontWeight: '700', color: '#333' },
  timeText: { fontSize: 12, color: '#999' },
  chatMsg: { fontSize: 13, color: '#666', marginTop: 2 }
});
