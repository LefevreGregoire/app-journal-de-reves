// components/DreamForm.tsx

import { AsyncStorageConfig } from '@/constants/AsyncStorageConfig';
import { DreamData } from '@/interfaces/DreamData';
import { AsyncStorageService } from '@/services/AsyncStorageService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import {
  Alert,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ScrollView,
  Text,
} from 'react-native';
import { Button, Checkbox, TextInput, SegmentedButtons } from 'react-native-paper';


const { width } = Dimensions.get('window');

export default function DreamForm() {
  // Champs de base
  const [title, setTitle] = useState<string>('');
  const [dreamText, setDreamText] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState<string>('');
  
  // Type et caractéristiques
  const [dreamType, setDreamType] = useState<'cauchemar' | 'lucide' | 'ordinaire' | 'recurring' | 'autre'>('ordinaire');
  const [isLucidDream, setIsLucidDream] = useState<boolean>(false);
  
  // Émotions
  const [emotionBefore, setEmotionBefore] = useState<string>('');
  const [emotionAfter, setEmotionAfter] = useState<string>('');
  const [mood, setMood] = useState<'positive' | 'negative' | 'neutre'>('neutre');
  
  // Détails
  const [characters, setCharacters] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [personalMeaning, setPersonalMeaning] = useState<string>('');
  const [tags, setTags] = useState<string>('');

  const handleDreamSubmission = async (): Promise<void> => {
    // Validation simple
    if (!dreamText.trim()) {
      Alert.alert('Erreur', 'Veuillez décrire votre rêve');
      return;
    }

    try {
      const formDataArray: DreamData[] = await AsyncStorageService.getData(AsyncStorageConfig.keys.dreamsArrayKey);

      // Créer le nouveau rêve avec un ID unique
      const newDream: DreamData = {
        id: Date.now().toString(),
        title: title.trim() || 'Sans titre',
        dreamText: dreamText.trim(),
        date: date,
        time: time || undefined,
        dreamType: dreamType,
        isLucidDream: isLucidDream || dreamType === 'lucide',
        emotionBefore: emotionBefore.trim() || undefined,
        emotionAfter: emotionAfter.trim() || undefined,
        mood: mood,
        characters: characters.trim() ? characters.split(',').map(c => c.trim()) : undefined,
        location: location.trim() || undefined,
        personalMeaning: personalMeaning.trim() || undefined,
        tags: tags.trim() ? tags.split(',').map(t => t.trim()) : undefined,
        createdAt: new Date().toISOString(),
      };

      // Ajouter le nouveau rêve
      formDataArray.push(newDream);

      await AsyncStorageService.setData(AsyncStorageConfig.keys.dreamsArrayKey, formDataArray);

      console.log('Rêve enregistré:', newDream);

      // Message de confirmation
      Alert.alert('Succès', 'Votre rêve a été enregistré !');

      // Réinitialiser le formulaire
      resetForm();

    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données:', error);
      Alert.alert('Erreur', 'Impossible d\'enregistrer le rêve');
    }
  };

  const resetForm = () => {
    setTitle('');
    setDreamText('');
    setDate(new Date().toISOString().split('T')[0]);
    setTime('');
    setDreamType('ordinaire');
    setIsLucidDream(false);
    setEmotionBefore('');
    setEmotionAfter('');
    setMood('neutre');
    setCharacters('');
    setLocation('');
    setPersonalMeaning('');
    setTags('');
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

          {/* Date et heure */}
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
              label="Heure (optionnel)"
              value={time}
              onChangeText={setTime}
              mode="outlined"
              style={[styles.input, { flex: 1 }]}
              placeholder="HH:MM"
            />
          </View>

          {/* Type de rêve */}
          <Text style={styles.label}>Type de rêve</Text>
          <SegmentedButtons
            value={dreamType}
            onValueChange={(value) => setDreamType(value as any)}
            buttons={[
              { value: 'ordinaire', label: 'Ordinaire' },
              { value: 'lucide', label: 'Lucide' },
              { value: 'cauchemar', label: 'Cauchemar' },
            ]}
            style={styles.segmented}
          />

          {/* Tonalité */}
          <Text style={styles.label}>Tonalité globale</Text>
          <SegmentedButtons
            value={mood}
            onValueChange={(value) => setMood(value as any)}
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
  segmented: {
    marginBottom: 16,
  },
  button: {
    marginTop: 20,
    marginBottom: 20,
  },
});
