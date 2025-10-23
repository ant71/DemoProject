import { useEffect, useState } from 'react'
import './Weather.css'

interface Location {
  name: string
  latitude: number
  longitude: number
  timezone: string
}

interface WeatherData {
  current: {
    temperature: number
    weatherCode: number
    windSpeed: number
    humidity: number
  }
  daily: {
    dates: string[]
    maxTemps: number[]
    minTemps: number[]
    weatherCodes: number[]
  }
}

const PRESET_LOCATIONS: Location[] = [
  // Australia & Oceania
  { name: 'Sydney, Australia', latitude: -33.8688, longitude: 151.2093, timezone: 'Australia/Sydney' },
  { name: 'Melbourne, Australia', latitude: -37.8136, longitude: 144.9631, timezone: 'Australia/Melbourne' },
  { name: 'Brisbane, Australia', latitude: -27.4698, longitude: 153.0251, timezone: 'Australia/Brisbane' },
  { name: 'Perth, Australia', latitude: -31.9505, longitude: 115.8605, timezone: 'Australia/Perth' },
  { name: 'Adelaide, Australia', latitude: -34.9285, longitude: 138.6007, timezone: 'Australia/Adelaide' },
  { name: 'Canberra, Australia', latitude: -35.2809, longitude: 149.1300, timezone: 'Australia/Sydney' },
  { name: 'Auckland, New Zealand', latitude: -36.8485, longitude: 174.7633, timezone: 'Pacific/Auckland' },
  { name: 'Wellington, New Zealand', latitude: -41.2865, longitude: 174.7762, timezone: 'Pacific/Auckland' },

  // North America
  { name: 'New York, USA', latitude: 40.7128, longitude: -74.0060, timezone: 'America/New_York' },
  { name: 'Los Angeles, USA', latitude: 34.0522, longitude: -118.2437, timezone: 'America/Los_Angeles' },
  { name: 'Chicago, USA', latitude: 41.8781, longitude: -87.6298, timezone: 'America/Chicago' },
  { name: 'Houston, USA', latitude: 29.7604, longitude: -95.3698, timezone: 'America/Chicago' },
  { name: 'Miami, USA', latitude: 25.7617, longitude: -80.1918, timezone: 'America/New_York' },
  { name: 'San Francisco, USA', latitude: 37.7749, longitude: -122.4194, timezone: 'America/Los_Angeles' },
  { name: 'Seattle, USA', latitude: 47.6062, longitude: -122.3321, timezone: 'America/Los_Angeles' },
  { name: 'Boston, USA', latitude: 42.3601, longitude: -71.0589, timezone: 'America/New_York' },
  { name: 'Washington DC, USA', latitude: 38.9072, longitude: -77.0369, timezone: 'America/New_York' },
  { name: 'Las Vegas, USA', latitude: 36.1699, longitude: -115.1398, timezone: 'America/Los_Angeles' },
  { name: 'Toronto, Canada', latitude: 43.6532, longitude: -79.3832, timezone: 'America/Toronto' },
  { name: 'Vancouver, Canada', latitude: 49.2827, longitude: -123.1207, timezone: 'America/Vancouver' },
  { name: 'Montreal, Canada', latitude: 45.5017, longitude: -73.5673, timezone: 'America/Montreal' },
  { name: 'Mexico City, Mexico', latitude: 19.4326, longitude: -99.1332, timezone: 'America/Mexico_City' },

  // Europe
  { name: 'London, UK', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London' },
  { name: 'Paris, France', latitude: 48.8566, longitude: 2.3522, timezone: 'Europe/Paris' },
  { name: 'Berlin, Germany', latitude: 52.5200, longitude: 13.4050, timezone: 'Europe/Berlin' },
  { name: 'Madrid, Spain', latitude: 40.4168, longitude: -3.7038, timezone: 'Europe/Madrid' },
  { name: 'Rome, Italy', latitude: 41.9028, longitude: 12.4964, timezone: 'Europe/Rome' },
  { name: 'Amsterdam, Netherlands', latitude: 52.3676, longitude: 4.9041, timezone: 'Europe/Amsterdam' },
  { name: 'Barcelona, Spain', latitude: 41.3851, longitude: 2.1734, timezone: 'Europe/Madrid' },
  { name: 'Vienna, Austria', latitude: 48.2082, longitude: 16.3738, timezone: 'Europe/Vienna' },
  { name: 'Prague, Czech Republic', latitude: 50.0755, longitude: 14.4378, timezone: 'Europe/Prague' },
  { name: 'Stockholm, Sweden', latitude: 59.3293, longitude: 18.0686, timezone: 'Europe/Stockholm' },
  { name: 'Copenhagen, Denmark', latitude: 55.6761, longitude: 12.5683, timezone: 'Europe/Copenhagen' },
  { name: 'Oslo, Norway', latitude: 59.9139, longitude: 10.7522, timezone: 'Europe/Oslo' },
  { name: 'Helsinki, Finland', latitude: 60.1695, longitude: 24.9354, timezone: 'Europe/Helsinki' },
  { name: 'Dublin, Ireland', latitude: 53.3498, longitude: -6.2603, timezone: 'Europe/Dublin' },
  { name: 'Lisbon, Portugal', latitude: 38.7223, longitude: -9.1393, timezone: 'Europe/Lisbon' },
  { name: 'Athens, Greece', latitude: 37.9838, longitude: 23.7275, timezone: 'Europe/Athens' },
  { name: 'Moscow, Russia', latitude: 55.7558, longitude: 37.6173, timezone: 'Europe/Moscow' },
  { name: 'Istanbul, Turkey', latitude: 41.0082, longitude: 28.9784, timezone: 'Europe/Istanbul' },
  { name: 'Warsaw, Poland', latitude: 52.2297, longitude: 21.0122, timezone: 'Europe/Warsaw' },
  { name: 'Brussels, Belgium', latitude: 50.8503, longitude: 4.3517, timezone: 'Europe/Brussels' },
  { name: 'Zurich, Switzerland', latitude: 47.3769, longitude: 8.5417, timezone: 'Europe/Zurich' },

  // Asia
  { name: 'Tokyo, Japan', latitude: 35.6762, longitude: 139.6503, timezone: 'Asia/Tokyo' },
  { name: 'Seoul, South Korea', latitude: 37.5665, longitude: 126.9780, timezone: 'Asia/Seoul' },
  { name: 'Beijing, China', latitude: 39.9042, longitude: 116.4074, timezone: 'Asia/Shanghai' },
  { name: 'Shanghai, China', latitude: 31.2304, longitude: 121.4737, timezone: 'Asia/Shanghai' },
  { name: 'Hong Kong', latitude: 22.3193, longitude: 114.1694, timezone: 'Asia/Hong_Kong' },
  { name: 'Singapore', latitude: 1.3521, longitude: 103.8198, timezone: 'Asia/Singapore' },
  { name: 'Bangkok, Thailand', latitude: 13.7563, longitude: 100.5018, timezone: 'Asia/Bangkok' },
  { name: 'Kuala Lumpur, Malaysia', latitude: 3.1390, longitude: 101.6869, timezone: 'Asia/Kuala_Lumpur' },
  { name: 'Mumbai, India', latitude: 19.0760, longitude: 72.8777, timezone: 'Asia/Kolkata' },
  { name: 'Delhi, India', latitude: 28.6139, longitude: 77.2090, timezone: 'Asia/Kolkata' },
  { name: 'Bangalore, India', latitude: 12.9716, longitude: 77.5946, timezone: 'Asia/Kolkata' },
  { name: 'Dubai, UAE', latitude: 25.2048, longitude: 55.2708, timezone: 'Asia/Dubai' },
  { name: 'Tel Aviv, Israel', latitude: 32.0853, longitude: 34.7818, timezone: 'Asia/Jerusalem' },
  { name: 'Jakarta, Indonesia', latitude: -6.2088, longitude: 106.8456, timezone: 'Asia/Jakarta' },
  { name: 'Manila, Philippines', latitude: 14.5995, longitude: 120.9842, timezone: 'Asia/Manila' },
  { name: 'Hanoi, Vietnam', latitude: 21.0285, longitude: 105.8542, timezone: 'Asia/Bangkok' },

  // South America
  { name: 'São Paulo, Brazil', latitude: -23.5505, longitude: -46.6333, timezone: 'America/Sao_Paulo' },
  { name: 'Rio de Janeiro, Brazil', latitude: -22.9068, longitude: -43.1729, timezone: 'America/Sao_Paulo' },
  { name: 'Buenos Aires, Argentina', latitude: -34.6037, longitude: -58.3816, timezone: 'America/Argentina/Buenos_Aires' },
  { name: 'Lima, Peru', latitude: -12.0464, longitude: -77.0428, timezone: 'America/Lima' },
  { name: 'Bogotá, Colombia', latitude: 4.7110, longitude: -74.0721, timezone: 'America/Bogota' },
  { name: 'Santiago, Chile', latitude: -33.4489, longitude: -70.6693, timezone: 'America/Santiago' },

  // Africa
  { name: 'Cairo, Egypt', latitude: 30.0444, longitude: 31.2357, timezone: 'Africa/Cairo' },
  { name: 'Cape Town, South Africa', latitude: -33.9249, longitude: 18.4241, timezone: 'Africa/Johannesburg' },
  { name: 'Johannesburg, South Africa', latitude: -26.2041, longitude: 28.0473, timezone: 'Africa/Johannesburg' },
  { name: 'Lagos, Nigeria', latitude: 6.5244, longitude: 3.3792, timezone: 'Africa/Lagos' },
  { name: 'Nairobi, Kenya', latitude: -1.2864, longitude: 36.8172, timezone: 'Africa/Nairobi' },
  { name: 'Casablanca, Morocco', latitude: 33.5731, longitude: -7.5898, timezone: 'Africa/Casablanca' },
]

const weatherCodeToEmoji = (code: number): string => {
  if (code === 0) return '☀️'
  if (code <= 3) return '⛅'
  if (code <= 48) return '🌫️'
  if (code <= 67) return '🌧️'
  if (code <= 77) return '🌨️'
  if (code <= 82) return '🌧️'
  if (code <= 86) return '🌨️'
  if (code >= 95) return '⛈️'
  return '☁️'
}

const weatherCodeToDescription = (code: number): string => {
  if (code === 0) return 'Clear sky'
  if (code <= 3) return 'Partly cloudy'
  if (code <= 48) return 'Foggy'
  if (code <= 67) return 'Rainy'
  if (code <= 77) return 'Snowy'
  if (code <= 82) return 'Rain showers'
  if (code <= 86) return 'Snow showers'
  if (code >= 95) return 'Thunderstorm'
  return 'Cloudy'
}

function Weather() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<Location>(PRESET_LOCATIONS[0])
  const [gettingLocation, setGettingLocation] = useState(false)

  const fetchWeather = async (location: Location) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=${location.timezone}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch weather data')
      }

      const data = await response.json()

      setWeather({
        current: {
          temperature: Math.round(data.current.temperature_2m),
          weatherCode: data.current.weather_code,
          windSpeed: Math.round(data.current.wind_speed_10m),
          humidity: data.current.relative_humidity_2m
        },
        daily: {
          dates: data.daily.time,
          maxTemps: data.daily.temperature_2m_max.map((t: number) => Math.round(t)),
          minTemps: data.daily.temperature_2m_min.map((t: number) => Math.round(t)),
          weatherCodes: data.daily.weather_code
        }
      })
      setLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load weather')
      setLoading(false)
    }
  }

  const getCurrentLocation = () => {
    setGettingLocation(true)
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      setGettingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        // Get timezone from coordinates using worldtimeapi
        let timezone = 'auto'
        try {
          const tzResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=auto`
          )
          const tzData = await tzResponse.json()
          timezone = tzData.timezone || 'auto'
        } catch {
          // Fallback to auto timezone
        }

        const currentLocation: Location = {
          name: 'Current Location',
          latitude,
          longitude,
          timezone
        }

        setSelectedLocation(currentLocation)
        fetchWeather(currentLocation)
        setGettingLocation(false)
      },
      (err) => {
        setError(`Unable to get location: ${err.message}`)
        setGettingLocation(false)
      }
    )
  }

  const handleLocationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const location = PRESET_LOCATIONS.find(loc => loc.name === event.target.value)
    if (location) {
      setSelectedLocation(location)
      fetchWeather(location)
    }
  }

  useEffect(() => {
    fetchWeather(selectedLocation)
  }, [])

  if (loading) {
    return (
      <div className="weather-container">
        <div className="loading">Loading weather data...</div>
      </div>
    )
  }

  if (error || !weather) {
    return (
      <div className="weather-container">
        <div className="error">Unable to load weather data</div>
      </div>
    )
  }

  const formatDate = (dateString: string, index: number): string => {
    if (index === 0) return 'Today'
    if (index === 1) return 'Tomorrow'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }

  return (
    <div className="weather-container">
      <div className="weather-header">
        <h2 className="weather-title">{selectedLocation.name} Weather</h2>

        <div className="location-selector">
          <select
            value={selectedLocation.name === 'Current Location' ? '' : selectedLocation.name}
            onChange={handleLocationChange}
            className="location-dropdown"
            disabled={gettingLocation}
          >
            {selectedLocation.name === 'Current Location' && (
              <option value="">Current Location</option>
            )}
            {PRESET_LOCATIONS.map(loc => (
              <option key={loc.name} value={loc.name}>{loc.name}</option>
            ))}
          </select>

          <button
            onClick={getCurrentLocation}
            disabled={gettingLocation}
            className="current-location-btn"
            title="Use my current location"
          >
            {gettingLocation ? '...' : '📍'}
          </button>
        </div>
      </div>

      <div className="current-weather">
        <div className="current-icon">
          {weatherCodeToEmoji(weather.current.weatherCode)}
        </div>
        <div className="current-temp">{weather.current.temperature}°C</div>
        <div className="current-description">
          {weatherCodeToDescription(weather.current.weatherCode)}
        </div>
        <div className="current-details">
          <span>Wind: {weather.current.windSpeed} km/h</span>
          <span>Humidity: {weather.current.humidity}%</span>
        </div>
      </div>

      <div className="forecast">
        <h3 className="forecast-title">7-Day Forecast</h3>
        <div className="forecast-grid">
          {weather.daily.dates.slice(0, 7).map((date, index) => (
            <div key={date} className="forecast-day">
              <div className="forecast-date">{formatDate(date, index)}</div>
              <div className="forecast-icon">
                {weatherCodeToEmoji(weather.daily.weatherCodes[index])}
              </div>
              <div className="forecast-temps">
                <span className="temp-max">{weather.daily.maxTemps[index]}°</span>
                <span className="temp-min">{weather.daily.minTemps[index]}°</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Weather
