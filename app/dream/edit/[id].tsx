// app/dream/edit/[id].tsx
// Page d'édition d'un rêve

import { AsyncStorageConfig } from "@/constants/AsyncStorageConfig";
import { DreamData } from "@/interfaces/DreamData";
import { AsyncStorageService } from "@/services/AsyncStorageService";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

export default function EditDreamScreen() {
  const { id } = useLocalSearchParams(); // ID du rêve depuis l'URL
  const router = useRouter();
  
  // States basiques pour l'édition
  const [title, setTitle] = useState("");
  const [dreamText, setDreamText] = useState("");
  const [date, setDate] = useState("");

  // Charge le rêve à éditer
  useEffect(() => { loadDream(); }, [id]);

  const loadDream = async () => {
    try {
      const dreams: DreamData[] = await AsyncStorageService.getData(AsyncStorageConfig.keys.dreamsArrayKey);
      const foundDream = dreams.find((d) => d.id === id);
      // Remplit les champs avec les données actuelles
      if (foundDream) {
        setTitle(foundDream.title);
        setDreamText(foundDream.dreamText);
        setDate(foundDream.date || "");
      }
    } catch (error) { console.error("Erreur:", error); }
  };

  // Sauvegarde les modifications
  const handleSave = async () => {
    // Validation basique
    if (!title.trim() || !dreamText.trim()) {
      Alert.alert("Erreur", "Le titre et la description sont obligatoires");
      return;
    }
    try {
      const dreams: DreamData[] = await AsyncStorageService.getData(AsyncStorageConfig.keys.dreamsArrayKey);
      // Map pour update le bon rêve dans le tableau
      const updatedDreams = dreams.map((dream) =>
        dream.id === id
          ? { ...dream, title: title.trim(), dreamText: dreamText.trim(), date, updatedAt: new Date().toISOString() }
          : dream
      );
      await AsyncStorageService.setData(AsyncStorageConfig.keys.dreamsArrayKey, updatedDreams);
      Alert.alert("Succès", "Rêve modifié", [{ text: "OK", onPress: () => router.back() }]);
    } catch (error) { Alert.alert("Erreur", "Impossible de sauvegarder"); }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.heading}>Modifier le rêve</Text>
        <TextInput label="Titre *" value={title} onChangeText={setTitle} mode="outlined" style={styles.input} />
        <TextInput label="Description *" value={dreamText} onChangeText={setDreamText} mode="outlined" multiline numberOfLines={4} style={styles.input} />
        <TextInput label="Date" value={date} onChangeText={setDate} mode="outlined" style={styles.input} />
        <Button mode="contained" onPress={handleSave} style={styles.saveButton} icon="content-save">Enregistrer</Button>
        <Button mode="outlined" onPress={() => router.back()}>Annuler</Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 16 },
  heading: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
  input: { marginBottom: 12 },
  saveButton: { marginBottom: 8, marginTop: 24 }
});