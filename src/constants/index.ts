export const COLORS = {
  background: '#F8FAFC',
  primary: '#4F46E5', // Indigo-600
  secondary: '#7C3AED', // Violet-600
  accent: '#F43F5E', // Rose-500
  text: '#0F172A', // Slate-900
  gray: '#64748B', // Slate-500
  lightGray: '#E2E8F0', // Slate-200
  white: '#FFFFFF',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  lightPrimary: '#4F46E510',
  lightBackground: '#F8FAFC',
  shadow: '#000',
  // Glassmorphism variants
  glassBackground: 'rgba(255, 255, 255, 0.7)',
  glassBorder: 'rgba(255, 255, 255, 0.3)',
};

export const GRADIENTS = {
  primary: ['#4F46E5', '#7C3AED'],
  sunny: ['#F59E0B', '#D97706'],
  cloudy: ['#64748B', '#475569'],
  rainy: ['#2563EB', '#1D4ED8'],
  night: ['#1E293B', '#0F172A'],
};

export const SIZES = {
  base: 8,
  small: 12,
  font: 14,
  medium: 16,
  large: 18,
  extraLarge: 24,
  // Ajouter ces propriétés si nécessaire
  padding: 20,
  radius: 16,
};

export const FONTS = {
  h1: { fontSize: 32, fontWeight: '800' as const },
  h2: { fontSize: 28, fontWeight: '700' as const },
  h3: { fontSize: 24, fontWeight: '600' as const },
  h4: { fontSize: 20, fontWeight: '600' as const },
  body1: { fontSize: 18, fontWeight: '500' as const },
  body2: { fontSize: 16, fontWeight: '400' as const },
  body3: { fontSize: 14, fontWeight: '400' as const },
  body4: { fontSize: 12, fontWeight: '400' as const },
  // Ajouter body5 si nécessaire
  body5: { fontSize: 10, fontWeight: '400' as const },
};

export const SHADOWS = {
  light: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  dark: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
};

export const API_URLS = {
  WEATHER_BASE: 'https://api.openweathermap.org/data/2.5/weather',
};

export const NAVIGATION_ROUTES = {
  LOGIN: 'Login',
  WEATHER: 'Weather',
};