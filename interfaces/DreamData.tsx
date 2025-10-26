// interfaces/DreamData.tsx
// Interface TypeScript pour typer les rêves

export interface DreamData {
  id: string; // ID unique généré avec Date.now()
  title: string; 
  dreamText: string; // Description du rêve
  date: string; // Date au format YYYY-MM-DD
  time?: string; // Heure optionnelle (deprecated, remplacé par sleepDuration)
  sleepDuration?: number; // Durée de sommeil en heures
  
  // Type et caractéristiques du rêve
  dreamType: 'cauchemar' | 'lucide' | 'ordinaire' | 'recurring' | 'autre';
  isLucidDream: boolean; // Flag pour les rêves lucides
  
  // États émotionnels
  emotionBefore?: string; 
  emotionAfter?: string; 
  emotionalIntensity?: number; // De 1 à 10
  mood?: 'positive' | 'negative' | 'neutre'; // Tonalité 
  
  // Détails
  characters?: string[]; // Liste des personnages (split par virgules dans le form)
  location?: string; // Lieu du rêve
  clarity?: number; // Clarté de 1 à 10
  sleepQuality?: number; // Qualité sommeil de 1 à 10
  
  // Métadonnées et tags
  tags?: string[]; // Mots-clés
  personalMeaning?: string; // Signification perso du rêve
  
  // Timestamps auto
  createdAt: string; // Date de création ISO
  updatedAt?: string; // Date modif si édité
}