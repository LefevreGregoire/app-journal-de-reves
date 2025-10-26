# Journal de Rêves - Starter Kit

## Présentation

Bienvenue dans le starter kit du projet Journal de Rêves, une base solide pour développer une application mobile immersive dédiée à l'enregistrement, l'analyse et l'exploration des rêves.

## Technologies utilisées

- **Expo** - Framework de développement et déploiement multiplateforme
- **React Native** - Création d'interfaces mobiles natives
- **TypeScript** - Base de code robuste avec typage statique
- **React Native Paper** - Librairie de composants Material Design
- **AsyncStorage** - Gestion de la persistance locale des données

## Structure et architecture

Le projet suit une architecture simple mais extensible. 

### Structure générale

```
dreams-report-app/
├── components/
│   ├── DreamForm.tsx          # Formulaire d'ajout de rêve
│   ├── DreamList.tsx          # Liste d'affichage des rêves
│   
├── services/
│   ├── AsyncStorageService.ts # Gestion centralisée du stockage
│   
├── constants/
│   ├── AsyncStorageConfig.ts  # Clés de stockage et constantes
│   
├── interfaces/
│   ├── DreamData.ts           # Définition du type Dream
│   
├── app/                        # Point d'entrée de l'application
```

## Installation et lancement

### Étape 1 : Installation des dépendances

```bash
npm install
```

### Étape 2 : Démarrage du serveur de développement

```bash
npx expo start
```

### Étape 3 : Exécution sur un appareil ou un émulateur

Vous pouvez lancer l'application de plusieurs manières :

**Sur un appareil physique :**
Scannez le QR Code affiché dans le terminal ou le navigateur à l'aide de l'application Expo Go (disponible sur iOS et Android).

**Sur un émulateur :**
Sélectionnez "Run on iOS simulator" ou "Run on Android device/emulator" dans Expo Developer Tools, selon votre environnement.

### Étape 4 : Nettoyer le cache (optionnel)

Si vous rencontrez des comportements inattendus :

```bash
npx expo start -c
```

Cette commande reconstruit le cache de bundling d'Expo.

## Documentation complète

Pour une documentation technique détaillée incluant l'architecture, les fonctionnalités implémentées, et les guides de développement, consultez le fichier [DOCUMENTATION.md](DOCUMENTATION.md).

## Auteur et licence

Projet académique - Développé par Julien COURAUD pour servir de base à un projet étudiant.

---

Adapté et enrichi par Grégoire Lefèvre - EPSI 2025
