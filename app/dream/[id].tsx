// app/dream/[id].tsx - Page de détail dun rêve

import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, Alert, Text as RNText } from "react-native";
import { Text, Button, Divider } from "react-native-paper";
import { DreamData } from "@/interfaces/DreamData";
import { AsyncStorageService } from "@/services/AsyncStorageService";
import { AsyncStorageConfig } from "@/constants/AsyncStorageConfig";

export default function DreamDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [dream, setDream] = useState<DreamData | null>(null);

  useEffect(() => {
    loadDream();
  }, [id]);

  const loadDream = async () => {
    try {
      const dreams: DreamData[] = await AsyncStorageService.getData(
        AsyncStorageConfig.keys.dreamsArrayKey
      );
      const foundDream = dreams.find((d) => d.id === id);
      if (foundDream) {
        setDream(foundDream);
      }
    } catch (error) {
      console.error("Erreur lors du chargement du rêve:", error);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Supprimer ce rêve ?",
      "Cette action est irréversible.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              const dreams: DreamData[] = await AsyncStorageService.getData(
                AsyncStorageConfig.keys.dreamsArrayKey
              );
              const updatedDreams = dreams.filter((d) => d.id !== id);
              await AsyncStorageService.setData(
                AsyncStorageConfig.keys.dreamsArrayKey,
                updatedDreams
              );
              Alert.alert("Succès", "Rêve supprimé");
              router.back();
            } catch (error) {
              console.error("Erreur suppression:", error);
              Alert.alert("Erreur", "Impossible de supprimer");
            }
          }
        }
      ]
    );
  };

  if (!dream) {
    return (
      <View style={styles.container}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{dream.title}</Text>
        <Text style={styles.date}>📅 {dream.date}</Text>
        <Text style={styles.type}>{dream.dreamType}</Text>
        <Divider style={styles.divider} />
        <Text style={styles.description}>{dream.dreamText}</Text>
        <View style={styles.actions}>
          <Button mode="contained" onPress={() => {}} style={styles.editButton}>Modifier</Button>
          <Button mode="outlined" onPress={handleDelete} style={styles.deleteButton} textColor="#d32f2f">Supprimer</Button>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 16 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 8 },
  date: { fontSize: 14, color: "#666" },
  type: { fontSize: 14, fontWeight: "600", color: "#6200ee" },
  divider: { marginVertical: 16 },
  description: { fontSize: 16, lineHeight: 24 },
  actions: { flexDirection: "row", gap: 12, marginTop: 24 },
  editButton: { flex: 1 },
  deleteButton: { flex: 1 }
});
