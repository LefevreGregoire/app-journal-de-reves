// app/(tabs)/three.tsx
// Page "À propos" + Export des données

import { AsyncStorageConfig } from '@/constants/AsyncStorageConfig';
import { DreamData } from '@/interfaces/DreamData';
import { AsyncStorageService } from '@/services/AsyncStorageService';
import { useState } from 'react';
import { Alert, ScrollView, Share, StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';

export default function TabThreeScreen() {
  const [exporting, setExporting] = useState(false);

  // Export en JSON 
  const exportData = async () => {
    setExporting(true);
    try {
      // Charge tous les rêves depuis AsyncStorage
      const dreams: DreamData[] = await AsyncStorageService.getData(
        AsyncStorageConfig.keys.dreamsArrayKey
      );

      if (dreams.length === 0) {
        Alert.alert('Information', 'Aucun rêve à exporter');
        setExporting(false);
        return;
      }

      // Stringify avec indentation pour lisibilité
      const jsonContent = JSON.stringify(dreams, null, 2);
      
      // Share API native pour partager
      await Share.share({
        message: jsonContent,
        title: 'Mes rêves (JSON)',
      });

    } catch (error) {
      console.error('Erreur export:', error);
      Alert.alert('Erreur', 'Impossible d\'exporter les données');
    } finally {
      setExporting(false);
    }
  };

  // Export en texte lisible
  const exportAsText = async () => {
    setExporting(true);
    try {
      const dreams: DreamData[] = await AsyncStorageService.getData(
        AsyncStorageConfig.keys.dreamsArrayKey
      );

      if (dreams.length === 0) {
        Alert.alert('Information', 'Aucun rêve à exporter');
        setExporting(false);
        return;
      }

      // Format texte lisible avec séparateurs
      let textContent = '📖 JOURNAL DE RÊVES\n';
      textContent += '='.repeat(50) + '\n\n';
      
      dreams.forEach((dream, index) => {
        textContent += `${index + 1}. ${dream.title}\n`;
        textContent += `   Date: ${dream.date}\n`;
        if (dream.sleepDuration) {
          textContent += `   Durée sommeil: ${dream.sleepDuration}h\n`;
        }
        textContent += `   Type: ${dream.dreamType}\n`;
        if (dream.mood) {
          textContent += `   Mood: ${dream.mood}\n`;
        }
        textContent += `\n   ${dream.dreamText}\n`;
        if (dream.tags && dream.tags.length > 0) {
          textContent += `   Tags: ${dream.tags.join(', ')}\n`;
        }
        textContent += '\n' + '-'.repeat(50) + '\n\n';
      });

      // Métadonnées de l'export
      textContent += `\nTotal: ${dreams.length} rêve(s)\n`;
      textContent += `Exporté le: ${new Date().toLocaleString()}\n`;

      // Partage via Share API
      await Share.share({
        message: textContent,
        title: 'Mes rêves (Texte)',
      });

    } catch (error) {
      console.error('Erreur export texte:', error);
      Alert.alert('Erreur', 'Impossible d\'exporter en texte');
    } finally {
      setExporting(false);
    }
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>ℹ️ À propos</Text>
        
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.description}>
              Journal de Rêves{'\n'}
              {'\n'}
              Application pour enregistrer et suivre vos rêves.{'\n'}
              {'\n'}
              Fonctionnalités :{'\n'}
              • Enregistrer vos rêves{'\n'}
              • Marquer les rêves lucides{'\n'}
              • Consulter l'historique{'\n'}
              • Recherche et filtres{'\n'}
              • Statistiques détaillées{'\n'}
              • Calendrier des rêves{'\n'}
              • Export des données{'\n'}
              {'\n'}
              Projet étudiant - EPSI 2025
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>📤 Exporter mes données</Text>
            <Text style={styles.sectionDescription}>
              Sauvegardez tous vos rêves dans un fichier que vous pouvez partager ou conserver.
            </Text>
            
            <Button
              mode="contained"
              onPress={exportData}
              loading={exporting}
              disabled={exporting}
              icon="file-code"
              style={styles.exportButton}
            >
              Exporter en JSON
            </Button>
            
            <Button
              mode="outlined"
              onPress={exportAsText}
              loading={exporting}
              disabled={exporting}
              icon="file-document"
              style={styles.exportButton}
            >
              Exporter en Texte
            </Button>

            <Text style={styles.hint}>
              💡 Le fichier sera partagé via l'application de partage de votre appareil
            </Text>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    color: '#555',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  exportButton: {
    marginBottom: 12,
  },
  hint: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
