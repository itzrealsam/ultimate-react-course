import React from "react";

function getWeatherIcon(wmoCode) {
  const icons = new Map([
    [[0], "☀️"],
    [[1], "🌤"],
    [[2], "⛅️"],
    [[3], "☁️"],
    [[45, 48], "🌫"],
    [[51, 56, 61, 66, 80], "🌦"],
    [[53, 55, 63, 65, 57, 67, 81, 82], "🌧"],
    [[71, 73, 75, 77, 85, 86], "🌨"],
    [[95], "🌩"],
    [[96, 99], "⛈"],
  ]);
  const arr = [...icons.keys()].find((key) => key.includes(wmoCode));
  if (!arr) return "NOT FOUND";
  return icons.get(arr);
}

function convertToFlag(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function formatDay(dateStr) {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
  }).format(new Date(dateStr));
}

class App extends React.Component {
  state = {
    location: "",
    displayLocation: "",
    isLoading: false,
    error: null,
    weather: {},
  };

  fetchWeather = async () => {
    if (this.state.location.length < 2)
      return this.setState({
        error: "Location must be at least 2 characters long",
        weather: {},
      });

    try {
      this.setState({ isLoading: true, error: null });

      // 1) Getting location (geocoding)
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${this.state.location}`,
      );
      const geoData = await geoRes.json();
      console.log(geoData);

      if (!geoData.results) throw new Error("Location not found");

      const { latitude, longitude, timezone, name, country_code } =
        geoData.results.at(0);
      this.setState({
        displayLocation: `${name} ${convertToFlag(country_code)}`,
      });

      // 2) Getting actual weather
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`,
      );
      const weatherData = await weatherRes.json();
      this.setState({ weather: weatherData.daily });
    } catch (err) {
      this.setState({ error: err.message, weather: {} });
      console.error(err, err.message);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  handleInputChange = (event) => {
    this.setState({ location: event.target.value });
  };

  // ueseEffect []
  componentDidMount() {
    this.fetchWeather();

    this.setState({ location: localStorage.getItem("location") || "" });
  }

  //useEffect [location]
  componentDidUpdate(prevProps, prevState) {
    if (prevState.location !== this.state.location) {
      this.fetchWeather();

      localStorage.setItem("location", this.state.location);
    }
  }

  render() {
    return (
      <div className="app">
        <h1>Classy Weather</h1>
        <div>
          <Input
            location={this.state.location}
            onInputChange={this.handleInputChange}
          />
        </div>
        {/* <button onClick={this.fetchWeather}>Get Weather</button> */}

        {this.state.isLoading && <p>Loading...</p>}
        {this.state.error && <p>Error: {this.state.error}</p>}

        {this.state.weather.weathercode && (
          <Weather
            weather={this.state.weather}
            displayLocation={this.state.displayLocation}
          />
        )}
      </div>
    );
  }
}

export default App;

class Input extends React.Component {
  render() {
    return (
      <input
        type="text"
        placeholder="Search from location.."
        value={this.props.location}
        onChange={this.props.onInputChange}
      />
    );
  }
}

class Weather extends React.Component {
  componentDidMount() {
    console.log("Weather component mounted");
  }

  componentWillUnmount() {
    console.log("Weather component unmounted");
  }

  render() {
    const {
      weathercode: codes,
      temperature_2m_max: max,
      temperature_2m_min: min,
      time: dates,
    } = this.props.weather;

    return (
      <div>
        <h2>Weather {this.props.displayLocation}</h2>
        <ul className="weather">
          {dates.map((date, index) => (
            <Day
              key={date}
              code={codes[index]}
              dates={date}
              isToday={index === 0}
              min={min[index]}
              max={max[index]}
            />
          ))}
        </ul>
      </div>
    );
  }
}

class Day extends React.Component {
  render() {
    const { code, dates, isToday, min, max } = this.props;

    return (
      <li className="day">
        <span>{getWeatherIcon(code)}</span>
        <p>{isToday ? "Today" : formatDay(dates)}</p>
        <p>
          {Math.floor(min)}&deg; &mdash; <strong>{Math.ceil(max)}&deg;</strong>
        </p>
      </li>
    );
  }
}
