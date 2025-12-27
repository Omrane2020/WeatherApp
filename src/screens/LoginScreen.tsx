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
import { useAuth } from '../context/AuthContext';
import { useAuthLogic } from '../hooks/useAuthLogic';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import { GoogleSignInButton } from '../components/GoogleSignInButton';
import { COLORS, SIZES, FONTS } from '../constants';
import { Ionicons } from '@expo/vector-icons';

interface LoginScreenProps {
    navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
    // --- UI State ---
    const [passwordVisible, setPasswordVisible] = useState(false);

    // --- Logic Hook ---
    const {
        email,
        setEmail,
        password,
        setPassword,
        isLoading,
        isGoogleLoading,
        handleEmailLogin,
        handleGoogleLogin
    } = useAuthLogic();

    const { user } = useAuth();

    // --- Navigation Effect ---
    useEffect(() => {
        if (user) {
            navigation.replace('Weather');
        }
    }, [user, navigation]);

    // --- Navigation Handlers ---
    const handleForgotPassword = () => navigation.navigate('ForgotPassword');
    const handleSignUp = () => navigation.navigate('SignUp');

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
                            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} disabled={isLoading}>
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
                        <Text style={[styles.forgotPasswordText, (isLoading || isGoogleLoading) && styles.disabledText]}>
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
                        <TouchableOpacity onPress={handleSignUp} disabled={isLoading || isGoogleLoading}>
                            <Text style={[styles.signUpLink, (isLoading || isGoogleLoading) && styles.disabledText]}>
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