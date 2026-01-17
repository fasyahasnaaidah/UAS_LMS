import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignInScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Portal Instruktur</Text>
      <Text style={styles.sub}>Login to manage your classes</Text>

      <Text style={styles.label}>Email Address</Text>
      <TextInput value={email} onChangeText={setEmail} placeholder="example@email.com" style={styles.input} />

      <Text style={styles.label}>Password</Text>
      <TextInput value={pass} onChangeText={setPass} placeholder="********" secureTextEntry style={styles.input} />

      <TouchableOpacity style={styles.btn} onPress={() => navigation.replace('Main')}>
        <Text style={styles.btnText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('CreateAccount')}>
        <Text style={styles.link}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', paddingHorizontal: 18, paddingTop: 70 },
  title: { fontSize: 22, fontWeight: '800', color: '#003D79' },
  sub: { marginTop: 6, color: '#6B7280', marginBottom: 22 },
  label: { fontSize: 12, color: '#6B7280', marginBottom: 6, marginTop: 12 },
  input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 12 },
  btn: { backgroundColor: '#003D79', borderRadius: 12, paddingVertical: 13, alignItems: 'center', marginTop: 18 },
  btnText: { color: 'white', fontWeight: '800' },
  link: { marginTop: 16, color: '#003D79', fontWeight: '700' },
});
