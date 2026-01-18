import { API_URL } from '@/config/api';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function SignInScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

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

  const handleModalClose = async () => {
    setModalVisible(false);
    if (modalType === 'success') {
      try {
        const role = await AsyncStorage.getItem('userRole');
        if (role === 'student') {
          navigation.replace('StudentRoot');
        } else if (role === 'teacher') {
          navigation.replace('InstructorRoot');
        } else {
          // Fallback or handle other roles
           // For now, maybe default to Student or show error
           console.warn('Unknown role:', role);
           navigation.replace('StudentRoot'); // Fallback to student for safety
        }
      } catch (e) {
        console.error("Error reading role", e);
      }
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showModal('Error', 'Please fill in all fields', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('userToken', data.token);
        await AsyncStorage.setItem('userName', data.user.name);
        await AsyncStorage.setItem('userRole', data.user.role); // Save Role
        
        showModal('Success', 'Login Successful!', 'success');
      } else {
        showModal('Login Failed', data.message || 'Invalid credentials', 'error');
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
      <Text style={styles.title}>Sign In</Text>
      <Text style={styles.subText}>
        New User? <Text style={styles.link} onPress={() => navigation.navigate('CreateAccount')}>Create an account</Text>
      </Text>
      
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
          secureTextEntry={!isPasswordVisible} 
          style={{flex: 1}} 
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
          <Ionicons name={isPasswordVisible ? "eye" : "eye-off"} size={20} color="gray" />
        </TouchableOpacity>
      </View>
      <Text style={styles.forgot}>Forgot password?</Text>

      <TouchableOpacity 
        style={[styles.btn, loading && { opacity: 0.7 }]} 
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.btnText}>Sign In</Text>
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
  container: { flexGrow: 1, padding: 25, paddingTop: 100, backgroundColor: 'white' },
  title: { fontSize: 28, fontWeight: 'bold' },
  subText: { color: 'gray', marginBottom: 30 },
  link: { color: '#003D79', fontWeight: 'bold' },
  label: { fontWeight: '600', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#DDD', padding: 15, borderRadius: 12, marginBottom: 20 },
  passInput: { flexDirection: 'row', borderWidth: 1, borderColor: '#DDD', padding: 15, borderRadius: 12, alignItems: 'center' },
  forgot: { textAlign: 'right', color: 'gray', marginTop: 10 },
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
