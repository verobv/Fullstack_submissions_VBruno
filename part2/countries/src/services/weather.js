import axios from 'axios'
const api_key = import.meta.env.VITE_SOME_KEY
const baseUrl = 'https://api.openweathermap.org/data/2.5'

const getWeather = (capital) => {
  const request = axios.get(`${baseUrl}/weather?q=${capital}&appid=${api_key}&units=metric`)
  console.log('API KEY:', api_key)
  return request.then(response => response.data)
}

export default { getWeather }