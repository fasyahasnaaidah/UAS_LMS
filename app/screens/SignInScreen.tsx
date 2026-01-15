import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignInScreen({ navigation }: any) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Ionicons name="chevron-back" size={24} color="black" />
      </TouchableOpacity>
      
      <Text style={styles.title}>Sign In</Text>
      <Text style={styles.subText}>
        New User? <Text style={styles.link} onPress={() => navigation.navigate('CreateAccount')}>Create an account</Text>
      </Text>
      
      <Text style={styles.label}>Email Address</Text>
      <TextInput placeholder="example@gmail.com" style={styles.input} keyboardType="email-address" />
      
      <Text style={styles.label}>Password</Text>
      <View style={styles.passInput}>
        <TextInput placeholder="Input your password" secureTextEntry style={{flex: 1}} />
        <Ionicons name="eye-off" size={20} color="gray" />
      </View>
      <Text style={styles.forgot}>Forgot password?</Text>

      <TouchableOpacity 
        style={styles.btn} 
        onPress={() => navigation.replace('Main')} // Ini yang membuat pindah ke Dashboard (Tabs)
      >
        <Text style={styles.btnText}>Sign In</Text>
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
  forgot: { textAlign: 'right', color: 'gray', marginTop: 10 },
  btn: { backgroundColor: '#003D79', padding: 18, borderRadius: 12, marginTop: 30 },
  btnText: { color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 }
});