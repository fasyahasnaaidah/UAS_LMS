import { API_URL } from '@/config/api';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


export default function ScheduleDetailScreen({ navigation, route }: any) {
  const { schedule } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [attendanceStatus, setAttendanceStatus] = useState<string | null>(schedule?.attendance_status || null);

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  useEffect(() => {
    const loadAttendance = async () => {
      if (schedule?.attendance_status !== undefined) {
        setAttendanceStatus(schedule.attendance_status);
        setLoading(false);
        return;
      }
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token || !schedule?.id) return;
        const response = await fetch(`${API_URL}/api/student/schedules/${schedule.id}/attendance`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
          setAttendanceStatus(data.status || null);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    loadAttendance();
  }, [schedule]);

  const normalizeStatus = (status: string | null) => {
    if (!status) return '';
    return status.toString().trim().toLowerCase();
  };

  const capitalizeFirst = (value: string) => {
    if (!value) return value;
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const getStatusLabel = (status: string | null) => {
    if (!status) return 'Not recorded';
    const normalized = normalizeStatus(status);
    if (normalized === 'h' || normalized === 'present') return 'Present';
    if (normalized === 'i' || normalized === 'permission') return 'Permission';
    if (normalized === 's' || normalized === 'sick') return 'Sick';
    if (normalized === 'a' || normalized === 'absent') return 'Absent';
    if (normalized === 'late') return 'Late';
    return capitalizeFirst(normalized);
  };

  const getStatusColor = (status: string | null) => {
    if (!status) return '#999';
    const normalized = normalizeStatus(status);
    if (normalized === 'h' || normalized === 'present') return '#2ECC71';
    if (normalized === 'i' || normalized === 'permission') return '#F39C12';
    if (normalized === 's' || normalized === 'sick') return '#2980B9';
    if (normalized === 'a' || normalized === 'absent') return '#E74C3C';
    if (normalized === 'late') return '#F1C40F';
    return '#999';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Session Detail</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 25, paddingBottom: 100 }}>
        <Text style={styles.subtitle}>Topic</Text>
        <Text style={styles.mainTitle}>{schedule?.session_topic}</Text>
        <Text style={styles.dateInfo}>{formatDate(schedule?.session_date)} | {schedule?.location}</Text>

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>
          Description for session: {schedule?.session_topic}. Students are expected to attend and participate actively.
        </Text>

        <View style={styles.separator} />

        <Text style={styles.sectionTitle}>Attendance Status</Text>
        <View style={styles.attendanceCard}>
          {loading ? (
            <ActivityIndicator size="small" color="#003D79" />
          ) : (
            <>
              <Text style={styles.attendanceLabel}>Your Status</Text>
              <Text style={[styles.attendanceValue, { color: getStatusColor(attendanceStatus) }]}>
                {getStatusLabel(attendanceStatus)}
              </Text>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 50 },
  backBtn: { 
    width: 40, height: 40, borderRadius: 20, 
    backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center', marginRight: 15
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 20 },
  mainTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', marginTop: 5 },
  dateInfo: { fontSize: 13, color: '#AAA', marginTop: 5 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginTop: 25 },
  description: { fontSize: 14, color: '#666', marginTop: 10, lineHeight: 22 },
  separator: { height: 1, backgroundColor: '#EEE', marginVertical: 25 },
  attendanceCard: {
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#EEE',
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
    alignItems: 'center'
  },
  attendanceLabel: { fontSize: 12, color: '#777' },
  attendanceValue: { fontSize: 16, fontWeight: 'bold', marginTop: 6 }
});
