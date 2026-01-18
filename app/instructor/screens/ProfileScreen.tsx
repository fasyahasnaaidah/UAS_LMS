import { API_URL } from '@/config/api';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function ProfileScreen({ navigation }: any) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);
  
  const handleLogout = async () => {
    try {
      setLogoutModalVisible(false);
      await AsyncStorage.clear();
      navigation.navigate('SignIn');
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  const confirmLogout = () => setLogoutModalVisible(true);
  const closeLogoutModal = () => setLogoutModalVisible(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarLarge}>
            <Ionicons name="person" size={50} color="#AAA" />
        </View>
        {loading ? (
          <ActivityIndicator size="small" color="#003D79" />
        ) : (
          <>
            <Text style={styles.userName}>{user?.name || 'Instructor'}</Text>
            <Text style={styles.userRole}>{user?.email || 'instructor@example.com'}</Text>
            <Text style={styles.roleBadge}>{user?.role ? user.role.toUpperCase() : 'TEACHER'}</Text>
          </>
        )}
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="person-outline" size={20} color="#333" />
          <Text style={styles.menuText}>Account Information</Text>
          <Ionicons name="chevron-forward" size={20} color="#CCC" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="settings-outline" size={20} color="#333" />
          <Text style={styles.menuText}>Settings</Text>
          <Ionicons name="chevron-forward" size={20} color="#CCC" />
        </TouchableOpacity>

        {/* Tombol Logout */}
        <TouchableOpacity 
          style={[styles.menuItem, { marginTop: 40, borderBottomWidth: 0 }]} 
          onPress={confirmLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#E74C3C" />
          <Text style={[styles.menuText, { color: '#E74C3C', fontWeight: 'bold' }]}>Logout</Text>
        </TouchableOpacity>
      </View>

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  profileHeader: { alignItems: 'center', paddingVertical: 50, backgroundColor: '#F9F9F9' },
  avatarLarge: { 
    width: 100, height: 100, borderRadius: 50, 
    backgroundColor: '#DDD', marginBottom: 15,
    justifyContent: 'center', alignItems: 'center'
  },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  userRole: { fontSize: 14, color: '#888', marginTop: 2 },
  roleBadge: { 
    marginTop: 8, fontSize: 10, fontWeight: 'bold', 
    color: 'white', backgroundColor: '#003D79', 
    paddingVertical: 4, paddingHorizontal: 10, borderRadius: 10 
  },
  menuContainer: { padding: 20 },
  menuItem: { 
    flexDirection: 'row', alignItems: 'center', 
    paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' 
  },
  menuText: { flex: 1, marginLeft: 15, fontSize: 16, color: '#333' },
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
