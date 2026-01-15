import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MaterialListScreen({ navigation }: any) {
  // Data dummy untuk list materi
  const materials = [
    {
      id: 1,
      title: "Pertemuan Pertama (4 Sks)",
      sub: "Installation React Native",
      mod: "5 Modul",
    },
    {
      id: 2,
      title: "Pertemuan Kedua (4 Sks)",
      sub: "Using API",
      mod: "3 Modul",
    },
    {
      id: 3,
      title: "Pertemuan Ketiga (4 Sks)",
      sub: "Using Side Menu & Tab",
      mod: "10 Modul",
    }
  ];

  return (
    <View style={styles.container}>
      {/* Header Biru Melengkung */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Android Mobile Programming</Text>
        <Text style={styles.subTitle}>Dosen : [0329077103] - Masria, M.Kom.</Text>
      </View>
      
      {/* Tabs Menu */}
      <View style={styles.tabs}>
        <TouchableOpacity style={styles.activeTab}>
          <Text style={{color:'white', fontWeight: 'bold'}}>material</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={{color: 'gray'}}>Attendance</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={{color: 'gray'}}>Value Details</Text>
        </TouchableOpacity>
      </View>

      {/* Daftar Materi */}
      <ScrollView contentContainerStyle={{padding: 20}}>
        {materials.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.card} 
            onPress={() => navigation.navigate('MaterialDetail', { title: item.sub })}
          >
            <View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSub}>{item.sub}</Text>
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Ionicons name="copy-outline" size={14} color="gray" />
                  <Text style={styles.cardInfo}>{item.mod}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Ionicons name="time-outline" size={14} color="gray" />
                  <Text style={styles.cardInfo}>2h 30m</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { 
    backgroundColor: '#003D79', 
    padding: 25, 
    paddingTop: 50, 
    borderBottomLeftRadius: 35, 
    borderBottomRightRadius: 35 
  },
  title: { color: 'white', fontSize: 22, fontWeight: 'bold', marginTop: 15 },
  subTitle: { color: '#CCC', fontSize: 13, marginTop: 5 },
  tabs: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    gap: 10,
    marginTop: 25 
  },
  activeTab: { 
    backgroundColor: '#003D79', 
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    borderRadius: 20 
  },
  tab: { 
    backgroundColor: '#E0E0E0', 
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    borderRadius: 20 
  },
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