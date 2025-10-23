// Définition du type pour un rêve
export interface DreamData {
  id: string; // ID unique du rêve
  title: string; // Titre du rêve
  dreamText: string; // Description complète
  date: string; // Date du rêve
  time?: string; // Heure du rêve
  
  // Type et caractéristiques
  dreamType: 'cauchemar' | 'lucide' | 'ordinaire' | 'recurring' | 'autre'; // Type de rêve
  isLucidDream: boolean; // Rêve lucide ou non
  
  // Émotions
  emotionBefore?: string; // État émotionnel avant le rêve
  emotionAfter?: string; // État émotionnel après le rêve
  emotionalIntensity?: number; // Intensité émotionnelle (1-10)
  mood?: 'positive' | 'negative' | 'neutre'; // Tonalité globale
  
  // Détails du rêve
  characters?: string[]; // Personnages présents
  location?: string; // Lieu du rêve
  clarity?: number; // Clarté du rêve (1-10)
  sleepQuality?: number; // Qualité du sommeil (1-10)
  
  // Métadonnées
  tags?: string[]; // Tags ou mots-clés
  personalMeaning?: string; // Signification personnelle
  
  // Dates système
  createdAt: string; // Date de création
  updatedAt?: string; // Date de modification
}