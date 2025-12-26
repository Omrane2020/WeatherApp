import { useState } from 'react';
import { getWeatherByCity, WeatherData } from '../services/weather';

/**
 * Hook personnalisé pour gérer la récupération des données météo
 * Gère l'état de chargement, les erreurs et le stockage des résultats
 */
export const useWeather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Effectue une requête API pour obtenir la météo d'une ville spécifique
   */
  const fetchWeather = async (city: string): Promise<WeatherData | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWeatherByCity(city);
      setWeather(data);
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { weather, loading, error, fetchWeather };
};