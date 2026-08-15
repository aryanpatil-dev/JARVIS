export interface WeatherData {
  city: string;
  country: string;
  tempC: number;
  condition: string;
  humidity: number;
  windKmh: number;
  icon: string;
}

class WeatherService {
  private cachedData: WeatherData = {
    city: 'Malibu',
    country: 'US',
    tempC: 22,
    condition: 'Clear Sky',
    humidity: 45,
    windKmh: 12,
    icon: '☀️',
  };

  public async fetchLiveWeather(): Promise<WeatherData> {
    try {
      // Use wttr.in JSON API for lightweight zero-api-key location and weather detection
      const res = await fetch('https://wttr.in/?format=j1', {
        headers: { 'User-Agent': 'Mozilla/5.0 JARVIS-HUD' },
      });
      if (res.ok) {
        const data = await res.json();
        const current = data.current_condition?.[0];
        const area = data.nearest_area?.[0];

        const weather: WeatherData = {
          city: area?.areaName?.[0]?.value || 'Point Dume',
          country: area?.country?.[0]?.value || 'US',
          tempC: parseInt(current?.temp_C || '22', 10),
          condition: current?.weatherDesc?.[0]?.value || 'Optimal',
          humidity: parseInt(current?.humidity || '45', 10),
          windKmh: parseInt(current?.windspeedKmph || '12', 10),
          icon: this.getWeatherIcon(current?.weatherDesc?.[0]?.value || ''),
        };
        this.cachedData = weather;
        return weather;
      }
    } catch (err) {
      console.warn('Live weather lookup unavailable, using tactical cached telemetry:', err);
    }
    return this.cachedData;
  }

  private getWeatherIcon(desc: string): string {
    const d = desc.toLowerCase();
    if (d.includes('rain') || d.includes('drizzle')) return '🌧️';
    if (d.includes('cloud') || d.includes('overcast')) return '⛅';
    if (d.includes('snow') || d.includes('ice')) return '❄️';
    if (d.includes('thunder') || d.includes('storm')) return '⚡';
    if (d.includes('fog') || d.includes('mist')) return '🌫️';
    return '☀️';
  }
}

export const weatherService = new WeatherService();
