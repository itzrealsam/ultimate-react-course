import CountryItem from "./CountryItem";
import Message from "./Message";
import styles from "./CountryList.module.css";
import Spinner from "./Spinner";
import PropTypes from "prop-types";

function CountryList({ cities, isLoading }) {
  if (isLoading) return <Spinner />;

  if (!cities.length)
    return (
      <Message
        message={"Add your first city by clicking on a city on the map"}
      />
    );

  const countries = cities.reduce((arr, city) => {
    const countryExists = arr.map((el) => el.country).includes(city.country);

    if (!countryExists) {
      return [...arr, { country: city.country, emoji: city.emoji }];
    }

    return arr;
  }, []);

  if (!isLoading && cities.length > 0)
    return (
      <ul className={styles.countryList}>
        {countries.map((country) => (
          <CountryItem country={country} key={country.country} />
        ))}
      </ul>
    );
}

CountryList.propTypes = {
  cities: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default CountryList;
