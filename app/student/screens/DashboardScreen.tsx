import { API_URL } from '@/config/api';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';


export default function DashboardScreen({ navigation }: any) {
  const [name, setName] = useState('Student');
  const [progressList, setProgressList] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]); // Changed to array
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        return;
      }

      const response = await fetch(`${API_URL}/api/student/dashboard/summary`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401 || response.status === 403) {
        navigation.replace('SignIn');
        return;
      }

      const data = await response.json();
      
      if (response.ok) {
        setName(data.user.name);
        setProgressList(data.progress);
        setSchedules(data.schedules || []); // Handle array
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [navigation]);

  // Reload data when screen comes into focus
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
      <View style={styles.header}>
        <View style={styles.topRow}>
          <View>
            <View style={styles.hiRow}>
              <Text style={styles.hi}>Hello, {name}!</Text>
              <Ionicons name="hand-right-outline" size={18} color="white" style={styles.hiIcon} />
            </View>
            <Text style={styles.subHi}>Continue Your Journey And Achieve Your Target.</Text>
          </View>
          <Ionicons name="notifications-outline" size={24} color="white" />
        </View>
        <View style={styles.search}>
          <TextInput placeholder="Search for a course..." style={{flex: 1}} />
          <Ionicons name="search" size={20} color="gray" />
        </View>
      </View>

      <ScrollView 
        style={{padding: 20}}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.progCard}>
          <Text style={styles.cardHeader}>Learning Progress</Text>
          
          {progressList.length === 0 ? (
            <Text style={{color: 'gray', fontStyle: 'italic'}}>No enrolled courses yet.</Text>
          ) : (
            progressList.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                onPress={() => navigation.navigate('CourseDetailScreen', { courseId: item.id, courseTitle: item.title })}
              >
                <ProgressItem 
                  label={item.title} 
                  val={`${item.submitted}/${item.total}`} 
                  per={item.percentage} 
                />
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={{marginTop: 20}}>
          <Text style={styles.cardHeader}>Today&apos;s Class Schedule</Text>
          
          {schedules.length === 0 ? (
            <View style={styles.schCard}>
              <View>
                <Text style={styles.schTitle}>No classes today</Text>
                <Text style={styles.schSub}>Relax and study!</Text>
              </View>
            </View>
          ) : (
            schedules.map((item, index) => (
              <TouchableOpacity 
                key={index}
                style={[styles.schCard, { marginTop: 10 }]} 
                onPress={() => navigation.navigate('ScheduleDetailScreen', { schedule: item })}
              >
                <View style={{flex: 1}}>
                  <Text style={styles.schTitle}>{item.course_title}</Text>
                  <Text style={styles.schCourse}>{item.session_topic}</Text>
                  <Text style={styles.schSub}>Teacher: {item.teacher_name}</Text>
                  <View style={[styles.schSubRow, {marginTop: 2}]}>
                    <Ionicons name="location-outline" size={14} color="#E0E0E0" style={{ marginRight: 6 }} />
                    <Text style={styles.schSub}>{item.location}</Text>
                  </View>
                </View>
                
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {new Date(item.session_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const ProgressItem = ({label, val, per}: any) => (
  <View style={{marginBottom: 15}}>
    <View style={{flexDirection:'row', justifyContent:'space-between'}}>
      <Text style={{fontSize: 12, fontWeight: '600'}}>{label}</Text>
      <Text style={{fontSize: 12}}>{val}</Text>
    </View>
    <View style={styles.barBg}>
      <View style={[styles.barFill, {width: `${Math.min(per * 100, 100)}%`}]} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { backgroundColor: '#003D79', padding: 25, paddingTop: 50, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  hiRow: { flexDirection: 'row', alignItems: 'center' },
  hi: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  hiIcon: { marginLeft: 6 },
  subHi: { color: '#CCC', fontSize: 11 },
  search: { backgroundColor: 'white', flexDirection: 'row', padding: 12, borderRadius: 25, alignItems: 'center' },
  progCard: { backgroundColor: 'white', padding: 20, borderRadius: 15, elevation: 3 },
  cardHeader: { fontWeight: 'bold', marginBottom: 15 },
  barBg: { height: 8, backgroundColor: '#EEE', borderRadius: 5, marginTop: 5 },
  barFill: { height: 8, backgroundColor: '#2ECC71', borderRadius: 5 },
  schCard: { backgroundColor: '#003D79', marginTop: 20, padding: 20, borderRadius: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  schTitle: { color: 'white', fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
  schCourse: { color: '#FFD700', fontWeight: 'bold', fontSize: 14, marginBottom: 2 },
  schSubRow: { flexDirection: 'row', alignItems: 'center' },
  schSub: { color: '#E0E0E0', fontSize: 12 },
  badge: { backgroundColor: 'white', padding: 8, borderRadius: 10 },
  badgeText: { fontSize: 10, fontWeight: 'bold', color: '#003D79' }
});


