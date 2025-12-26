import React from 'react';
import {
  TextInput,
  StyleSheet,
  TextInputProps,
  View,
  ViewStyle,
  Text
} from 'react-native';

interface CustomInputProps extends TextInputProps {
  placeholder: string;
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
}

/**
 * Champ de saisie personnalisé avec support d'icônes, de labels et de gestion d'erreurs
 */
const CustomInput: React.FC<CustomInputProps> = ({
  label,
  error,
  icon,
  rightIcon,
  containerStyle,
  style,
  ...props
}) => {
  return (
    <View style={containerStyle}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[
        styles.inputContainer,
        error && styles.inputContainerError,
        props.editable === false && styles.inputDisabled
      ]}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <TextInput
          style={[
            styles.input,
            icon ? { marginLeft: 0 } : undefined,
            rightIcon ? { marginRight: 0 } : undefined,
            style
          ]}
          placeholderTextColor="#9CA3AF"
          {...props}
        />
        {rightIcon && <View style={styles.rightIconContainer}>{rightIcon}</View>}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
  },
  inputContainerError: {
    borderColor: '#EF4444',
  },
  inputDisabled: {
    backgroundColor: '#F3F4F6',
  },
  iconContainer: {
    marginRight: 12,
  },
  rightIconContainer: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#111827',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
});

export default CustomInput;