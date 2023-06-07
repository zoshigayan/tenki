import { useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'

import { convertWeathercodetoText } from '@/utils'
import { City, Weather, WeatherResponse } from '@/types'

const cities: City[] = [
  {
    name: "東京",
    latitude: 35.7,
    longitude: 139.6875,
  },
  {
    name: "京都",
    latitude: 35.01,
    longitude: 135.45,
  },
  {
    name: "ワシントン",
    latitude: 38.9041,
    longitude: -77.0171,
  },
  {
    name: "ニューヨーク",
    latitude: 40.4246,
    longitude: -74.0022,
  },
  {
    name: "北京",
    latitude: 39.9042,
    longitude: 116.4073,
  },
  {
    name: "ブラジリア",
    latitude: -25.2743,
    longitude: 133.7751,
  },
  {
    name: "デリー",
    latitude: 28.64,
    longitude: 77.209,
  },
  {
    name: "モスクワ",
    latitude: 55.45,
    longitude: 37.37,
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
      date: time[i].replace(/20[0-9]{2}-/, "").replace("-", "/"),
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
    <div className="container mx-auto max-w-3xl">
      <Head>
        <title>ファイターゆかりの地の天気</title>
      </Head>

      <h1 className="pt-10 text-xl font-bold">{currentCity.name}の天気</h1>

      <select onChange={onChangeCity} className="mt-10">
        {cities.map((city, index) => (
          <option
            key={`city-${index}`}
            label={city.name}
            value={JSON.stringify(city)}
          />
        ))}
      </select>

      <Image
        src={`/${cities.findIndex(city => city.name === currentCity.name) + 1}.png`}
        alt=""
        width="200"
        height="200"
        className="mt-10"
      />

      {weathers
        ? (
          <table className="mt-10 w-full border border-collapse table-fixed">
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
                  <td key={`weather-body-${key}`} className="h-md text-center">
                    {weather.weather}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        )
        : null}
    </div>
  )
}

