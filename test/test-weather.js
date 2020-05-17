const expect = require("chai").expect
const nock = require("nock")
const { fetchWeather, fetchWeathers } = require("../weather")
const responses = require("./responses")

describe("weather", () => {
  it("should fetch and parse weather for city", async () => {
    nock("https://api.openweathermap.org")
      .get(
        "/data/2.5/weather?q=Marrero&units=metric&appid=4fe760a65625e12e8cf362d264c244de"
      )
      .reply(200, responses[0])

    const weatherForCity = await fetchWeather("Marrero")
    expect(weatherForCity).to.equal(
      "Marrero, US: Clouds - Temp 24°C - Humidity 83% - Wind 3.1kph - Time - 9:28 PM GMT-5"
    )
  })
  it("should fetch and parse weather for zipcode", async () => {
    nock("https://api.openweathermap.org")
      .get(
        "/data/2.5/weather?zip=70072&units=metric&appid=4fe760a65625e12e8cf362d264c244de"
      )
      .reply(200, responses[1])

    const weatherForCity = await fetchWeather("70072")
    expect(weatherForCity).to.equal(
      "Marrero, US: Clouds - Temp 24°C - Humidity 94% - Wind 4.1kph - Time - 2:04 AM GMT-5"
    )
  })
  it("should fetch and parse weather for multiple cities/zips", async () => {
    nock("https://api.openweathermap.org")
      .get(
        "/data/2.5/weather?q=Marrero&units=metric&appid=4fe760a65625e12e8cf362d264c244de"
      )
      .reply(200, responses[0])
    nock("https://api.openweathermap.org")
      .get(
        "/data/2.5/weather?zip=70072&units=metric&appid=4fe760a65625e12e8cf362d264c244de"
      )
      .reply(200, responses[1])
    nock("https://api.openweathermap.org")
      .get(
        "/data/2.5/weather?q=Tokyo&units=metric&appid=4fe760a65625e12e8cf362d264c244de"
      )
      .reply(200, responses[2])
    nock("https://api.openweathermap.org")
      .get(
        "/data/2.5/weather?q=Pluto&units=metric&appid=4fe760a65625e12e8cf362d264c244de"
      )
      .reply(200, responses[3])

    const weatherForCities = await fetchWeathers("Marrero, 70072, Tokyo, Pluto")
    expect(weatherForCities).to.equal(
      "Marrero, US: Clouds - Temp 24°C - Humidity 83% - Wind 3.1kph - Time - 9:28 PM GMT-5\nMarrero, US: Clouds - Temp 24°C - Humidity 94% - Wind 4.1kph - Time - 2:04 AM GMT-5\nTokyo, JP: Clouds - Temp 27°C - Humidity 69% - Wind 3.6kph - Time - 4:25 PM GMT+9\nPluto, US: Clouds - Temp 22°C - Humidity 83% - Wind 6.2kph - Time - 2:37 AM GMT-5"
    )
  })
  it("should handle invalid city", async () => {
    nock("https://api.openweathermap.org")
      .get(
        "/data/2.5/weather?q=Pluto&units=metric&appid=4fe760a65625e12e8cf362d264c244de"
      )
      .reply(200, responses[4])
    const weatherForCity = await fetchWeather("fake city")
    expect(weatherForCity).to.equal("fake city: Invalid City or Zip Code")
  })
})
