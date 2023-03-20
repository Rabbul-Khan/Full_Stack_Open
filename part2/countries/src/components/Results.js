const Results = ({ results, onClickShowButton }) => {
  if (results.length > 1 && results.length < 10) {
    return (
      <div>
        {results.map((result) => {
          return (
            <p key={result}>
              {result}
              <button onClick={() => onClickShowButton(result)}>show</button>
            </p>
          );
        })}
      </div>
    );
  } else if (results.length === 1) {
    return <div></div>;
  } else {
    return (
      <p>
        {/* {results.map((result) => {
          return <p key={result}>{result}</p>;
        })} */}
        {results}
      </p>
    );
  }
};

export default Results;
