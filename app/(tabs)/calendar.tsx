// app/(tabs)/calendar.tsx
// Calendrier interactif

import { AsyncStorageConfig } from '@/constants/AsyncStorageConfig';
import { DreamData } from '@/interfaces/DreamData';
import { AsyncStorageService } from '@/services/AsyncStorageService';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { Card, Chip, Text } from 'react-native-paper';

export default function CalendarScreen() {
  const router = useRouter();
  const [dreams, setDreams] = useState<DreamData[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [markedDates, setMarkedDates] = useState<any>({}); // Dates avec des rêves
  const [dreamsForSelectedDate, setDreamsForSelectedDate] = useState<DreamData[]>([]);

  // Reload dès qu'on arrive sur cet écran
  useFocusEffect(
    useCallback(() => {
      loadDreams();
    }, [])
  );

  const loadDreams = async () => {
    try {
      const dreamsData: DreamData[] = await AsyncStorageService.getData(
        AsyncStorageConfig.keys.dreamsArrayKey
      );
      setDreams(dreamsData);
      createMarkedDates(dreamsData); // Marque les dates avec des rêves
    } catch (error) {
      console.error('Erreur chargement calendrier:', error);
    }
  };

  // Crée un objet avec toutes les dates qui ont des rêves
  const createMarkedDates = (dreamsData: DreamData[]) => {
    const marked: any = {};
    
    dreamsData.forEach(dream => {
      const date = dream.date;
      if (date) {
        // Ajoute un point bleu sous chaque date avec rêve
        if (!marked[date]) {
          marked[date] = {
            marked: true,
            dotColor: '#6200ee',
            dots: [{ color: '#6200ee' }],
          };
        }
      }
    });

    setMarkedDates(marked);
  };

  // Appelé quand on clique sur une date
  const onDayPress = (day: DateData) => {
    const date = day.dateString;
    setSelectedDate(date);
    
    // Filtre les rêves de cette date
    const dreamsOnDate = dreams.filter(d => d.date === date);
    setDreamsForSelectedDate(dreamsOnDate);

    // Update les dates marquées pour highlight la sélection
    const newMarkedDates = { ...markedDates };
    Object.keys(newMarkedDates).forEach(key => {
      newMarkedDates[key] = {
        ...newMarkedDates[key],
        selected: key === date,
        selectedColor: '#6200ee',
      };
    });
    
    // Si la date cliquée n'avait pas de rêve, on l'ajoute quand même
    if (!newMarkedDates[date]) {
      newMarkedDates[date] = {
        selected: true,
        selectedColor: '#6200ee',
      };
    } else {
      newMarkedDates[date].selected = true;
      newMarkedDates[date].selectedColor = '#6200ee';
    }
    
    setMarkedDates(newMarkedDates);
  };

  const getDreamTypeIcon = (type: string) => {
    switch (type) {
      case 'lucide': return '✨';
      case 'cauchemar': return '😱';
      case 'recurring': return '🔄';
      default: return '💭';
    }
  };

  const getMoodIcon = (mood?: string) => {
    switch (mood) {
      case 'positive': return '😊';
      case 'negative': return '😢';
      case 'neutre': return '😐';
      default: return '';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📅 Calendrier des rêves</Text>
      
      <Calendar
        onDayPress={onDayPress}
        markedDates={markedDates}
        theme={{
          backgroundColor: '#ffffff',
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#6200ee',
          selectedDayBackgroundColor: '#6200ee',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#6200ee',
          dayTextColor: '#2d4150',
          textDisabledColor: '#d9e1e8',
          dotColor: '#6200ee',
          selectedDotColor: '#ffffff',
          arrowColor: '#6200ee',
          monthTextColor: '#6200ee',
          textDayFontWeight: '300',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '600',
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 14,
        }}
        style={styles.calendar}
      />

      <ScrollView style={styles.dreamsList}>
        {selectedDate ? (
          <>
            <Text style={styles.dateTitle}>
              {dreamsForSelectedDate.length > 0
                ? `${dreamsForSelectedDate.length} rêve(s) le ${selectedDate}`
                : `Aucun rêve le ${selectedDate}`}
            </Text>
            
            {dreamsForSelectedDate.map((dream) => (
              <TouchableOpacity
                key={dream.id}
                onPress={() => router.push(`/dream/${dream.id}`)}
              >
                <Card style={styles.dreamCard}>
                  <Card.Content>
                    <View style={styles.dreamHeader}>
                      <Text style={styles.dreamTitle}>
                        {getDreamTypeIcon(dream.dreamType)} {dream.title}
                      </Text>
                      {dream.mood && (
                        <Text style={styles.moodIcon}>{getMoodIcon(dream.mood)}</Text>
                      )}
                    </View>
                    
                    {dream.sleepDuration && (
                      <Text style={styles.dreamTime}>� {dream.sleepDuration}h de sommeil</Text>
                    )}
                    
                    <Text style={styles.dreamText} numberOfLines={2}>
                      {dream.dreamText}
                    </Text>
                    
                    {dream.tags && dream.tags.length > 0 && (
                      <View style={styles.tagsContainer}>
                        {dream.tags.slice(0, 3).map((tag, index) => (
                          <Chip key={index} style={styles.tag} textStyle={styles.tagText}>
                            {tag}
                          </Chip>
                        ))}
                      </View>
                    )}
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              👆 Sélectionnez une date sur le calendrier
            </Text>
            <Text style={styles.emptySubtext}>
              Les jours marqués d'un point contiennent des rêves
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    paddingBottom: 8,
    color: '#333',
  },
  calendar: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 16,
  },
  dreamsList: {
    flex: 1,
    padding: 16,
    paddingTop: 0,
  },
  dateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  dreamCard: {
    marginBottom: 12,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#6200ee',
  },
  dreamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  dreamTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  moodIcon: {
    fontSize: 20,
    marginLeft: 8,
  },
  dreamTime: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  dreamText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  tag: {
    height: 24,
    backgroundColor: '#e8eaf6',
  },
  tagText: {
    fontSize: 11,
    marginVertical: 0,
    marginHorizontal: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
