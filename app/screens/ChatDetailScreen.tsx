import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const Bubble = ({ text, time, position }: any) => (
  <View style={[styles.bubbleWrapper, position === 'right' ? { alignSelf: 'flex-end' } : { alignSelf: 'flex-start' }]}>
    <View style={[styles.bubble, position === 'right' ? styles.bubbleRight : styles.bubbleLeft]}>
      <Text style={[styles.bubbleText, position === 'right' && { color: 'white' }]}>{text}</Text>
      <Text style={[styles.bubbleTime, position === 'right' && { color: '#D1D1D1' }]}>{time}</Text>
    </View>
  </View>
);

export default function ChatDetailScreen({ navigation, route }: any) {
  const { title } = route.params;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerName}>{title}</Text>
        <View style={{width: 24}} /> 
      </View>

      <ScrollView contentContainerStyle={styles.chatContent}>
        <Bubble text="Good afternoon, sir. May I ask what the difference is between UI and UX?" time="13.00" position="left" />
        <Bubble text="So UX is more about 'how users feel', while UI is 'how it looks', right?" time="14.00" position="right" />
      </ScrollView>

      <View style={styles.inputBar}>
        <TextInput placeholder="Type a message..." style={styles.input} />
        <TouchableOpacity style={styles.sendBtn}>
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingBottom: 15, paddingTop: 50, backgroundColor: 'white' },
  headerName: { fontSize: 16, fontWeight: '700', color: '#003D79' },
  chatContent: { padding: 15 },
  bubbleWrapper: { marginBottom: 15, maxWidth: '80%' },
  bubble: { padding: 12, borderRadius: 18 },
  bubbleLeft: { backgroundColor: 'white', borderBottomLeftRadius: 2 },
  bubbleRight: { backgroundColor: '#003D79', borderBottomRightRadius: 2 },
  bubbleText: { fontSize: 14 },
  bubbleTime: { fontSize: 10, color: '#AAA', textAlign: 'right', marginTop: 4 },
  inputBar: { flexDirection: 'row', padding: 10, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#EEE' },
  input: { flex: 1, backgroundColor: '#F0F2F5', borderRadius: 24, paddingHorizontal: 15 },
  sendBtn: { backgroundColor: '#003D79', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginLeft: 10 }
});