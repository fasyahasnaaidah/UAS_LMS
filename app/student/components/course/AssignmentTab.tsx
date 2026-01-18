import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AssignmentTabProps {
  assignments: any[];
  formatDate: (date: string) => string;
  navigation: any;
}

export default function AssignmentTab({ assignments, formatDate, navigation }: AssignmentTabProps) {
  if (assignments.length === 0) {
    return (
      <Text style={{textAlign:'center', color:'gray', marginTop: 20}}>No assignments available for this course.</Text>
    );
  }

  return (
    <View>
      {assignments.map((item, index) => (
        <TouchableOpacity 
          key={item.id} 
          style={styles.card} 
          onPress={() => navigation.navigate('AssignmentDetailScreen', { material: item, type: 'assignment' })}
        >
          <View>
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
              <Text style={styles.cardTitle}>Assignment {index + 1}</Text>
              {item.submitted_at && <Text style={{fontSize:10, color:'green', fontWeight:'bold'}}>Done</Text>}
            </View>
            <Text style={styles.cardSub}>{item.title}</Text>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Ionicons name="clipboard-outline" size={14} color="gray" />
                <Text style={styles.cardInfo}>Assignment</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="calendar-outline" size={14} color={item.submission_id ? 'green' : 'red'} />
                <Text style={[styles.cardInfo, {color: item.submission_id ? 'green' : 'red'}]}>
                   Deadline: {formatDate(item.due_date)}
                </Text>
              </View>
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
