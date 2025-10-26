// app/dream/[id].tsx
// Page de détails d'un rêve avec suppression/modification

import { AsyncStorageConfig } from "@/constants/AsyncStorageConfig";
import { DreamData } from "@/interfaces/DreamData";
import { AsyncStorageService } from "@/services/AsyncStorageService";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";

export default function DreamDetailScreen() {
  const { id } = useLocalSearchParams(); // Récup l'ID depuis l'URL
  const router = useRouter();
  const [dream, setDream] = useState<DreamData | null>(null);
  const [moonPhase, setMoonPhase] = useState<string>('');
  const [loadingMoon, setLoadingMoon] = useState<boolean>(false);

  // Charge le rêve au montage
  useEffect(() => { loadDream(); }, [id]);

  // Appel API lune dès qu'on a la date
  useEffect(() => { if (dream?.date) fetchMoonPhase(dream.date); }, [dream]);

  const loadDream = async () => {
    try {
      const dreams: DreamData[] = await AsyncStorageService.getData(AsyncStorageConfig.keys.dreamsArrayKey);
      const foundDream = dreams.find((d) => d.id === id);
      if (foundDream) setDream(foundDream);
    } catch (error) { console.error("Erreur:", error); }
  };

  // Appel à l'API moon-phase
  const fetchMoonPhase = async (date: string) => {
    setLoadingMoon(true);
    try {
      const response = await fetch(`https://moon-phase.p.rapidapi.com/advanced?date=${date}`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': 'DEMO', // En mode DEMO pour pas avoir à créer un compte
          'X-RapidAPI-Host': 'moon-phase.p.rapidapi.com'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const phase = data.phase || 'Inconnue';
        setMoonPhase(getMoonPhaseEmoji(phase) + ' ' + phase);
      } else {
        setMoonPhase('🌙 Phase lunaire non disponible');
      }
    } catch (error) {
      setMoonPhase('🌙 Phase lunaire non disponible');
    } finally {
      setLoadingMoon(false);
    }
  };

  // Convertit le nom de phase en emoji
  const getMoonPhaseEmoji = (phase: string): string => {
    const p = phase.toLowerCase();
    if (p.includes('new')) return '🌑';
    if (p.includes('waxing crescent')) return '🌒';
    if (p.includes('first quarter')) return '🌓';
    if (p.includes('waxing gibbous')) return '🌔';
    if (p.includes('full')) return '🌕';
    if (p.includes('waning gibbous')) return '🌖';
    if (p.includes('last quarter')) return '🌗';
    if (p.includes('waning crescent')) return '🌘';
    return '🌙';
  };

  // Suppression avec confirmation
  const handleDelete = () => {
    Alert.alert("Supprimer ce rêve ?", "Cette action est irréversible.", [
      { text: "Annuler", style: "cancel" },
      { text: "Supprimer", style: "destructive", onPress: async () => {
        try {
          const dreams: DreamData[] = await AsyncStorageService.getData(AsyncStorageConfig.keys.dreamsArrayKey);
          const updatedDreams = dreams.filter((d) => d.id !== id); // Retire le rêve du tableau
          await AsyncStorageService.setData(AsyncStorageConfig.keys.dreamsArrayKey, updatedDreams);
          Alert.alert("Succès", "Rêve supprimé");
          router.back(); // Retour page précédente
        } catch (error) { Alert.alert("Erreur", "Impossible de supprimer"); }
      }}
    ]);
  };

  // Navigation vers page d'édition
  const handleEdit = () => { router.push(`/dream/edit/${id}`); };

  if (!dream) return <View style={styles.container}><Text>Chargement...</Text></View>;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{dream.title}</Text>
        <Text style={styles.date}>📅 {dream.date}</Text>
        
        {moonPhase && (
          <Text style={styles.moonPhase}>{moonPhase}</Text>
        )}
        
        {dream.sleepDuration && (
          <Text style={styles.metadata}>
            Durée de sommeil: {dream.sleepDuration}h
          </Text>
        )}
        
        {dream.dreamType && (
          <Text style={styles.metadata}>
            Type: {dream.dreamType === 'lucide' && '✨ Lucide'}
            {dream.dreamType === 'cauchemar' && '😱 Cauchemar'}
            {dream.dreamType === 'ordinaire' && '💭 Ordinaire'}
            {dream.dreamType === 'recurring' && '🔄 Récurrent'}
          </Text>
        )}
        
        {dream.mood && (
          <Text style={styles.metadata}>
            Tonalité: {dream.mood === 'positive' && '😊 Positive'}
            {dream.mood === 'negative' && '😢 Négative'}
            {dream.mood === 'neutre' && '😐 Neutre'}
          </Text>
        )}
        
        {dream.emotionalIntensity && (
          <Text style={styles.metadata}>
            Intensité émotionnelle: {dream.emotionalIntensity}/10
          </Text>
        )}
        
        {dream.clarity && (
          <Text style={styles.metadata}>
            Clarté: {dream.clarity}/10
          </Text>
        )}
        
        {dream.sleepQuality && (
          <Text style={styles.metadata}>
            Qualité du sommeil: {dream.sleepQuality}/10
          </Text>
        )}
        
        <Text style={styles.description}>{dream.dreamText}</Text>
        
        {dream.location && (
          <Text style={styles.detail}>📍 Lieu: {dream.location}</Text>
        )}
        
        {dream.characters && dream.characters.length > 0 && (
          <Text style={styles.detail}>👥 Personnages: {dream.characters.join(', ')}</Text>
        )}
        
        {dream.tags && dream.tags.length > 0 && (
          <Text style={styles.detail}>🏷️ Tags: {dream.tags.join(', ')}</Text>
        )}
        
        {dream.personalMeaning && (
          <View style={styles.meaningSection}>
            <Text style={styles.meaningTitle}>💭 Signification personnelle</Text>
            <Text style={styles.meaningText}>{dream.personalMeaning}</Text>
          </View>
        )}
        
        <View style={styles.actions}>
          <Button mode="contained" onPress={handleEdit} icon="pencil">Modifier</Button>
          <Button mode="outlined" onPress={handleDelete} textColor="#d32f2f" icon="delete">Supprimer</Button>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 16 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 8 },
  date: { fontSize: 14, color: "#666", marginBottom: 8 },
  moonPhase: { fontSize: 14, color: "#6200ee", marginBottom: 8, fontWeight: "600" },
  metadata: { fontSize: 14, color: "#555", marginBottom: 6 },
  description: { fontSize: 16, lineHeight: 24, marginTop: 16, marginBottom: 16 },
  detail: { fontSize: 14, color: "#666", marginBottom: 8 },
  meaningSection: { backgroundColor: "#f5f5f5", padding: 12, borderRadius: 8, marginBottom: 16 },
  meaningTitle: { fontSize: 14, fontWeight: "bold", marginBottom: 8, color: "#333" },
  meaningText: { fontSize: 14, lineHeight: 20, color: "#555" },
  actions: { flexDirection: "row", gap: 12, marginTop: 16 }
});