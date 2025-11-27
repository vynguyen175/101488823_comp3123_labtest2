# Reference-Styled Weather Dashboard

![Hero layout](README_images/hero-preview.png)
![Forecast detail](README_images/forecast-preview.png)

This project is a React-based weather dashboard that mirrors the provided hero/forecast reference screens while remaining fully powered by the OpenWeatherMap APIs. The search bar drives live data, the hero card surfaces the current temperature/conditions, and the forecast cards present the next few entries with matching icons.

## Project Description

- **Hero + Forecast Layout**: A gradient night-sky backdrop with a hero card on the left and a forecast card on the right, matching the provided mockups in spacing and typography.
- **Live Data Integration**: Fetches both the current weather (`/weather`) and a five-entry forecast (`/forecast`), then keeps the toggle-able units and status messaging in sync.
- **Units & Accessibility**: A toggle lets users switch between metric and imperial, while `aria` attributes on the unit button ensure the state is announced.

## Setup Steps

1. Install dependencies:

   ```bash
   npm install
   ```

2. Provide your OpenWeatherMap API key in a `.env.local` or `.env` file at the project root:

   ```env
   REACT_APP_OPENWEATHER_KEY=your_real_key_here
   ```

3. Start the dev server:

   ```bash
   npm start
   ```

4. (Optional) Build for production to verify everything compiles:

   ```bash
   npm run build
   ```

## API Usage

- `https://api.openweathermap.org/data/2.5/weather`: Retrieves the current conditions shown in the hero card and stats.
- `https://api.openweathermap.org/data/2.5/forecast`: Pulls the next five data points for the forecast row, which deduplicates by calendar day before rendering.
- Both endpoints are called with the selected unit (metric or imperial) so toggling the unit button re-fetches every value.

## Notes & Assumptions

- The hero and forecast cards expect PNG/SVG icons from OpenWeatherMap; fallback logic uses the current weather icon when the forecast response is missing an icon.
- Forecast entries are deduplicated by the localized weekday name, so the card order mirrors the upcoming calendar days even if the API returns three-hour snapshots.
- Place the attached `hero-preview.png` and `forecast-preview.png` inside the `README_images` folder so the images render above this text (create the folder if it is missing).
