# 📖 Journal de Rêves - Documentation Technique

## 🎯 Projet
**Nom:** Journal de Rêves  
**Type:** Application mobile React Native / Expo  
**Auteur:** Grégoire Lefèvre  
**École:** EPSI 2025  
**Date:** Octobre 2025

---

## 🚀 Lancer l'application

### Prérequis
- Node.js (v20.19.2 ou supérieur)
- npm (v9.2.0 ou supérieur)
- Expo Go installé sur votre smartphone (iOS ou Android)

### Installation

```bash
# 1. Installer les dépendances
npm install

# 2. Démarrer le serveur de développement
npm start
```

### Lancement sur appareil

**Option 1 : Sur smartphone (recommandé)**
1. Ouvrez l'application **Expo Go** sur votre téléphone
2. Scannez le QR Code affiché dans le terminal
3. L'application se chargera automatiquement

**Option 2 : Sur émulateur**
```bash
# Android
npm run android

# iOS 
npm run ios
```

### Nettoyer le cache (si problème)
```bash
npx expo start -c
```

---

## 🏗️ Structure du Projet

```
dreams-report-app/
├── app/                          # Pages et navigation (Expo Router)
│   ├── (tabs)/                   # Navigation par onglets
│   │   ├── index.tsx             # 📝 Page d'ajout de rêve
│   │   ├── two.tsx               # 📋 Liste des rêves
│   │   ├── search.tsx            # 🔍 Recherche et filtrage
│   │   ├── stats.tsx             # 📊 Statistiques
│   │   ├── calendar.tsx          # 📅 Calendrier
│   │   ├── three.tsx             # ℹ️ À propos + Export
│   │   └── _layout.tsx           # Configuration des onglets
│   ├── dream/
│   │   ├── [id].tsx              # 👁️ Détails d'un rêve
│   │   └── edit/
│   │       └── [id].tsx          # ✏️ Édition d'un rêve
│   └── _layout.tsx               # Layout racine
├── components/                    # Composants réutilisables
│   ├── DreamForm.tsx             # Formulaire d'ajout de rêve
│   ├── DreamList.tsx             # Liste des rêves
│   └── Themed.tsx                # Composants thématisés
├── interfaces/                    # Types TypeScript
│   └── DreamData.tsx             # Interface DreamData
├── services/                      # Services métier
│   └── AsyncStorageService.tsx   # Gestion du stockage
├── constants/                     # Constantes globales
│   ├── AsyncStorageConfig.ts     # Clés de stockage
│   └── Colors.ts                 # Thème de couleurs
└── assets/                        # Images et ressources
```

---

## 🎨 Architecture

### Pattern : Service-Oriented Architecture (SOA)

#### 1. **Couche de Données**
- **AsyncStorage** : Stockage local persistant
- **AsyncStorageService** : Abstraction du stockage
  ```typescript
  export const AsyncStorageService = {
    getData: async (key: string): Promise<DreamData[]>
    setData: async (key: string, data: DreamData[]): Promise<void>
  }
  ```

#### 2. **Couche Métier**
- **Interfaces TypeScript** : Typage fort des données
- **DreamData** : Structure complète d'un rêve (12+ champs)

#### 3. **Couche Présentation**
- **Expo Router** : Navigation file-based
- **React Native Paper** : Composants Material Design
- **Composants React** : State management avec hooks

### Flux de données

```
User Input → Component → Service → AsyncStorage
                ↓
            State Update
                ↓
            Re-render UI
```

---

## ✨ Fonctionnalités Implémentées

### 🔵 Exigences OBLIGATOIRES

#### 1. Formulaire Enrichi (12/12 champs ✅)
- ✅ Date et Heure du rêve
- ✅ Type de rêve (cauchemar, lucide, ordinaire, récurrent, autre)
- ✅ État émotionnel avant le rêve
- ✅ État émotionnel après le rêve
- ✅ **Intensité émotionnelle** (1-10) avec SegmentedButtons
- ✅ Personnages présents (séparés par virgules)
- ✅ Lieu du rêve
- ✅ **Clarté du rêve** (1-10) avec SegmentedButtons
- ✅ Tags/Mots-clés (séparés par virgules)
- ✅ **Qualité du sommeil** (1-10) avec SegmentedButtons
- ✅ Signification personnelle (multiline)
- ✅ Tonalité globale (positive, négative, neutre)

**Implémentation :**
```typescript
// components/DreamForm.tsx
const [emotionalIntensity, setEmotionalIntensity] = useState<number>(5);
const [clarity, setClarity] = useState<number>(5);
const [sleepQuality, setSleepQuality] = useState<number>(5);
```

