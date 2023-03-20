const Details = ({
  countryName,
  capital,
  area,
  flag,
  languages,
  temperature,
  iconCode,
  wind,
}) => {
  let languagesTitle;
  if (languages.length === 0) {
    languagesTitle = "";
  } else {
    languagesTitle = "Language(s):";
  }

  let weatherTitle;
  if (capital) {
    weatherTitle = `Weather in the ${capital}`;
  } else {
    weatherTitle = "";
  }

  return (
    <div>
      <h1>{countryName}</h1>
      <p>{capital}</p>
      <p>{area}</p>
      <p>{languagesTitle}</p>
      <ul>
        {languages.map((language) => {
          return <li key={language}> {language}</li>;
        })}
      </ul>
      <p style={{ fontSize: "5rem", margin: "0" }}>{flag}</p>
      <h2>{weatherTitle}</h2>
      <p>{temperature}</p>
      <img src={iconCode} alt=""></img>
      <p>{wind}</p>
    </div>
  );
};

export default Details;
