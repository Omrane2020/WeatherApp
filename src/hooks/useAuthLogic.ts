import { useState } from 'react';
import { Alert } from 'react-native';
import { signInWithEmailAndPassword, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../services/firebase';
import * as AuthSession from 'expo-auth-session';

export const useAuthLogic = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const validateEmail = (email: string): boolean => {
        const emailRegex = /\S+@\S+\.\S+/;
        return emailRegex.test(email);
    };

    const validateForm = (email: string, password: string): boolean => {
        if (!email.trim()) {
            Alert.alert('Erreur', 'Veuillez saisir votre email');
            return false;
        }
        if (!validateEmail(email)) {
            Alert.alert('Erreur', 'Veuillez saisir un email valide');
            return false;
        }
        if (!password.trim()) {
            Alert.alert('Erreur', 'Veuillez saisir votre mot de passe');
            return false;
        }
        if (password.length < 6) {
            Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
            return false;
        }
        return true;
    };

    const handleEmailLogin = async (email: string, password: string): Promise<void> => {
        if (!validateForm(email, password)) return;

        setIsLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
            let errorMessage = 'Une erreur est survenue lors de la connexion';
            switch (error.code) {
                case 'auth/user-not-found':
                    errorMessage = 'Aucun utilisateur trouvé avec cet email';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Mot de passe incorrect';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Email invalide';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Trop de tentatives. Veuillez réessayer plus tard';
                    break;
                default:
                    console.error('Login error:', error);
            }
            Alert.alert('Erreur de connexion', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async (): Promise<void> => {
        setIsGoogleLoading(true);
        try {
            const redirectUriOptions: any = { useProxy: true };
            const redirectUri = AuthSession.makeRedirectUri(redirectUriOptions);

            const request = new AuthSession.AuthRequest({
                clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
                scopes: ['openid', 'profile', 'email'],
                redirectUri,
                responseType: 'id_token',
                extraParams: {
                    nonce: Math.random().toString(36).substring(2, 15),
                },
            });

            const result = await request.promptAsync({
                authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
            });

            if (result.type === 'success') {
                const { id_token } = result.params;
                if (id_token) {
                    const credential = GoogleAuthProvider.credential(id_token);
                    await signInWithCredential(auth, credential);
                }
            }
        } catch (error) {
            console.error('Google login error:', error);
            Alert.alert('Erreur', 'Impossible de se connecter avec Google');
        } finally {
            setIsGoogleLoading(false);
        }
    };

    return {
        isLoading,
        isGoogleLoading,
        handleEmailLogin,
        handleGoogleLogin,
    };
};
