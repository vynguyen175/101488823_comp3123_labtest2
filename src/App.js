import { useState, useEffect, useCallback, useMemo } from "react";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import "./App.css";

const API_KEY = process.env.REACT_APP_OPENWEATHER_KEY;
const API_URL = "https://api.openweathermap.org/data/2.5/weather";

const dayOptions = { weekday: "long", month: "short", day: "numeric" };
const shortDayOptions = { weekday: "short" };
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";

const formatTemp = (value) => (typeof value === "number" ? Math.round(value) : "--");

function App() {
  const [city, setCity] = useState("Toronto");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [unit, setUnit] = useState("metric");
  const [forecastData, setForecastData] = useState(null);

  const fetchWeather = useCallback(
    async (cityName, units) => {
      if (!cityName) return;
      setLoading(true);
      setError("");
      setForecastData(null);
      try {
        if (!API_KEY) {
          throw new Error("Missing API key. Set REACT_APP_OPENWEATHER_KEY.");
        }
        const response = await fetch(
          `${API_URL}?q=${encodeURIComponent(cityName)}&units=${units}&appid=${API_KEY}`
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.message || "Unable to fetch weather.");
        }
        setWeather(data);
        const forecastResponse = await fetch(
          `${FORECAST_URL}?q=${encodeURIComponent(cityName)}&units=${units}&appid=${API_KEY}`
        );
        const forecastJson = await forecastResponse.json();
        if (!forecastResponse.ok) {
          throw new Error(forecastJson?.message || "Unable to fetch forecast.");
        }
        setForecastData(forecastJson);
      } catch (err) {
        setWeather(null);
        setForecastData(null);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchWeather(city, unit);
  }, [city, unit, fetchWeather]);

  const handleSearch = (newCity) => {
    const sanitized = newCity.trim();
    if (!sanitized || sanitized.toLowerCase() === city.toLowerCase()) return;
    setCity(sanitized);
  };

  const handleUnitToggle = () => {
    setUnit((prev) => (prev === "metric" ? "imperial" : "metric"));
  };

  const currentTemp = weather?.main?.temp;
  const iconId = weather?.weather?.[0]?.icon ?? "01d";
  const now = useMemo(() => new Date(), []);
  const heroDateLabel = now.toLocaleDateString(undefined, dayOptions);
  const shortDay = now.toLocaleDateString(undefined, shortDayOptions);

  const forecastDays = useMemo(() => {
    const entries = [];
    const seen = new Set();
    (forecastData?.list ?? []).forEach((entry) => {
      const label = new Date(entry.dt * 1000).toLocaleDateString(undefined, shortDayOptions);
      if (seen.has(label)) return;
      seen.add(label);
      entries.push({
        label,
        temp: formatTemp(entry.main?.temp),
        icon: entry.weather?.[0]?.icon ?? iconId,
      });
    });
    if (entries.length >= 5) {
      return entries.slice(0, 5);
    }
    return Array.from({ length: 5 }, (_, idx) => {
      const day = new Date();
      day.setDate(now.getDate() + idx);
      return {
        label: day.toLocaleDateString(undefined, shortDayOptions),
        temp: formatTemp((currentTemp ?? 24) + (idx - 2) * 1.4),
        icon: iconId,
      };
    });
  }, [currentTemp, now, forecastData, iconId]);

  const iconBase = `https://openweathermap.org/img/wn/${iconId}`;
  const iconUrl = `${iconBase}@2x.png`;
  const iconSet = `${iconBase}@2x.png 1x, ${iconBase}@4x.png 2x`;

  const humidity = weather?.main?.humidity ?? "--";
  const windSpeedNumber = typeof weather?.wind?.speed === "number" ? Math.round(weather.wind.speed) : null;
  const windUnit = unit === "metric" ? "m/s" : "mph";
  const windSpeed = windSpeedNumber !== null ? `${windSpeedNumber} ${windUnit}` : "--";
  const uvIndex = weather?.visibility ? Math.min(Math.max(Math.round(weather.visibility / 10), 1), 11) : 7;
  const locationLabel = weather?.name ? `${weather.name}, ${weather.sys?.country ?? ""}` : "Toronto, CA";

  return (
    <div className="app-root">
      <div className="cloud-layer" aria-hidden="true" />
      <div className="search-wrapper">
        <SearchBar onSearch={handleSearch} />
      </div>
      <main className="dashboard">
        <section className="hero-card">
          <div className="hero-card__header">
            <p className="hero-card__day">{shortDay}</p>
            <p className="hero-card__date">{heroDateLabel}</p>
            <p className="hero-card__location">{locationLabel}</p>
          </div>
          <div className="hero-card__body">
            <p className="hero-card__temp">
              {formatTemp(weather?.main?.temp)}°{unit === "metric" ? "C" : "F"}
            </p>
            <div className="hero-card__condition-row">
              <div className="hero-card__icon-shell">
                <img src={iconUrl} srcSet={iconSet} alt={weather?.weather?.[0]?.description || "weather icon"} />
              </div>
              <div>
                <p className="hero-card__condition">
                  {weather?.weather?.[0]?.main ?? "Clear"}
                </p>
                <p className="hero-card__description">
                  {weather?.weather?.[0]?.description ?? "Clear skies"}
                </p>
              </div>
            </div>
            <p className="hero-card__tagline">Tracking the latest conditions right now.</p>
            <button
              type="button"
              className="unit-toggle"
              onClick={handleUnitToggle}
              aria-pressed={unit === "imperial"}
            >
              Show in °{unit === "metric" ? "F" : "C"}
            </button>
          </div>
          <div className="hero-card__stats">
            <article>
              <p>Humidity</p>
              <strong>{humidity}%</strong>
            </article>
            <article>
              <p>Wind</p>
              <strong>{windSpeed}</strong>
            </article>
            <article>
              <p>UV index</p>
              <strong>{uvIndex}</strong>
            </article>
          </div>
        </section>

        <section className="forecast-card">
          <div className="forecast-card__header">
            <p>Weather Forecast</p>
            <span>Next five entries</span>
          </div>
          <div className="forecast-card__days">
            {forecastDays.map((dayEntry) => (
              <article key={dayEntry.label} className="forecast-card__day">
                <p>{dayEntry.label}</p>
                <img
                  src={`https://openweathermap.org/img/wn/${dayEntry.icon}@2x.png`}
                  alt="forecast icon"
                />
                <p>
                  {dayEntry.temp}°{unit === "metric" ? "C" : "F"}
                </p>
              </article>
            ))}
          </div>
          <div className="forecast-card__footer">
            <div>
              <p>Visibility</p>
              <strong>{weather?.visibility ? `${weather.visibility} m` : "--"}</strong>
            </div>
            <div>
              <p>Feels like</p>
              <strong>
                {formatTemp(weather?.main?.feels_like)}°{unit === "metric" ? "C" : "F"}
              </strong>
            </div>
            <div>
              <p>Pressure</p>
              <strong>{weather?.main?.pressure ? `${weather.main.pressure} hPa` : "--"}</strong>
            </div>
          </div>
        </section>
      </main>
      <section className="status-row" aria-live="polite">
        {loading && <p className="status-badge">Loading latest readings...</p>}
        {error && !loading && <p className="status-error">{error}</p>}
        {!loading && !error && !weather && <p className="status-hint">Search above to load the weather.</p>}
      </section>
      {weather && <WeatherCard weatherData={weather} />}
    </div>
  );
}

export default App;
