// app/(tabs)/stats.tsx
// Page de statistiques - Bonus du cahier des charges

import { AsyncStorageConfig } from '@/constants/AsyncStorageConfig';
import { DreamData } from '@/interfaces/DreamData';
import { AsyncStorageService } from '@/services/AsyncStorageService';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';

export default function StatsScreen() {
  const [dreams, setDreams] = useState<DreamData[]>([]);
  // Objet qui stocke toutes les stats calculées
  const [stats, setStats] = useState({
    total: 0,
    lucid: 0,
    nightmare: 0,
    ordinary: 0,
    recurring: 0,
    positiveCount: 0,
    negativeCount: 0,
    neutralCount: 0,
    thisWeek: 0,
    thisMonth: 0,
    mostFrequentTags: [] as { tag: string; count: number }[],
  });

  // Rechargement à chaque focus
  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [])
  );

  const loadStats = async () => {
    try {
      const dreamsData: DreamData[] = await AsyncStorageService.getData(
        AsyncStorageConfig.keys.dreamsArrayKey
      );
      setDreams(dreamsData);
      calculateStats(dreamsData); // Calcul après chargement
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    }
  };

  // Fonction qui fait tous les calculs statistiques
  const calculateStats = (dreamsData: DreamData[]) => {
    const total = dreamsData.length;
    
    // Compte les différents types de rêves
    const lucid = dreamsData.filter(d => d.dreamType === 'lucide').length;
    const nightmare = dreamsData.filter(d => d.dreamType === 'cauchemar').length;
    const ordinary = dreamsData.filter(d => d.dreamType === 'ordinaire').length;
    const recurring = dreamsData.filter(d => d.dreamType === 'recurring').length;

    // Compte les moods
    const positiveCount = dreamsData.filter(d => d.mood === 'positive').length;
    const negativeCount = dreamsData.filter(d => d.mood === 'negative').length;
    const neutralCount = dreamsData.filter(d => d.mood === 'neutre').length;

    // Calcul rêves de la semaine
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const thisWeek = dreamsData.filter(d => new Date(d.createdAt) >= oneWeekAgo).length;

    // Calcul rêves du mois
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const thisMonth = dreamsData.filter(d => new Date(d.createdAt) >= oneMonthAgo).length;

    // Comptage des tags
    const tagCounts: { [key: string]: number } = {};
    dreamsData.forEach(dream => {
      if (dream.tags) {
        dream.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1; // Incrémente le compteur
        });
      }
    });

    // Tri des tags par ordre décroissant + limite à 5
    const mostFrequentTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Update du state avec toutes les stats
    setStats({
      total,
      lucid,
      nightmare,
      ordinary,
      recurring,
      positiveCount,
      negativeCount,
      neutralCount,
      thisWeek,
      thisMonth,
      mostFrequentTags,
    });
  };

  // Composant Card pour afficher une stat
  const StatCard = ({ title, value, icon, color }: { title: string; value: number | string; icon: string; color: string }) => (
    <Card style={[styles.statCard, { borderLeftColor: color }]}>
      <Card.Content>
        <Text style={styles.statIcon}>{icon}</Text>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </Card.Content>
    </Card>
  );

  // Composant barre de progression avec pourcentage
  const ProgressBar = ({ label, value, total, color }: { label: string; value: number; total: number; color: string }) => {
    const percentage = total > 0 ? (value / total) * 100 : 0;
    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>{label}</Text>
          <Text style={styles.progressValue}>{value} ({percentage.toFixed(0)}%)</Text>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${percentage}%`, backgroundColor: color }]} />
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.mainTitle}>📊 Statistiques de mes rêves</Text>

      {/* Cartes principales */}
      <View style={styles.cardsGrid}>
        <StatCard title="Total de rêves" value={stats.total} icon="🌙" color="#6200ee" />
        <StatCard title="Cette semaine" value={stats.thisWeek} icon="📅" color="#03dac6" />
        <StatCard title="Ce mois" value={stats.thisMonth} icon="📆" color="#018786" />
        <StatCard title="Rêves lucides" value={stats.lucid} icon="✨" color="#ffd700" />
      </View>

      {/* Types de rêves */}
      <Card style={styles.section}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Types de rêves</Text>
          <ProgressBar label="✨ Lucides" value={stats.lucid} total={stats.total} color="#ffd700" />
          <ProgressBar label="😱 Cauchemars" value={stats.nightmare} total={stats.total} color="#d32f2f" />
          <ProgressBar label="💭 Ordinaires" value={stats.ordinary} total={stats.total} color="#6200ee" />
          <ProgressBar label="🔄 Récurrents" value={stats.recurring} total={stats.total} color="#ff6f00" />
        </Card.Content>
      </Card>

      {/* Tonalités */}
      <Card style={styles.section}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Tonalités émotionnelles</Text>
          <ProgressBar label="😊 Positive" value={stats.positiveCount} total={stats.total} color="#4caf50" />
          <ProgressBar label="😐 Neutre" value={stats.neutralCount} total={stats.total} color="#9e9e9e" />
          <ProgressBar label="😢 Négative" value={stats.negativeCount} total={stats.total} color="#f44336" />
        </Card.Content>
      </Card>

      {/* Tags populaires */}
      {stats.mostFrequentTags.length > 0 && (
        <Card style={styles.section}>
          <Card.Content>
            <Text style={styles.sectionTitle}>🏷️ Tags les plus fréquents</Text>
            {stats.mostFrequentTags.map((item, index) => (
              <View key={index} style={styles.tagItem}>
                <Text style={styles.tagLabel}>#{item.tag}</Text>
                <Text style={styles.tagCount}>{item.count} fois</Text>
              </View>
            ))}
          </Card.Content>
        </Card>
      )}

      {/* Message si pas de rêves */}
      {stats.total === 0 && (
        <Card style={styles.section}>
          <Card.Content>
            <Text style={styles.emptyText}>
              Aucun rêve enregistré pour le moment.{'\n'}
              Commencez à enregistrer vos rêves pour voir vos statistiques !
            </Text>
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    marginBottom: 12,
    borderLeftWidth: 4,
    elevation: 2,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  statTitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  section: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 14,
    color: '#333',
  },
  progressValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  tagItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tagLabel: {
    fontSize: 14,
    color: '#6200ee',
    fontWeight: '600',
  },
  tagCount: {
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 24,
  },
});