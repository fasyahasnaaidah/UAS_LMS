import { API_URL } from '@/config/api';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

// Import Tab Components
import ScheduleTab from '../components/ScheduleTab';
import MaterialTab from '../components/MaterialTab';
import AssignmentTab from '../components/AssignmentTab';


export default function CourseDetailScreen({ navigation, route }: any) {
  const { courseId, courseTitle } = route.params || {};
  const [activeTab, setActiveTab] = useState('Schedule');
  
  // Data States
  const [schedules, setSchedules] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token || !courseId) return;
      const headers = { 'Authorization': `Bearer ${token}` };

      // Parallel Fetching
      const [schRes, matRes, assignRes] = await Promise.all([
        fetch(`${API_URL}/api/instructor/courses/${courseId}/schedules`, { headers }),
        fetch(`${API_URL}/api/instructor/materials/${courseId}`, { headers }),
        fetch(`${API_URL}/api/instructor/assignments/course/${courseId}`, { headers })
      ]);

      if (schRes.ok) setSchedules(await schRes.json());
      if (matRes.ok) setMaterials(await matRes.json());
      if (assignRes.ok) setAssignments(await assignRes.json());

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [courseId]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Schedule':
        return <ScheduleTab schedules={schedules} formatDate={formatDate} navigation={navigation} courseId={courseId} />;
      case 'Material':
        return <MaterialTab materials={materials} formatDate={formatDate} navigation={navigation} courseId={courseId} />;
      case 'Assignment':
        return <AssignmentTab assignments={assignments} formatDate={formatDate} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={{flex: 1}}>
            <Text style={styles.headerTitle}>Course Details</Text>
            <Text style={styles.subHeaderTitle} numberOfLines={1}>{courseTitle}</Text>
        </View>
      </View>

      {loading && !refreshing ? (
         <ActivityIndicator size="large" color="#003D79" style={{marginTop: 50}} />
      ) : (
        <ScrollView 
          contentContainerStyle={{ paddingHorizontal: 25, paddingBottom: 140 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {/* Tab Selector */}
          <View style={styles.tabContainer}>
            {['Schedule', 'Material', 'Assignment'].map(tab => (
               <TouchableOpacity 
                 key={tab}
                 style={[styles.tab, activeTab === tab && styles.tabActive]}
                 onPress={() => setActiveTab(tab)}
               >
                 <Text style={activeTab === tab ? styles.tabTextActive : styles.tabText}>
                   {tab === 'Assignment' ? 'Assignments' : tab}
                 </Text>
               </TouchableOpacity>
            ))}
          </View>

          {/* Dynamic Content */}
          {renderContent()}

        </ScrollView>
      )}

      {activeTab === 'Schedule' && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('CreateScheduleScreen', { courseId: courseId })}
        >
          <Ionicons name="add" size={20} color="white" />
          <Text style={styles.fabText}>add schedule</Text>
        </TouchableOpacity>
      )}

      {activeTab === 'Material' && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('CreateMaterialScreen', { courseId: courseId })}
        >
          <Ionicons name="add" size={20} color="white" />
          <Text style={styles.fabText}>add material</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 50, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  backBtn: { marginRight: 15 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#003D79' },
  subHeaderTitle: { fontSize: 14, color: '#666', marginTop: 2 },
  tabContainer: { flexDirection: 'row', marginVertical: 25 },
  tab: { 
    paddingVertical: 10, paddingHorizontal: 15, borderRadius: 20, 
    backgroundColor: '#E5E5E5', marginRight: 10 
  },
  tabActive: { backgroundColor: '#003D79' },
  tabText: { fontSize: 11, color: '#666' },
  tabTextActive: { fontSize: 11, color: 'white', fontWeight: 'bold' },
  fab: { 
    position: 'absolute',
    right: 20,
    bottom: 60,
    backgroundColor: '#003D79', flexDirection: 'row',
    alignItems: 'center', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 30,
    elevation: 5, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5,
    zIndex: 10
  },
  fabText: { color: 'white', fontWeight: 'bold', marginLeft: 5, fontSize: 13 }
});
