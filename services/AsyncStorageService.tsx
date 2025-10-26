// services/AsyncStorageService.tsx
// Service persistance locale

import { DreamData } from "@/interfaces/DreamData";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Objet service avec deux méthodes pour get/set
export const AsyncStorageService = {

    // Récupère les données depuis AsyncStorage
    getData: async (key: string): Promise<DreamData[]> => {
        const existingData = await AsyncStorage.getItem(key);

        // Parse le JSON ou retourne tableau vide si rien
        return existingData
            ? JSON.parse(existingData)
            : [];
    },

    // Sauvegarde dans AsyncStorage
    setData: async (key: string, dataToInsert: DreamData[]): Promise<void> => {
      // Stringify l'objet en JSON puis save
      await AsyncStorage.setItem(
        key,
        JSON.stringify(dataToInsert)
      );
    }
}