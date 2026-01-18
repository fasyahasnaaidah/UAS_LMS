import { API_URL } from '@/config/api';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function AttendanceTab({ schedule, navigation }: any) {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState<'success' | 'error'>('success');

  const fetchAttendance = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token || !schedule.id) return;

      const response = await fetch(`${API_URL}/api/instructor/schedules/${schedule.id}/attendance`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        // Initialize status if null (default to absent or null? Let's keep null to force selection or default to present?)
        // Let's default to 'present' for easier workflow, or keep null.
        // The reference had mapped status.
        setStudents(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [schedule.id]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const updateStatus = (id: number, newStatus: string) => {
    setStudents(prev => prev.map(s => s.student_id === id ? { ...s, status: newStatus } : s));
  };

  const showModal = (title: string, message: string, type: 'success' | 'error') => {
    setModalTitle(title);
    setModalMessage(message);
    setModalType(type);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const saveAttendance = async () => {
    setSaving(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      // Filter only students with status set? Or send all? Send all that have status.
      const attendances = students
        .filter(s => s.status)
        .map(s => ({ student_id: s.student_id, status: s.status }));

      if (attendances.length === 0) {
        showModal('Info', 'No attendance marked to save.', 'error');
        setSaving(false);
        return;
      }

      const response = await fetch(`${API_URL}/api/instructor/schedules/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          scheduleId: schedule.id,
          attendances
        })
      });

      if (response.ok) {
        showModal('Success', 'Attendance saved successfully!', 'success');
      } else {
        showModal('Error', 'Failed to save attendance', 'error');
      }
    } catch (error) {
      console.error(error);
      showModal('Error', 'Server error', 'error');
    } finally {
      setSaving(false);
    }
  };

  const RadioBtn = ({ selected, label, onPress, color = '#003D79' }: any) => (
    <TouchableOpacity onPress={onPress} style={styles.radioContainer}>
      <Ionicons 
        name={selected ? "radio-button-on" : "radio-button-off"} 
        size={20} 
        color={selected ? color : "#AAA"} 
      />
      <Text style={[styles.radioLabel, selected && { color: color, fontWeight: 'bold' }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }: any) => (
    <View style={styles.tableRow}>
      <Text style={[styles.studentName, { flex: 1.5 }]}>{item.name}</Text>
      <View style={styles.statusRow}>
        <RadioBtn 
          label="P" 
          selected={item.status === 'present'} 
          onPress={() => updateStatus(item.student_id, 'present')} 
          color="#2ECC71" // Green
        />
        <RadioBtn 
          label="L" 
          selected={item.status === 'late'} 
          onPress={() => updateStatus(item.student_id, 'late')} 
          color="#F1C40F" // Yellow
        />
        <RadioBtn 
          label="A" 
          selected={item.status === 'absent'} 
          onPress={() => updateStatus(item.student_id, 'absent')} 
          color="#E74C3C" // Red
        />
      </View>
    </View>
  );

  if (loading) return <ActivityIndicator size="small" color="#003D79" style={{marginTop: 20}} />;

  return (
    <View style={styles.container}>
       <View style={styles.tableHeader}>
        <Text style={[styles.columnLabel, { flex: 1.5 }]}>Student Name</Text>
        <Text style={[styles.columnLabel, { flex: 2, textAlign: 'center' }]}>Status (P/L/A)</Text>
      </View>

      {students.length === 0 ? (
        <Text style={{textAlign: 'center', color: 'gray', marginTop: 20}}>No students enrolled.</Text>
      ) : (
        <View>
          {students.map((item) => (
             <View key={item.student_id}>
               {renderItem({ item })}
             </View>
          ))}
        </View>
      )}

      {students.length > 0 && (
        <TouchableOpacity 
          style={[styles.saveBtn, saving && { opacity: 0.7 }]} 
          onPress={saveAttendance}
          disabled={saving}
        >
          {saving ? <ActivityIndicator color="white" /> : <Text style={styles.saveBtnText}>Save Attendance</Text>}
        </TouchableOpacity>
      )}

      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons
              name={modalType === 'success' ? "checkmark-circle" : "alert-circle"}
              size={50}
              color={modalType === 'success' ? "#4CAF50" : "#F44336"}
              style={{ marginBottom: 15 }}
            />
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: modalType === 'success' ? '#003D79' : '#F44336' }]}
              onPress={handleModalClose}
            >
              <Text style={styles.btnText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 20, backgroundColor: 'white', borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: '#EEE' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#F9F9F9', padding: 12, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  columnLabel: { fontSize: 12, fontWeight: 'bold', color: '#555' },
  tableRow: { flexDirection: 'row', padding: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', alignItems: 'center' },
  studentName: { fontSize: 13, color: '#333' },
  statusRow: { flex: 2, flexDirection: 'row', justifyContent: 'space-around' },
  radioContainer: { flexDirection: 'row', alignItems: 'center' },
  radioLabel: { fontSize: 12, marginLeft: 4, color: '#666' },
  saveBtn: { backgroundColor: '#003D79', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10, alignSelf: 'flex-end', margin: 15 },
  saveBtnText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  btnText: { color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  modalContent: { 
    width: '80%', 
    backgroundColor: 'white', 
    padding: 25, 
    borderRadius: 20, 
    alignItems: 'center', 
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 10, 
    color: '#333',
    textAlign: 'center'
  },
  modalMessage: { 
    fontSize: 16, 
    color: '#666', 
    textAlign: 'center', 
    marginBottom: 25 
  },
  modalBtn: { 
    width: '100%', 
    padding: 12, 
    borderRadius: 12, 
    alignItems: 'center' 
  }
});
