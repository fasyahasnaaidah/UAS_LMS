import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MaterialTabProps {
  materials: any[];
  formatDate: (date: string) => string;
  navigation: any;
}

export default function MaterialTab({ materials, formatDate, navigation }: MaterialTabProps) {
  const groupedMaterials = useMemo(() => {
    const groups: { [key: string]: any } = {};
    materials.forEach((item) => {
      const dayKey = new Date(item.uploaded_at).toISOString().slice(0, 10);
      const groupKey = `${dayKey}__${item.title}__${item.content || ''}`;
      if (!groups[groupKey]) {
        groups[groupKey] = {
          id: item.id,
          title: item.title,
          content: item.content,
          uploaded_at: item.uploaded_at,
          files: []
        };
      }
      groups[groupKey].files.push({
        id: item.id,
        file_path: item.file_path,
        uploaded_at: item.uploaded_at
      });
      if (new Date(item.uploaded_at) < new Date(groups[groupKey].uploaded_at)) {
        groups[groupKey].uploaded_at = item.uploaded_at;
      }
    });
    const grouped = Object.values(groups);
    grouped.sort((a: any, b: any) => new Date(a.uploaded_at).getTime() - new Date(b.uploaded_at).getTime());
    return grouped;
  }, [materials]);

  const groupedByDate = useMemo(() => {
    const groups: { [key: string]: any[] } = {};
    groupedMaterials.forEach((item: any) => {
      const date = new Date(item.uploaded_at).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'long', year: 'numeric'
      });
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(item);
    });
    const ordered: { [key: string]: any[] } = {};
    Object.keys(groups)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      .forEach((key) => {
        ordered[key] = groups[key];
      });
    return ordered;
  }, [groupedMaterials]);

  if (materials.length === 0) {
    return (
      <Text style={{textAlign:'center', color:'gray', marginTop: 20}}>No materials available for this course.</Text>
    );
  }

  return (
    <View>
      {Object.keys(groupedByDate).map((date) => (
        <View key={date} style={styles.dateGroup}>
          <View style={styles.dateHeaderContainer}>
            <Ionicons name="calendar-outline" size={16} color="#003D79" />
            <Text style={styles.dateHeader}>{date}</Text>
          </View>
          <View style={styles.groupContent}>
            {groupedByDate[date].map((item: any, index: number) => (
              <TouchableOpacity 
                key={`${item.title}-${item.uploaded_at}-${index}`} 
                style={styles.card} 
                onPress={() => navigation.navigate('MaterialDetailScreen', { material: item })}
              >
                <View>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  {item.content ? <Text style={styles.cardSub}>{item.content}</Text> : null}
                  <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                      <Ionicons name="document-text-outline" size={14} color="gray" />
                      <Text style={styles.cardInfo}>{item.files.length} file(s)</Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Ionicons name="time-outline" size={14} color="gray" />
                      <Text style={styles.cardInfo}>
                        {formatDate(item.uploaded_at)}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
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
  cardInfo: { fontSize: 12, color: 'gray' },
  dateGroup: { marginBottom: 20 },
  dateHeaderContainer: { 
    flexDirection: 'row', alignItems: 'center', 
    backgroundColor: '#F0F4F8', padding: 8, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 10
  },
  dateHeader: { fontSize: 13, fontWeight: 'bold', color: '#003D79', marginLeft: 6 },
  groupContent: { 
    borderLeftWidth: 2, borderLeftColor: '#EEE', paddingLeft: 15, marginLeft: 10 
  }
});
