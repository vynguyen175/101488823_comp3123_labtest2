import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [city, setCity] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!city.trim()) return;
    onSearch(city.trim());
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="city-search">
        City name
      </label>
      <input
        id="city-search"
        className="search-bar__input"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city or town"
      />
      <button className="search-bar__button" type="submit" aria-label="Search weather">
        Search
      </button>
    </form>
  );
}
