import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function DashboardScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.topRow}>
          <View>
            <Text style={styles.hi}>Halo, Ahmad! 👋</Text>
            <Text style={styles.subHi}>Continue Your Journey And Achieve Your Target.</Text>
          </View>
          <Ionicons name="notifications-outline" size={24} color="white" />
        </View>
        <View style={styles.search}>
          <TextInput placeholder="Search for a course..." style={{flex: 1}} />
          <Ionicons name="search" size={20} color="gray" />
        </View>
      </View>

      <ScrollView style={{padding: 20}}>
        <View style={styles.progCard}>
          <Text style={styles.cardHeader}>Learning Progress</Text>
          <ProgressItem label="Android Mobile Programming" val="5/10" per={0.5} />
          <ProgressItem label="UI/UX Design Fundamental" val="8/10" per={0.8} />
        </View>

        <TouchableOpacity 
          style={styles.schCard} 
          onPress={() => navigation.navigate('Class')}
        >
          <View>
            <Text style={styles.schTitle}>Today's class schedule</Text>
            <Text style={styles.schSub}>Fullstack Web Developer</Text>
          </View>
          <View style={styles.badge}><Text style={styles.badgeText}>18.30 - 21.45 WIB</Text></View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const ProgressItem = ({label, val, per}: any) => (
  <View style={{marginBottom: 15}}>
    <View style={{flexDirection:'row', justifyContent:'space-between'}}><Text style={{fontSize: 12}}>{label}</Text><Text style={{fontSize: 12}}>{val}</Text></View>
    <View style={styles.barBg}><View style={[styles.barFill, {width: `${per*100}%`}]} /></View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { backgroundColor: '#003D79', padding: 25, paddingTop: 50, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  hi: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  subHi: { color: '#CCC', fontSize: 11 },
  search: { backgroundColor: 'white', flexDirection: 'row', padding: 12, borderRadius: 25, alignItems: 'center' },
  progCard: { backgroundColor: 'white', padding: 20, borderRadius: 15, elevation: 3 },
  cardHeader: { fontWeight: 'bold', marginBottom: 15 },
  barBg: { height: 8, backgroundColor: '#EEE', borderRadius: 5, marginTop: 5 },
  barFill: { height: 8, backgroundColor: '#2ECC71', borderRadius: 5 },
  schCard: { backgroundColor: '#003D79', marginTop: 20, padding: 20, borderRadius: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  schTitle: { color: 'white', fontWeight: 'bold' },
  schSub: { color: '#CCC', fontSize: 12 },
  badge: { backgroundColor: 'white', padding: 8, borderRadius: 10 },
  badgeText: { fontSize: 10, fontWeight: 'bold', color: '#003D79' }
});