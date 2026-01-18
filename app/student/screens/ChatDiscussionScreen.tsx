import { API_URL } from '@/config/api';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';


const Bubble = ({ text, time, position, sender, isTeacher }: any) => (
  <View style={[styles.bubbleWrapper, position === 'right' ? { alignSelf: 'flex-end' } : { alignSelf: 'flex-start' }]}>
    <View style={styles.senderRow}>
      <Text style={[styles.senderText, position === 'right' && styles.senderTextRight]}>{sender}</Text>
      {isTeacher && position === 'left' ? (
        <View style={styles.teacherBadge}>
          <Text style={styles.teacherBadgeText}>Instructor</Text>
        </View>
      ) : null}
    </View>
    <View style={[styles.bubble, position === 'right' ? styles.bubbleRight : styles.bubbleLeft]}>
      <Text style={[styles.bubbleText, position === 'right' && { color: 'white' }]}>{text}</Text>
      <Text style={[styles.bubbleTime, position === 'right' && { color: '#D1D1D1' }]}>{time}</Text>
    </View>
  </View>
);

export default function ChatDiscussionScreen({ navigation, route }: any) {
  const { title, courseId, studentCount } = route.params;
  const courseInitial = String(title || '').charAt(0);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const scrollViewRef = useRef<ScrollView | null>(null);

  const fetchCurrentUser = useCallback(async (token: string) => {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (response.ok) {
      const data = await response.json();
      setCurrentUserId(data.id);
    }
  }, []);

  const fetchMessages = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token || !courseId) return;
      await fetchCurrentUser(token);

      const response = await fetch(`${API_URL}/api/student/discussions/course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [courseId, fetchCurrentUser]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const formatTime = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '-';
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  const getDayLabel = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '';
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMessageDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diffDays = Math.floor((startOfToday.getTime() - startOfMessageDay.getTime()) / 86400000);
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const sendMessage = useCallback(async () => {
    const trimmed = inputText.trim();
    if (!trimmed || !courseId || sending) return;
    try {
      setSending(true);
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      const response = await fetch(`${API_URL}/api/student/discussions/course/${courseId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: trimmed })
      });

      if (response.ok) {
        const newMessage = await response.json();
        setMessages((prev) => [...prev, newMessage]);
        setInputText('');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSending(false);
    }
  }, [courseId, inputText, sending]);

  const participantCount = Number.isFinite(Number(studentCount)) ? Number(studentCount) + 1 : null;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.headerAvatar}>
            <Text style={styles.headerAvatarText}>{courseInitial}</Text>
          </View>
          <View style={styles.headerTextBlock}>
            <Text style={styles.headerName}>{title}</Text>
            {participantCount !== null && (
              <Text style={styles.participantText}>{participantCount} Participants</Text>
            )}
          </View>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#003D79" />
        </View>
      ) : (
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.chatContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: false })}
        >
          {messages.length === 0 ? (
            <Text style={styles.emptyText}>Belum ada diskusi</Text>
          ) : (
            messages.map((msg, index) => {
              const position = currentUserId && msg.user_id === currentUserId ? 'right' : 'left';
              const senderName = msg.sender_name || 'Unknown';
              const isTeacher = msg.sender_role === 'teacher';
              const currentDayLabel = getDayLabel(msg.posted_at);
              const prevDayLabel = index > 0 ? getDayLabel(messages[index - 1].posted_at) : '';
              return (
                <View key={msg.id}>
                  {currentDayLabel && currentDayLabel !== prevDayLabel ? (
                    <View style={styles.daySeparator}>
                      <Text style={styles.daySeparatorText}>{currentDayLabel}</Text>
                    </View>
                  ) : null}
                  <Bubble
                    text={msg.message}
                    time={formatTime(msg.posted_at)}
                    position={position}
                    sender={position === 'right' ? 'You' : senderName}
                    isTeacher={isTeacher}
                  />
                </View>
              );
            })
          )}
        </ScrollView>
      )}

      <View style={styles.inputBar}>
        <TextInput
          placeholder="Type a message..."
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage} disabled={sending}>
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  header: { paddingHorizontal: 15, paddingTop: 50, paddingBottom: 12, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#EEE' },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  headerAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#E8F0FE', justifyContent: 'center', alignItems: 'center', marginLeft: 12, marginRight: 10 },
  headerAvatarText: { fontSize: 18, fontWeight: 'bold', color: '#003D79' },
  headerTextBlock: { flex: 1 },
  headerName: { fontSize: 16, fontWeight: '700', color: '#003D79' },
  participantText: { color: '#999', fontSize: 12, marginTop: 4 },
  chatContent: { padding: 15 },
  bubbleWrapper: { marginBottom: 15, maxWidth: '80%' },
  bubble: { padding: 12, borderRadius: 18 },
  bubbleLeft: { backgroundColor: 'white', borderBottomLeftRadius: 2 },
  bubbleRight: { backgroundColor: '#003D79', borderBottomRightRadius: 2 },
  bubbleText: { fontSize: 14 },
  bubbleTime: { fontSize: 10, color: '#AAA', textAlign: 'right', marginTop: 4 },
  senderRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  senderText: { fontSize: 11, color: '#666' },
  senderTextRight: { alignSelf: 'flex-end' },
  teacherBadge: { backgroundColor: '#E8F0FE', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 },
  teacherBadgeText: { fontSize: 10, color: '#003D79', fontWeight: '700' },
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { textAlign: 'center', color: 'gray', marginTop: 20 },
  daySeparator: { alignSelf: 'center', backgroundColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, marginVertical: 10 },
  daySeparatorText: { fontSize: 11, color: '#555', fontWeight: '600' },
  inputBar: { flexDirection: 'row', padding: 10, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#EEE' },
  input: { flex: 1, backgroundColor: '#F0F2F5', borderRadius: 24, paddingHorizontal: 15 },
  sendBtn: { backgroundColor: '#003D79', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginLeft: 10 }
});
