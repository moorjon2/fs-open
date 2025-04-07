import { useState, useEffect } from 'react'
import CountryDetails from "./components/countryDetails.jsx";
import axios from 'axios'

const WEATHER_API_KEY = '50b953b1723d541b243986fa8c125111'

function App() {
    const [countries, setCountries] = useState([])           // List of all countries
    const [filter, setFilter] = useState('')                 // Search input
    const [selectedCountry, setSelectedCountry] = useState(null) // Country being shown in detail
    const [weather, setWeather] = useState(null)             // Weather data for selected country

    // Fetch all countries on mount
    useEffect(() => {
        axios
            .get('https://studies.cs.helsinki.fi/restcountries/api/all')
            .then(response => {
                setCountries(response.data)
            })
    }, [])

    // When a new country is selected, fetch weather
    useEffect(() => {
        if (!selectedCountry) return

        const capital = selectedCountry.capital?.[0]
        if (!capital) return

        axios
            .get('https://api.openweathermap.org/data/2.5/weather', {
                params: {
                    q: capital,
                    units: 'metric',
                    appid: WEATHER_API_KEY,
                }
            })
            .then(response => {
                setWeather(response.data)
            })
            .catch(err => {
                console.error('Weather fetch error:', err)
                setWeather(null)
            })
    }, [selectedCountry])

    // Update filter value + reset country and weather
    const handleFilterChange = (e) => {
        setFilter(e.target.value)
        setSelectedCountry(null)
        setWeather(null)
    }

    // Filter countries by input
    const filteredCountries = countries.filter(country =>
        country.name.common.toLowerCase().includes(filter.toLowerCase())
    )

    return (
        <>
            <h1>Country Finder</h1>

            <input
                value={filter}
                onChange={handleFilterChange}
                placeholder="Search for a country"
            />

            <div>
                {filteredCountries.length > 10 && (
                    <p>Too many matches, specify another filter</p>
                )}

                {filteredCountries.length <= 10 && filteredCountries.length > 1 && (
                    <ul>
                        {filteredCountries.map((country) => (
                            <li key={country.cca3}>
                                {country.name.common}
                                <button onClick={() => setSelectedCountry(country)}>Show</button>

                                {/* If this country is the selected one, show full details */}
                                {selectedCountry && selectedCountry.cca3 === country.cca3 && (
                                    <CountryDetails country={country} weather={weather} />
                                )}
                            </li>
                        ))}
                    </ul>
                )}

                {/* Show details immediately when only one match */}
                {filteredCountries.length === 1 && (
                    <CountryDetails country={filteredCountries[0]} weather={weather} />
                )}
            </div>
        </>
    )
}

export default App
