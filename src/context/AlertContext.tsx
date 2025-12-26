import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import AwesomeAlert from 'react-native-awesome-alerts';
import { COLORS, SHADOWS, FONTS } from '../constants';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertOptions {
    title: string;
    message: string;
    type?: AlertType;
    onConfirm?: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    showCancelButton?: boolean;
}

interface AlertContextType {
    showAlert: (options: AlertOptions) => void;
    hideAlert: () => void;
}

// Création du contexte pour les alertes globales
const AlertContext = createContext<AlertContextType | undefined>(undefined);

/**
 * Hook personnalisé pour accéder facilement aux fonctions d'alerte
 */
export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert must be used within an AlertProvider');
    }
    return context;
};

interface AlertProviderProps {
    children: ReactNode;
}

/**
 * Provider qui encapsule l'application et gère l'affichage de AwesomeAlert
 */
export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
    // --- État de l'alerte ---
    const [visible, setVisible] = useState(false);
    const [options, setOptions] = useState<AlertOptions>({
        title: '',
        message: '',
        type: 'info',
    });

    /**
     * Affiche une nouvelle alerte avec les options spécifiées
     */
    const showAlert = useCallback((newOptions: AlertOptions) => {
        setOptions({
            ...newOptions,
            type: newOptions.type || 'info',
        });
        setVisible(true);
    }, []);

    /**
     * Masque l'alerte actuellement affichée
     */
    const hideAlert = useCallback(() => {
        setVisible(false);
    }, []);

    /**
     * Détermine la couleur de confirmation en fonction du type d'alerte
     */
    const getAlertColor = () => {
        switch (options.type) {
            case 'success': return COLORS.success;
            case 'error': return COLORS.error;
            case 'warning': return COLORS.warning;
            case 'info': return COLORS.primary;
            default: return COLORS.primary;
        }
    };

    return (
        <AlertContext.Provider value={{ showAlert, hideAlert }}>
            {children}
            <AwesomeAlert
                show={visible}
                showProgress={false}
                title={options.title}
                message={options.message}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showCancelButton={options.showCancelButton}
                showConfirmButton={true}
                cancelText={options.cancelText || 'Annuler'}
                confirmText={options.confirmText || 'OK'}
                confirmButtonColor={getAlertColor()}
                cancelButtonColor={COLORS.gray + '50'}
                onCancelPressed={() => {
                    hideAlert();
                    if (options.onCancel) options.onCancel();
                }}
                onConfirmPressed={() => {
                    hideAlert();
                    if (options.onConfirm) options.onConfirm();
                }}
                titleStyle={{
                    ...FONTS.h3,
                    color: COLORS.text,
                }}
                messageStyle={{
                    ...FONTS.body2,
                    color: COLORS.gray,
                    textAlign: 'center',
                }}
                contentContainerStyle={{
                    borderRadius: 20,
                    padding: 10,
                    ...SHADOWS.dark,
                }}
                confirmButtonStyle={{
                    borderRadius: 12,
                    paddingHorizontal: 24,
                    paddingVertical: 10,
                }}
                cancelButtonStyle={{
                    borderRadius: 12,
                    paddingHorizontal: 24,
                    paddingVertical: 10,
                }}
                confirmButtonTextStyle={{
                    ...FONTS.body2,
                    fontWeight: 'bold',
                }}
            />
        </AlertContext.Provider>
    );
};
