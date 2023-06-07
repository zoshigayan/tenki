export type City = {
  name: string
  latitude: number
  longitude: number 
}

export type Weather = {
  date: string
  weather: string
}

export type WeatherResponse = {
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
