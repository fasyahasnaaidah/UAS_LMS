import { API_URL } from '@/config/api';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View, Platform, TextInput } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as IntentLauncher from 'expo-intent-launcher';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function AssignmentDetailScreen({ navigation, route }: any) {
  const { material } = route.params;
  
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [submissionNote, setSubmissionNote] = useState('');
  
  const [submittedFiles, setSubmittedFiles] = useState<any[]>([]);
  const [assignmentData, setAssignmentData] = useState<any>(material);
  
  const [uploading, setUploading] = useState(false);
  const [webPreviewVisible, setWebPreviewVisible] = useState(false);
  const [webPreviewUrl, setWebPreviewUrl] = useState('');
  const [webPreviewSourceUrl, setWebPreviewSourceUrl] = useState('');
  const [webPreviewFileName, setWebPreviewFileName] = useState('');
  const [webPreviewFilePath, setWebPreviewFilePath] = useState('');
  const [webPreviewIsLocal, setWebPreviewIsLocal] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState<'success' | 'error'>('success');

  const isLate = assignmentData.due_date ? new Date() > new Date(assignmentData.due_date) : false;

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

  const fetchAssignmentStatus = useCallback(async () => {
      try {
          const token = await AsyncStorage.getItem('userToken');
          const response = await fetch(`${API_URL}/api/student/assignments/${material.id}/status`, {
              headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await response.json();
          if (response.ok) {
              setAssignmentData(data.assignment);
              setSubmittedFiles(data.submissions);
          }
      } catch (error) {
          console.error(error);
      }
  }, [material.id]);

  useEffect(() => {
      fetchAssignmentStatus();
  }, [fetchAssignmentStatus]);

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

  const getMimeType = (fileName: string) => {
    const ext = getFileExtension(fileName);
    switch (ext) {
      case 'pdf':
        return 'application/pdf';
      case 'zip':
        return 'application/zip';
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
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'txt':
        return 'text/plain';
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

  const openWebPreview = (fileUri: string, isLocal: boolean) => {
    const sourceUrl = isLocal ? fileUri : `${API_URL}${fileUri}`;
    const fileName = getCleanFileName(fileUri);
    const previewUrl = buildWebPreviewUrl(sourceUrl);
    setWebPreviewSourceUrl(sourceUrl);
    setWebPreviewFileName(fileName);
    setWebPreviewFilePath(fileUri);
    setWebPreviewIsLocal(isLocal);
    setWebPreviewUrl(previewUrl);
    setWebPreviewVisible(true);
  };

  const handleWebDownload = (sourceUrl: string, fileName: string) => {
    const anchor = document.createElement('a');
    anchor.href = sourceUrl;
    anchor.download = fileName || 'download';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const handleView = async (fileUri: string, isLocal: boolean = false) => {
      if (Platform.OS === 'web') {
          const fileName = getCleanFileName(fileUri);
          const ext = getFileExtension(fileName);
          if (officeExtensions.has(ext)) {
              if (isLocal) {
                  handleWebDownload(fileUri, fileName);
              } else {
                  await handleDownload(fileUri);
              }
              return;
          }
          openWebPreview(fileUri, isLocal);
          return;
      }

      try {
          let targetUri = fileUri;
          if (!isLocal) {
              const fileName = getCleanFileName(fileUri);
              const cacheUri = FileSystem.cacheDirectory + fileName;
              const url = `${API_URL}${fileUri}`;
              const downloadRes = await FileSystem.downloadAsync(url, cacheUri);
              targetUri = downloadRes.uri;
          }

          if (Platform.OS === 'android') {
              const contentUri = await FileSystem.getContentUriAsync(targetUri);
              const mimeType = getMimeType(getCleanFileName(fileUri));
              await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
                  data: contentUri,
                  flags: 1, 
                  ...(mimeType ? { type: mimeType } : {})
              });
          } else {
              await Sharing.shareAsync(targetUri);
          }
      } catch (e) {
          console.error(e);
          showModal("Error", "Gagal membuka file. Pastikan Anda memiliki aplikasi pembuka file yang sesuai.", "error");
      }
  };

  const handleDownload = async (filePath: string) => {
    const fileName = sanitizeFileName(getCleanFileName(filePath));
    const url = `${API_URL}${filePath}`;

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
            .catch(error => { console.log(error); showModal("Failed", "Gagal menyimpan file.", "error"); });
        } else {
          showModal("Failed", "Akses penyimpanan ditolak. Coba pilih folder lagi.", "error");
        }
      } else { Sharing.shareAsync(uri); }
    } catch (error) { console.error(error); showModal("Error", "Gagal mengunduh file.", "error"); }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['*/*'],
        copyToCacheDirectory: true,
        multiple: true 
      });
      if (!result.canceled) {
        setUploadedFiles(prev => [...prev, ...result.assets]);
      }
    } catch (err) { console.log(err); }
  };

  const removeLocalFile = (index: number) => {
      setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (uploadedFiles.length === 0) return;
    setUploading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const formData = new FormData();
      formData.append('assignmentId', material.id);
      formData.append('content', submissionNote);
      for (const file of uploadedFiles) {
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
            type: file.mimeType || 'application/octet-stream'
          } as any);
        }
      }

      const response = await fetch(`${API_URL}/api/student/assignments/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      const raw = await response.text();
      let data: any = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        data = { message: raw };
      }
      if (response.ok) {
        showModal("Success", isLate ? "Tugas berhasil dikumpulkan terlambat." : "Tugas berhasil dikumpulkan!", "success");
        setUploadedFiles([]); 
        fetchAssignmentStatus(); 
      } else {
        showModal("Failed", data.message || "Gagal mengupload tugas.", "error");
      }
    } catch (error) {
      console.error(error);
      showModal("Error", "Terjadi kesalahan koneksi.", "error");
    } finally {
      setUploading(false);
    }
  };

  const confirmCancelSubmission = () => {
    setCancelModalVisible(true);
  };

  const handleCancelSubmission = async () => {
      setCancelModalVisible(false);
      if (!material?.id) {
          showModal("Error", "Assignment ID tidak ditemukan.", "error");
          return;
      }
      try {
          const token = await AsyncStorage.getItem('userToken');
          const response = await fetch(`${API_URL}/api/student/assignments/${material.id}/submission`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token}` }
          });
          const raw = await response.text();
          let data: any = {};
          try {
              data = raw ? JSON.parse(raw) : {};
          } catch {
              data = { message: raw };
          }
          if (response.ok) {
              showModal("Cancelled", "Submission berhasil dibatalkan.", "success");
              fetchAssignmentStatus();
          } else {
              showModal("Failed", data.message || "Gagal membatalkan submission.", "error");
          }
      } catch (error) { console.error(error); }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color="white" /></TouchableOpacity>
        <Text style={styles.title}>{assignmentData.title}</Text>
        <Text style={styles.posted}>Due: {formatDate(assignmentData.due_date)}</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionHeader}>DESCRIPTION</Text>
        <View style={styles.divider} />
        <Text style={styles.description}>
          {assignmentData.description || assignmentData.content || "No additional description."}
        </Text>

        <View style={styles.taskCard}>
            <Text style={styles.taskTitle}>Your Submission</Text>
            {submittedFiles.length > 0 ? (
                <View style={{marginBottom: 15}}>
                    <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:10}}>
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                            <Ionicons name="checkmark-circle" size={20} color="green" />
                            <Text style={{color: 'green', fontWeight:'bold', marginLeft: 5}}>Submitted</Text>
                        </View>
                        {submittedFiles.find(s => s.score !== null && s.score !== undefined) && (
                            <View style={styles.scoreBadge}>
                                <Text style={styles.scoreBadgeText}>
                                    {submittedFiles.find(s => s.score !== null && s.score !== undefined).score}/100
                                </Text>
                            </View>
                        )}
                    </View>
                    {submittedFiles.map((file, idx) => {
                        const fileLate = file.submitted_at && assignmentData.due_date && new Date(file.submitted_at) > new Date(assignmentData.due_date);
                        return (
                            <View key={idx} style={styles.submittedItem}>
                                <Ionicons name="document-text" size={16} color="#555" />
                                <Text style={{flex:1, marginLeft:5, fontSize:12}} numberOfLines={1}>
                                    {getCleanFileName(file.file_path)}
                                </Text>
                                <View style={{flexDirection:'row', gap:10, marginRight: 5}}>
                                    <TouchableOpacity onPress={() => handleView(file.file_path)}>
                                        <Ionicons name="eye-outline" size={18} color="#003D79" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleDownload(file.file_path)}>
                                        <Ionicons name="download-outline" size={18} color="#003D79" />
                                    </TouchableOpacity>
                                </View>
                                {fileLate && <Text style={{fontSize:10, color:'red', fontWeight:'bold'}}>LATE</Text>}
                            </View>
                        );
                    })}
                    {!submittedFiles.find(s => s.score !== null && s.score !== undefined) && (
                        <TouchableOpacity style={[styles.addBtn, {marginTop: 15, borderColor: 'red'}]} onPress={confirmCancelSubmission}>
                            <Text style={{color: 'red'}}>Cancel / Remove Submission</Text>
                        </TouchableOpacity>
                    )}
                    {submittedFiles[0].content ? (
                        <View style={{marginTop: 15, padding: 12, backgroundColor: '#FAFAFA', borderRadius: 8, borderWidth: 1, borderColor: '#EEE'}}>
                            <View style={{flexDirection:'row', alignItems:'center', marginBottom: 4}}>
                              <Ionicons name="pencil-outline" size={14} color="#555" style={{ marginRight: 6 }} />
                              <Text style={{fontWeight:'bold', fontSize:12, color:'#555'}}>Your Note:</Text>
                            </View>
                            <Text style={{fontSize:13, color:'#333'}}>{submittedFiles[0].content}</Text>
                        </View>
                    ) : null}
                    {submittedFiles.find(s => s.feedback) && (
                        <View style={{marginTop: 15, backgroundColor: '#E3F2FD', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#BBDEFB'}}>
                            <View style={{flexDirection:'row', alignItems:'center', marginBottom: 5}}>
                              <Ionicons name="school-outline" size={14} color="#003D79" style={{ marginRight: 6 }} />
                              <Text style={{fontWeight:'bold', color:'#003D79'}}>Instructor Feedback:</Text>
                            </View>
                            <Text style={{color: '#333'}}>{submittedFiles.find(s => s.feedback).feedback}</Text>
                        </View>
                    )}
                </View>
            ) : (
                <View>
                    {isLate && (
                      <View style={{flexDirection:'row', alignItems:'center', marginBottom:10}}>
                        <Ionicons name="warning-outline" size={14} color="red" style={{ marginRight: 6 }} />
                        <Text style={{color:'red', fontWeight:'bold'}}>You are submitting LATE</Text>
                      </View>
                    )}
                    <Text style={styles.deadline}>Status: Not Submitted</Text>
                    {uploadedFiles.map((file, idx) => (
                        <View key={idx} style={styles.localFileItem}>
                            <View style={{flexDirection:'row', alignItems:'center', flex:1}}>
                              <Ionicons name="document-text-outline" size={14} color="#555" />
                              <Text style={{flex:1, marginLeft:5, fontSize:12}} numberOfLines={1}>{file.name}</Text>
                            </View>
                            <View style={{flexDirection:'row', gap:10}}>
                                <TouchableOpacity onPress={() => handleView(file.uri, true)}>
                                    <Ionicons name="eye-outline" size={20} color="#003D79" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => removeLocalFile(idx)}>
                                    <Ionicons name="close-circle" size={20} color="red" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                    <TouchableOpacity style={styles.addBtn} onPress={pickDocument}>
                        <Text style={styles.addText}>+ {uploadedFiles.length > 0 ? "Add Another File" : "Add File"}</Text>
                    </TouchableOpacity>
                    <View style={{marginTop: 10, marginBottom: 10}}>
                        <Text style={{fontSize: 12, fontWeight: 'bold', marginBottom: 5, color: '#555'}}>Note / Comment:</Text>
                        <TextInput 
                            style={{borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 10, height: 80, textAlignVertical: 'top'}}
                            placeholder="Write a note for the instructor here..."
                            multiline
                            value={submissionNote}
                            onChangeText={setSubmissionNote}
                        />
                    </View>
                    {uploadedFiles.length > 0 && (
                        <TouchableOpacity 
                            style={[styles.submitBtn, { backgroundColor: '#003D79' }]}
                            onPress={handleSubmit}
                            disabled={uploading}
                        >
                            <Text style={[styles.submitText, { color: 'white' }]}>
                                {uploading ? "Uploading..." : (isLate ? "Submit Late" : "Submit Assignment")}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
          </View>
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
                  <TouchableOpacity
                    onPress={() =>
                      webPreviewIsLocal
                        ? handleWebDownload(webPreviewSourceUrl, webPreviewFileName)
                        : handleDownload(webPreviewFilePath)
                    }
                  >
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
        visible={cancelModalVisible}
        onRequestClose={() => setCancelModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="alert-circle" size={50} color="#F44336" style={{ marginBottom: 15 }} />
            <Text style={styles.modalTitle}>Cancel Submission</Text>
            <Text style={styles.modalMessage}>
              Apakah Anda yakin ingin membatalkan pengumpulan? Semua file yang sudah diupload akan dihapus.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalBtn, styles.modalCancelBtn]} onPress={() => setCancelModalVisible(false)}>
                <Text style={styles.modalCancelText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, styles.modalDangerBtn]} onPress={handleCancelSubmission}>
                <Text style={styles.modalDangerText}>Yes, Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
            <TouchableOpacity style={styles.modalOkBtn} onPress={handleModalClose}>
              <Text style={styles.modalOkText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { backgroundColor: '#003D79', padding: 25, paddingTop: 50, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
  title: { color: 'white', fontSize: 22, fontWeight: 'bold', marginTop: 20 },
  posted: { color: '#CCC', fontSize: 12, marginTop: 5 },
  content: { padding: 25 },
  sectionHeader: { fontSize: 12, fontWeight: 'bold', color: 'black' },
  divider: { height: 1, backgroundColor: '#EEE', marginVertical: 10 },
  description: { fontSize: 14, color: '#555', lineHeight: 20 },
  taskCard: { marginTop: 40, padding: 20, backgroundColor: '#F9F9F9', borderRadius: 15, borderWidth: 1, borderColor: '#EEE' },
  taskTitle: { fontWeight: 'bold', fontSize: 14 },
  deadline: { color: 'red', fontSize: 11, marginBottom: 15 },
  addBtn: { borderStyle: 'dashed', borderWidth: 1, borderColor: '#CCC', padding: 12, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  addText: { color: 'gray', fontSize: 13 },
  submitBtn: { padding: 12, borderRadius: 10, alignItems: 'center' },
  submitText: { fontWeight: 'bold', textTransform: 'uppercase' },
  submittedItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9', padding: 8, borderRadius: 5, marginBottom: 5 },
  localFileItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 8, borderRadius: 5, marginBottom: 5, borderWidth: 1, borderColor: '#EEE' },
  scoreBadge: { backgroundColor: '#E3F2FD', borderColor: '#BBDEFB', borderWidth: 1, borderRadius: 12, paddingVertical: 4, paddingHorizontal: 8 },
  scoreBadgeText: { fontSize: 11, color: '#003D79', fontWeight: 'bold' },
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
    fontSize: 14, 
    color: '#666', 
    textAlign: 'center', 
    marginBottom: 20 
  },
  modalActions: { width: '100%', flexDirection: 'row', gap: 10 },
  modalBtn: { flex: 1, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center', minHeight: 44 },
  modalCancelBtn: { backgroundColor: '#EEE' },
  modalDangerBtn: { backgroundColor: '#F44336' },
  modalCancelText: { color: '#333', fontWeight: 'bold' },
  modalDangerText: { color: 'white', fontWeight: 'bold' },
  modalOkBtn: { width: '100%', padding: 12, borderRadius: 12, alignItems: 'center', backgroundColor: '#003D79' },
  modalOkText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});

