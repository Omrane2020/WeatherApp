import axios from 'axios';

const API_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

/**
 * Interface représentant la structure des données retournées par l'API OpenWeather
 */
export interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  clouds: {
    all: number;
  };
  visibility: number;
  dt: number;
  timezone: number;
  coord?: {
    lon: number;
    lat: number;
  };
  base?: string;
  id?: number;
  cod?: number;
}

/**
 * Récupère les données météo actuelles pour une ville donnée
 * @param city Nom de la ville à rechercher
 */
export const getWeatherByCity = async (city: string): Promise<WeatherData> => {
  const apiKey = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;
  try {
    const response = await axios.get(`${API_BASE_URL}?q=${city}&appid=${apiKey}&units=metric`);
    return response.data;
  } catch (error) {
    throw new Error('Ville non trouvée ou erreur API');
  }
};
