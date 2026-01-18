import { API_URL } from '@/config/api';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


export default function ClassScheduleScreen({ navigation }: any) {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading && !refreshing) {
    return (
      <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
        <ActivityIndicator size="large" color="#003D79" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} /></TouchableOpacity>
        <Text style={styles.title}>Enrolled Course(s)</Text>
      </View>
      <ScrollView 
        contentContainerStyle={{padding: 20}}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {courses.length === 0 ? (
           <Text style={{textAlign: 'center', marginTop: 20, color: 'gray'}}>No enrolled courses found.</Text>
        ) : (
          courses.map((item, idx) => (
          <TouchableOpacity 
            key={idx} 
            style={styles.card} 
            onPress={() => navigation.navigate('CourseDetailScreen', { courseId: item.id, courseTitle: item.title })}
          >
            <View style={styles.courseInfoContainer}>
              <Text style={styles.className}>{item.title}</Text>
              <Text style={styles.profName}>Instructor : {item.teacher_name}</Text>
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Ionicons name="person-outline" size={14} color="gray" style={styles.infoIcon} />
                  <Text style={styles.infoText}>{item.student_count} Students</Text>
                </View>
                <View style={styles.infoItem}>
                  <Ionicons name="book-outline" size={14} color="gray" style={styles.infoIcon} />
                  <Text style={styles.infoText}>{item.material_count} Modules</Text>
                </View>
                <View style={styles.infoItem}>
                  <Ionicons name="time-outline" size={14} color="gray" style={styles.infoIcon} />
                  <Text style={styles.infoText}>
                    {item.start_date && item.end_date ? `${formatDate(item.start_date)} - ${formatDate(item.end_date)}` : '-'}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 25, paddingTop: 50 },
  title: { fontSize: 24, fontWeight: 'bold', marginLeft: 15 },
  card: { marginBottom: 20, elevation: 2, shadowOpacity: 0.1 },
  courseInfoContainer: { backgroundColor: '#F8F9FA', borderRadius: 15, padding: 20, borderWidth: 1, borderColor: '#EEE' },
  className: { fontWeight: 'bold', fontSize: 18, color: '#003D79' },
  profName: { color: '#555', fontSize: 13, marginVertical: 8 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, borderTopWidth: 1, borderTopColor: '#EEE', paddingTop: 10 },
  infoItem: { flexDirection: 'row', alignItems: 'center' },
  infoIcon: { marginRight: 6 },
  infoText: { fontSize: 11, color: '#777' }
});


