// app/dream/edit/[id].tsx - Page d'édition d'un rêveimport React, { useState, useEffect } from 'react';

import {

import { useLocalSearchParams, useRouter } from 'expo-router';  ScrollView,

import { useState, useEffect } from 'react';  View,

import {  StyleSheet,

  View,  Alert,

  ScrollView,  Text,

  StyleSheet,  KeyboardAvoidingView,

  Alert,  Platform,

  Text,} from 'react-native';

  KeyboardAvoidingView,import {

  Platform,  TextInput,

} from 'react-native';  Button,

import { TextInput, Button, SegmentedButtons } from 'react-native-paper';  Card,

import { DreamData } from '@/interfaces/DreamData';  Title,

import { AsyncStorageService } from '@/services/AsyncStorageService';  Paragraph,

import { AsyncStorageConfig } from '@/constants/AsyncStorageConfig';  Chip,

  RadioButton,

export default function EditDreamScreen() {  Checkbox,

  const { id } = useLocalSearchParams();  HelperText,

  const router = useRouter();  ActivityIndicator,

  } from 'react-native-paper';

  const [loading, setLoading] = useState(true);import { router, useLocalSearchParams } from 'expo-router';

  const [title, setTitle] = useState('');import { Calendar } from 'react-native-calendars';

  const [dreamText, setDreamText] = useState('');import { useFocusEffect } from '@react-navigation/native';

  const [date, setDate] = useState('');

  const [time, setTime] = useState('');import { DreamData, DreamEmotion, DreamQuality } from '../../../interfaces/interfaces_DreamData';

  const [dreamType, setDreamType] = useState<'cauchemar' | 'lucide' | 'ordinaire' | 'recurring' | 'autre'>('ordinaire');import { AsyncStorageService } from '../../../services/services_AsyncStorageService';

  const [mood, setMood] = useState<'positive' | 'negative' | 'neutre'>('neutre');

  const [emotionBefore, setEmotionBefore] = useState('');export default function DreamEditByIdScreen() {

  const [emotionAfter, setEmotionAfter] = useState('');  const { id } = useLocalSearchParams<{ id: string }>();

  const [characters, setCharacters] = useState('');  const [originalDream, setOriginalDream] = useState<DreamData | null>(null);

  const [location, setLocation] = useState('');  const [formData, setFormData] = useState({

  const [tags, setTags] = useState('');    title: '',

  const [personalMeaning, setPersonalMeaning] = useState('');    description: '',

    date: new Date().toISOString().split('T')[0],

  useEffect(() => {    emotion: DreamEmotion.NEUTRAL,

    loadDream();    intensity: 5,

  }, [id]);    tags: [] as string[],

    isLucid: false,

  const loadDream = async () => {    duration: '',

    try {    characters: [] as string[],

      const dreams: DreamData[] = await AsyncStorageService.getData(    location: '',

        AsyncStorageConfig.keys.dreamsArrayKey    color: '',

      );    recurring: false,

      const dream = dreams.find((d) => d.id === id);    quality: DreamQuality.AVERAGE,

        });

      if (dream) {

        setTitle(dream.title || '');  const [newTag, setNewTag] = useState('');

        setDreamText(dream.dreamText || '');  const [newCharacter, setNewCharacter] = useState('');

        setDate(dream.date || '');  const [loading, setLoading] = useState(true);

        setTime(dream.time || '');  const [saving, setSaving] = useState(false);

        setDreamType(dream.dreamType || 'ordinaire');  const [showCalendar, setShowCalendar] = useState(false);

        setMood(dream.mood || 'neutre');  const [errors, setErrors] = useState<{[key: string]: string}>({});

        setEmotionBefore(dream.emotionBefore || '');

        setEmotionAfter(dream.emotionAfter || '');  const loadDream = async () => {

        setCharacters(dream.characters?.join(', ') || '');    if (!id) {

        setLocation(dream.location || '');      Alert.alert('Erreur', 'ID du rêve manquant');

        setTags(dream.tags?.join(', ') || '');      router.back();

        setPersonalMeaning(dream.personalMeaning || '');      return;

      } else {    }

        Alert.alert('Erreur', 'Rêve introuvable');    

        router.back();    try {

      }      const dreamData = await AsyncStorageService.getDreamById(id);

    } catch (error) {      if (dreamData) {

      console.error('Erreur chargement:', error);        setOriginalDream(dreamData);

      Alert.alert('Erreur', 'Impossible de charger le rêve');        setFormData({

    } finally {          title: dreamData.title,

      setLoading(false);          description: dreamData.description,

    }          date: dreamData.date,

  };          emotion: dreamData.emotion,

          intensity: dreamData.intensity,

  const handleSave = async () => {          tags: [...dreamData.tags],

    if (!dreamText.trim()) {          isLucid: dreamData.isLucid,

      Alert.alert('Erreur', 'La description est obligatoire');          duration: dreamData.duration || '',

      return;          characters: dreamData.characters ? [...dreamData.characters] : [],

    }          location: dreamData.location || '',

          color: dreamData.color || '',

    try {          recurring: dreamData.recurring || false,

      const dreams: DreamData[] = await AsyncStorageService.getData(          quality: dreamData.quality,

        AsyncStorageConfig.keys.dreamsArrayKey        });

      );      } else {

              Alert.alert('Erreur', 'Rêve introuvable');

      const dreamIndex = dreams.findIndex((d) => d.id === id);        router.back();

            }

      if (dreamIndex === -1) {    } catch (error) {

        Alert.alert('Erreur', 'Rêve introuvable');      console.error('Erreur lors du chargement du rêve:', error);

        return;      Alert.alert('Erreur', 'Impossible de charger ce rêve.');

      }      router.back();

    } finally {

      const updatedDream: DreamData = {      setLoading(false);

        ...dreams[dreamIndex],    }

        title: title.trim() || 'Sans titre',  };

        dreamText: dreamText.trim(),

        date: date,  const validateForm = () => {

        time: time || undefined,    const newErrors: {[key: string]: string} = {};

        dreamType: dreamType,

        isLucidDream: dreamType === 'lucide',    if (!formData.title.trim()) {

        mood: mood,      newErrors.title = 'Le titre est obligatoire';

        emotionBefore: emotionBefore.trim() || undefined,    }

        emotionAfter: emotionAfter.trim() || undefined,

        characters: characters.trim() ? characters.split(',').map(c => c.trim()) : undefined,    if (!formData.description.trim()) {

        location: location.trim() || undefined,      newErrors.description = 'La description est obligatoire';

        tags: tags.trim() ? tags.split(',').map(t => t.trim()) : undefined,    }

        personalMeaning: personalMeaning.trim() || undefined,

        updatedAt: new Date().toISOString(),    if (formData.intensity < 1 || formData.intensity > 10) {

      };      newErrors.intensity = 'L\'intensité doit être entre 1 et 10';

    }

      dreams[dreamIndex] = updatedDream;

    setErrors(newErrors);

      await AsyncStorageService.setData(    return Object.keys(newErrors).length === 0;

        AsyncStorageConfig.keys.dreamsArrayKey,  };

        dreams

      );  const saveDream = async () => {

    if (!validateForm() || !id) {

      Alert.alert('Succès', 'Rêve modifié !', [      return;

        { text: 'OK', onPress: () => router.back() }    }

      ]);

    } catch (error) {    setSaving(true);

      console.error('Erreur:', error);    try {

      Alert.alert('Erreur', 'Impossible de sauvegarder');      const updatedData = {

    }        ...formData,

  };        intensity: Number(formData.intensity),

      };

  if (loading) {

    return (      const savedDream = await AsyncStorageService.updateDream(id, updatedData);

      <View style={styles.loadingContainer}>      if (savedDream) {

        <Text>Chargement...</Text>        Alert.alert('Succès', 'Votre rêve a été modifié avec succès !', [

      </View>          { text: 'OK', onPress: () => router.back() }

    );        ]);

  }      } else {

        Alert.alert('Erreur', 'Une erreur est survenue lors de la modification.');

  return (      }

    <KeyboardAvoidingView    } catch (error) {

      style={{ flex: 1 }}      console.error('Erreur lors de la sauvegarde:', error);

      behavior={Platform.OS === 'ios' ? 'padding' : undefined}      Alert.alert('Erreur', 'Une erreur est survenue lors de la modification.');

    >    } finally {

      <ScrollView style={styles.scrollView}>      setSaving(false);

        <View style={styles.container}>    }

            };

          <TextInput

            label="Titre du rêve"  const addTag = () => {

            value={title}    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {

            onChangeText={setTitle}      setFormData({

            mode="outlined"        ...formData,

            style={styles.input}        tags: [...formData.tags, newTag.trim()]

          />      });

      setNewTag('');

          <TextInput    }

            label="Description *"  };

            value={dreamText}

            onChangeText={setDreamText}  const removeTag = (tagToRemove: string) => {

            mode="outlined"    setFormData({

            multiline      ...formData,

            numberOfLines={4}      tags: formData.tags.filter(tag => tag !== tagToRemove)

            style={styles.input}    });

          />  };



          <View style={styles.row}>  const addCharacter = () => {

            <TextInput    if (newCharacter.trim() && !formData.characters.includes(newCharacter.trim())) {

              label="Date"      setFormData({

              value={date}        ...formData,

              onChangeText={setDate}        characters: [...formData.characters, newCharacter.trim()]

              mode="outlined"      });

              style={[styles.input, { flex: 1, marginRight: 8 }]}      setNewCharacter('');

            />    }

            <TextInput  };

              label="Heure"

              value={time}  const removeCharacter = (characterToRemove: string) => {

              onChangeText={setTime}    setFormData({

              mode="outlined"      ...formData,

              style={[styles.input, { flex: 1 }]}      characters: formData.characters.filter(character => character !== characterToRemove)

            />    });

          </View>  };



          <Text style={styles.label}>Type de rêve</Text>  const getEmotionEmoji = (emotion: DreamEmotion) => {

          <SegmentedButtons    const emojiMap = {

            value={dreamType}      [DreamEmotion.JOY]: '😄',

            onValueChange={(value) => setDreamType(value as any)}      [DreamEmotion.FEAR]: '😨',

            buttons={[      [DreamEmotion.ANGER]: '😠',

              { value: 'ordinaire', label: 'Ordinaire' },      [DreamEmotion.SADNESS]: '😢',

              { value: 'lucide', label: 'Lucide' },      [DreamEmotion.SURPRISE]: '😮',

              { value: 'cauchemar', label: 'Cauchemar' },      [DreamEmotion.LOVE]: '😍',

            ]}      [DreamEmotion.ANXIETY]: '😰',

            style={styles.segmented}      [DreamEmotion.PEACEFUL]: '😌',

          />      [DreamEmotion.CONFUSED]: '😕',

      [DreamEmotion.NEUTRAL]: '😐'

          <Text style={styles.label}>Tonalité</Text>    };

          <SegmentedButtons    return emojiMap[emotion] || '😐';

            value={mood}  };

            onValueChange={(value) => setMood(value as any)}

            buttons={[  useFocusEffect(

              { value: 'positive', label: '😊' },    React.useCallback(() => {

              { value: 'neutre', label: '😐' },      loadDream();

              { value: 'negative', label: '😢' },    }, [id])

            ]}  );

            style={styles.segmented}

          />  if (loading) {

    return (

          <TextInput      <View style={styles.centered}>

            label="Émotion avant"        <ActivityIndicator size="large" />

            value={emotionBefore}        <Text style={styles.loadingText}>Chargement du rêve...</Text>

            onChangeText={setEmotionBefore}      </View>

            mode="outlined"    );

            style={styles.input}  }

          />

  if (!originalDream) {

          <TextInput    return (

            label="Émotion après"      <View style={styles.centered}>

            value={emotionAfter}        <Text style={styles.errorText}>Rêve introuvable</Text>

            onChangeText={setEmotionAfter}        <Button mode="contained" onPress={() => router.back()}>

            mode="outlined"          Retour

            style={styles.input}        </Button>

          />      </View>

    );

          <TextInput  }

            label="Personnages (virgules)"

            value={characters}  return (

            onChangeText={setCharacters}    <KeyboardAvoidingView 

            mode="outlined"      style={styles.container} 

            style={styles.input}      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}

          />    >

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>

          <TextInput        

            label="Lieu"        {/* Informations principales */}

            value={location}        <Card style={styles.section}>

            onChangeText={setLocation}          <Card.Content>

            mode="outlined"            <Title>Informations principales</Title>

            style={styles.input}            

          />            <TextInput

              label="Titre du rêve *"

          <TextInput              value={formData.title}

            label="Tags (virgules)"              onChangeText={(text) => setFormData({...formData, title: text})}

            value={tags}              style={styles.input}

            onChangeText={setTags}              error={!!errors.title}

            mode="outlined"            />

            style={styles.input}            <HelperText type="error" visible={!!errors.title}>

          />              {errors.title}

            </HelperText>

          <TextInput

            label="Signification"            <TextInput

            value={personalMeaning}              label="Description *"

            onChangeText={setPersonalMeaning}              value={formData.description}

            mode="outlined"              onChangeText={(text) => setFormData({...formData, description: text})}

            multiline              multiline

            numberOfLines={3}              numberOfLines={4}

            style={styles.input}              style={styles.input}

          />              error={!!errors.description}

            />

          <View style={styles.actions}>            <HelperText type="error" visible={!!errors.description}>

            <Button              {errors.description}

              mode="outlined"            </HelperText>

              onPress={() => router.back()}

              style={styles.cancelButton}            <Button 

            >              mode="outlined" 

              Annuler              onPress={() => setShowCalendar(!showCalendar)}

            </Button>              style={styles.input}

            <Button            >

              mode="contained"              Date: {new Date(formData.date).toLocaleDateString('fr-FR')}

              onPress={handleSave}            </Button>

              style={styles.saveButton}

            >            {showCalendar && (

              💾 Enregistrer              <Calendar

            </Button>                current={formData.date}

          </View>                onDayPress={(day) => {

                  setFormData({...formData, date: day.dateString});

        </View>                  setShowCalendar(false);

      </ScrollView>                }}

    </KeyboardAvoidingView>                maxDate={new Date().toISOString().split('T')[0]}

  );                style={styles.calendar}

}              />

            )}

const styles = StyleSheet.create({          </Card.Content>

  loadingContainer: {        </Card>

    flex: 1,

    justifyContent: 'center',        {/* Émotion et intensité */}

    alignItems: 'center',        <Card style={styles.section}>

  },          <Card.Content>

  scrollView: {            <Title>Émotion et intensité</Title>

    flex: 1,            

    backgroundColor: '#fff',            <Paragraph style={styles.sectionDescription}>

  },              Quelle était l'émotion dominante de ce rêve ?

  container: {            </Paragraph>

    padding: 16,

    paddingBottom: 40,            <RadioButton.Group

  },              onValueChange={(value) => setFormData({...formData, emotion: value as DreamEmotion})}

  input: {              value={formData.emotion}

    marginBottom: 12,            >

  },              {Object.values(DreamEmotion).map((emotion) => (

  row: {                <View key={emotion} style={styles.radioOption}>

    flexDirection: 'row',                  <RadioButton.Item

    marginBottom: 12,                    label={`${getEmotionEmoji(emotion)} ${emotion}`}

  },                    value={emotion}

  label: {                  />

    fontSize: 14,                </View>

    fontWeight: '600',              ))}

    marginBottom: 8,            </RadioButton.Group>

    marginTop: 8,

  },            <TextInput

  segmented: {              label="Intensité (1-10) *"

    marginBottom: 16,              value={formData.intensity.toString()}

  },              onChangeText={(text) => {

  actions: {                const num = parseInt(text) || 5;

    flexDirection: 'row',                setFormData({...formData, intensity: Math.max(1, Math.min(10, num))});

    gap: 12,              }}

    marginTop: 20,              keyboardType="numeric"

    marginBottom: 20,              style={styles.input}

  },              error={!!errors.intensity}

  cancelButton: {            />

    flex: 1,            <HelperText type="error" visible={!!errors.intensity}>

  },              {errors.intensity}

  saveButton: {            </HelperText>

    flex: 1,          </Card.Content>

  },        </Card>

});

        {/* Qualité du sommeil et caractéristiques */}
        <Card style={styles.section}>
          <Card.Content>
            <Title>Qualité et caractéristiques</Title>

            <Paragraph style={styles.sectionDescription}>
              Qualité du sommeil cette nuit-là
            </Paragraph>

            <RadioButton.Group
              onValueChange={(value) => setFormData({...formData, quality: value as DreamQuality})}
              value={formData.quality}
            >
              {Object.values(DreamQuality).map((quality) => (
                <RadioButton.Item
                  key={quality}
                  label={quality}
                  value={quality}
                />
              ))}
            </RadioButton.Group>

            <View style={styles.checkboxContainer}>
              <Checkbox
                status={formData.isLucid ? 'checked' : 'unchecked'}
                onPress={() => setFormData({...formData, isLucid: !formData.isLucid})}
              />
              <Text style={styles.checkboxLabel}>Rêve lucide (j'étais conscient de rêver)</Text>
            </View>

            <View style={styles.checkboxContainer}>
              <Checkbox
                status={formData.recurring ? 'checked' : 'unchecked'}
                onPress={() => setFormData({...formData, recurring: !formData.recurring})}
              />
              <Text style={styles.checkboxLabel}>Rêve récurrent</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Détails additionnels */}
        <Card style={styles.section}>
          <Card.Content>
            <Title>Détails additionnels</Title>

            <TextInput
              label="Durée estimée du rêve"
              value={formData.duration}
              onChangeText={(text) => setFormData({...formData, duration: text})}
              style={styles.input}
              placeholder="ex: 30 minutes, toute la nuit..."
            />

            <TextInput
              label="Lieu principal du rêve"
              value={formData.location}
              onChangeText={(text) => setFormData({...formData, location: text})}
              style={styles.input}
              placeholder="ex: maison d'enfance, école, forêt..."
            />

            <TextInput
              label="Couleur dominante"
              value={formData.color}
              onChangeText={(text) => setFormData({...formData, color: text})}
              style={styles.input}
              placeholder="ex: bleu, rouge vif, sépia..."
            />
          </Card.Content>
        </Card>

        {/* Tags */}
        <Card style={styles.section}>
          <Card.Content>
            <Title>Tags</Title>
            <Paragraph style={styles.sectionDescription}>
              Ajoutez des mots-clés pour retrouver facilement ce rêve
            </Paragraph>

            <View style={styles.tagInputContainer}>
              <TextInput
                label="Nouveau tag"
                value={newTag}
                onChangeText={setNewTag}
                style={styles.tagInput}
                onSubmitEditing={addTag}
              />
              <Button mode="contained" onPress={addTag} style={styles.addButton}>
                +
              </Button>
            </View>

            <View style={styles.tagsContainer}>
              {formData.tags.map((tag, index) => (
                <Chip 
                  key={index} 
                  style={styles.tag}
                  onClose={() => removeTag(tag)}
                >
                  {tag}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Personnages */}
        <Card style={styles.section}>
          <Card.Content>
            <Title>Personnages</Title>
            <Paragraph style={styles.sectionDescription}>
              Qui était présent dans ce rêve ?
            </Paragraph>

            <View style={styles.tagInputContainer}>
              <TextInput
                label="Nouveau personnage"
                value={newCharacter}
                onChangeText={setNewCharacter}
                style={styles.tagInput}
                onSubmitEditing={addCharacter}
              />
              <Button mode="contained" onPress={addCharacter} style={styles.addButton}>
                +
              </Button>
            </View>

            <View style={styles.tagsContainer}>
              {formData.characters.map((character, index) => (
                <Chip 
                  key={index} 
                  style={styles.tag}
                  onClose={() => removeCharacter(character)}
                >
                  {character}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Boutons d'action */}
        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={() => router.back()}
            style={styles.button}
          >
            Annuler
          </Button>
          <Button
            mode="contained"
            onPress={saveDream}
            loading={saving}
            disabled={saving}
            style={styles.button}
          >
            Enregistrer les modifications
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  section: {
    margin: 16,
    marginBottom: 8,
  },
  sectionDescription: {
    color: '#666',
    marginBottom: 16,
  },
  input: {
    marginBottom: 8,
  },
  calendar: {
    marginVertical: 10,
  },
  radioOption: {
    marginVertical: 2,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  checkboxLabel: {
    flex: 1,
    marginLeft: 8,
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  tagInput: {
    flex: 1,
    marginRight: 8,
  },
  addButton: {
    minWidth: 50,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    marginRight: 8,
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    paddingBottom: 32,
  },
  button: {
    minWidth: 120,
  },
});