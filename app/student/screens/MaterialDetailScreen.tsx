import { API_URL } from '@/config/api';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as IntentLauncher from 'expo-intent-launcher';


export default function MaterialDetailScreen({ navigation, route }: any) {
  const { material } = route.params;
  const [downloading, setDownloading] = useState(false);
  const [webPreviewVisible, setWebPreviewVisible] = useState(false);
  const [webPreviewUrl, setWebPreviewUrl] = useState('');
  const [webPreviewSourceUrl, setWebPreviewSourceUrl] = useState('');
  const [webPreviewFileName, setWebPreviewFileName] = useState('');
  const [webPreviewFilePath, setWebPreviewFilePath] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState<'success' | 'error'>('success');

  const getCleanFileName = (filePath: string) => {
      if (!filePath) return 'File';
      const fullName = filePath.split('/').pop() || '';
      let decodedName = fullName;
      try { decodedName = decodeURIComponent(fullName); } catch {}
      const parts = decodedName.split('-');
      if (parts.length > 1) { return parts.slice(1).join('-'); }
      return decodedName;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const officeExtensions = useMemo(
    () => new Set(['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx']),
    []
  );

  const getFileExtension = (value: string) => {
    if (!value) return '';
    const clean = value.split('?')[0].split('#')[0];
    const last = clean.split('.').pop() || '';
    return last.toLowerCase();
  };

  const sanitizeFileName = (value: string) => {
    if (!value) return 'downloaded_file';
    const cleaned = value
      .replace(/[\\/:*?"<>|]/g, '_')
      .replace(/\s+/g, '_')
      .replace(/_+/g, '_')
      .replace(/_+$/g, '')
      .trim();
    return cleaned || 'downloaded_file';
  };

  const normalizeMaterialPath = (value: string) => {
    if (!value) return value;
    if (value.startsWith('/uploads/materials/')) return value;
    if (value.startsWith('/uploads/')) {
      return value.replace('/uploads/', '/uploads/materials/');
    }
    return `/uploads/materials/${value.replace(/^\/+/, '')}`;
  };

  const getMimeType = (fileName: string) => {
    const ext = getFileExtension(fileName);
    switch (ext) {
      case 'pdf':
        return 'application/pdf';
      case 'doc':
        return 'application/msword';
      case 'docx':
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      case 'ppt':
        return 'application/vnd.ms-powerpoint';
      case 'pptx':
        return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
      case 'xls':
        return 'application/vnd.ms-excel';
      case 'xlsx':
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      default:
        return undefined;
    }
  };

  const buildWebPreviewUrl = (sourceUrl: string) => sourceUrl;

  const showModal = (title: string, message: string, type: 'success' | 'error') => {
    setModalTitle(title);
    setModalMessage(message);
    setModalType(type);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const openWebPreview = (fileUri: string) => {
    const normalizedPath = normalizeMaterialPath(fileUri);
    const sourceUrl = `${API_URL}${normalizedPath}`;
    const fileName = getCleanFileName(normalizedPath);
    const previewUrl = buildWebPreviewUrl(sourceUrl);
    setWebPreviewSourceUrl(sourceUrl);
    setWebPreviewFileName(fileName);
    setWebPreviewFilePath(normalizedPath);
    setWebPreviewUrl(previewUrl);
    setWebPreviewVisible(true);
  };

  const handleView = async (fileUri: string) => {
      const normalizedPath = normalizeMaterialPath(fileUri);
      if (Platform.OS === 'web') {
        const fileName = getCleanFileName(normalizedPath);
        const ext = getFileExtension(fileName);
        if (officeExtensions.has(ext)) {
          await handleDownload(normalizedPath);
          return;
        }
        openWebPreview(normalizedPath);
        return;
      }

      try {
          setDownloading(true);
          const fileName = getCleanFileName(normalizedPath);
          const cacheUri = FileSystem.cacheDirectory + fileName;
          const url = `${API_URL}${normalizedPath}`;
          
          const downloadRes = await FileSystem.downloadAsync(url, cacheUri);
          if (downloadRes.status && downloadRes.status >= 400) {
            throw new Error(`Download failed with status ${downloadRes.status}`);
          }
          setDownloading(false);

          if (Platform.OS === 'android') {
              const contentUri = await FileSystem.getContentUriAsync(downloadRes.uri);
              const mimeType = getMimeType(fileName);
              await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
                  data: contentUri,
                  flags: 1,
                  ...(mimeType ? { type: mimeType } : {})
              });
          } else {
              await Sharing.shareAsync(downloadRes.uri);
          }
      } catch (e) {
          console.error(e);
          setDownloading(false);
          showModal("Error", "Gagal membuka file. Pastikan Anda memiliki aplikasi pembuka file yang sesuai.", "error");
      }
  };

  const handleDownload = async (filePath: string) => {
    const normalizedPath = normalizeMaterialPath(filePath);
    const fileName = sanitizeFileName(getCleanFileName(normalizedPath));
    const url = `${API_URL}${normalizedPath}`;

    if (Platform.OS === 'web') {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = blobUrl;
        anchor.download = fileName || 'download';
        anchor.style.display = 'none';
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        window.URL.revokeObjectURL(blobUrl);
      } catch {
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = fileName;
        anchor.style.display = 'none';
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
      }
      return;
    }

    const fileUri = FileSystem.documentDirectory + (fileName || 'downloaded_file');

    setDownloading(true);
    try {
      const { uri } = await FileSystem.downloadAsync(url, fileUri);
      if (Platform.OS === 'android') {
        const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (permissions.granted) {
          const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
          const mimeType = getMimeType(fileName) || 'application/octet-stream';
          await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, fileName, mimeType)
            .then(async (createdUri) => {
              await FileSystem.writeAsStringAsync(createdUri, base64, { encoding: FileSystem.EncodingType.Base64 });
              showModal("Success", "File berhasil disimpan di folder yang dipilih.", "success");
            })
            .catch(e => { console.log(e); showModal("Failed", "Gagal menyimpan file.", "error"); });
        } else {
          showModal("Failed", "Akses penyimpanan ditolak. Coba pilih folder lagi.", "error");
        }
      } else { Sharing.shareAsync(uri); }
    } catch (e) { console.error(e); showModal("Error", "Gagal mengunduh file.", "error"); } finally { setDownloading(false); }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color="white" /></TouchableOpacity>
        <Text style={styles.title}>{material.title}</Text>
        <Text style={styles.posted}>Posted: {formatDate(material.uploaded_at)}</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionHeader}>DESCRIPTION</Text>
        <View style={styles.divider} />
        <Text style={styles.description}>
          {material.description || material.content || "No additional description."}
        </Text>

        <Text style={[styles.sectionHeader, { marginTop: 30 }]}>ATTACHMENT</Text>
        {material.files && material.files.length > 0 ? (
          material.files.map((file: any, idx: number) => (
            <AttachmentItem
              key={`${file.file_path}-${idx}`}
              name={getCleanFileName(file.file_path)}
              size={downloading ? "Downloading..." : "View / Download"}
              onDownload={() => !downloading && handleDownload(file.file_path)}
              onView={() => handleView(file.file_path)}
            />
          ))
        ) : material.file_path ? (
          <AttachmentItem
            name={getCleanFileName(material.file_path)}
            size={downloading ? "Downloading..." : "View / Download"}
            onDownload={() => !downloading && handleDownload(material.file_path)}
            onView={() => handleView(material.file_path)}
          />
        ) : (
          <Text style={{color: 'gray', fontStyle: 'italic', marginTop: 10}}>No file attached.</Text>
        )}
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
                  <TouchableOpacity onPress={() => handleDownload(webPreviewFilePath)}>
                    <Ionicons name="download-outline" size={20} color="#003D79" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setWebPreviewVisible(false)}>
                    <Ionicons name="close" size={20} color="#222" />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.previewBody}>
                <iframe
                  src={webPreviewUrl}
                  style={{ border: 'none', width: '100%', height: '100%' } as any}
                  title="File Preview"
                />
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
              <Text style={styles.modalBtnText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const AttachmentItem = ({ name, size, onDownload, onView }: any) => (
  <View style={styles.attachBox}>
    <View style={styles.fileIcon}>
      <Ionicons name="document-text-outline" size={24} color="#003D79" />
    </View>
    <View style={{ flex: 1, marginLeft: 15 }}>
      <Text style={styles.fileName}>{name}</Text>
      <Text style={styles.fileSize}>{size}</Text>
    </View>
    <View style={{flexDirection: 'row', gap: 15}}>
        <TouchableOpacity onPress={onView}>
            <Ionicons name="eye-outline" size={22} color="#003D79" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDownload}>
            <Ionicons name="download-outline" size={22} color="#003D79" />
        </TouchableOpacity>
    </View>
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
  previewBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  previewCard: { width: '92%', height: '85%', backgroundColor: '#FFF', borderRadius: 14, overflow: 'hidden' },
  previewHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EEE' },
  previewTitle: { fontSize: 14, fontWeight: 'bold', color: '#111' },
  previewSubtitle: { fontSize: 11, color: '#666', marginTop: 2 },
  previewActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  previewBody: { flex: 1, backgroundColor: '#111' },
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
  },
  modalBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});
