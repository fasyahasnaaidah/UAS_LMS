import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function UploadMaterialScreen({ navigation }: any) {
  const [title, setTitle] = useState('');
  const [sub, setSub] = useState('');
  const [desc, setDesc] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upload Material</Text>
        <View style={{ width: 34 }} />
      </View>

      <View style={styles.body}>
        <Text style={styles.label}>Title of Material</Text>
        <TextInput style={styles.input} placeholder="example: Pertemuan Pertama" value={title} onChangeText={setTitle} />

        <Text style={styles.label}>Subtitle of Material</Text>
        <TextInput style={styles.input} placeholder="example: Using Flatlist" value={sub} onChangeText={setSub} />

        <Text style={styles.label}>Material Description</Text>
        <TextInput
          style={[styles.input, { height: 90, textAlignVertical: 'top' }]}
          placeholder="example: Displaying data in list form"
          multiline
          value={desc}
          onChangeText={setDesc}
        />

        <View style={styles.drop}>
          <Ionicons name="cloud-upload-outline" size={34} color="#9CA3AF" />
          <Text style={styles.dropTitle}>Upload File</Text>
          <Text style={styles.dropSub}>maximum file size: 50 MB</Text>
        </View>

        <TouchableOpacity style={styles.btn}>
          <Text style={styles.btnText}>Publish</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  header: { paddingTop: 54, paddingHorizontal: 16, paddingBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#111827' },

  body: { padding: 16 },
  label: { fontSize: 12, color: '#6B7280', marginTop: 12, marginBottom: 6, fontWeight: '700' },
  input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 11 },

  drop: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  dropTitle: { fontWeight: '900', color: '#111827', marginTop: 10 },
  dropSub: { fontSize: 12, color: '#9CA3AF', marginTop: 4 },

  btn: { marginTop: 16, backgroundColor: '#003D79', paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: '900' },
});
