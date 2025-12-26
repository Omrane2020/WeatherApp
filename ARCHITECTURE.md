# Architecture du Projet - WeatherLive 🌤️

Ce document détaille l'architecture technique, les choix technologiques et les bonnes pratiques appliquées dans le développement de l'application **WeatherLive**.

## 🏗️ Structure du Projet

L'application suit une structure modulaire pour garantir la maintenabilité et l'évolutivité :

```text
src/
├── components/     # Composants UI réutilisables et atomiques
├── constants/      # Configuration centralisée (couleurs, thèmes, API)
├── context/        # Gestion d'état globale via React Context API
├── hooks/          # Logique métier encapsulée dans des hooks personnalisés
├── screens/        # Composants de pages (Login, Weather, etc.)
├── services/       # Connecteurs API et services externes (Firebase, Weather API)
└── utils/          # Fonctions utilitaires et helpers (Storage, Formattage)
```

## 🛠️ Architecture Technique

### 1. Gestion de l'État (State Management)
Nous utilisons la **Context API** de React pour éviter le "prop drilling" et gérer les états globaux :
- **AuthContext** : Gère la session utilisateur avec Firebase Auth.
- **AlertContext** : Fournit un système d'alertes premium (`AwesomeAlerts`) accessible partout dans l'application.

### 2. Séparation des Responsabilités (SoC)
- **UI Logic** : Les écrans se concentrent sur la structure et le rendu.
- **Business Logic** : La logique complexe est déportée dans des **Custom Hooks** (ex: `useWeather`) ou des services.
- **Services layer** : Les appels API sont centralisés dans `src/services` pour faciliter le changement de fournisseur de données si nécessaire.

### 3. Design System & UI
L'application utilise un système de design cohérent défini dans `src/constants` :
- Palette de couleurs harmonieuse (Indigo, Slate).
- Échelles de typographie et d'espacement normalisées.
- Utilisation de **Glassmorphism** et de gradients pour un effet premium.

## ✅ Bonnes Pratiques Appliquées

### 🚀 Performance & Optimisation
- **Memoization** : Utilisation de `React.memo`, `useCallback` et `useMemo` pour éviter les rendus inutiles.
- **FlatList** : Utilisation optimisée des listes pour le rendu des données météo.
- **Animated API** : Animations fluides utilisant le driver natif (`useNativeDriver: true`).

### 🛡️ Type Safety
L'usage de **TypeScript** garantit une détection précoce des erreurs et une auto-complétion efficace. Les interfaces (ex: `WeatherData`) sont définies pour assurer la cohérence des données transigées.

### 🧪 Expérience Utilisateur (UX)
- **Feedback Immédiat** : Utilisation de `ActivityIndicator` et de skelettons de chargement.
- **Gestion d'Erreurs** : Centralisation des messages d'erreur via un système d'alerte visuel (`AwesomeAlerts`) plutôt que des alertes système basiques.
- **Persistance** : Sauvegarde des recherches récentes localement via un wrapper utilitaire pour `AsyncStorage`.

### 🧹 Propreté du Code
- **DRY (Don't Repeat Yourself)** : Extraction des composants communs (`CustomInput`, `CustomButton`).
- **Imports Propres** : Organisation logique des imports et suppression des bibliothèques inutilisées.
- **Commentaires Utiles** : Documentation de la logique complexe et des choix d'architecture.
