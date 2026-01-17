import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

function Bubble({ text, time, position }: any) {
  const isRight = position === 'right';
  return (
    <View style={[styles.bubbleRow, isRight ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' }]}>
      {!isRight && <View style={styles.avatarSmall} />}
      <View style={[styles.bubble, isRight ? styles.bubbleRight : styles.bubbleLeft]}>
        <Text style={[styles.bubbleText, isRight && { color: 'white' }]}>{text}</Text>
        <Text style={[styles.bubbleTime, isRight && { color: '#D1D1D1' }]}>{time}</Text>
      </View>
      {isRight && <View style={styles.statusDot} />}
    </View>
  );
}

export default function ChatDetailScreen({ navigation, route }: any) {
  const title = route?.params?.title ?? 'Chat';
  const scrollRef = useRef<ScrollView>(null);

  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState([
    { id: '1', text: 'Good afternoon, sir. May I ask what the difference is between UI and UX?', time: '13.00', position: 'left' },
    { id: '2', text: "It's simple, Alya. UX stands for User Experience, which focuses on the user's experience when using an application or website.", time: '13.30', position: 'right' },
    { id: '3', text: 'UX is a process, not just about creating cool appearance. Always think about the user first.', time: '13.30', position: 'right' },
    { id: '4', text: "So UX is more about 'how users feel', while UI is 'how it looks', right?", time: '14.00', position: 'left' },
    { id: '5', text: 'That’s right! UX is like the foundation, UI is the paint and decoration. Both must work together.', time: '16.04', position: 'right' },
  ]);

  const onlineText = useMemo(() => '4 Online, 12 Offline', []);

  const onSend = () => {
    const t = msg.trim();
    if (!t) return;
    setMessages((prev) => [
      ...prev,
      { id: String(Date.now()), text: t, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), position: 'right' },
    ]);
    setMsg('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={styles.headerName} numberOfLines={1}>{title}</Text>
          <Text style={styles.headerSub}>{onlineText}</Text>
        </View>

        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="ellipsis-vertical" size={18} color="#111827" />
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((m) => (
          <Bubble key={m.id} text={m.text} time={m.time} position={m.position} />
        ))}
      </ScrollView>

      <View style={styles.inputBar}>
        <TouchableOpacity style={styles.leftIcon}>
          <Ionicons name="happy-outline" size={22} color="#9CA3AF" />
        </TouchableOpacity>

        <View style={styles.inputWrap}>
          <TextInput
            placeholder="Write a message..."
            placeholderTextColor="#9CA3AF"
            style={styles.input}
            value={msg}
            onChangeText={setMsg}
            multiline
          />
          <TouchableOpacity style={styles.attachBtn}>
            <Ionicons name="attach-outline" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.micBtn} onPress={onSend}>
          <Ionicons name={msg.trim() ? 'send' : 'mic'} size={20} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  header: {
    paddingTop: 54,
    paddingBottom: 12,
    paddingHorizontal: 14,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  headerName: { fontSize: 14, fontWeight: '900', color: '#003D79' },
  headerSub: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },

  chatContent: { padding: 14, paddingBottom: 20 },

  bubbleRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 14, gap: 10 },
  avatarSmall: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#E5E7EB' },
  statusDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#22C55E', marginLeft: 2 },

  bubble: { maxWidth: '78%', padding: 12, borderRadius: 16 },
  bubbleLeft: { backgroundColor: '#F3F4F6', borderTopLeftRadius: 6 },
  bubbleRight: { backgroundColor: '#003D79', borderTopRightRadius: 6 },
  bubbleText: { fontSize: 13, color: '#111827', lineHeight: 18 },
  bubbleTime: { fontSize: 10, color: '#6B7280', textAlign: 'right', marginTop: 6 },

  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: 'white',
  },
  leftIcon: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },

  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F3F4F6',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  input: { flex: 1, maxHeight: 90, fontSize: 13, color: '#111827' },
  attachBtn: { paddingBottom: 2 },

  micBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#003D79',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
