import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function CreateAccountScreen({ navigation }: any) {
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
      <TextInput placeholder="Full your name" style={styles.input} />

      <Text style={styles.label}>Email Address</Text>
      <TextInput placeholder="example@gmail.com" style={styles.input} keyboardType="email-address" />
      
      <Text style={styles.label}>Password</Text>
      <View style={styles.passInput}>
        <TextInput placeholder="Input your password" secureTextEntry style={{flex: 1}} />
        <Ionicons name="eye-off" size={20} color="gray" />
      </View>

      {/* Tombol Create - Diarahkan ke Sign In */}
      <TouchableOpacity 
        style={styles.btn} 
        onPress={() => {
          alert("Account Created Successfully!"); // Opsional: Beri notifikasi kecil
          navigation.navigate('SignIn'); // Kembali ke halaman Sign In
        }}
      >
        <Text style={styles.btnText}>Create</Text>
      </TouchableOpacity>
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
  btnText: { color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 }
});