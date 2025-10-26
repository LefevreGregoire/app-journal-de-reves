// app/(tabs)/search.tsx
// Page de recherche et filtrage

import { AsyncStorageConfig } from '@/constants/AsyncStorageConfig';
import { DreamData } from '@/interfaces/DreamData';
import { AsyncStorageService } from '@/services/AsyncStorageService';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Searchbar, SegmentedButtons, Text } from 'react-native-paper';

export default function SearchScreen() {
  const router = useRouter();
  const [allDreams, setAllDreams] = useState<DreamData[]>([]);
  const [filteredDreams, setFilteredDreams] = useState<DreamData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  // Charge tous les rêves au démarrage
  useEffect(() => {
    loadDreams();
  }, []);

  // Relance le filtrage à chaque changement
  useEffect(() => {
    filterDreams();
  }, [searchQuery, filterType, allDreams]);

  const loadDreams = async () => {
    try {
      const dreams: DreamData[] = await AsyncStorageService.getData(
        AsyncStorageConfig.keys.dreamsArrayKey
      );
      setAllDreams(dreams);
    } catch (error) {
      console.error('Erreur chargement:', error);
    }
  };

  // Fonction de filtrage combiné
  const filterDreams = () => {
    let results = [...allDreams];

    // Filtre 1 : par type de rêve
    if (filterType !== 'all') {
      results = results.filter(d => d.dreamType === filterType);
    }

    // Filtre 2 : recherche textuelle dans plusieurs champs
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(dream => {
        return (
          dream.title?.toLowerCase().includes(query) ||
          dream.dreamText?.toLowerCase().includes(query) ||
          dream.characters?.some(c => c.toLowerCase().includes(query)) ||
          dream.tags?.some(t => t.toLowerCase().includes(query)) ||
          dream.location?.toLowerCase().includes(query)
        );
      });
    }

    setFilteredDreams(results);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔍 Rechercher un rêve</Text>
      
      <Searchbar
        placeholder="Rechercher par titre, description, tags..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      <Text style={styles.filterTitle}>Filtrer par type:</Text>
      <SegmentedButtons
        value={filterType}
        onValueChange={setFilterType}
        buttons={[
          { value: 'all', label: 'Tous' },
          { value: 'ordinaire', label: 'Normal' },
          { value: 'lucide', label: 'Lucide' },
          { value: 'cauchemar', label: 'Cauchemar' },
          { value: 'recurring', label: 'Récurrent' },
        ]}
        style={styles.segmented}
      />

      <Text style={styles.resultCount}>
        {filteredDreams.length} rêve(s) trouvé(s)
      </Text>

      <ScrollView style={styles.results}>
        {filteredDreams.length > 0 ? (
          filteredDreams.map((dream) => (
            <TouchableOpacity
              key={dream.id}
              style={styles.dreamCard}
              onPress={() => router.push(`/dream/${dream.id}`)}
            >
              <Text style={styles.dreamTitle}>{dream.title}</Text>
              <Text style={styles.dreamDate}>📅 {dream.date}</Text>
              <Text style={styles.dreamType}>
                {dream.dreamType === 'lucide' && '✨ Lucide'}
                {dream.dreamType === 'cauchemar' && '😱 Cauchemar'}
                {dream.dreamType === 'ordinaire' && '💭 Ordinaire'}
              </Text>
              {dream.tags && dream.tags.length > 0 && (
                <Text style={styles.tags}>🏷️ {dream.tags.join(', ')}</Text>
              )}
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.emptyText}>
            {searchQuery || filterType !== 'all' 
              ? 'Aucun rêve ne correspond à votre recherche' 
              : 'Aucun rêve enregistré'}
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchBar: {
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  segmented: {
    marginBottom: 16,
  },
  resultCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  results: {
    flex: 1,
  },
  dreamCard: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#6200ee',
  },
  dreamTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dreamDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  dreamType: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  tags: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 40,
  },
});
