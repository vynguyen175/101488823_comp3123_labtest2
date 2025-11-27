export default function WeatherCard({ weatherData }) {
  if (!weatherData) return null;
  const { name, sys = {}, main = {}, weather = [], wind = {} } = weatherData;
  const currentWeather = weather[0] ?? {};
  const iconId = currentWeather.icon ?? "01d";
  const iconBase = `https://openweathermap.org/img/wn/${iconId}`;
  const iconUrl = `${iconBase}@2x.png`;
  const iconSrcSet = `${iconBase}@2x.png 1x, ${iconBase}@4x.png 2x`;

  const formatTemp = (value) => (typeof value === "number" ? Math.round(value) : "--");

  return (
    <article className="weather-card">
      <div className="weather-card__header">
        <div>
          <p className="weather-card__city">
            {name}
            {sys.country ? `, ${sys.country}` : ""}
          </p>
          <p className="weather-card__condition">
            {(currentWeather.main || "") + (currentWeather.description ? ` · ${currentWeather.description}` : "")}
          </p>
        </div>
        <img
          className="weather-card__icon"
          src={iconUrl}
          srcSet={iconSrcSet}
          alt={currentWeather.description || "weather icon"}
          loading="lazy"
        />
      </div>
      <div className="weather-card__metrics">
        <p className="weather-card__temp">{formatTemp(main.temp)}°C</p>
        <div className="weather-card__details">
          <p>Feels like {formatTemp(main.feels_like)}°</p>
          <p>Humidity {main.humidity ?? "--"}%</p>
          <p>Wind {typeof wind.speed === "number" ? Math.round(wind.speed) : "--"} m/s</p>
        </div>
      </div>
      <footer className="weather-card__footer">
        <p>Last updated for {name}</p>
      </footer>
    </article>
  );
}