import { useState, useEffect } from 'react'
import countryService from './services/countries'
import weatherService from './services/weather'

const Filter = ({ toSearch, handleToSearch }) => (
  <div>
    find countries <input value={toSearch} onChange={handleToSearch}></input>
  </div>
)

const Country = ({ country }) => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    if (!country.capital) return

    weatherService
      .getWeather(country.capital[0])
      .then(data => setWeather(data))
      .catch(err => console.error(err))
  }, [country])

  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>
        Capital: {country.capital} 
        <br />
        Area: {country.area}
      </p>
      <h3>Languages</h3> 
      <ul>
        {Object.values(country.languages).map(lang => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt="flag" width="150" />
      {weather && (
        <div>
          <h3>Weather in {country.capital}</h3>
          <p>Temperature {weather.main.temp} Celsius</p>
          <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="weather icon" width="150" />
          <p>Wind {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  )
}

function App() {
  const [toSearch, setToSearch] = useState('')
  const [all, setAll] = useState([])
  const [countries, setCountries] = useState([])
  const [selected, setSelected] = useState(null)

  const handleToSearch = (event) => setToSearch(event.target.value)

  useEffect(() => {
    countryService.getAll().then(data => setAll(data))
  }, [])

  useEffect(() => {
    if (toSearch === '') {
      setCountries([]) 
      setSelected(null)
      return
    }
    const filtered = all.filter(country =>
      country.name.common.toLowerCase().includes(toSearch.toLowerCase())
    )
    setCountries(filtered)
  }, [toSearch, all])

  return (
    <div>
      <Filter toSearch={toSearch} handleToSearch={handleToSearch} />
      <div>
        {countries.length > 10 && <p>Too many matches, specify another filter</p>}
        {countries.length <= 10 && countries.length > 1 && (
          <ul>
            {countries.map(country => (
              <li style={{ marginLeft: '10px' }} key={country.name.common}>
                {country.name.common}
                <button onClick={() => setSelected(country)}>Show</button>
              </li>
            ))}
          </ul>
        )}
        {selected ? (
          <Country country={selected}/>
        ) : countries.length === 1 ? (
          <Country country={countries[0]}/>
        ) : null}
      </div>
    </div>
  )
}

export default App
