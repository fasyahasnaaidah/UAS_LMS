import { API_URL } from '@/config/api';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';


export default function DiscussionListScreen({ navigation }: any) {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCourses = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      const response = await fetch(`${API_URL}/api/instructor/courses/taught`, {
        headers: { 'Authorization': `Bearer ${token}` }
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
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#003D79" style={{ marginTop: 50 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Chat</Text>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Group Discussions..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Ionicons name="search" size={20} color="#000" style={styles.searchIcon} />
      </View>

      <FlatList
        data={filteredCourses}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', color: 'gray', marginTop: 20 }}>
            No active courses found.
          </Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.chatItem}
            onPress={() =>
              navigation.navigate('ChatDiscussionScreen', {
                courseId: item.id,
                groupName: item.title,
                studentCount: item.student_count
              })
            }
          >
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{String(item.title || '').charAt(0)}</Text>
            </View>
            <View style={styles.chatInfo}>
              <View style={styles.chatHeader}>
                <Text style={styles.groupName}>{item.title}</Text>
                <Text style={styles.timeText}>{formatLastMessageTime(item.last_message_time)}</Text>
              </View>
              <View style={styles.chatFooter}>
                <Text style={styles.lastMsg} numberOfLines={1}>
                  {item.last_message
                    ? `${item.last_sender || 'Unknown'}: ${item.last_message}`
                    : 'Belum ada diskusi'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', paddingTop: 50 },
  headerTitle: { fontSize: 32, fontWeight: 'bold', marginLeft: 20, marginBottom: 20 },
  searchContainer: { marginHorizontal: 20, marginBottom: 20, position: 'relative' },
  searchInput: { backgroundColor: '#F5F5F5', padding: 15, borderRadius: 25, paddingRight: 45 },
  searchIcon: { position: 'absolute', right: 20, top: 15 },
  chatItem: { flexDirection: 'row', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', alignItems: 'flex-start' },
  avatarCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#E8F0FE', justifyContent: 'center', alignItems: 'center', marginTop: 2 },
  avatarText: { fontSize: 18, fontWeight: 'bold', color: '#003D79' },
  chatInfo: { flex: 1, marginLeft: 15, paddingTop: 2 },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  groupName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  timeText: { fontSize: 12, color: '#AAA' },
  chatFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, alignItems: 'center' },
  lastMsg: { fontSize: 13, color: '#666', flex: 1 }
});
