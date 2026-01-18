import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AttendanceTab from '../components/AttendanceTab';

export default function ScheduleDetailScreen({ navigation, route }: any) {
  const { schedule } = route.params || {};

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Session Detail</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 25, paddingBottom: 100 }}>
        <Text style={styles.subtitle}>Topic</Text>
        <Text style={styles.mainTitle}>{schedule.session_topic}</Text>
        <View style={styles.dateInfoRow}>
          <Ionicons name="calendar-outline" size={14} color="#AAA" style={{ marginRight: 6 }} />
          <Text style={styles.dateInfoText}>{formatDate(schedule.session_date)}</Text>
          <Text style={styles.dateInfoDivider}>|</Text>
          <Ionicons name="location-outline" size={14} color="#AAA" style={{ marginRight: 6, marginLeft: 8 }} />
          <Text style={styles.dateInfoText}>{schedule.location}</Text>
        </View>

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>
          Description for session: {schedule.session_topic}. Students are expected to attend and participate actively.
        </Text>

        <View style={styles.separator} />

        {/* Attendance Section directly here or as a component */}
        <AttendanceTab schedule={schedule} navigation={navigation} />

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
  dateInfoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  dateInfoText: { fontSize: 13, color: '#AAA' },
  dateInfoDivider: { marginHorizontal: 6, color: '#AAA' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginTop: 25 },
  description: { fontSize: 14, color: '#666', marginTop: 10, lineHeight: 22 },
  separator: { height: 1, backgroundColor: '#EEE', marginVertical: 25 },
});




