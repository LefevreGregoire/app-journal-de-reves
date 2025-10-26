// components/DreamForm.tsx
// Formulaire d'ajout de rêve

import { AsyncStorageConfig } from '@/constants/AsyncStorageConfig';
import { DreamData } from '@/interfaces/DreamData';
import { AsyncStorageService } from '@/services/AsyncStorageService';
import { useState } from 'react';
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Button, SegmentedButtons, TextInput } from 'react-native-paper';


const { width } = Dimensions.get('window');

export default function DreamForm() {
  // Champs de base du formulaire
  const [title, setTitle] = useState<string>('');
  const [dreamText, setDreamText] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]); // Date par défaut = aujourd'hui
  const [sleepDuration, setSleepDuration] = useState<string>(''); // Durée de sommeil en heures
  
  // Type et caractéristiques du rêve
  const [dreamType, setDreamType] = useState<'cauchemar' | 'lucide' | 'ordinaire' | 'recurring' | 'autre'>('ordinaire');
  const [isLucidDream, setIsLucidDream] = useState<boolean>(false);
  
  // États émotionnels
  const [emotionBefore, setEmotionBefore] = useState<string>('');
  const [emotionAfter, setEmotionAfter] = useState<string>('');
  const [mood, setMood] = useState<'positive' | 'negative' | 'neutre'>('neutre');
  const [emotionalIntensity, setEmotionalIntensity] = useState<number>(5); // Sur 10
  
  // Détails du rêve
  const [characters, setCharacters] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [personalMeaning, setPersonalMeaning] = useState<string>('');
  const [tags, setTags] = useState<string>('');
  const [clarity, setClarity] = useState<number>(5); // Clarté sur 10
  const [sleepQuality, setSleepQuality] = useState<number>(5); // Qualité sommeil sur 10

  // Fonction qui sauvegarde le rêve dans AsyncStorage
  const handleDreamSubmission = async (): Promise<void> => {
    // Check basique
    if (!dreamText.trim()) {
      Alert.alert('Erreur', 'Veuillez décrire votre rêve');
      return;
    }

    try {
      // Récupère le tableau existant dans AsyncStorage
      const formDataArray: DreamData[] = await AsyncStorageService.getData(AsyncStorageConfig.keys.dreamsArrayKey);

      // Création de l'objet rêve avec tous les champs
      // ID unique = timestamp actuel
      const newDream: DreamData = {
        id: Date.now().toString(),
        title: title.trim() || 'Sans titre',
        dreamText: dreamText.trim(),
        date: date,
        sleepDuration: sleepDuration ? parseFloat(sleepDuration) : undefined,
        dreamType: dreamType,
        isLucidDream: isLucidDream || dreamType === 'lucide',
        emotionBefore: emotionBefore.trim() || undefined,
        emotionAfter: emotionAfter.trim() || undefined,
        emotionalIntensity: emotionalIntensity,
        mood: mood,
        // Split par virgules pour transformer en array
        characters: characters.trim() ? characters.split(',').map(c => c.trim()) : undefined,
        location: location.trim() || undefined,
        clarity: clarity,
        sleepQuality: sleepQuality,
        personalMeaning: personalMeaning.trim() || undefined,
        tags: tags.trim() ? tags.split(',').map(t => t.trim()) : undefined,
        createdAt: new Date().toISOString(),
      };

      // Push dans le tableau
      formDataArray.push(newDream);

      // Sauvegarde dans AsyncStorage
      await AsyncStorageService.setData(AsyncStorageConfig.keys.dreamsArrayKey, formDataArray);

      // Popup de confirmation
      Alert.alert('Succès', 'Votre rêve a été enregistré !');

      // Reset tous les champs
      resetForm();

    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données:', error);
      Alert.alert('Erreur', 'Impossible d\'enregistrer le rêve');
    }
  };

  // Réinitialise tous les champs du formulaire
  const resetForm = () => {
    setTitle('');
    setDreamText('');
    setDate(new Date().toISOString().split('T')[0]);
    setSleepDuration('');
    setDreamType('ordinaire');
    setIsLucidDream(false);
    setEmotionBefore('');
    setEmotionAfter('');
    setMood('neutre');
    setEmotionalIntensity(5);
    setCharacters('');
    setLocation('');
    setPersonalMeaning('');
    setTags('');
    setClarity(5);
    setSleepQuality(5);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          
          {/* Titre du rêve */}
          <TextInput
            label="Titre du rêve"
            value={title}
            onChangeText={setTitle}
            mode="outlined"
            style={styles.input}
            placeholder="Ex: Le château volant"
          />

          {/* Description */}
          <TextInput
            label="Description du rêve *"
            value={dreamText}
            onChangeText={setDreamText}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.input}
            placeholder="Décrivez votre rêve en détail..."
          />

          {/* Date et durée de sommeil */}
          <View style={styles.row}>
            <TextInput
              label="Date"
              value={date}
              onChangeText={setDate}
              mode="outlined"
              style={[styles.input, { flex: 1, marginRight: 8 }]}
              placeholder="YYYY-MM-DD"
            />
            <TextInput
              label="Durée sommeil (h)"
              value={sleepDuration}
              onChangeText={setSleepDuration}
              mode="outlined"
              keyboardType="decimal-pad"
              style={[styles.input, { flex: 1 }]}
              placeholder="Ex: 7.5"
            />
          </View>

          {/* Type de rêve */}
          <Text style={styles.label}>Type de rêve</Text>
          <View style={styles.buttonGrid}>
            <Button
              mode={dreamType === 'ordinaire' ? 'contained' : 'outlined'}
              onPress={() => setDreamType('ordinaire')}
              style={styles.gridButton}
            >
              💭 Normal
            </Button>
            <Button
              mode={dreamType === 'lucide' ? 'contained' : 'outlined'}
              onPress={() => setDreamType('lucide')}
              style={styles.gridButton}
            >
              ✨ Lucide
            </Button>
            <Button
              mode={dreamType === 'cauchemar' ? 'contained' : 'outlined'}
              onPress={() => setDreamType('cauchemar')}
              style={styles.gridButton}
            >
              😱 Cauchemar
            </Button>
            <Button
              mode={dreamType === 'recurring' ? 'contained' : 'outlined'}
              onPress={() => setDreamType('recurring')}
              style={styles.gridButton}
            >
              🔄 Récurrent
            </Button>
          </View>

          {/* Tonalité */}
          <Text style={styles.label}>Tonalité globale</Text>
          <SegmentedButtons
            value={mood}
            onValueChange={setMood}
            buttons={[
              { value: 'positive', label: '😊 Positive' },
              { value: 'neutre', label: '😐 Neutre' },
              { value: 'negative', label: '😢 Négative' },
            ]}
            style={styles.segmented}
          />

          {/* Émotions */}
          <TextInput
            label="Émotion avant le rêve"
            value={emotionBefore}
            onChangeText={setEmotionBefore}
            mode="outlined"
            style={styles.input}
            placeholder="Ex: Anxieux, Calme, Excité..."
          />

          <TextInput
            label="Émotion après le rêve"
            value={emotionAfter}
            onChangeText={setEmotionAfter}
            mode="outlined"
            style={styles.input}
            placeholder="Ex: Heureux, Troublé, Serein..."
          />

          {/* Intensité émotionnelle */}
          <Text style={styles.label}>Intensité émotionnelle: {emotionalIntensity}/10</Text>
          <Text style={styles.sliderDescription}>De 1 (faible) à 10 (très intense)</Text>
          <View style={styles.buttonGrid}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <Button
                key={num}
                mode={emotionalIntensity === num ? 'contained' : 'outlined'}
                onPress={() => setEmotionalIntensity(num)}
                style={styles.numberButton}
                compact
              >
                {num}
              </Button>
            ))}
          </View>

          {/* Clarté du rêve */}
          <Text style={styles.label}>Clarté du rêve: {clarity}/10</Text>
          <Text style={styles.sliderDescription}>De 1 (flou) à 10 (très clair)</Text>
          <View style={styles.buttonGrid}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <Button
                key={num}
                mode={clarity === num ? 'contained' : 'outlined'}
                onPress={() => setClarity(num)}
                style={styles.numberButton}
                compact
              >
                {num}
              </Button>
            ))}
          </View>

          {/* Qualité du sommeil */}
          <Text style={styles.label}>Qualité du sommeil: {sleepQuality}/10</Text>
          <Text style={styles.sliderDescription}>De 1 (mauvaise) à 10 (excellente)</Text>
          <View style={styles.buttonGrid}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <Button
                key={num}
                mode={sleepQuality === num ? 'contained' : 'outlined'}
                onPress={() => setSleepQuality(num)}
                style={styles.numberButton}
                compact
              >
                {num}
              </Button>
            ))}
          </View>

          {/* Détails du rêve */}
          <TextInput
            label="Personnages (séparés par des virgules)"
            value={characters}
            onChangeText={setCharacters}
            mode="outlined"
            style={styles.input}
            placeholder="Ex: Maman, Un inconnu, Mon chat"
          />

          <TextInput
            label="Lieu du rêve"
            value={location}
            onChangeText={setLocation}
            mode="outlined"
            style={styles.input}
            placeholder="Ex: Ma maison d'enfance, Une forêt"
          />

          {/* Tags */}
          <TextInput
            label="Tags (séparés par des virgules)"
            value={tags}
            onChangeText={setTags}
            mode="outlined"
            style={styles.input}
            placeholder="Ex: vol, eau, famille"
          />

          {/* Signification */}
          <TextInput
            label="Signification personnelle"
            value={personalMeaning}
            onChangeText={setPersonalMeaning}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.input}
            placeholder="Que signifie ce rêve pour vous ?"
          />

          {/* Boutons */}
          <Button
            mode="contained"
            onPress={handleDreamSubmission}
            style={styles.button}
          >
            💾 Enregistrer le rêve
          </Button>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  input: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 8,
  },
  sliderDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  gridButton: {
    flex: 1,
    minWidth: '45%',
    marginBottom: 8,
  },
  numberButton: {
    width: '18%',
    minWidth: 50,
    marginBottom: 8,
  },
  sliderContainer: {
    marginBottom: 16,
  },
  sliderLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  segmented: {
    marginBottom: 16,
  },
  button: {
    marginTop: 20,
    marginBottom: 20,
  },
});
