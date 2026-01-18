import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

export default function AssignmentTab({ assignments, formatDate }: any) {

  const renderItem = ({ item, index }: any) => (
    <View 
      key={item.id} 
      style={styles.card} 
    >
      <View>
        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
          <Text style={styles.cardTitle}>Assignment {index + 1}</Text>
        </View>
        <Text style={styles.cardSub}>{item.title}</Text>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="clipboard-outline" size={14} color="gray" />
            <Text style={styles.cardInfo}>Assignment</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="calendar-outline" size={14} color="red" />
            <Text style={[styles.cardInfo, {color: 'red'}]}>
               Deadline: {formatDate(item.due_date)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
       <Text style={styles.text}>Assignments</Text>
       <Text style={styles.subText}>List of assignments given to students.</Text>
       
       {assignments.length === 0 ? (
          <Text style={{color: 'gray', fontStyle: 'italic', marginTop: 10}}>No assignments created yet.</Text>
       ) : (
          <FlatList
            data={assignments}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            contentContainerStyle={{marginTop: 15}}
          />
       )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 0 },
  text: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  subText: { fontSize: 14, color: '#666', marginTop: 5 },
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
    borderWidth: 1, borderColor: '#F0F0F0'
  },
  cardTitle: { fontWeight: 'bold', fontSize: 14 },
  cardSub: { color: 'gray', fontSize: 13, marginTop: 4 },
  infoRow: { flexDirection: 'row', marginTop: 12, gap: 20 },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  cardInfo: { fontSize: 12, color: 'gray' }
});
