import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type TabKey = 'material' | 'assignment' | 'attendance';

export default function MaterialDetailScreen({ navigation, route }: any) {
  const title = route?.params?.title ?? 'Installation React Native';
  const [tab, setTab] = useState<TabKey>('material');

  const files = useMemo(() => ([
    { id: 'f1', name: 'Slide Material - Soft Run.ppt', size: '2.4 MB' },
    { id: 'f2', name: 'Panduan Instalasi.docx', size: '1.2 MB' },
  ]), []);

  const submissions = useMemo(() => ([
    { id: 's1', name: 'Muhammad Ramdan', time: '09.45 AM', value: 90, file: 'Tugas1.pdf' },
    { id: 's2', name: 'Fasya Hasna Aidah', time: '10.00 AM', value: 86, file: 'Tugas1.pdf' },
    { id: 's3', name: 'Andreas Julianto', time: '10.45 AM', value: 90, file: 'Tugas1.pdf' },
  ]), []);

  const students = useMemo(() => ([
    { id: 'a1', name: 'Muhammad Ramdan' },
    { id: 'a2', name: 'Fasya Hasna Aidah' },
    { id: 'a3', name: 'Andreas Julianto' },
    { id: 'a4', name: 'Iqbaal Ramadhan' },
    { id: 'a5', name: 'Erika Carlina' },
  ]), []);

  const [attendance, setAttendance] = useState<Record<string, 'H' | 'I' | 'S' | 'A'>>({
    a1: 'H', a2: 'I', a3: 'H', a4: 'S', a5: 'A'
  });

  const setStatus = (id: string, val: 'H' | 'I' | 'S' | 'A') => setAttendance(p => ({ ...p, [id]: val }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={styles.meeting}>Pertemuan Pertama</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.sub}>January 12, 2024 | 8:00 AM - 11:30 AM</Text>
        </View>
      </View>

      <View style={styles.tabs}>
        <TabBtn label="Material" active={tab === 'material'} onPress={() => setTab('material')} />
        <TabBtn label="Assignment Submission" active={tab === 'assignment'} onPress={() => setTab('assignment')} />
        <TabBtn label="Attendance" active={tab === 'attendance'} onPress={() => setTab('attendance')} />
      </View>

      {/* CONTENT */}
      {tab === 'material' && (
        <View style={styles.content}>
          <Text style={styles.section}>Meeting Description</Text>
          <Text style={styles.desc}>
            At this meeting, students are expected to be able to correctly install React Native CLI, JDK, and Android Studio.
          </Text>

          <View style={{ marginTop: 12 }}>
            {files.map(f => (
              <View key={f.id} style={styles.fileRow}>
                <View style={styles.fileIcon}>
                  <Ionicons name="document-text-outline" size={18} color="#003D79" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.fileName} numberOfLines={1}>{f.name}</Text>
                  <Text style={styles.fileSize}>{f.size}</Text>
                </View>
                <TouchableOpacity>
                  <Ionicons name="download-outline" size={18} color="#6B7280" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.fabSmall} onPress={() => navigation.navigate('UploadMaterial')}>
            <Text style={styles.fabText}>+ add material</Text>
          </TouchableOpacity>
        </View>
      )}

      {tab === 'assignment' && (
        <View style={styles.content}>
          <View style={styles.topRow}>
            <Text style={styles.section}>Collection List (3/30 Students)</Text>
            <TouchableOpacity style={styles.downloadAll}>
              <Text style={styles.downloadAllText}>Download All (.zip)</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.table}>
            <View style={[styles.trow, styles.thead]}>
              <Text style={[styles.th, { flex: 2 }]}>Student Name</Text>
              <Text style={[styles.th, { flex: 1 }]}>Delivery Time</Text>
              <Text style={[styles.th, { flex: 1 }]}>Value</Text>
              <Text style={[styles.th, { flex: 1 }]}>Assignment</Text>
            </View>

            {submissions.map(s => (
              <View key={s.id} style={styles.trow}>
                <Text style={[styles.td, { flex: 2 }]} numberOfLines={1}>{s.name}</Text>
                <Text style={[styles.td, { flex: 1 }]}>{s.time}</Text>
                <Text style={[styles.td, { flex: 1 }]}>{s.value}</Text>
                <Text style={[styles.tdLink, { flex: 1 }]}>{s.file}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {tab === 'attendance' && (
        <View style={styles.content}>
          <View style={styles.table}>
            <View style={[styles.trow, styles.thead]}>
              <Text style={[styles.th, { flex: 2 }]}>Student Name</Text>
              <Text style={[styles.th, { flex: 2 }]}>Attendance Status</Text>
            </View>

            {students.map(st => (
              <View key={st.id} style={styles.trow}>
                <Text style={[styles.td, { flex: 2 }]} numberOfLines={1}>{st.name}</Text>

                <View style={[styles.statusRow, { flex: 2 }]}>
                  {(['H','I','S','A'] as const).map(code => (
                    <TouchableOpacity key={code} style={styles.radioWrap} onPress={() => setStatus(st.id, code)}>
                      <View style={[styles.radio, attendance[st.id] === code && styles.radioOn]} />
                      <Text style={styles.radioLabel}>{code}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.saveBtn}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

function TabBtn({ label, active, onPress }: any) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.tab, active && styles.tabActive]}>
      <Text style={[styles.tabText, active && styles.tabTextActive]} numberOfLines={1}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  header: { paddingTop: 54, paddingHorizontal: 16, paddingBottom: 10, flexDirection: 'row', gap: 12 },
  backBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  meeting: { fontSize: 12, color: '#9CA3AF' },
  title: { fontSize: 18, fontWeight: '900', color: '#111827', marginTop: 2 },
  sub: { fontSize: 12, color: '#9CA3AF', marginTop: 4 },

  tabs: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingVertical: 10 },
  tab: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999, backgroundColor: '#E5E7EB' },
  tabActive: { backgroundColor: '#003D79' },
  tabText: { fontSize: 11, fontWeight: '800', color: '#6B7280' },
  tabTextActive: { color: 'white' },

  content: { flex: 1, padding: 16 },

  section: { fontSize: 12, fontWeight: '900', color: '#111827', marginBottom: 6 },
  desc: { fontSize: 12, color: '#6B7280', lineHeight: 17 },

  fileRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  fileIcon: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' },
  fileName: { fontWeight: '800', color: '#111827', fontSize: 12 },
  fileSize: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },

  fabSmall: { position: 'absolute', right: 16, bottom: 16, backgroundColor: '#003D79', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999 },
  fabText: { color: 'white', fontWeight: '900', fontSize: 12 },

  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  downloadAll: { backgroundColor: '#003D79', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999 },
  downloadAllText: { color: 'white', fontWeight: '900', fontSize: 11 },

  table: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, overflow: 'hidden' },
  trow: { flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', backgroundColor: 'white' },
  thead: { backgroundColor: '#F9FAFB' },
  th: { fontSize: 11, fontWeight: '900', color: '#6B7280' },
  td: { fontSize: 11, color: '#111827' },
  tdLink: { fontSize: 11, color: '#003D79', fontWeight: '800' },

  statusRow: { flexDirection: 'row', gap: 14, justifyContent: 'flex-end', alignItems: 'center' },
  radioWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  radio: { width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: '#9CA3AF' },
  radioOn: { backgroundColor: '#003D79', borderColor: '#003D79' },
  radioLabel: { fontSize: 11, color: '#6B7280', fontWeight: '800' },

  saveBtn: { alignSelf: 'flex-end', marginTop: 14, backgroundColor: '#374151', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 999 },
  saveText: { color: 'white', fontWeight: '900', fontSize: 12 },
});
