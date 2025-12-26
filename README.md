# WeatherApp - Application Météo React Native

Une application mobile React Native avec authentification Firebase et recherche météo via OpenWeatherMap.

## Fonctionnalités

- **Écran de connexion** : Authentification par email/mot de passe et Google via Firebase.
- **Écran de recherche météo** : Recherche de villes, affichage des données météo avec détails expandables.

## Architecture du projet
Le projet suit une architecture modulaire et propre avec séparation des préoccupations :

- **src/components/** : Composants réutilisables (CustomButton, CustomInput, WeatherCard)
- **src/hooks/** : Hooks personnalisés (useWeather)
- **src/context/** : Contextes globaux (AuthContext)
- **src/constants/** : Constantes (couleurs, URLs)
- **src/utils/** : Utilitaires (alerts)
- **src/services/** : Services externes (Firebase, Weather API)
- **src/screens/** : Écrans de l'app
- **src/types/** : Types TypeScript

Utilise des hooks pour la logique métier, des composants pour la réutilisabilité, et un contexte pour l'état global d'authentification.

## Installation

1. Clonez le repository :
   ```bash
   git clone <url>
   cd WeatherApp
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Configurez Firebase :
   - Créez un projet sur [Firebase Console](https://console.firebase.google.com).
   - Activez Authentication avec Email/Password et Google.
   - Obtenez les clés API et mettez-les dans `.env`.

4. Configurez OpenWeatherMap :
   - Inscrivez-vous sur [OpenWeatherMap](https://openweathermap.org/api).
   - Obtenez votre clé API et mettez-la dans `.env`.

5. Configurez Google OAuth :
   - Dans Firebase, configurez Google Sign-In.
   - Obtenez le Client ID et mettez-le dans `.env`.

6. Lancez l'application :
   ```bash
   npm start
   ```

## Variables d'environnement

Créez un fichier `.env` à la racine avec :

```
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
OPENWEATHER_API_KEY=your_openweather_api_key
GOOGLE_CLIENT_ID=your_google_client_id
```

## Technologies utilisées

- React Native
- Expo
- Firebase Authentication
- OpenWeatherMap API
- React Navigation
- Axios

## Captures d'écran
![interface login](/ScreenShoot/2425.jpg)
![warning alert](/ScreenShoot/2435.jpg)
![alerts echec](/ScreenShoot/2437.jpg)
![connexion avec firebass](/ScreenShoot/Screenshot_20251226-203306.jpg)
![interface principale](/ScreenShoot/2433.jpg)
![interface principale'](/ScreenShoot/Screenshot_20251226-210918.png)
![Consamation de'api](/ScreenShoot/Screenshot_20251226-210945.png)
![Alert de Historique qui'l soit efface ](/ScreenShoot/Screenshot_20251226-201945.jpg)
## Gestion des erreurs

- Erreurs d'authentification affichées via Alert.
- Erreurs API météo gérées avec messages utilisateur.
- Animations de chargement pendant les appels API.