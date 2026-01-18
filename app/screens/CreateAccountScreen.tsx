import { API_URL } from '@/config/api';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Modal } from 'react-native';


export default function CreateAccountScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // New state
  const [loading, setLoading] = useState(false);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState<'success' | 'error'>('success');

  const showModal = (title: string, message: string, type: 'success' | 'error') => {
    setModalTitle(title);
    setModalMessage(message);
    setModalType(type);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    if (modalType === 'success') {
      navigation.navigate('SignIn');
    }
  };

  const handleRegister = async () => {
    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      showModal('Error', 'Please fill in all fields', 'error');
      return;
    }

    // Password match validation
    if (password !== confirmPassword) {
      showModal('Error', 'Passwords do not match', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role: 'student' }),
      });

      const data = await response.json();

      if (response.ok) {
        showModal('Success', 'Account Created Successfully!', 'success');
      } else {
        showModal('Registration Failed', data.message || 'Something went wrong', 'error');
      }
    } catch (error) {
      showModal('Connection Error', 'Could not connect to server. Ensure backend is running.', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Tombol Back */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Ionicons name="chevron-back" size={24} color="black" />
      </TouchableOpacity>
      
      <Text style={styles.title}>Create An Account</Text>
      <Text style={styles.subText}>
        Already have an account? <Text style={styles.link} onPress={() => navigation.navigate('SignIn')}>Login</Text>
      </Text>
      
      {/* Form Input */}
      <Text style={styles.label}>Full Name</Text>
      <TextInput 
        placeholder="Full your name" 
        style={styles.input} 
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Email Address</Text>
      <TextInput 
        placeholder="example@gmail.com" 
        style={styles.input} 
        keyboardType="email-address" 
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      
      <Text style={styles.label}>Password</Text>
      <View style={styles.passInput}>
        <TextInput 
          placeholder="Input your password" 
          secureTextEntry 
          style={{flex: 1}} 
          value={password}
          onChangeText={setPassword}
        />
        <Ionicons name="eye-off" size={20} color="gray" />
      </View>

      {/* Confirm Password Input */}
      <Text style={[styles.label, { marginTop: 20 }]}>Confirm Password</Text>
      <View style={styles.passInput}>
        <TextInput 
          placeholder="Confirm your password" 
          secureTextEntry 
          style={{flex: 1}} 
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <Ionicons name="eye-off" size={20} color="gray" />
      </View>

      {/* Tombol Create */}
      <TouchableOpacity 
        style={[styles.btn, loading && { opacity: 0.7 }]} 
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.btnText}>Create</Text>
        )}
      </TouchableOpacity>

      {/* Custom Modal */}
      <Modal
        animationType="fade"
        transparent={true}
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

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 25, backgroundColor: 'white' },
  backBtn: { marginTop: 40, marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold' },
  subText: { color: 'gray', marginBottom: 30 },
  link: { color: '#003D79', fontWeight: 'bold' },
  label: { fontWeight: '600', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#DDD', padding: 15, borderRadius: 12, marginBottom: 20 },
  passInput: { flexDirection: 'row', borderWidth: 1, borderColor: '#DDD', padding: 15, borderRadius: 12, alignItems: 'center' },
  btn: { backgroundColor: '#003D79', padding: 18, borderRadius: 12, marginTop: 30 },
  btnText: { color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  
  // Modal Styles
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
