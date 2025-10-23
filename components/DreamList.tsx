// components/DreamList.tsx

import { AsyncStorageConfig } from '@/constants/AsyncStorageConfig';
import { DreamData } from '@/interfaces/DreamData';
import { AsyncStorageService } from '@/services/AsyncStorageService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from 'react-native-paper';


export default function DreamList() {
    const [dreams, setDreams] = useState<DreamData[]>([]);
    const router = useRouter();

    const fetchData = async () => {
        try {
            const formDataArray: DreamData[] = await AsyncStorageService.getData(AsyncStorageConfig.keys.dreamsArrayKey);
            setDreams(formDataArray);
        } catch (error) {
            console.error('Erreur lors de la récupération des données:', error);
        }
    };

    // Chargement initial
    useEffect(() => {
        fetchData();
    }, []);

    // Rechargement quand on revient sur l’écran
    useFocusEffect(
        useCallback(() => {
            fetchData();
            return () => {
                console.log('This route is now unfocused.');
            };
        }, [])
    );

    const handleResetDreams = async (): Promise<void> => {
        try {
            await AsyncStorage.setItem('dreamFormDataArray', JSON.stringify([]));

            const emptyDreamsData: DreamData[] = [];

            await AsyncStorageService.setData(AsyncStorageConfig.keys.dreamsArrayKey, emptyDreamsData);

            setDreams(emptyDreamsData);

        } catch (error) {
            console.error('Erreur lors de la réinitialisation des données:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Liste des Rêves :</Text>
            {dreams.length > 0 ? (
                dreams.map((dream, index) => (
                    <TouchableOpacity 
                        key={dream.id || index} 
                        style={styles.dreamCard}
                        onPress={() => router.push(`/dream/${dream.id}`)}
                    >
                        <Text style={styles.dreamTitle}>
                            {dream.title || 'Sans titre'}
                        </Text>
                        <Text style={styles.dreamDate}>
                            📅 {dream.date} {dream.time ? `à ${dream.time}` : ''}
                        </Text>
                        <Text style={styles.dreamText} numberOfLines={2}>
                            {dream.dreamText}
                        </Text>
                        <View style={styles.dreamMeta}>
                            <Text style={styles.dreamType}>
                                {dream.dreamType === 'lucide' && '✨ Lucide'}
                                {dream.dreamType === 'cauchemar' && '😱 Cauchemar'}
                                {dream.dreamType === 'ordinaire' && '💭 Ordinaire'}
                                {dream.dreamType === 'recurring' && '🔄 Récurrent'}
                            </Text>
                            {dream.mood && (
                                <Text style={styles.dreamMood}>
                                    {dream.mood === 'positive' && '😊'}
                                    {dream.mood === 'negative' && '😢'}
                                    {dream.mood === 'neutre' && '😐'}
                                </Text>
                            )}
                        </View>
                        {dream.tags && dream.tags.length > 0 && (
                            <Text style={styles.dreamTags}>
                                🏷️ {dream.tags.join(', ')}
                            </Text>
                        )}
                    </TouchableOpacity>
                ))
            ) : (
                <Text style={styles.emptyText}>Aucun rêve enregistré</Text>
            )}

            <Button
                mode="contained"
                onPress={handleResetDreams}
                style={styles.button}
                buttonColor="#d32f2f"
            >
                🗑️ Reset Dreams
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    dreamCard: {
        backgroundColor: '#f5f5f5',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#6200ee',
    },
    dreamTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    dreamDate: {
        fontSize: 12,
        color: '#666',
        marginBottom: 8,
    },
    dreamText: {
        fontSize: 14,
        marginBottom: 8,
        color: '#333',
    },
    dreamMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    dreamType: {
        fontSize: 12,
        fontWeight: '600',
    },
    dreamMood: {
        fontSize: 16,
    },
    dreamTags: {
        fontSize: 12,
        color: '#888',
        fontStyle: 'italic',
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        marginTop: 40,
    },
    button: {
        marginTop: 20,
    },
});
