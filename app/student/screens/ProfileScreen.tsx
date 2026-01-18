import { API_URL } from '@/config/api';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function ProfileScreen({ navigation }: any) {
  const [user, setUser] = useState({ name: 'Loading...', email: '...' });
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const fetchUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      if (response.ok) {
        setUser(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    try {
      setLogoutModalVisible(false);
      await AsyncStorage.clear();
      navigation.navigate('SignIn');
    } catch (e) {
      console.error(e);
    }
  };

  const confirmLogout = () => setLogoutModalVisible(true);

  const closeLogoutModal = () => setLogoutModalVisible(false);

  return (
    <View style={styles.container}>
      {/* Header Profil */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.profileInfo}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={50} color="#003D79" />
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        
        <ProfileMenuItem icon="person-outline" label="Edit Profile" />
        <ProfileMenuItem icon="notifications-outline" label="Notifications" />
        <ProfileMenuItem icon="shield-checkmark-outline" label="Security" />
        <ProfileMenuItem icon="language-outline" label="Language" />

        <TouchableOpacity 
          style={[styles.menuItem, { marginTop: 20 }]} 
          onPress={confirmLogout}
        >
          <Ionicons name="log-out-outline" size={22} color="#E74C3C" />
          <Text style={[styles.menuLabel, { color: '#E74C3C' }]}>Logout</Text>
          <Ionicons name="chevron-forward" size={18} color="#E74C3C" />
        </TouchableOpacity>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent
        visible={logoutModalVisible}
        onRequestClose={closeLogoutModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="alert-circle" size={50} color="#F44336" style={{ marginBottom: 15 }} />
            <Text style={styles.modalTitle}>Logout</Text>
            <Text style={styles.modalMessage}>Are you sure you want to logout?</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalBtn, styles.modalCancel]} onPress={closeLogoutModal}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, styles.modalConfirm]} onPress={handleLogout}>
                <Text style={styles.modalConfirmText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const ProfileMenuItem = ({ icon, label }: any) => (
  <TouchableOpacity style={styles.menuItem}>
    <Ionicons name={icon} size={22} color="#003D79" />
    <Text style={styles.menuLabel}>{label}</Text>
    <Ionicons name="chevron-forward" size={18} color="gray" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { 
    backgroundColor: '#003D79', 
    paddingTop: 60, 
    paddingBottom: 40, 
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30
  },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  profileInfo: { alignItems: 'center' },
  avatarContainer: { 
    width: 90, 
    height: 90, 
    backgroundColor: 'white', 
    borderRadius: 45, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 15
  },
  userName: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  userEmail: { color: '#CCC', fontSize: 13 },
  content: { padding: 20 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: 'gray', marginBottom: 15 },
  menuItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'white', 
    padding: 15, 
    borderRadius: 12, 
    marginBottom: 10,
    elevation: 1
  },
  menuLabel: { flex: 1, marginLeft: 15, fontSize: 15, fontWeight: '500' },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  modalContent: { 
    width: '82%', 
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
    marginBottom: 8, 
    color: '#333',
    textAlign: 'center'
  },
  modalMessage: { 
    fontSize: 15, 
    color: '#666', 
    textAlign: 'center', 
    marginBottom: 20 
  },
  modalActions: { flexDirection: 'row', gap: 10, width: '100%' },
  modalBtn: { flex: 1, padding: 12, borderRadius: 12, alignItems: 'center' },
  modalCancel: { backgroundColor: '#F1F1F1' },
  modalConfirm: { backgroundColor: '#E74C3C' },
  modalCancelText: { color: '#333', fontWeight: 'bold' },
  modalConfirmText: { color: 'white', fontWeight: 'bold' }
});
