import { useEffect, useState } from 'react'

type City = {
  name: string
  latitude: number
  longitude: number 
}

type Weather = {
  date: string
  weather: string
}

const cities: City[] = [
  {
    name: "東京",
    latitude: 35.7,
    longitude: 139.6875,
  },
  {
    name: "シドニー",
    latitude: 29.563,
    longitude: 106.5515,
  },
  {
    name: "キングストン",
    latitude: 50.0528,
    longitude: 8.5698,
  },
]

type WeatherResponse = {
    latitude: number
    longitude: number
    generationtime_ms: number
    utc_offset_seconds: number
    timezone: string
    timezone_abbreviation: string
    elevation: number
    daily_units: {
        time: string
        weathercode: string
    }
    daily: {
        time: string[],
        weathercode: number[],
    }
}

const fetchWeather = async (city: City): Promise<Weather[]> => {
  const queries = new URLSearchParams({
    latitude: city.latitude.toString(),
    longitude: city.longitude.toString(),
    daily: "weathercode",
    timezone: "Asia/Tokyo",
  })
  const url = `https://api.open-meteo.com/v1/forecast?${queries}`
  const response = await fetch(url)
  const { daily: { weathercode, time } } = await response.json() as WeatherResponse

  let weathers = []
  for (let i = 0; i < weathercode.length; i++) {
    weathers.push({
      date: time[i].replaceAll("-", "/"),
      weather: convertWeathercodetoText(weathercode[i]),
    })
  }

  return weathers
}

const convertWeathercodetoText = (weathercode: number) => {
  switch (weathercode) {
    case 0:
      return "Clear sky"
    case 1:
    case 2:
    case 3:
      return "Mainly clear, partly cloudy, and overcast"
    case 45:
    case 48:
      return "Fog and depositing rime fog"
    case 51:
    case 53:
    case 55:
      return "Drizzle: Light, moderate, and dense intensity"
    case 56:
    case 57:
      return "Freezing Drizzle: Light and dense intensity"
    case 61:
    case 63:
    case 65:
      return "Rain: Slight, moderate and heavy intensity"
    case 66:
    case 67:
      return "Freezing Rain: Light and heavy intensity"
    case 71:
    case 73:
    case 75:
      return "Snow fall: Slight, moderate, and heavy intensity"
    case 77:
      return "Snow grains"
    case 80:
    case 81:
    case 82:
      return "Rain showers: Slight, moderate, and violent"
    case 85:
    case 86:
      return "Snow showers slight and heavy"
    case 95:
      return "Thunderstorm: Slight or moderate"
    case 96:
    case 99:
      return "Thunderstorm with slight and heavy hail"
    default:
      return ""
  }
}

export default function Home() {
  const [weathers, setWeathers] = useState<null | Weather[]>(null)
  const [currentCity, setCurrentCity] = useState<City>(cities[0])
  const onChangeCity = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const city = JSON.parse(e.currentTarget.value) as City
    setCurrentCity(city)
  }

  useEffect(() => {
    (async () => {
      const weathers = await fetchWeather(currentCity)
      setWeathers(weathers)
    })()
  }, [currentCity])

  return (
    <>
      <h1>{currentCity.name}の天気</h1>

      <select onChange={onChangeCity}>
        {cities.map((city, index) => (
          <option
            key={`city-${index}`}
            label={city.name}
            value={JSON.stringify(city)}
          />
        ))}
      </select>

      {weathers
        ? (
          <table>
            <thead>
              <tr>
                {weathers.map((weather, key) => (
                <th key={`weather-heading-${key}`}>{weather.date}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {weathers.map((weather, key) => (
                  <td key={`weather-body-${key}`}>{weather.weather}</td>
                ))}
              </tr>
            </tbody>
          </table>
        )
        : null}
    </>
  )
}

