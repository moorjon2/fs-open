function CountryDetails({ country, weather }) {
    return (
        <div>
            <h2>{country.name.common}</h2>
            <p>Capital: {country.capital}</p>
            <p>Area: {country.area} km²</p>

            <h3>Languages:</h3>
            <ul>
                {Object.values(country.languages ?? {}).map((lang, i) => (
                    <li key={i}>{lang}</li>
                ))}
            </ul>

            <img
                src={country.flags.png}
                alt={`Flag of ${country.name.common}`}
                width="150"
            />

            {/* Weather display if available */}
            {weather && (
                <div>
                    <h3>Weather in {country.capital?.[0]}</h3>
                    <p>Temperature: {weather.main.temp} °C</p>
                    <img
                        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                        alt={weather.weather[0].description}
                    />
                    <p>Wind: {weather.wind.speed} m/s</p>
                </div>
            )}
        </div>
    )
}

export default CountryDetails;