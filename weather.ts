#!/usr/bin/env -S node -r "ts-node/register"
const bent = require("bent")
import * as querystring from "querystring"
import { format } from "date-fns"

const argv = process.argv.splice(2)
if (!argv.length) {
  console.error(`usage: ./weather.ts <city>`)
  process.exit(1)
}
const args = argv.join(" ")

const API_KEY = "4fe760a65625e12e8cf362d264c244de"
const getJSON = bent("json")

interface APIResponse {
  name: string
  main: {
    temp: number
    humidity: number
  }
  wind: {
    speed: number
  }
  sys: {
    country: string
  }
  weather: { main: string }[]
  dt: number
  timezone: number
}

function formatTime(unixTimestamp, tzOffsetSeconds) {
  const date = new Date(unixTimestamp * 1000)
  const tzOffsetMinutes = tzOffsetSeconds / 60
  const tzOffsetHours = tzOffsetMinutes / 60
  const adjustedMinutes = date.getTimezoneOffset() + tzOffsetMinutes
  const adjustedDate = new Date(date.getTime() + adjustedMinutes * 60 * 1000)
  const GMTOffset =
    "GMT" + (tzOffsetHours > 0 ? "+" + tzOffsetHours : tzOffsetHours)
  return format(adjustedDate, "h:mm aa ") + GMTOffset
}

function formatWeatherAndTime(json) {
  const weatherDescription = json.weather[0].main
  const temp = Math.floor(json.main.temp) + "°C"
  const humidity = json.main.humidity + "%"
  const wind = json.wind.speed + "kph"
  const location = `${json.name}, ${json.sys.country}`
  const formattedTime = formatTime(json.dt, json.timezone)
  return `${location}: ${weatherDescription} - Temp ${temp} - Humidity ${humidity} - Wind ${wind} - Time - ${formattedTime}`
}

export const fetchWeather = async (query: string) => {
  const params: {
    units: string
    appid: string
    q?: string
    zip?: string
  } = {
    units: "metric",
    appid: API_KEY,
  }
  if (/\d{5}/.test(query)) {
    params.zip = query
  } else {
    params.q = query
  }
  const url =
    "https://api.openweathermap.org/data/2.5/weather?" +
    querystring.stringify(params)
  try {
    const json: APIResponse = await getJSON(url)
    return formatWeatherAndTime(json)
  } catch (err) {
    console.error(err)
    return `${query}: Invalid City or Zip Code`
  }
}

if (require.main === module) {
  ;(async () => {
    console.log(await fetchWeather(args))
  })()
}