#### 2. Suppression/Modification ✅
- **Modification** : Page dédiée `/dream/edit/[id].tsx`
  - Chargement des données existantes
  - Formulaire pré-rempli
  - Sauvegarde avec mise à jour du timestamp
  
- **Suppression** : Confirmation avant suppression
  ```typescript
  Alert.alert("Supprimer ce rêve ?", "Cette action est irréversible.", [
    { text: "Annuler", style: "cancel" },
    { text: "Supprimer", style: "destructive", onPress: handleDelete }
  ]);
  ```

#### 3. Recherche et Filtrage ✅
- **Recherche textuelle** : Titre, description, tags, lieu, personnages
- **Filtrage par type** : Tous, Lucide, Cauchemar, Ordinaire
- **Compteur de résultats** : Affichage dynamique
- **Navigation** : Clic sur résultat → Détail du rêve

**Implémentation :**
```typescript
// app/(tabs)/search.tsx
const filterDreams = () => {
  let results = [...allDreams];
  if (filterType !== 'all') {
    results = results.filter(d => d.dreamType === filterType);
  }
  if (searchQuery.trim()) {
    results = results.filter(dream => 
      dream.title?.toLowerCase().includes(query) ||
      dream.dreamText?.toLowerCase().includes(query) ||
      dream.tags?.some(t => t.toLowerCase().includes(query))
    );
  }
  setFilteredDreams(results);
};
```

---

### 🎁 Fonctionnalités BONUS

