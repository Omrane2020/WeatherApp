import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

export const useAuthLogic = () => {
    const { user } = useAuth();
    const { showAlert } = useAlert();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    // --- Google Auth Configuration ---
    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    });

    useEffect(() => {
        const handleGoogleResponse = async () => {
            if (response?.type === 'success') {
                setIsGoogleLoading(true);
                try {
                    const { id_token } = response.params;
                    if (id_token) {
                        const credential = GoogleAuthProvider.credential(id_token);
                        await signInWithCredential(auth, credential);
                    }
                } catch (error) {
                    console.error('Google Auth Error:', error);
                    showAlert({
                        title: 'Erreur Google',
                        message: 'Impossible de se connecter avec Google',
                        type: 'error'
                    });
                } finally {
                    setIsGoogleLoading(false);
                }
            } else if (response?.type === 'error') {
                showAlert({
                    title: 'Erreur',
                    message: 'La connexion Google a échoué',
                    type: 'error'
                });
            }
        };

        handleGoogleResponse();
    }, [response]);

    const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

    const validateForm = (): boolean => {
        if (!email.trim()) {
            showAlert({ title: 'Champ requis', message: 'Veuillez saisir votre email', type: 'warning' });
            return false;
        }
        if (!validateEmail(email)) {
            showAlert({ title: 'Format invalide', message: 'Veuillez saisir un email valide', type: 'warning' });
            return false;
        }
        if (!password.trim()) {
            showAlert({ title: 'Champ requis', message: 'Veuillez saisir votre mot de passe', type: 'warning' });
            return false;
        }
        if (password.length < 6) {
            showAlert({ title: 'Sécurité', message: 'Le mot de passe doit contenir au moins 6 caractères', type: 'warning' });
            return false;
        }
        return true;
    };

    const handleEmailLogin = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
            let errorMessage = 'Une erreur est survenue lors de la connexion';
            if (error.code === 'auth/user-not-found') errorMessage = 'Aucun utilisateur trouvé avec cet email';
            else if (error.code === 'auth/wrong-password') errorMessage = 'Mot de passe incorrect';
            else if (error.code === 'auth/invalid-email') errorMessage = 'Email invalide';
            else if (error.code === 'auth/too-many-requests') errorMessage = 'Trop de tentatives. Réessayez plus tard';

            showAlert({ title: 'Erreur de connexion', message: errorMessage, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        setIsGoogleLoading(true);
        promptAsync({ useProxy: true } as any).catch(() => {
            setIsGoogleLoading(false);
        });
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        isLoading,
        isGoogleLoading,
        handleEmailLogin,
        handleGoogleLogin
    };
};
