import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MaterialDetailScreen({ navigation, route }: any) {
  const { title } = route.params;
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  // Fungsi Simulasi Download
  const handleDownload = (fileName: string) => {
    Alert.alert("Downloading", `File ${fileName} sedang diunduh ke perangkat Anda.`);
  };

  // Fungsi Pilih File (PDF, Excel, Vid, Foto, Word)
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'image/*', 'video/*', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
      });

      if (!result.canceled) {
        setUploadedFile(result.assets[0].name);
        Alert.alert("Berhasil", `File ${result.assets[0].name} berhasil ditambahkan.`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Biru Melengkung */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.posted}>Posted January, 12 (Updated 8:30 AM)</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionHeader}>PERTEMUAN PERTAMA</Text>
        <View style={styles.divider} />
        <Text style={styles.description}>
          At this meeting, students are expected to be able to correctly install React Native CLI, JDK, and Android Studio.
        </Text>

        <Text style={[styles.sectionHeader, { marginTop: 30 }]}>ATTACHMENT</Text>
        
        {/* List Lampiran Dosen */}
        <AttachmentItem 
          name="Slide Material - Setun RN.pdf" 
          size="2.4 MB" 
          onDownload={() => handleDownload("Slide Material.pdf")} 
        />
        <AttachmentItem 
          name="Panduan Instalasi.docx" 
          size="1.1 MB" 
          onDownload={() => handleDownload("Panduan Instalasi.docx")} 
        />

        {/* Bagian Tugas (Bottom Card Style) */}
        <View style={styles.taskCard}>
          <Text style={styles.taskTitle}>Your Task</Text>
          <Text style={styles.deadline}>Deadline: Tomorrow, 11:59 P.M</Text>
          
          <TouchableOpacity style={styles.addBtn} onPress={pickDocument}>
            <Text style={styles.addText}>
              {uploadedFile ? `✅ ${uploadedFile}` : "+ add or create"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.submitBtn, { backgroundColor: uploadedFile ? '#003D79' : '#E0E0E0' }]}
            onPress={() => uploadedFile && Alert.alert("Success", "Tugas berhasil dikumpulkan!")}
          >
            <Text style={[styles.submitText, { color: uploadedFile ? 'white' : 'gray' }]}>submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const AttachmentItem = ({ name, size, onDownload }: any) => (
  <View style={styles.attachBox}>
    <View style={styles.fileIcon}>
      <Ionicons name="document-text-outline" size={24} color="#003D79" />
    </View>
    <View style={{ flex: 1, marginLeft: 15 }}>
      <Text style={styles.fileName}>{name}</Text>
      <Text style={styles.fileSize}>{size}</Text>
    </View>
    <TouchableOpacity onPress={onDownload}>
      <Ionicons name="download-outline" size={24} color="gray" />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { backgroundColor: '#003D79', padding: 25, paddingTop: 50, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
  title: { color: 'white', fontSize: 22, fontWeight: 'bold', marginTop: 20 },
  posted: { color: '#CCC', fontSize: 12, marginTop: 5 },
  content: { padding: 25 },
  sectionHeader: { fontSize: 12, fontWeight: 'bold', color: 'black' },
  divider: { height: 1, backgroundColor: '#EEE', marginVertical: 10 },
  description: { fontSize: 14, color: '#555', lineHeight: 20 },
  attachBox: { flexDirection: 'row', alignItems: 'center', marginTop: 15 },
  fileIcon: { width: 45, height: 45, backgroundColor: '#F0F0F0', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  fileName: { fontSize: 13, fontWeight: '500' },
  fileSize: { fontSize: 11, color: 'gray' },
  taskCard: { marginTop: 40, padding: 20, backgroundColor: '#F9F9F9', borderRadius: 15, borderWidth: 1, borderColor: '#EEE' },
  taskTitle: { fontWeight: 'bold', fontSize: 14 },
  deadline: { color: 'red', fontSize: 11, marginBottom: 15 },
  addBtn: { borderStyle: 'dashed', borderWidth: 1, borderColor: '#CCC', padding: 12, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  addText: { color: 'gray', fontSize: 13 },
  submitBtn: { padding: 12, borderRadius: 10, alignItems: 'center' },
  submitText: { fontWeight: 'bold', textTransform: 'uppercase' }
});