import { API_URL } from '@/config/api';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';


export default function DashboardScreen({ navigation }: any) {
  const [name, setName] = useState('Instructor');
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        return;
      }

      const response = await fetch(`${API_URL}/api/instructor/dashboard/summary`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401 || response.status === 403) {
        // Redirect to SignIn if token invalid (handled by interceptor usually, but here manually)
        // navigation.replace('SignIn'); // Instructor uses Root navigation, might be tricky to jump out of Tab. 
        // For now, assume session persistence or handled by main App wrapper.
        return;
      }

      const data = await response.json();
      
      if (response.ok) {
        setName(data.user.name);
        setSchedules(data.schedules || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  if (loading && !refreshing) {
    return (
      <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
        <ActivityIndicator size="large" color="#003D79" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Biru */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.welcomeRow}>
            <Text style={styles.welcomeText}>Hello, {name}!</Text>
            <Ionicons name="hand-right-outline" size={18} color="white" style={styles.welcomeIcon} />
          </View>
          <TouchableOpacity>
            <Ionicons name="notifications" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.subWelcome}>Monitor Student Progress And Assignments Here.</Text>
        
        <View style={styles.searchContainer}>
          <TextInput placeholder="search for a group or topic..." style={styles.searchInput} />
          <Ionicons name="search" size={20} color="black" />
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text style={styles.sectionTitle}>Today&apos;s Course Schedule</Text>

        {schedules.length === 0 ? (
          <View style={[styles.card, {justifyContent: 'center'}]}>
             <Text style={{color: 'gray'}}>No courses scheduled for today.</Text>
          </View>
        ) : (
          schedules.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.card}
              onPress={() => navigation.navigate('ScheduleDetailScreen', { schedule: item })}
            >
              <View style={{flex: 1}}>
                <Text style={styles.courseName}>{item.course_title}</Text>
                <Text style={styles.courseCode}>{item.session_topic}</Text>
                <View style={styles.locationRow}>
                  <Ionicons name="location-outline" size={14} color="gray" style={{ marginRight: 6 }} />
                  <Text style={styles.locationText}>{item.location}</Text>
                  <Text style={styles.locationDivider}>•</Text>
                  <Ionicons name="time-outline" size={14} color="gray" style={{ marginRight: 6 }} />
                  <Text style={styles.locationText}>{new Date(item.session_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
                </View>
                
                <View style={styles.peopleRow}>
                  <Ionicons name="people" size={14} color="gray" />
                  <Text style={styles.peopleText}>{item.student_count} Students Enrolled</Text>
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
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { 
    backgroundColor: '#003D79', paddingTop: 60, paddingHorizontal: 20, 
    paddingBottom: 40, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  welcomeRow: { flexDirection: 'row', alignItems: 'center' },
  welcomeText: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  welcomeIcon: { marginLeft: 6 },
  subWelcome: { color: 'white', fontSize: 13, marginTop: 5, opacity: 0.9 },
  searchContainer: { 
    flexDirection: 'row', backgroundColor: 'white', borderRadius: 25, 
    marginTop: 25, paddingHorizontal: 20, alignItems: 'center', height: 50 
  },
  searchInput: { flex: 1, fontSize: 14 },
  content: { flex: 1, padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  card: { 
    backgroundColor: 'white', borderRadius: 15, padding: 20, marginBottom: 15,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5,
    borderLeftWidth: 5, borderLeftColor: '#003D79'
  },
  courseName: { fontSize: 16, fontWeight: 'bold', color: '#003D79' },
  courseCode: { fontSize: 14, color: '#555', marginTop: 4, fontWeight: '600' },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  locationText: { fontSize: 12, color: 'gray' },
  locationDivider: { marginHorizontal: 6, color: 'gray' },
  peopleRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  peopleText: { fontSize: 12, color: 'gray', marginLeft: 5 },
});





