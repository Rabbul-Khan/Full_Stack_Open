import { useState, useEffect } from "react";
import axios from "axios";

import InputField from "./components/InputField";
import Results from "./components/Results";
import Details from "./components/Details";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [results, setResults] = useState([]);
  const [countryName, setCountryName] = useState("");
  const [capital, setCapital] = useState("");
  const [area, setArea] = useState("");
  const [languages, setLanguages] = useState([]);
  const [flag, setFlag] = useState("");
  const [temperature, setTemperature] = useState("");
  const [iconCode, setIconCode] = useState("");
  const [wind, setWind] = useState("");
  const API_key = process.env.REACT_APP_API_KEY;

  //make an array with all the country names
  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all?fields=name")
      .then((response) => {
        const countryNames = response.data.map((country) => {
          return country.name.common;
        });
        setCountries(countryNames);
      });
  }, []);

  //function to ensure the first character of every word of the search term is always uppercase and the rest are lowercase
  const firstCharToUpper = (searchTerm) => {
    const terms = searchTerm.split(" ");
    for (let i = 0; i < terms.length; i++) {
      if (terms[i] !== "") {
        terms[i] =
          terms[i].charAt(0).toUpperCase() + terms[i].slice(1).toLowerCase();
      }
    }
    return terms.join(" ");
  };

  //set all the details for a country
  const setDetails = (response) => {
    setCountryName(`${response.data[0].name.common}`);
    setCapital(`Capital: ${response.data[0].capital[0]}`);
    setArea(`Area: ${response.data[0].area}`);
    setFlag(`${response.data[0].flag}`);
    const languagesList = response.data[0].languages;
    setLanguages(Object.values(languagesList));
    const lat = response.data[0].capitalInfo.latlng[0];
    const long = response.data[0].capitalInfo.latlng[1];
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_key}`
      )
      .then((response) => {
        setTemperature(`Temperature: ${response.data.main.temp}`);
        setWind(`Wind: ${response.data.wind.speed}`);
        setIconCode(
          `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
        );
      });
  };

  //show button functionality to show details of a country on click
  const onClickShowButton = (result) => {
    axios
      .get(`https://restcountries.com/v3.1/name/${result}`)
      .then((response) => setDetails(response));
  };

  const inputOnChange = (event) => {
    const searchTerm = firstCharToUpper(event.target.value);

    //function to remove previous search results
    const removePreviousDetails = () => {
      setCountryName("");
      setCapital("");
      setArea("");
      setFlag("");
      setLanguages([]);
      setTemperature("");
      setIconCode("");
      setWind("");
    };

    //an array to get all the results
    const searchResults = [];
    countries.filter((country) => {
      if (country.includes(searchTerm)) {
        searchResults.push(country);
        return true;
      } else {
        return false;
      }
    });

    //if we have more than 10 results...
    if (searchResults.length >= 10) {
      //... and the input search value is "" - do nothing
      if (!event.target.value) {
        removePreviousDetails();
        setResults(["Blank"]);
        return;
      }

      //... and input search value is not "" - output "Too many results"
      setResults("Too many results");
      removePreviousDetails();
      return;
    }
    //if we have less than 10 results and more than 1 match - display list of results
    else if (searchResults.length > 1) {
      setResults(
        countries.filter((country) => {
          if (country.includes(searchTerm)) {
            return country;
          }
        })
      );
      removePreviousDetails();
    }

    //if only 1 match - display the information for that match
    else if (searchResults.length === 1) {
      axios
        .get(`https://restcountries.com/v3.1/name/${searchResults[0]}`)
        .then((response) => {
          setDetails(response);
          setResults([searchResults[0]]);
        });
    }
    // if 0 matches
    else if (searchResults.length < 1) {
      setResults([]);
      removePreviousDetails();
    }
  };

  return (
    <div>
      <InputField inputOnChange={inputOnChange} />
      <Results results={results} onClickShowButton={onClickShowButton} />
      <Details
        countryName={countryName}
        capital={capital}
        area={area}
        flag={flag}
        languages={languages}
        temperature={temperature}
        iconCode={iconCode}
        wind={wind}
      />
    </div>
  );
};

export default App;
