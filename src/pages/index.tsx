import { useEffect, useState } from 'react'

import { convertWeathercodetoText } from '@/utils'
import { City, Weather, WeatherResponse } from '@/types'

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

const fetchWeathers = async (city: City): Promise<Weather[]> => {
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

export default function Home() {
  const [weathers, setWeathers] = useState<null | Weather[]>(null)
  const [currentCity, setCurrentCity] = useState<City>(cities[0])
  const onChangeCity = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const city = JSON.parse(e.currentTarget.value) as City
    setCurrentCity(city)
  }

  useEffect(() => {
    (async () => {
      const weathers = await fetchWeathers(currentCity)
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

