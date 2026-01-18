import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const INITIAL_STUDENTS = [
  { id: '1', name: 'Muhammad Ramdan', status: 'H' },
  { id: '2', name: 'Fasya Hasna Aidah', status: 'I' },
  { id: '3', name: 'Andreas Julianto', status: 'H' },
  { id: '4', name: 'Iqbaal Ramadhan', status: 'S' },
  { id: '5', name: 'Erika Carlina', status: 'A' },
];

export default function AttendanceScreen({ navigation }: any) {
  const [students, setStudents] = useState(INITIAL_STUDENTS);

  const updateStatus = (id: string, newStatus: string) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  const RadioBtn = ({ selected, label, onPress }: any) => (
    <TouchableOpacity onPress={onPress} style={styles.radioContainer}>
      <Ionicons 
        name={selected ? "radio-button-on" : "radio-button-off"} 
        size={18} 
        color={selected ? "#003D79" : "#AAA"} 
      />
      <Text style={[styles.radioLabel, selected && { color: '#003D79', fontWeight: 'bold' }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.meetingInfo}>Pertemuan Pertama</Text>
        <Text style={styles.mainTitle}>Installation React Native</Text>
      </View>

      {/* Tab Selector - Navigasi Aktif */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={styles.tab} 
          onPress={() => navigation.navigate('MaterialDetailScreen', { 
            item: { topic: 'Installation React Native', title: 'Pertemuan Pertama' } 
          })}
        >
          <Text style={styles.tabText}>Material</Text>
        </TouchableOpacity>
        
        <View style={styles.tab}>
          <Text style={styles.tabText}>Assignment Submission</Text>
        </View>
        
        <TouchableOpacity style={[styles.tab, styles.tabActive]}>
          <Text style={styles.tabTextActive}>Attendance</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tableHeader}>
        <Text style={[styles.columnLabel, { flex: 1.5 }]}>Student Name</Text>
        <Text style={[styles.columnLabel, { flex: 2, textAlign: 'center' }]}>Attendance Status</Text>
      </View>

      <ScrollView>
        {students.map((item) => (
          <View key={item.id} style={styles.tableRow}>
            <Text style={[styles.studentName, { flex: 1.5 }]}>{item.name}</Text>
            <View style={styles.statusRow}>
              <RadioBtn label="H" selected={item.status === 'H'} onPress={() => updateStatus(item.id, 'H')} />
              <RadioBtn label="I" selected={item.status === 'I'} onPress={() => updateStatus(item.id, 'I')} />
              <RadioBtn label="S" selected={item.status === 'S'} onPress={() => updateStatus(item.id, 'S')} />
              <RadioBtn label="A" selected={item.status === 'A'} onPress={() => updateStatus(item.id, 'A')} />
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.saveBtn} onPress={() => alert('Attendance Saved!')}>
        <Text style={styles.saveBtnText}>Save</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { padding: 20, paddingTop: 50 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  meetingInfo: { fontSize: 14, color: '#666' },
  mainTitle: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  tabContainer: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 20 },
  tab: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, backgroundColor: '#E0E0E0', marginRight: 8 },
  tabActive: { backgroundColor: '#003D79' },
  tabText: { fontSize: 11, color: '#666' },
  tabTextActive: { fontSize: 11, color: 'white', fontWeight: 'bold' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#F9F9F9', padding: 12, borderTopWidth: 1, borderTopColor: '#EEE' },
  columnLabel: { fontSize: 12, fontWeight: 'bold' },
  tableRow: { flexDirection: 'row', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', alignItems: 'center' },
  studentName: { fontSize: 13, color: '#333' },
  statusRow: { flex: 2, flexDirection: 'row', justifyContent: 'space-around' },
  radioContainer: { flexDirection: 'row', alignItems: 'center' },
  radioLabel: { fontSize: 12, marginLeft: 4, color: '#666' },
  saveBtn: { backgroundColor: '#4F5E71', paddingVertical: 12, paddingHorizontal: 40, borderRadius: 10, alignSelf: 'flex-end', margin: 25 },
  saveBtnText: { color: 'white', fontWeight: 'bold' }
});
