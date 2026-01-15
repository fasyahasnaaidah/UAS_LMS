import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      {/* Header Profil */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.profileInfo}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={50} color="#003D79" />
          </View>
          <Text style={styles.userName}>Ahmad Syaifuddin</Text>
          <Text style={styles.userEmail}>ahmad.syaif@mahasiswa.ac.id</Text>
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
          onPress={() => navigation.replace('SignIn')}
        >
          <Ionicons name="log-out-outline" size={22} color="#E74C3C" />
          <Text style={[styles.menuLabel, { color: '#E74C3C' }]}>Logout</Text>
          <Ionicons name="chevron-forward" size={18} color="#E74C3C" />
        </TouchableOpacity>
      </ScrollView>
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
  menuLabel: { flex: 1, marginLeft: 15, fontSize: 15, fontWeight: '500' }
});