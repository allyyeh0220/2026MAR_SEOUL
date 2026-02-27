import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, Loader2 } from 'lucide-react';

export function WeatherWidget() {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch current weather for Seoul (Lat: 37.5665, Lon: 126.9780)
    async function fetchWeather() {
      try {
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=37.5665&longitude=126.9780&current=temperature_2m,weather_code&timezone=Asia%2FSeoul"
        );
        const data = await res.json();
        setWeather(data.current);
      } catch (e) {
        console.error("Failed to fetch weather", e);
      } finally {
        setLoading(false);
      }
    }
    fetchWeather();
  }, []);

  if (loading) return <div className="animate-pulse h-8 w-24 bg-k-coffee/10 rounded-full"></div>;
  if (!weather) return null;

  const getWeatherIcon = (code: number) => {
    if (code <= 1) return <Sun className="w-4 h-4 text-orange-400" />;
    if (code <= 3) return <Cloud className="w-4 h-4 text-k-coffee/40" />;
    if (code <= 67) return <CloudRain className="w-4 h-4 text-k-blue" />;
    return <CloudSnow className="w-4 h-4 text-k-blue" />;
  };

  return (
    <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-k-coffee/5 text-sm font-bold text-k-coffee">
      {getWeatherIcon(weather.weather_code)}
      <span className="font-mono">{weather.temperature_2m}°C</span>
      <span className="text-xs text-k-coffee/50 ml-1">首爾</span>
    </div>
  );
}
