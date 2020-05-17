const expect = require("chai").expect
const nock = require("nock")
const { fetchWeatherForCity } = require("../weather")
const responses = require("./responses")

describe("weather", () => {
  it("should fetch and parse weather for city", async () => {
    nock("https://api.openweathermap.org")
      .get(
        "/data/2.5/weather?q=Marrero&units=metric&appid=4fe760a65625e12e8cf362d264c244de"
      )
      .reply(200, responses[0])

    const weatherForCity = await fetchWeatherForCity("Marrero")
    expect(weatherForCity).to.equal(
      "Marrero, US: Clouds - Temp 24°C - Humidity 83% - Wind 3.1kph - Time - 9:28 PM GMT-5"
    )
  })
})
