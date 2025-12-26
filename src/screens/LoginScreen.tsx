import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    TextStyle
} from 'react-native';
import { signInWithEmailAndPassword, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../services/firebase';
import * as AuthSession from 'expo-auth-session';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import { GoogleSignInButton } from '../components/GoogleSignInButton';
import { COLORS, SIZES, FONTS } from '../constants';
import { Ionicons } from '@expo/vector-icons';

interface LoginScreenProps {
    navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
    // --- États locaux (Local State) ---
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);

    // --- Hooks ---
    const { user } = useAuth();
    const { showAlert } = useAlert();

    // --- Navigation & Effets ---
    // Rediriger automatiquement vers l'écran météo si l'utilisateur est déjà authentifié
    useEffect(() => {
        if (user) {
            navigation.replace('Weather');
        }
    }, [user, navigation]);

    // --- Fonctions de Validation ---

    /**
     * Vérifie si le format de l'email est valide
     */
    const validateEmail = (email: string): boolean => {
        const emailRegex = /\S+@\S+\.\S+/;
        return emailRegex.test(email);
    };

    /**
     * Valide l'ensemble du formulaire de connexion
     */
    const validateForm = (): boolean => {
        if (!email.trim()) {
            showAlert({
                title: 'Champ requis',
                message: 'Veuillez saisir votre email',
                type: 'warning'
            });
            return false;
        }
        if (!validateEmail(email)) {
            showAlert({
                title: 'Format invalide',
                message: 'Veuillez saisir un email valide',
                type: 'warning'
            });
            return false;
        }
        if (!password.trim()) {
            showAlert({
                title: 'Champ requis',
                message: 'Veuillez saisir votre mot de passe',
                type: 'warning'
            });
            return false;
        }
        if (password.length < 6) {
            showAlert({
                title: 'Sécurité',
                message: 'Le mot de passe doit contenir au moins 6 caractères',
                type: 'warning'
            });
            return false;
        }
        return true;
    };

    // --- Gestionnaires d'Actions (Action Handlers) ---

    /**
     * Gère la connexion par email et mot de passe via Firebase
     */
    const handleEmailLogin = async (): Promise<void> => {
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Succès - la redirection se fait automatiquement via l'AuthContext
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

            showAlert({
                title: 'Erreur de connexion',
                message: errorMessage,
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Gère l'authentification via Google (OAuth2)
     */
    const handleGoogleLogin = async (): Promise<void> => {
        setIsGoogleLoading(true);
        try {
            console.log('Début du login Google');

            const redirectUriOptions: any = { useProxy: true };
            const redirectUri = AuthSession.makeRedirectUri(redirectUriOptions);

            console.log('Redirect URI:', redirectUri);

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

            console.log('Result Google login:', result);

            if (result.type === 'success') {
                const { id_token } = result.params;
                console.log('ID Token reçu');
                if (id_token) {
                    const credential = GoogleAuthProvider.credential(id_token);
                    await signInWithCredential(auth, credential);
                }
            }
        } catch (error) {
            console.error('Google login error:', error);
            showAlert({
                title: 'Erreur Google',
                message: 'Impossible de se connecter avec Google',
                type: 'error'
            });
        } finally {
            setIsGoogleLoading(false);
        }
    };

    const handleForgotPassword = (): void => {
        navigation.navigate('ForgotPassword');
    };

    const handleSignUp = (): void => {
        navigation.navigate('SignUp');
    };

    // --- Rendu Principal ---
    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? SIZES.base : 0}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                bounces={false}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Bon retour !</Text>
                    <Text style={styles.subtitle}>Connectez-vous à votre compte</Text>
                </View>

                <View style={styles.formContainer}>
                    <CustomInput
                        placeholder="Adresse email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                        icon={<Ionicons name="mail-outline" size={20} color={COLORS.gray} />}
                        containerStyle={styles.inputContainer}
                        editable={!isLoading}
                    />

                    <CustomInput
                        placeholder="Mot de passe"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!passwordVisible}
                        autoComplete="password"
                        icon={<Ionicons name="lock-closed-outline" size={20} color={COLORS.gray} />}
                        rightIcon={
                            <TouchableOpacity
                                onPress={() => setPasswordVisible(!passwordVisible)}
                                disabled={isLoading}
                            >
                                <Ionicons
                                    name={passwordVisible ? "eye-off-outline" : "eye-outline"}
                                    size={20}
                                    color={isLoading ? COLORS.lightGray : COLORS.gray}
                                />
                            </TouchableOpacity>
                        }
                        containerStyle={styles.inputContainer}
                        editable={!isLoading}
                    />

                    <TouchableOpacity
                        style={styles.forgotPasswordContainer}
                        onPress={handleForgotPassword}
                        disabled={isLoading || isGoogleLoading}
                        activeOpacity={0.7}
                    >
                        <Text style={[
                            styles.forgotPasswordText,
                            (isLoading || isGoogleLoading) && styles.disabledText
                        ]}>
                            Mot de passe oublié ?
                        </Text>
                    </TouchableOpacity>

                    <CustomButton
                        title="Se connecter"
                        onPress={handleEmailLogin}
                        loading={isLoading}
                        disabled={isLoading || isGoogleLoading}
                        style={styles.loginButton}
                    />

                    <View style={styles.dividerContainer}>
                        <View style={styles.divider} />
                        <Text style={styles.dividerText}>Ou continuer avec</Text>
                        <View style={styles.divider} />
                    </View>

                    <GoogleSignInButton
                        onPress={handleGoogleLogin}
                        loading={isGoogleLoading}
                        disabled={isGoogleLoading || isLoading}
                    />

                    <View style={styles.signUpContainer}>
                        <Text style={styles.signUpText}>Pas encore de compte ? </Text>
                        <TouchableOpacity
                            onPress={handleSignUp}
                            disabled={isLoading || isGoogleLoading}
                        >
                            <Text style={[
                                styles.signUpLink,
                                (isLoading || isGoogleLoading) && styles.disabledText
                            ]}>
                                S'inscrire
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: SIZES.padding,
        paddingVertical: SIZES.padding * 2,
    },
    header: {
        alignItems: 'center',
        marginBottom: SIZES.padding * 3,
    },
    title: {
        ...FONTS.h1,
        color: COLORS.text,
        marginBottom: SIZES.base,
        textAlign: 'center',
    } as TextStyle,
    subtitle: {
        ...FONTS.body2,
        color: COLORS.gray,
        textAlign: 'center',
    } as TextStyle,
    formContainer: {
        width: '100%',
    },
    inputContainer: {
        marginBottom: SIZES.padding,
    },
    forgotPasswordContainer: {
        alignSelf: 'flex-end',
        marginBottom: SIZES.padding * 2,
    },
    forgotPasswordText: {
        ...FONTS.body4,
        color: COLORS.primary,
    } as TextStyle,
    loginButton: {
        marginBottom: SIZES.padding * 2,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: SIZES.padding * 2,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: `${COLORS.gray}30`, // Ajoute de la transparence
    },
    dividerText: {
        ...FONTS.body4,
        color: COLORS.gray,
        marginHorizontal: SIZES.base,
        textAlign: 'center',
    } as TextStyle,
    signUpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: SIZES.padding * 2,
    },
    signUpText: {
        ...FONTS.body3,
        color: COLORS.text,
    } as TextStyle,
    signUpLink: {
        ...FONTS.body3,
        color: COLORS.primary,
        fontWeight: '600',
    } as TextStyle,
    disabledText: {
        color: COLORS.gray,
        opacity: 0.5,
    } as TextStyle,
});

export default LoginScreen;