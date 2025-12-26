import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  LayoutAnimation,
  Platform,
  UIManager
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WeatherData } from '../services/weather';
import { COLORS, SIZES, FONTS } from '../constants';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface WeatherCardProps {
  weather: WeatherData;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
  // --- États et Animations ---
  const [isExpanded, setIsExpanded] = useState(false);

  // Animation de rotation pour l'icône de développement (chevron)
  const rotateAnim = React.useRef(new Animated.Value(0)).current;

  // --- Sélecteurs et Calculs (Derived State) ---

  /**
   * Détermine l'icône Ionicons à afficher en fonction des conditions météo
   */
  const weatherIcon = useMemo(() => {
    const weatherCondition = weather.weather[0]?.main?.toLowerCase();
    const iconMap: Record<string, string> = {
      clear: 'sunny',
      clouds: 'cloud',
      rain: 'rainy',
      snow: 'snow',
      thunderstorm: 'thunderstorm',
      drizzle: 'water',
      mist: 'cloudy',
      fog: 'cloudy',
      haze: 'cloudy',
      smoke: 'cloudy',
      dust: 'cloudy',
      ash: 'cloudy',
      squall: 'cloudy',
      tornado: 'tornado-outline',
    };
    return iconMap[weatherCondition] || 'cloud';
  }, [weather.weather]);

  /**
   * Retourne une couleur représentative de la température actuelle
   */
  const temperatureColor = useMemo(() => {
    const temp = weather.main.temp;
    if (temp > 30) return '#FF6B6B'; // Hot
    if (temp > 20) return '#FFA726'; // Warm
    if (temp > 10) return '#42A5F5'; // Cool
    if (temp > 0) return '#29B6F6';  // Cold
    return '#64B5F6'; // Very cold
  }, [weather.main.temp]);

  /**
   * Gère le basculement entre l'état réduit et étendu
   * Utilise LayoutAnimation pour une transition fluide sur la hauteur
   */
  const handlePress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(prev => !prev);

    Animated.timing(rotateAnim, {
      toValue: isExpanded ? 0 : 1,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  // Interpolation de la rotation du chevron (0 deg -> 180 deg)
  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  });

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * Prépare les données détaillées pour l'affichage de la grille étendue
   */
  const weatherDetails = useMemo(() => [
    {
      label: 'Humidité',
      value: `${weather.main.humidity}%`,
      icon: 'water',
      color: '#42A5F5'
    },
    {
      label: 'Pression',
      value: `${weather.main.pressure} hPa`,
      icon: 'speedometer',
      color: '#66BB6A'
    },
    {
      label: 'Vent',
      value: `${weather.wind.speed} m/s`,
      icon: 'flag',
      color: '#FFA726'
    },
    {
      label: 'Min/Max',
      value: `${Math.round(weather.main.temp_min)}° / ${Math.round(weather.main.temp_max)}°`,
      icon: 'thermometer',
      color: '#EF5350'
    },
    {
      label: 'Visibilité',
      value: `${(weather.visibility / 1000).toFixed(1)} km`,
      icon: 'eye',
      color: '#5C6BC0'
    },
    {
      label: 'Nuages',
      value: `${weather.clouds?.all || 0}%`,
      icon: 'cloud',
      color: '#78909C'
    }
  ], [weather]);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.95}
      accessibilityLabel={`Météo pour ${weather.name}, ${weather.sys?.country || ''}. Température: ${Math.round(weather.main.temp)}°C. ${isExpanded ? 'Développé' : 'Réduit'}`}
      accessibilityRole="button"
      accessibilityHint="Double-tap pour développer/réduire les détails"
    >
      <View style={styles.summary}>
        <View style={styles.locationContainer}>
          <Ionicons name="location" size={16} color={COLORS.primary} />
          <View style={styles.locationTextContainer}>
            <Text style={styles.city} numberOfLines={1}>
              {weather.name}
            </Text>
            {weather.sys?.country && (
              <Text style={styles.country}>
                {weather.sys.country}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.weatherInfo}>
          <View style={styles.temperatureContainer}>
            <Text style={[styles.temperature, { color: temperatureColor }]}>
              {Math.round(weather.main.temp)}°C
            </Text>
            <Text style={styles.feelsLike}>
              Ressenti: {Math.round(weather.main.feels_like)}°C
            </Text>
          </View>

          <View style={styles.weatherIconContainer}>
            <Ionicons
              name={weatherIcon as any}
              size={32}
              color={COLORS.primary}
              style={styles.weatherIcon}
            />
            <Text style={styles.weatherDescription}>
              {weather.weather[0]?.description}
            </Text>
          </View>
        </View>

        <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
          <Ionicons
            name="chevron-down"
            size={24}
            color={COLORS.gray}
          />
        </Animated.View>
      </View>

      {isExpanded && (
        <View style={styles.details}>
          <View style={styles.detailsGrid}>
            {weatherDetails.map((detail, index) => (
              <View key={index} style={styles.detailItem}>
                <View style={[styles.detailIconContainer, { backgroundColor: `${detail.color}15` }]}>
                  <Ionicons name={detail.icon as any} size={18} color={detail.color} />
                </View>
                <View style={styles.detailTextContainer}>
                  <Text style={styles.detailLabel}>{detail.label}</Text>
                  <Text style={styles.detailValue}>{detail.value}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.timestamp}>
            <Ionicons name="time-outline" size={14} color={COLORS.gray} />
            <Text style={styles.timestampText}>
              Mise à jour: {formatTime(weather.dt)}
            </Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: SIZES.base,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: SIZES.base,
  },
  locationTextContainer: {
    marginLeft: SIZES.base,
  },
  city: {
    ...FONTS.body1,
    fontWeight: '600',
    color: COLORS.text,
  },
  country: {
    fontSize: 10,
    color: COLORS.gray,
    marginTop: 2,
  },
  weatherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
  },
  temperatureContainer: {
    alignItems: 'flex-end',
    marginRight: 16,
  },
  temperature: {
    ...FONTS.h2,
    fontWeight: '700',
  },
  feelsLike: {
    fontSize: 10,
    color: COLORS.gray,
    marginTop: 2,
  },
  weatherIconContainer: {
    alignItems: 'center',
    flex: 1,
  },
  weatherIcon: {
    marginBottom: 4,
  },
  weatherDescription: {
    fontSize: 10,
    color: COLORS.gray,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  details: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    marginBottom: SIZES.base,
  },
  detailIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 10,
    color: COLORS.gray,
    marginBottom: 2,
  },
  detailValue: {
    ...FONTS.body2,
    fontWeight: '600',
    color: COLORS.text,
  },
  timestamp: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  timestampText: {
    fontSize: 10,
    color: COLORS.gray,
    marginLeft: 6,
  },
});

export default React.memo(WeatherCard);