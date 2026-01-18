import { API_URL } from '@/config/api';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform, 
  SafeAreaView, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  Modal 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';


export default function CreateScheduleScreen({ navigation, route }: any) {
  const { courseId } = route.params;
  
  const [topic, setTopic] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState<'success' | 'error'>('success');

  // Date & Time Picker State
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const currentDate = selectedDate;
      // Preserve the time when changing date
      currentDate.setHours(date.getHours());
      currentDate.setMinutes(date.getMinutes());
      setDate(currentDate);
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const currentTime = date;
      currentTime.setHours(selectedTime.getHours());
      currentTime.setMinutes(selectedTime.getMinutes());
      setDate(new Date(currentTime));
    }
  };

  const handleWebDateChange = (value: string) => {
    if (!value) return;
    const [y, m, d] = value.split('-').map(Number);
    if (!y || !m || !d) return;
    const next = new Date(date);
    next.setFullYear(y);
    next.setMonth(m - 1);
    next.setDate(d);
    setDate(next);
  };

  const handleWebTimeChange = (value: string) => {
    if (!value) return;
    const [h, min] = value.split(':').map(Number);
    if (h === undefined || min === undefined) return;
    const next = new Date(date);
    next.setHours(h);
    next.setMinutes(min);
    setDate(next);
  };

  const formatDateValue = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatTimeValue = (d: Date) => {
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const showModal = (title: string, message: string, type: 'success' | 'error') => {
    setModalTitle(title);
    setModalMessage(message);
    setModalType(type);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    if (modalType === 'success') {
      navigation.goBack();
    }
  };

  const handleSubmit = async () => {
    if (!topic || !location) {
      showModal('Error', 'Please fill in all fields', 'error');
      return;
    }

    // Format for MySQL: YYYY-MM-DD HH:mm:ss
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    const sessionDateTime = `${year}-${month}-${day} ${hours}:${minutes}:00`;

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API_URL}/api/instructor/courses/schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          courseId,
          sessionTopic: topic,
          sessionDate: sessionDateTime,
          location
        })
      });

      const data = await response.json();

      if (response.ok) {
        showModal('Success', 'Schedule created successfully', 'success');
      } else {
        showModal('Error', data.message || 'Failed to create schedule', 'error');
      }
    } catch (error) {
      console.error(error);
      showModal('Error', 'Server error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatDateLabel = (d: Date) => {
    return d.toLocaleDateString('en-GB', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  };

  const formatTimeLabel = (d: Date) => {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create New Schedule</Text>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.label}>Session Topic</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="book-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput 
              style={styles.input} 
              placeholder="e.g. Intro to React Native" 
              value={topic}
              onChangeText={setTopic}
            />
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.label}>Date</Text>
              {Platform.OS === 'web' ? (
                <View style={styles.webInputRow}>
                  <Ionicons name="calendar-outline" size={20} color="#003D79" />
                  <input
                    type="date"
                    value={formatDateValue(date)}
                    onChange={(e) => handleWebDateChange(e.target.value)}
                    style={styles.webInput as any}
                  />
                </View>
              ) : (
                <TouchableOpacity 
                  style={styles.pickerBtn} 
                  onPress={() => setShowDatePicker(true)}
                >
                  <Ionicons name="calendar-outline" size={20} color="#003D79" />
                  <Text style={styles.pickerBtnText}>{formatDateLabel(date)}</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.label}>Time</Text>
              {Platform.OS === 'web' ? (
                <View style={styles.webInputRow}>
                  <Ionicons name="time-outline" size={20} color="#003D79" />
                  <input
                    type="time"
                    value={formatTimeValue(date)}
                    onChange={(e) => handleWebTimeChange(e.target.value)}
                    style={styles.webInput as any}
                  />
                </View>
              ) : (
                <TouchableOpacity 
                  style={styles.pickerBtn} 
                  onPress={() => setShowTimePicker(true)}
                >
                  <Ionicons name="time-outline" size={20} color="#003D79" />
                  <Text style={styles.pickerBtnText}>{formatTimeLabel(date)}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {showDatePicker && Platform.OS !== 'web' && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
              minimumDate={new Date()}
            />
          )}

          {showTimePicker && Platform.OS !== 'web' && (
            <DateTimePicker
              value={date}
              mode="time"
              is24Hour={true}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onTimeChange}
            />
          )}

          <Text style={styles.label}>Location / Room</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="location-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput 
              style={styles.input} 
              placeholder="e.g. Lab 1 or Zoom Link" 
              value={location}
              onChangeText={setLocation}
            />
          </View>

          <TouchableOpacity 
            style={[styles.btn, loading && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.btnText}>Create Schedule</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 50, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  backBtn: { marginRight: 15, width: 40, height: 40, borderRadius: 20, backgroundColor: '#F5F5F5', justifyContent:'center', alignItems:'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#003D79' },
  content: { padding: 25 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 8, marginTop: 15 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 15,
  },
  inputIcon: { marginRight: 10 },
  input: { 
    flex: 1,
    paddingVertical: 15,
    fontSize: 14,
    color: '#333'
  },
  row: { flexDirection: 'row', marginTop: 10 },
  pickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
    padding: 15,
    gap: 10
  },
  pickerBtnText: { fontSize: 13, color: '#333', fontWeight: '500' },
  webInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 15,
    paddingVertical: 12,
    gap: 10
  },
  webInput: {
    flex: 1,
    borderWidth: 0,
    outlineStyle: 'none',
    fontSize: 13,
    color: '#333',
    backgroundColor: 'transparent'
  },
  btn: { 
    backgroundColor: '#003D79', padding: 18, borderRadius: 15, 
    marginTop: 40, alignItems: 'center',
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5
  },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
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
