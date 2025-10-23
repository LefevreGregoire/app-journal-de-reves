// app/(tabs)/three.tsx

import { Text, View } from '@/components/Themed';
import { StyleSheet } from 'react-native';

export default function TabThreeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ℹ️ À propos</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text style={styles.description}>
        Journal de Rêves{'\n'}
        {'\n'}
        Application pour enregistrer et suivre vos rêves.{'\n'}
        {'\n'}
        Fonctionnalités :{'\n'}
        • Enregistrer vos rêves{'\n'}
        • Marquer les rêves lucides{'\n'}
        • Consulter l'historique{'\n'}
        {'\n'}
        Projet étudiant - EPSI 2025
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});
