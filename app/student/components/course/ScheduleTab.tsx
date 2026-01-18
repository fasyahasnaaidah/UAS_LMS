import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ScheduleTabProps {
  schedules: any[];
  formatDate: (date: string) => string;
  navigation: any;
}

export default function ScheduleTab({ schedules, formatDate, navigation }: ScheduleTabProps) {
  if (schedules.length === 0) {
    return (
      <Text style={{textAlign:'center', color:'gray', marginTop: 20}}>No schedules available for this course.</Text>
    );
  }

  return (
    <View>
      {schedules.map((item, index) => (
        <TouchableOpacity
          key={item.id}
          style={styles.card}
          onPress={() => navigation.navigate('ScheduleDetailScreen', { schedule: item })}
        >
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.cardTitle}>Session {index + 1}</Text>
            <Text style={{fontSize: 12, color: '#003D79', fontWeight: 'bold'}}>
              {formatDate(item.session_date)}
            </Text>
          </View>
          <Text style={styles.cardSub}>{item.session_topic}</Text>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="location-outline" size={14} color="gray" />
              <Text style={styles.cardInfo}>{item.location}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={14} color="gray" />
              <Text style={styles.cardInfo}>
                {new Date(item.session_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { 
    backgroundColor: 'white', 
    padding: 20, 
    borderRadius: 15, 
    marginBottom: 15, 
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: { fontWeight: 'bold', fontSize: 14 },
  cardSub: { color: 'gray', fontSize: 13, marginTop: 4 },
  infoRow: { flexDirection: 'row', marginTop: 12, gap: 20 },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  cardInfo: { fontSize: 12, color: 'gray' }
});
