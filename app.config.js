import 'dotenv/config';

export default ({ config }) => ({
    ...config,
    extra: {
        firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
        firebaseAuthDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
        firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
        firebaseStorageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
        firebaseMessagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        firebaseAppId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
        openWeatherApiKey: process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY,
        googleClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
        googleClientAndroidId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ANDROID_ID,
    },
});
