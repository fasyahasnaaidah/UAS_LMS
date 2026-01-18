import { API_URL } from '@/config/api';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import ScheduleTab from '../components/course/ScheduleTab';
import MaterialTab from '../components/course/MaterialTab';
import AssignmentTab from '../components/course/AssignmentTab';


export default function CourseDetailScreen({ navigation, route }: any) {
  const { courseId, courseTitle } = route.params || { courseId: 1, courseTitle: 'Material List' };
  
  const [activeTab, setActiveTab] = useState('Schedule');
  const [materials, setMaterials] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      const headers = { 'Authorization': `Bearer ${token}` };

      // Fetch Materials
      const matResponse = await fetch(`${API_URL}/api/student/materials/${courseId}`, { headers });
      if (matResponse.ok) setMaterials(await matResponse.json());

      // Fetch Schedules
      const schResponse = await fetch(`${API_URL}/api/student/courses/${courseId}/schedules`, { headers });
      if (schResponse.ok) setSchedules(await schResponse.json());

      // Fetch Assignments
      const assignResponse = await fetch(`${API_URL}/api/student/assignments/course/${courseId}`, { headers });
      if (assignResponse.ok) setAssignments(await assignResponse.json());

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [courseId]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const renderContent = () => {
    if (activeTab === 'Schedule') {
      return <ScheduleTab schedules={schedules} formatDate={formatDate} navigation={navigation} />;
    } else if (activeTab === 'Material') {
      return <MaterialTab materials={materials} formatDate={formatDate} navigation={navigation} />;
    } else if (activeTab === 'Assignment') {
      return <AssignmentTab assignments={assignments} formatDate={formatDate} navigation={navigation} />;
    } else {
      return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Biru Melengkung */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>{courseTitle}</Text>
        <Text style={styles.subTitle}>Course Details</Text>
      </View>
      
      {/* Tabs Menu */}
      <View style={styles.tabs}>
        {['Schedule', 'Material', 'Assignment'].map(tab => (
           <TouchableOpacity 
            key={tab} 
            style={activeTab === tab ? styles.activeTab : styles.tab}
            onPress={() => setActiveTab(tab)}
           >
             <Text style={{
               color: activeTab === tab ? 'white' : 'gray', 
               fontWeight: 'bold'
             }}>
               {tab}
             </Text>
           </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {loading && !refreshing ? (
        <ActivityIndicator size="large" color="#003D79" style={{marginTop: 50}} />
      ) : (
        <ScrollView 
          contentContainerStyle={{padding: 20}}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {renderContent()}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { 
    backgroundColor: '#003D79', 
    padding: 25, 
    paddingTop: 50, 
    borderBottomLeftRadius: 35, 
    borderBottomRightRadius: 35 
  },
  title: { color: 'white', fontSize: 22, fontWeight: 'bold', marginTop: 15 },
  subTitle: { color: '#CCC', fontSize: 13, marginTop: 5 },
  tabs: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    gap: 10,
    marginTop: 25 
  },
  activeTab: { 
    backgroundColor: '#003D79', 
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    borderRadius: 20 
  },
  tab: { 
    backgroundColor: '#E0E0E0', 
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    borderRadius: 20 
  },
});