#### 4. Amélioration Graphique ✅
- **Design moderne** avec React Native Paper
- **Material Design** : Cards, SegmentedButtons, TextInput outlined
- **Icônes Emoji** pour une meilleure UX
- **Couleurs cohérentes** : Palette violette (#6200ee)
- **Navigation fluide** : 6 onglets bien organisés
- **Responsive** : Grille adaptative pour les statistiques

#### 5. Statistiques et Graphiques ✅
**Page dédiée avec :**
- **4 cartes principales** :
  - Total de rêves 🌙
  - Rêves cette semaine 📅
  - Rêves ce mois 📆
  - Rêves lucides ✨

- **Barres de progression** :
  - Types de rêves (%, couleurs distinctes)
  - Tonalités émotionnelles (%, code couleur)
  
- **Top 5 des tags** fréquents avec compteurs

**Implémentation :**
```typescript
// app/(tabs)/stats.tsx
const calculateStats = (dreamsData: DreamData[]) => {
  const total = dreamsData.length;
  const lucid = dreamsData.filter(d => d.dreamType === 'lucide').length;
  
  // Tags fréquents
  const tagCounts: { [key: string]: number } = {};
  dreamsData.forEach(dream => {
    dream.tags?.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  
  const mostFrequentTags = Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
};
```

#### 6. Exportation des Rêves ✅
**Deux formats disponibles** :

1. **JSON structuré** :
   - Tous les champs préservés
   - Format réimportable
   - Idéal pour backup

2. **Texte formaté** :
   - Lisible et présenté
   - Séparateurs visuels
   - Métadonnées (date export, total)

**Partage natif** via Share API React Native :
```typescript
await Share.share({
  message: textContent,
  title: 'Mes rêves (Texte)',
});
```

Compatible avec : Email, WhatsApp, Drive, Notes, etc.

#### 7. API Phases Lunaires ✅
**Intégration moon-phase API** :
- Récupération automatique de la phase lunaire
- Affichage avec emoji correspondant :
  - 🌑 Nouvelle lune
  - 🌒 Premier croissant
  - 🌓 Premier quartier
  - 🌔 Lune gibbeuse croissante
  - 🌕 Pleine lune
  - 🌖 Lune gibbeuse décroissante
  - 🌗 Dernier quartier
  - 🌘 Dernier croissant

**Implémentation :**
```typescript
const fetchMoonPhase = async (date: string) => {
  const response = await fetch(
    `https://moon-phase.p.rapidapi.com/advanced?date=${date}`,
    {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'DEMO',
        'X-RapidAPI-Host': 'moon-phase.p.rapidapi.com'
      }
    }
  );
  const data = await response.json();
  setMoonPhase(getMoonPhaseEmoji(data.phase) + ' ' + data.phase);
};
```

**Affichage** dans la page de détail du rêve sous la date.

#### 8. Calendrier Interactif ✅
**Fonctionnalités** :
- Vue mensuelle avec `react-native-calendars`
- Points bleus sur les dates avec rêves
- Sélection de date → Liste des rêves du jour
- Navigation entre mois
- Thème personnalisé violet
- Aperçu rapide : titre, type, mood, tags

---

## 🛠️ Technologies Utilisées

### Core
- **Expo** ~54.0.10 : Framework React Native
- **React** 19.1.0 : Bibliothèque UI
- **React Native** 0.81.4 : Plateforme mobile
- **TypeScript** ~5.9.2 : Typage statique

### UI/UX
- **React Native Paper** ^5.14.5 : Material Design
- **@expo/vector-icons** ^15.0.2 : Icônes FontAwesome
- **react-native-calendars** ^1.1313.0 : Calendrier

### Navigation
- **expo-router** ~6.0.8 : Routing file-based
- **@react-navigation/native** ^7.1.8 : Navigation

### Stockage
- **@react-native-async-storage/async-storage** 2.2.0 : Persistance

---

## 📱 Captures d'écran

### 1. Page d'ajout de rêve
- Formulaire complet avec tous les champs
- SegmentedButtons pour sélections multiples
- Validation avant enregistrement

### 2. Liste des rêves
- Cards avec aperçu
- Type, mood, tags affichés
- Navigation vers détail
- Bouton reset

### 3. Page de recherche
- Barre de recherche textuelle
- Filtres par type (SegmentedButtons)
- Compteur de résultats
- Liste filtrée

### 4. Statistiques
- 4 cartes en grille
- Barres de progression colorées
- Top 5 tags avec compteurs
- Design moderne

### 5. Calendrier
- Vue mensuelle
- Marqueurs sur dates
- Liste du jour sélectionné
- Thème violet

### 6. Détails d'un rêve
- Toutes les informations
- Phase lunaire affichée
- Boutons Modifier/Supprimer
- Section signification

### 7. Export et À propos
- Description de l'app
- 2 boutons d'export
- Partage natif
- Liste des fonctionnalités

---

## 🔧 Configuration

### AsyncStorage Keys
```typescript
// constants/AsyncStorageConfig.ts
export const AsyncStorageConfig = {
  keys: {
    dreamsArrayKey: 'dreamFormDataArray'
  }
}
```

### Thème Couleurs
```typescript
// constants/Colors.ts
export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: '#2f95dc',
    tabIconSelected: '#2f95dc',
  },
  // ...
}
```

---

## 🎓 Choix de Conception

### 1. **Expo Router (File-based routing)**
**Avantages** :
- Structure claire et intuitive
- Navigation automatique
- Deep linking natif
- Typage TypeScript fort

### 2. **AsyncStorage pour la persistance**
**Pourquoi** :
- Simple à utiliser
- Pas de serveur requis
- Données locales sécurisées
- Compatible cross-platform

### 3. **Service Pattern**
**Bénéfices** :
- Séparation des préoccupations
- Réutilisabilité du code
- Facilité de test
- Abstraction de l'implémentation

### 4. **TypeScript**
**Raisons** :
- Détection d'erreurs à la compilation
- Autocomplétion dans VS Code
- Documentation vivante
- Refactoring sûr

### 5. **React Native Paper**
**Choix** :
- Material Design ready-to-use
- Composants accessibles
- Thématisation facile
- Grande communauté

---

## 📚 Améliorations Futures Possibles

### Fonctionnalités
- ❌ **Notifications quotidiennes** (expo-notifications)
- ❌ **Import de données** (restauration backup)
- ❌ **Graphiques avancés** (react-native-chart-kit)
- ❌ **Photos dans les rêves** (expo-image-picker)
- ❌ **Mode sombre** complet
- ❌ **Onboarding** pour nouveaux utilisateurs
- ❌ **Partage de rêves individuels** (réseaux sociaux)
- ❌ **Analyse de symboles** (base de données)

### Technique
- Migration vers **Expo SDK 55+**
- Tests unitaires avec **Jest**
- Tests E2E avec **Detox**
- CI/CD avec **GitHub Actions**
- Backend avec **Firebase** ou **Supabase**
- Synchronisation cloud

---

## 🐛 Résolution de Problèmes

### L'app ne se lance pas
```bash
# Nettoyer le cache
npx expo start -c

# Réinstaller les dépendances
rm -rf node_modules
npm install
```

### Erreur AsyncStorage
```bash
# Vérifier l'installation
npm install @react-native-async-storage/async-storage
```

### Problème de build
```bash
# Vérifier les versions
npx expo-doctor
```

---

## 📄 Licence

Projet étudiant - EPSI 2025  
Développé avec ❤️ par Grégoire Lefèvre

---

## 📞 Contact

Pour toute question concernant le projet :
- École : EPSI
- Année : 2025
- Projet : TP Journal de Rêves

---

**Fin de la documentation technique** ✨
