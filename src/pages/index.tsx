import { useState } from 'react'

type City = {
  name: string
  latitude: number
  longitude: number 
}

const cities: City[] = [
  {
    name: "東京",
    latitude: 35.7,
    longitude: 139.6875,
  },
  {
    name: "シンガポール",
    latitude: 35.69,
    longitude: 139.69,
  },
]


export default function Home() {
  const [currentCity, setCurrentCity] = useState<City>(cities[0])
  const onChangeCity = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const city = JSON.parse(e.currentTarget.value) as City
    setCurrentCity(city)
  }

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
    </>
  )
}
