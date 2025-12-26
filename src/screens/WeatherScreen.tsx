import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  ScrollView,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  Keyboard,
  Animated,
  Dimensions,
  RefreshControl,
  StatusBar,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useWeather } from '../hooks/useWeather';
import { useAlert } from '../context/AlertContext';
import WeatherCard from '../components/WeatherCard';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { WeatherData } from '../services/weather';
import { COLORS, SIZES, FONTS } from '../constants';
import { Ionicons } from '@expo/vector-icons';
import { storage } from '../utils/storage';

const { width } = Dimensions.get('window');
const RECENT_SEARCHES_KEY = 'recent_searches';
const MAX_RECENT_SEARCHES = 5;

const WeatherScreen: React.FC = () => {
  // --- États locaux (Local State) ---
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<WeatherData[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  // --- Hooks personnalisés & Refs ---
  const { loading, error, fetchWeather } = useWeather();
  const { showAlert } = useAlert();

  // Valeurs animées pour les transitions d'entrée
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // --- Logique métier (Business Logic) ---

  /**
   * Charge l'historique des recherches depuis le stockage local
   */
  const loadRecentSearches = useCallback(async () => {
    try {
      const searches = await storage.getItem<string[]>(RECENT_SEARCHES_KEY) || [];
      setRecentSearches(searches);
    } catch (err) {
      console.warn('Failed to load recent searches:', err);
      // Fallback to default cities
      setRecentSearches(['Paris', 'London', 'Tokyo', 'New York', 'Sydney']);
    }
  }, []);

  /**
   * Sauvegarde les recherches récentes dans le stockage persistant
   */
  const saveRecentSearches = useCallback(async (searches: string[]) => {
    try {
      await storage.setItem(RECENT_SEARCHES_KEY, searches);
    } catch (err) {
      console.warn('Failed to save recent searches:', err);
    }
  }, []);

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    loadRecentSearches();
  }, [fadeAnim, slideAnim, loadRecentSearches]);

  /**
   * Gère la recherche d'une ville (validation + fetch)
   */
  const handleSearch = useCallback(async () => {
    if (!query.trim()) {
      showAlert({
        title: 'Champ requis',
        message: 'Veuillez saisir le nom d\'une ville',
        type: 'warning'
      });
      return;
    }

    Keyboard.dismiss();

    try {
      const data = await fetchWeather(query);
      if (data) {
        setResults([data]);

        // Update recent searches
        const normalizedQuery = query.trim();
        const updatedSearches = [
          normalizedQuery,
          ...recentSearches.filter(item => item.toLowerCase() !== normalizedQuery.toLowerCase())
        ].slice(0, MAX_RECENT_SEARCHES);

        setRecentSearches(updatedSearches);
        saveRecentSearches(updatedSearches);
      }
    } catch (err) {
      showAlert({
        title: 'Erreur',
        message: 'Impossible de récupérer les données météo. Vérifiez le nom de la ville.',
        type: 'error'
      });
    }
  }, [query, fetchWeather, recentSearches, saveRecentSearches]);

  const handleRecentSearch = useCallback(async (city: string) => {
    setQuery(city);
    const data = await fetchWeather(city);
    if (data) {
      setResults([data]);
    }
  }, [fetchWeather]);

  const handleClearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
  }, []);

  const handleClearRecentSearches = useCallback(async () => {
    setRecentSearches([]);
    await storage.removeItem(RECENT_SEARCHES_KEY);
    showAlert({
      title: 'Succès',
      message: 'Historique effacé',
      type: 'success'
    });
  }, [showAlert]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    if (results.length > 0) {
      const currentCity = results[0].name;
      const data = await fetchWeather(currentCity);
      if (data) {
        setResults([data]);
      }
    }
    setRefreshing(false);
  }, [results, fetchWeather]);

  const handleSubmitEditing = useCallback(() => {
    handleSearch();
  }, [handleSearch]);

  // --- Fonctions de Rendu (Render Functions) ---

  /**
   * En-tête avec animation d'entrée
   */
  const renderHeader = () => (
    <Animated.View
      style={[
        styles.header,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <Text style={styles.title}>🌤️ Météo Live</Text>
      <Text style={styles.subtitle}>
        Consultez la météo en temps réel dans le monde entier
      </Text>
    </Animated.View>
  );

  /**
   * Section de saisie pour la recherche
   */
  const renderSearchSection = () => (
    <View style={styles.searchSection}>
      <CustomInput
        placeholder="Rechercher une ville..."
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSubmitEditing}
        icon={<Ionicons name="search" size={20} color={COLORS.gray} />}
        rightIcon={
          query ? (
            <TouchableOpacity
              onPress={handleClearSearch}
              accessibilityLabel="Effacer la recherche"
            >
              <Ionicons name="close-circle" size={20} color={COLORS.gray} />
            </TouchableOpacity>
          ) : undefined
        }
        containerStyle={styles.searchInput}
        autoCorrect={false}
        autoCapitalize="words"
      />

      <CustomButton
        title="Rechercher"
        onPress={handleSearch}
        loading={loading}
        disabled={loading || !query.trim()}
        style={styles.searchButton}
        leftIcon={<Ionicons name="cloud" size={20} color="#FFF" />}
        accessibilityLabel="Rechercher la météo"
      />
    </View>
  );

  const renderRecentSearches = () => {
    if (recentSearches.length === 0 || results.length > 0) return null;

    return (
      <View style={styles.recentSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="time" size={16} color={COLORS.primary} /> Historique
          </Text>
          <TouchableOpacity
            onPress={handleClearRecentSearches}
            accessibilityLabel="Effacer l'historique"
          >
            <Text style={styles.clearButton}>Tout effacer</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.recentList}
        >
          {recentSearches.map((city, index) => (
            <TouchableOpacity
              key={`${city}-${index}`}
              style={styles.recentItem}
              onPress={() => handleRecentSearch(city)}
              accessibilityLabel={`Rechercher ${city}`}
            >
              <Ionicons name="time-outline" size={14} color={COLORS.primary} />
              <Text style={styles.recentText}>{city}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderEmptyState = () => {
    if (loading || results.length > 0) return null;

    return (
      <View style={styles.emptyState}>
        <Ionicons name="partly-sunny" size={100} color={COLORS.gray + '40'} />
        <Text style={styles.emptyTitle}>Explorez la météo</Text>
        <Text style={styles.emptyText}>
          Commencez par rechercher une ville ou choisissez-en une ci-dessous
        </Text>
      </View>
    );
  };

  const renderError = () => {
    if (!error) return null;

    return (
      <View style={styles.errorContainer}>
        <Ionicons name="warning" size={50} color={COLORS.error} />
        <Text style={styles.errorText}>{error}</Text>
        <CustomButton
          title="Réessayer"
          onPress={handleSearch}
          variant="outline"
          style={styles.retryButton}
          accessibilityLabel="Réessayer la recherche"
        />
      </View>
    );
  };

  const renderPopularCities = () => {
    if (results.length > 0) return null;

    const popularCities = [
      { name: 'Paris', country: 'FR', icon: '🇫🇷' },
      { name: 'London', country: 'GB', icon: '🇬🇧' },
      { name: 'New York', country: 'US', icon: '🇺🇸' },
      { name: 'Tokyo', country: 'JP', icon: '🇯🇵' },
      { name: 'Sydney', country: 'AU', icon: '🇦🇺' },
    ];

    return (
      <View style={styles.popularSection}>
        <Text style={styles.sectionTitle}>
          <Ionicons name="star" size={16} color={COLORS.primary} /> Villes populaires
        </Text>
        <View style={styles.popularGrid}>
          {popularCities.map((city) => (
            <TouchableOpacity
              key={`${city.name}-${city.country}`}
              style={styles.popularItem}
              onPress={() => handleRecentSearch(city.name)}
              accessibilityLabel={`Voir météo pour ${city.name}`}
            >
              <Text style={styles.popularIcon}>{city.icon}</Text>
              <Text style={styles.popularText}>{city.name}</Text>
              <Text style={styles.popularCountry}>{city.country}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderLoadingOverlay = () => {
    if (!loading || results.length > 0) return null;

    return (
      <View style={styles.loadingOverlay}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Chargement en cours...</Text>
      </View>
    );
  };

  // --- Rendu Principal (Main Render) ---
  return (
    <View style={styles.container}>
      <FlatList
        data={results}
        keyExtractor={(item) => `${item.name}-${item.dt}`}
        renderItem={({ item }) => <WeatherCard weather={item} />}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {renderHeader()}
            {renderSearchSection()}
            {renderRecentSearches()}
            {renderPopularCities()}
            {renderEmptyState()}
            {renderError()}
          </>
        }
        ListEmptyComponent={null}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
            title="Actualisation..."
            titleColor={COLORS.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      />

      {renderLoadingOverlay()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 40,
    paddingTop: SIZES.padding * 2,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SIZES.base,
    textAlign: 'center',
  },
  subtitle: {
    ...FONTS.body3,
    color: COLORS.gray,
    lineHeight: 22,
    textAlign: 'center',
    paddingHorizontal: SIZES.padding,
  },
  searchSection: {
    marginBottom: 30,
  },
  searchInput: {
    marginBottom: 15,
  },
  searchButton: {
    height: 56,
    borderRadius: SIZES.radius * 2,
  },
  recentSection: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    ...FONTS.h4,
    color: COLORS.text,
    alignItems: 'center',
  },
  clearButton: {
    ...FONTS.body4,
    color: COLORS.error,
  },
  recentList: {
    paddingRight: 20,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightPrimary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.primary + '20',
  },
  recentText: {
    marginLeft: 8,
    color: COLORS.text,
    ...FONTS.body4,
  },
  popularSection: {
    marginBottom: 30,
  },
  popularGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  popularItem: {
    width: (width - SIZES.padding * 3) / 2,
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 16,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  popularIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  popularText: {
    ...FONTS.h4,
    color: COLORS.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  popularCountry: {
    ...FONTS.body5,
    color: COLORS.gray,
    backgroundColor: COLORS.lightPrimary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    ...FONTS.body3,
    color: COLORS.gray,
    textAlign: 'center',
    maxWidth: '80%',
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  errorText: {
    ...FONTS.body2,
    color: COLORS.error,
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 20,
    maxWidth: '80%',
  },
  retryButton: {
    minWidth: 120,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 15,
    ...FONTS.body2,
    color: COLORS.text,
  },
});

export default React.memo(WeatherScreen);