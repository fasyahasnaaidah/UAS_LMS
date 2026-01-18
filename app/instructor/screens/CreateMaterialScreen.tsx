import { API_URL } from '@/config/api';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import React, { useState } from 'react';
import { ActivityIndicator, Modal, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as IntentLauncher from 'expo-intent-launcher';


export default function CreateMaterialScreen({ navigation, route }: any) {
  const { courseId } = route.params || {}; // Receive courseId
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState<'success' | 'error'>('success');
  const [webPreviewVisible, setWebPreviewVisible] = useState(false);
  const [webPreviewFileName, setWebPreviewFileName] = useState('');
  const [webPreviewSourceUrl, setWebPreviewSourceUrl] = useState('');
  const [webPreviewIsOffice, setWebPreviewIsOffice] = useState(false);
  const [webPreviewFile, setWebPreviewFile] = useState<any>(null);

  const officeExtensions = useState(() => new Set(['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx']))[0];

  const getFileExtension = (value: string) => {
    if (!value) return '';
    const clean = value.split('?')[0].split('#')[0];
    const last = clean.split('.').pop() || '';
    return last.toLowerCase();
  };

  const showModal = (title: string, message: string, type: 'success' | 'error') => {
    setModalTitle(title);
    setModalMessage(message);
    setModalType(type);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    if (modalType === 'success') {
      navigation.goBack();
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
        multiple: true,
      });

      if (!result.canceled) {
        setFiles(prev => [...prev, ...result.assets]);
      }
    } catch (err) {
      console.log("Error picking document:", err);
    }
  };

  const removeLocalFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const openWebPreview = (fileItem: any) => {
    const fileName = fileItem?.name || 'File';
    const sourceUrl = fileItem?.uri || '';
    const ext = getFileExtension(fileName);
    setWebPreviewFileName(fileName);
    setWebPreviewSourceUrl(sourceUrl);
    setWebPreviewIsOffice(officeExtensions.has(ext));
    setWebPreviewFile(fileItem);
    setWebPreviewVisible(true);
  };

  const handleWebDownloadLocal = async (fileItem: any) => {
    try {
      if (fileItem?.file) {
        const blobUrl = window.URL.createObjectURL(fileItem.file);
        const anchor = document.createElement('a');
        anchor.href = blobUrl;
        anchor.download = fileItem.name || 'download';
        anchor.style.display = 'none';
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        window.URL.revokeObjectURL(blobUrl);
        return;
      }
      const anchor = document.createElement('a');
      anchor.href = fileItem?.uri;
      anchor.download = fileItem?.name || 'download';
      anchor.style.display = 'none';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    } catch (e) {
      console.error(e);
      showModal("Error", "Gagal mengunduh file.", "error");
    }
  };

  const handleViewLocal = async (fileItem: any) => {
    if (Platform.OS === 'web') {
      const fileName = fileItem?.name || 'File';
      const ext = getFileExtension(fileName);
      if (officeExtensions.has(ext)) {
        await handleWebDownloadLocal(fileItem);
        return;
      }
      openWebPreview(fileItem);
      return;
    }
    try {
      if (Platform.OS === 'android') {
        const contentUri = await FileSystem.getContentUriAsync(fileItem.uri);
        await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
          data: contentUri,
          flags: 1,
        });
      } else {
        await Sharing.shareAsync(fileItem.uri);
      }
    } catch (e) {
      console.error(e);
      showModal("Error", "Gagal membuka file.", "error");
    }
  };

  const handleUpload = async () => {
    if (!title || files.length === 0 || !courseId) {
      showModal("Error", "Please fill in title and select a file.", "error");
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const formData = new FormData();
      
      formData.append('courseId', courseId);
      formData.append('title', title);
      formData.append('content', description);

      for (const file of files) {
        if (Platform.OS === 'web') {
          if (file.file) {
            formData.append('files', file.file);
          } else {
            const res = await fetch(file.uri);
            const blob = await res.blob();
            formData.append('files', blob, file.name);
          }
        } else {
          formData.append('files', {
            uri: file.uri,
            name: file.name,
            type: file.mimeType || 'application/octet-stream',
          } as any);
        }
      }

      const response = await fetch(`${API_URL}/api/instructor/materials/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Do NOT set Content-Type header manually for FormData, fetch does it automatically with boundary
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        showModal("Success", "Material uploaded successfully!", "success");
        setFiles([]);
        setTitle('');
        setDescription('');
      } else {
        showModal("Error", data.message || "Upload failed", "error");
      }
    } catch (error) {
      console.error(error);
      showModal("Error", "Server error", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upload Material</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 25 }}>
        <Text style={styles.label}>Title of Material</Text>
        <TextInput 
            style={styles.input} 
            placeholder="example: Pertemuan Pertama" 
            value={title}
            onChangeText={setTitle}
        />

        <Text style={styles.label}>Material Description</Text>
        <TextInput 
          style={[styles.input, { height: 100, textAlignVertical: 'top' }]} 
          placeholder="example: Displaying data in list form" 
          multiline
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>Upload File</Text>
        {files.map((item, idx) => (
          <View key={`${item.uri}-${idx}`} style={styles.localFileItem}>
            <Text style={{ flex: 1, fontSize: 12 }} numberOfLines={1}>{item.name}</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity onPress={() => handleViewLocal(item)}>
                <Ionicons name="eye-outline" size={20} color="#003D79" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => removeLocalFile(idx)}>
                <Ionicons name="close-circle" size={20} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <TouchableOpacity style={styles.uploadArea} onPress={pickDocument}>
          <Ionicons 
            name={files.length > 0 ? "checkmark-circle" : "cloud-upload-outline"} 
            size={40} 
            color={files.length > 0 ? "#2ECC71" : "#CCC"} 
          />
          <Text style={[styles.uploadText, files.length > 0 && { color: '#333', fontWeight: 'bold' }]}>
            {files.length > 0 ? "Add Another File" : "Click to Select File"}
          </Text>
          <Text style={styles.uploadLimit}>maximum file size: 50 MB</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.publishBtn, loading && { opacity: 0.7 }]}
          onPress={handleUpload}
          disabled={loading}
        >
          {loading ? (
              <ActivityIndicator color="white" />
          ) : (
              <Text style={styles.publishText}>Publish</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {Platform.OS === 'web' && (
        <Modal
          visible={webPreviewVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setWebPreviewVisible(false)}
        >
          <View style={styles.previewBackdrop}>
            <View style={styles.previewCard}>
              <View style={styles.previewHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.previewTitle}>Preview</Text>
                  {webPreviewFileName ? (
                    <Text style={styles.previewSubtitle} numberOfLines={1}>
                      {webPreviewFileName}
                    </Text>
                  ) : null}
                </View>
                <View style={styles.previewActions}>
                  <TouchableOpacity onPress={() => window.open(webPreviewSourceUrl, '_blank')}>
                    <Ionicons name="open-outline" size={20} color="#003D79" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleWebDownloadLocal(webPreviewFile)}>
                    <Ionicons name="download-outline" size={20} color="#003D79" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setWebPreviewVisible(false)}>
                    <Ionicons name="close" size={20} color="#222" />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.previewBody}>
                {webPreviewIsOffice ? (
                  <View style={styles.previewFallback}>
                    <Ionicons name="document-text-outline" size={32} color="#666" />
                    <Text style={styles.previewFallbackText}>
                      Preview belum tersedia untuk file Office. Silakan Open atau Download.
                    </Text>
                  </View>
                ) : (
                  <iframe
                    src={webPreviewSourceUrl}
                    style={{ border: 'none', width: '100%', height: '100%' } as any}
                    title="File Preview"
                  />
                )}
              </View>
            </View>
          </View>
        </Modal>
      )}

      <Modal
        animationType="fade"
        transparent
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 50 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  label: { fontSize: 14, fontWeight: 'bold', marginTop: 20, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#DDD', borderRadius: 10, padding: 15, fontSize: 14 },
  uploadArea: { 
    borderWidth: 1, borderColor: '#DDD', borderStyle: 'dashed', 
    borderRadius: 15, height: 150, justifyContent: 'center', alignItems: 'center', marginTop: 10 
  },
  uploadText: { fontSize: 14, color: '#AAA', marginTop: 10, textAlign: 'center', paddingHorizontal: 10 },
  uploadLimit: { fontSize: 11, color: '#CCC', marginTop: 5 },
  publishBtn: { backgroundColor: '#003D79', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 40 },
  localFileItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 8, borderRadius: 5, marginBottom: 5, borderWidth: 1, borderColor: '#EEE' },
  publishText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  btnText: { color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  previewBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  previewCard: { width: '92%', height: '85%', backgroundColor: '#FFF', borderRadius: 14, overflow: 'hidden' },
  previewHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EEE' },
  previewTitle: { fontSize: 14, fontWeight: 'bold', color: '#111' },
  previewSubtitle: { fontSize: 11, color: '#666', marginTop: 2 },
  previewActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  previewBody: { flex: 1, backgroundColor: '#111' },
  previewFallback: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, gap: 10 },
  previewFallbackText: { color: '#DDD', textAlign: 'center', fontSize: 12 },
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
