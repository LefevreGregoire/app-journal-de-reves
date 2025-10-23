// app/dream/[id].tsx - Page de détail d'un rêve// app/dream/[id].tsx - Page de détail d'un rêveimport React, { useState, useEffect } from 'react';



import { useLocalSearchParams, useRouter } from 'expo-router';import {

import { useState, useEffect } from 'react';

import { View, ScrollView, StyleSheet, Alert, Text as RNText } from 'react-native';import { useLocalSearchParams, useRouter } from 'expo-router';  ScrollView,

import { Text, Button, Divider } from 'react-native-paper';

import { DreamData } from '@/interfaces/DreamData';import { useState, useEffect } from 'react';  View,

import { AsyncStorageService } from '@/services/AsyncStorageService';

import { AsyncStorageConfig } from '@/constants/AsyncStorageConfig';import {  StyleSheet,



export default function DreamDetailScreen() {  View,  Alert,

  const { id } = useLocalSearchParams();

  const router = useRouter();  ScrollView,  Text,

  const [dream, setDream] = useState<DreamData | null>(null);

  StyleSheet,  Share,

  useEffect(() => {

    loadDream();  Alert,} from 'react-native';

  }, [id]);

} from 'react-native';import {

  const loadDream = async () => {

    try {import { Text, Button, Divider } from 'react-native-paper';  Card,

      const dreams: DreamData[] = await AsyncStorageService.getData(

        AsyncStorageConfig.keys.dreamsArrayKeyimport { DreamData } from '@/interfaces/DreamData';  Title,

      );

      const foundDream = dreams.find((d) => d.id === id);import { AsyncStorageService } from '@/services/AsyncStorageService';  Paragraph,

      if (foundDream) {

        setDream(foundDream);import { AsyncStorageConfig } from '@/constants/AsyncStorageConfig';  Chip,

      }

    } catch (error) {  Button,

      console.error('Erreur chargement:', error);

    }export default function DreamDetailScreen() {  IconButton,

  };

  const { id } = useLocalSearchParams();  Divider,

  const handleDelete = () => {

    Alert.alert(  const router = useRouter();  ActivityIndicator,

      'Supprimer ce rêve ?',

      'Cette action est irréversible.',  const [dream, setDream] = useState<DreamData | null>(null);} from 'react-native-paper';

      [

        { text: 'Annuler', style: 'cancel' },import { router, useLocalSearchParams } from 'expo-router';

        {

          text: 'Supprimer',  useEffect(() => {import { useFocusEffect } from '@react-navigation/native';

          style: 'destructive',

          onPress: async () => {    loadDream();

            try {

              const dreams: DreamData[] = await AsyncStorageService.getData(  }, [id]);import { DreamData, DreamEmotion } from '../../interfaces/interfaces_DreamData';

                AsyncStorageConfig.keys.dreamsArrayKey

              );import { AsyncStorageService } from '../../services/services_AsyncStorageService';

              const updatedDreams = dreams.filter((d) => d.id !== id);

              await AsyncStorageService.setData(  const loadDream = async () => {

                AsyncStorageConfig.keys.dreamsArrayKey,

                updatedDreams    try {export default function DreamDetailsScreen() {

              );

              Alert.alert('Succès', 'Rêve supprimé');      const dreams: DreamData[] = await AsyncStorageService.getData(  const { id } = useLocalSearchParams<{ id: string }>();

              router.back();

            } catch (error) {        AsyncStorageConfig.keys.dreamsArrayKey  const [dream, setDream] = useState<DreamData | null>(null);

              console.error('Erreur:', error);

              Alert.alert('Erreur', 'Impossible de supprimer');      );  const [loading, setLoading] = useState(true);

            }

          }      const foundDream = dreams.find((d) => d.id === id);

        }

      ]      if (foundDream) {  const loadDream = async () => {

    );

  };        setDream(foundDream);    if (!id) return;



  const handleEdit = () => {      }    

    router.push(`/dream/edit/${id}` as any);

  };    } catch (error) {    try {



  if (!dream) {      console.error('Erreur lors du chargement du rêve:', error);      const dreamData = await AsyncStorageService.getDreamById(id);

    return (

      <View style={styles.container}>    }      setDream(dreamData);

        <Text>Chargement...</Text>

      </View>  };    } catch (error) {

    );

  }      console.error('Erreur lors du chargement du rêve:', error);



  return (  const handleDelete = () => {      Alert.alert('Erreur', 'Impossible de charger ce rêve.');

    <ScrollView style={styles.container}>

      <View style={styles.content}>    Alert.alert(    } finally {

        <Text style={styles.title}>{dream.title}</Text>

              'Supprimer ce rêve ?',      setLoading(false);

        <View style={styles.metaContainer}>

          <Text style={styles.date}>      'Cette action est irréversible.',    }

            📅 {dream.date} {dream.time && `à ${dream.time}`}

          </Text>      [  };

          <Text style={styles.type}>

            {dream.dreamType === 'lucide' && '✨ Rêve Lucide'}        {

            {dream.dreamType === 'cauchemar' && '😱 Cauchemar'}

            {dream.dreamType === 'ordinaire' && '💭 Rêve Ordinaire'}          text: 'Annuler',  const deleteDream = () => {

            {dream.dreamType === 'recurring' && '🔄 Récurrent'}

          </Text>          style: 'cancel',    Alert.alert(

        </View>

        },      "Supprimer le rêve",

        <Divider style={styles.divider} />

        {      "Êtes-vous sûr de vouloir supprimer ce rêve définitivement ?",

        <Text style={styles.sectionTitle}>Description</Text>

        <Text style={styles.description}>{dream.dreamText}</Text>          text: 'Supprimer',      [



        {dream.emotionBefore && (          style: 'destructive',        { text: "Annuler", style: "cancel" },

          <>

            <Text style={styles.sectionTitle}>Émotion avant</Text>          onPress: async () => {        {

            <Text style={styles.text}>{dream.emotionBefore}</Text>

          </>            try {          text: "Supprimer",

        )}

              const dreams: DreamData[] = await AsyncStorageService.getData(          style: "destructive",

        {dream.emotionAfter && (

          <>                AsyncStorageConfig.keys.dreamsArrayKey          onPress: async () => {

            <Text style={styles.sectionTitle}>Émotion après</Text>

            <Text style={styles.text}>{dream.emotionAfter}</Text>              );            if (!id) return;

          </>

        )}              const updatedDreams = dreams.filter((d) => d.id !== id);            



        {dream.mood && (              await AsyncStorageService.setData(            const success = await AsyncStorageService.deleteDream(id);

          <>

            <Text style={styles.sectionTitle}>Tonalité</Text>                AsyncStorageConfig.keys.dreamsArrayKey,            if (success) {

            <Text style={styles.text}>

              {dream.mood === 'positive' && '😊 Positive'}                updatedDreams              router.back();

              {dream.mood === 'negative' && '😢 Négative'}

              {dream.mood === 'neutre' && '😐 Neutre'}              );            } else {

            </Text>

          </>              Alert.alert('Succès', 'Rêve supprimé');              Alert.alert('Erreur', 'Impossible de supprimer ce rêve.');

        )}

              router.back();            }

        {dream.characters && dream.characters.length > 0 && (

          <>            } catch (error) {          }

            <Text style={styles.sectionTitle}>Personnages</Text>

            <Text style={styles.text}>{dream.characters.join(', ')}</Text>              console.error('Erreur lors de la suppression:', error);        }

          </>

        )}              Alert.alert('Erreur', 'Impossible de supprimer le rêve');      ]



        {dream.location && (            }    );

          <>

            <Text style={styles.sectionTitle}>Lieu</Text>          },  };

            <Text style={styles.text}>{dream.location}</Text>

          </>        },

        )}

      ]  const shareDream = async () => {

        {dream.tags && dream.tags.length > 0 && (

          <>    );    if (!dream) return;

            <Text style={styles.sectionTitle}>Tags</Text>

            <Text style={styles.text}>🏷️ {dream.tags.join(', ')}</Text>  };

          </>

        )}    const shareContent = `🌙 Mon rêve: ${dream.title}



        {dream.personalMeaning && (  const handleEdit = () => {

          <>

            <Text style={styles.sectionTitle}>Signification</Text>    // TODO: Naviguer vers la page d'édition📅 Date: ${formatDate(dream.date)}

            <Text style={styles.text}>{dream.personalMeaning}</Text>

          </>    router.push(`/dream/edit/${id}`);😄 Émotion: ${getEmotionLabel(dream.emotion)} ${getEmotionEmoji(dream.emotion)}

        )}

  };⚡ Intensité: ${dream.intensity}/10

        <Divider style={styles.divider} />

${dream.isLucid ? '✨ Rêve lucide' : ''}

        <View style={styles.actions}>

          <Button  if (!dream) {

            mode="contained"

            onPress={handleEdit}    return (📖 Description:

            style={styles.editButton}

            icon="pencil"      <View style={styles.container}>${dream.description}

          >

            Modifier        <Text>Chargement...</Text>

          </Button>

          <Button      </View>${dream.tags.length > 0 ? `🏷️ Tags: ${dream.tags.join(', ')}` : ''}

            mode="outlined"

            onPress={handleDelete}    );${dream.location ? `📍 Lieu: ${dream.location}` : ''}

            style={styles.deleteButton}

            textColor="#d32f2f"  }${dream.characters && dream.characters.length > 0 ? `👥 Personnages: ${dream.characters.join(', ')}` : ''}

            icon="delete"

          >

            Supprimer

          </Button>  return (Partagé depuis mon Journal de Rêves`;

        </View>

      </View>    <ScrollView style={styles.container}>

    </ScrollView>

  );      <View style={styles.content}>    try {

}

        <Text style={styles.title}>{dream.title}</Text>      await Share.share({

const styles = StyleSheet.create({

  container: {                message: shareContent,

    flex: 1,

    backgroundColor: '#fff',        <View style={styles.metaContainer}>        title: `Rêve: ${dream.title}`,

  },

  content: {          <Text style={styles.date}>      });

    padding: 16,

  },            📅 {dream.date} {dream.time && `à ${dream.time}`}    } catch (error) {

  title: {

    fontSize: 24,          </Text>      console.error('Erreur lors du partage:', error);

    fontWeight: 'bold',

    marginBottom: 8,          <Text style={styles.type}>    }

  },

  metaContainer: {            {dream.dreamType === 'lucide' && '✨ Rêve Lucide'}  };

    marginBottom: 16,

  },            {dream.dreamType === 'cauchemar' && '😱 Cauchemar'}

  date: {

    fontSize: 14,            {dream.dreamType === 'ordinaire' && '💭 Rêve Ordinaire'}  const getEmotionEmoji = (emotion: DreamEmotion) => {

    color: '#666',

    marginBottom: 4,            {dream.dreamType === 'recurring' && '🔄 Rêve Récurrent'}    const emojiMap = {

  },

  type: {          </Text>      [DreamEmotion.JOY]: '😄',

    fontSize: 14,

    fontWeight: '600',        </View>      [DreamEmotion.FEAR]: '😨',

    color: '#6200ee',

  },      [DreamEmotion.ANGER]: '😠',

  divider: {

    marginVertical: 16,        <Divider style={styles.divider} />      [DreamEmotion.SADNESS]: '😢',

  },

  sectionTitle: {      [DreamEmotion.SURPRISE]: '😮',

    fontSize: 16,

    fontWeight: '600',        <Text style={styles.sectionTitle}>Description</Text>      [DreamEmotion.LOVE]: '😍',

    marginTop: 12,

    marginBottom: 4,        <Text style={styles.description}>{dream.dreamText}</Text>      [DreamEmotion.ANXIETY]: '😰',

    color: '#333',

  },      [DreamEmotion.PEACEFUL]: '😌',

  description: {

    fontSize: 16,        {dream.emotionBefore && (      [DreamEmotion.CONFUSED]: '😕',

    lineHeight: 24,

    color: '#444',          <>      [DreamEmotion.NEUTRAL]: '😐'

  },

  text: {            <Text style={styles.sectionTitle}>Émotion avant</Text>    };

    fontSize: 14,

    color: '#555',            <Text style={styles.text}>{dream.emotionBefore}</Text>    return emojiMap[emotion] || '😐';

    marginBottom: 8,

  },          </>  };

  actions: {

    flexDirection: 'row',        )}

    justifyContent: 'space-between',

    marginTop: 24,  const getEmotionLabel = (emotion: DreamEmotion) => {

    marginBottom: 32,

    gap: 12,        {dream.emotionAfter && (    const labelMap = {

  },

  editButton: {          <>      [DreamEmotion.JOY]: 'Joie',

    flex: 1,

  },            <Text style={styles.sectionTitle}>Émotion après</Text>      [DreamEmotion.FEAR]: 'Peur',

  deleteButton: {

    flex: 1,            <Text style={styles.text}>{dream.emotionAfter}</Text>      [DreamEmotion.ANGER]: 'Colère',

  },

});          </>      [DreamEmotion.SADNESS]: 'Tristesse',


        )}      [DreamEmotion.SURPRISE]: 'Surprise',

      [DreamEmotion.LOVE]: 'Amour',

        {dream.mood && (      [DreamEmotion.ANXIETY]: 'Anxiété',

          <>      [DreamEmotion.PEACEFUL]: 'Paix',

            <Text style={styles.sectionTitle}>Tonalité</Text>      [DreamEmotion.CONFUSED]: 'Confusion',

            <Text style={styles.text}>      [DreamEmotion.NEUTRAL]: 'Neutre'

              {dream.mood === 'positive' && '😊 Positive'}    };

              {dream.mood === 'negative' && '😢 Négative'}    return labelMap[emotion] || emotion;

              {dream.mood === 'neutre' && '😐 Neutre'}  };

            </Text>

          </>  const getQualityLabel = (quality: string) => {

        )}    const labelMap: { [key: string]: string } = {

      excellent: 'Excellent',

        {dream.characters && dream.characters.length > 0 && (      good: 'Bon',

          <>      average: 'Moyen',

            <Text style={styles.sectionTitle}>Personnages</Text>      poor: 'Mauvais',

            <Text style={styles.text}>{dream.characters.join(', ')}</Text>      terrible: 'Très mauvais'

          </>    };

        )}    return labelMap[quality] || quality;

  };

        {dream.location && (

          <>  const formatDate = (dateString: string) => {

            <Text style={styles.sectionTitle}>Lieu</Text>    return new Date(dateString).toLocaleDateString('fr-FR', {

            <Text style={styles.text}>{dream.location}</Text>      weekday: 'long',

          </>      day: 'numeric',

        )}      month: 'long',

      year: 'numeric'

        {dream.tags && dream.tags.length > 0 && (    });

          <>  };

            <Text style={styles.sectionTitle}>Tags</Text>

            <Text style={styles.text}>🏷️ {dream.tags.join(', ')}</Text>  const formatDateTime = (dateString: string) => {

          </>    return new Date(dateString).toLocaleDateString('fr-FR', {

        )}      day: 'numeric',

      month: 'short',

        {dream.personalMeaning && (      year: 'numeric',

          <>      hour: '2-digit',

            <Text style={styles.sectionTitle}>Signification personnelle</Text>      minute: '2-digit'

            <Text style={styles.text}>{dream.personalMeaning}</Text>    });

          </>  };

        )}

  const getIntensityColor = (intensity: number) => {

        <Divider style={styles.divider} />    if (intensity <= 3) return '#4CAF50'; // Vert

    if (intensity <= 6) return '#FF9800'; // Orange

        <View style={styles.actions}>    return '#F44336'; // Rouge

          <Button  };

            mode="contained"

            onPress={handleEdit}  useFocusEffect(

            style={styles.editButton}    React.useCallback(() => {

            icon="pencil"      loadDream();

          >    }, [id])

            Modifier  );

          </Button>

          <Button  if (loading) {

            mode="outlined"    return (

            onPress={handleDelete}      <View style={styles.centered}>

            style={styles.deleteButton}        <ActivityIndicator size="large" />

            buttonColor="#d32f2f"        <Text style={styles.loadingText}>Chargement du rêve...</Text>

            textColor="#d32f2f"      </View>

            icon="delete"    );

          >  }

            Supprimer

          </Button>  if (!dream) {

        </View>    return (

      </View>      <View style={styles.centered}>

    </ScrollView>        <Text style={styles.errorText}>Rêve introuvable</Text>

  );        <Button mode="contained" onPress={() => router.back()}>

}          Retour

        </Button>

const styles = StyleSheet.create({      </View>

  container: {    );

    flex: 1,  }

    backgroundColor: '#fff',

  },  return (

  content: {    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>

    padding: 16,      

  },      {/* En-tête avec titre et actions */}

  title: {      <Card style={styles.headerCard}>

    fontSize: 24,        <Card.Content>

    fontWeight: 'bold',          <View style={styles.headerRow}>

    marginBottom: 8,            <View style={styles.titleSection}>

  },              <Title style={styles.dreamTitle}>{dream.title}</Title>

  metaContainer: {              <Text style={styles.dreamDate}>{formatDate(dream.date)}</Text>

    marginBottom: 16,            </View>

  },            <Text style={styles.emotionEmoji}>

  date: {              {getEmotionEmoji(dream.emotion)}

    fontSize: 14,            </Text>

    color: '#666',          </View>

    marginBottom: 4,

  },          <View style={styles.actionButtons}>

  type: {            <IconButton

    fontSize: 14,              icon="pencil"

    fontWeight: '600',              mode="outlined"

    color: '#6200ee',              onPress={() => router.push(`/dream/edit/${dream.id}`)}

  },            />

  divider: {            <IconButton

    marginVertical: 16,              icon="share-variant"

  },              mode="outlined"

  sectionTitle: {              onPress={shareDream}

    fontSize: 16,            />

    fontWeight: '600',            <IconButton

    marginTop: 12,              icon="delete"

    marginBottom: 4,              mode="outlined"

    color: '#333',              iconColor="#F44336"

  },              onPress={deleteDream}

  description: {            />

    fontSize: 16,          </View>

    lineHeight: 24,        </Card.Content>

    color: '#444',      </Card>

  },

  text: {      {/* Métriques principales */}

    fontSize: 14,      <Card style={styles.section}>

    color: '#555',        <Card.Content>

    marginBottom: 8,          <Title>Aperçu</Title>

  },          

  actions: {          <View style={styles.metricsGrid}>

    flexDirection: 'row',            <View style={styles.metric}>

    justifyContent: 'space-between',              <Text style={styles.metricLabel}>Émotion</Text>

    marginTop: 24,              <Text style={styles.metricValue}>

    marginBottom: 32,                {getEmotionEmoji(dream.emotion)} {getEmotionLabel(dream.emotion)}

    gap: 12,              </Text>

  },            </View>

  editButton: {

    flex: 1,            <View style={styles.metric}>

  },              <Text style={styles.metricLabel}>Intensité</Text>

  deleteButton: {              <Text style={[styles.metricValue, { color: getIntensityColor(dream.intensity) }]}>

    flex: 1,                {dream.intensity}/10

  },              </Text>

});            </View>


            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Qualité du sommeil</Text>
              <Text style={styles.metricValue}>
                {getQualityLabel(dream.quality)}
              </Text>
            </View>
          </View>

          <View style={styles.badgesContainer}>
            {dream.isLucid && (
              <Chip icon="lightbulb" style={styles.badge}>
                Rêve lucide
              </Chip>
            )}
            {dream.recurring && (
              <Chip icon="repeat" style={styles.badge}>
                Récurrent
              </Chip>
            )}
          </View>
        </Card.Content>
      </Card>

      {/* Description */}
      <Card style={styles.section}>
        <Card.Content>
          <Title>Description</Title>
          <Paragraph style={styles.description}>
            {dream.description}
          </Paragraph>
        </Card.Content>
      </Card>

      {/* Détails */}
      {(dream.duration || dream.location || dream.color) && (
        <Card style={styles.section}>
          <Card.Content>
            <Title>Détails</Title>
            
            {dream.duration && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Durée estimée:</Text>
                <Text style={styles.detailValue}>{dream.duration}</Text>
              </View>
            )}

            {dream.location && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Lieu:</Text>
                <Text style={styles.detailValue}>{dream.location}</Text>
              </View>
            )}

            {dream.color && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Couleur dominante:</Text>
                <Text style={styles.detailValue}>{dream.color}</Text>
              </View>
            )}
          </Card.Content>
        </Card>
      )}

      {/* Tags */}
      {dream.tags.length > 0 && (
        <Card style={styles.section}>
          <Card.Content>
            <Title>Tags</Title>
            <View style={styles.tagsContainer}>
              {dream.tags.map((tag, index) => (
                <Chip key={index} style={styles.tag} mode="outlined">
                  {tag}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Personnages */}
      {dream.characters && dream.characters.length > 0 && (
        <Card style={styles.section}>
          <Card.Content>
            <Title>Personnages</Title>
            <View style={styles.tagsContainer}>
              {dream.characters.map((character, index) => (
                <Chip key={index} style={styles.tag} mode="outlined">
                  {character}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Métadonnées */}
      <Card style={styles.section}>
        <Card.Content>
          <Title>Informations</Title>
          
          <View style={styles.metadataContainer}>
            <View style={styles.metadataRow}>
              <Text style={styles.metadataLabel}>Créé le:</Text>
              <Text style={styles.metadataValue}>
                {formatDateTime(dream.createdAt)}
              </Text>
            </View>

            {dream.updatedAt !== dream.createdAt && (
              <View style={styles.metadataRow}>
                <Text style={styles.metadataLabel}>Modifié le:</Text>
                <Text style={styles.metadataValue}>
                  {formatDateTime(dream.updatedAt)}
                </Text>
              </View>
            )}
          </View>
        </Card.Content>
      </Card>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingBottom: 20,
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
  headerCard: {
    margin: 16,
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleSection: {
    flex: 1,
    marginRight: 16,
  },
  dreamTitle: {
    fontSize: 24,
    marginBottom: 4,
  },
  dreamDate: {
    color: '#666',
    fontSize: 14,
  },
  emotionEmoji: {
    fontSize: 32,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  section: {
    margin: 16,
    marginBottom: 8,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metric: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  badge: {
    marginRight: 8,
    marginBottom: 4,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#666',
  },
  detailValue: {
    flex: 1,
    textAlign: 'right',
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
  metadataContainer: {
    marginTop: 8,
  },
  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  metadataLabel: {
    color: '#666',
    fontSize: 12,
  },
  metadataValue: {
    fontSize: 12,
  },
});