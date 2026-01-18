import { API_URL } from '@/config/api';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';


export default function CourseListScreen({ navigation }: any) {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      const response = await fetch(`${API_URL}/api/instructor/courses/taught`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      if (response.ok) {
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
      fetchData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };
  
  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Text style={styles.courseTitle}>{item.title}</Text>
      <Text style={styles.courseCode}>{item.description}</Text>
      
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Ionicons name="person-outline" size={14} color="#666" />
          <Text style={styles.infoText}>{item.student_count} Students</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="calendar-outline" size={14} color="#666" />
          <Text style={styles.infoText}>
             {formatDate(item.start_date)} - {formatDate(item.end_date)}
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.openBtn}
        onPress={() => navigation.navigate('CourseDetailScreen', { courseId: item.id, courseTitle: item.title })} 
      >
        <Text style={styles.openBtnText}>Open Course</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.titleSection}>
        <Text style={styles.mainTitle}>Course List</Text>
        <Text style={styles.subTitle}>Manage your courses and students for the active semester</Text>
      </View>

      {/* Button Add Course Removed as per request */}

      {loading && !refreshing ? (
        <ActivityIndicator size="large" color="#003D79" style={{marginTop: 50}} />
      ) : (
        <FlatList
          data={courses}
          renderItem={renderItem}
          keyExtractor={(item: any) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <Text style={{textAlign: 'center', color: 'gray', marginTop: 50}}>
              No active courses found.
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { paddingHorizontal: 20, paddingTop: 10 },
  backBtn: { 
    width: 40, height: 40, borderRadius: 20, 
    backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center' 
  },
  titleSection: { paddingHorizontal: 25, marginTop: 15, marginBottom: 20 },
  mainTitle: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  subTitle: { fontSize: 13, color: '#666', marginTop: 5, lineHeight: 18 },
  listContent: { paddingHorizontal: 25, paddingTop: 10, paddingBottom: 100 },
  card: { 
    backgroundColor: 'white', borderRadius: 20, padding: 20, marginBottom: 20,
    elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10,
    borderWidth: 1, borderColor: '#F0F0F0'
  },
  courseTitle: { fontSize: 15, fontWeight: 'bold', color: '#333' },
  courseCode: { fontSize: 12, color: '#888', marginVertical: 4 },
  infoRow: { flexDirection: 'row', marginTop: 10, marginBottom: 15 },
  infoItem: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
  infoText: { fontSize: 11, color: '#666', marginLeft: 5 },
  openBtn: { 
    backgroundColor: '#4F5E71', paddingVertical: 12, 
    borderRadius: 10, alignItems: 'center' 
  },
  openBtnText: { color: 'white', fontWeight: 'bold', fontSize: 12 }
});
