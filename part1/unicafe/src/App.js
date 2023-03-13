import { useState } from "react";

const Statistics = (props) => {
  if (props.total === 0) {
    return <p>No feedback given</p>;
  }
  return (
    <table>
      <tbody>
        <tr>
          <StatisticLine text="good" value={props.good} />
        </tr>
      </tbody>
      <tbody>
        <tr>
          <StatisticLine text="neutral" value={props.neutral} />
        </tr>
      </tbody>
      <tbody>
        <tr>
          <StatisticLine text="bad" value={props.bad} />
        </tr>
      </tbody>
      <tbody>
        <tr>
          <StatisticLine text="total" value={props.total} />
        </tr>
      </tbody>
      <tbody>
        <tr>
          <StatisticLine text="average" value={props.average} />
        </tr>
      </tbody>
      <tbody>
        <tr>
          <StatisticLine text="positive" value={props.positive} />
        </tr>
      </tbody>
    </table>
  );
};

const StatisticLine = (props) => {
  return (
    <>
      <td>{props.text}</td>
      <td> {props.value}</td>
    </>
  );
};

const Button = (props) => {
  return (
    <>
      <button onClick={props.handleGoodClick}>good</button>
      <button onClick={props.handleNeutralClick}>neutral</button>
      <button onClick={props.handleBadClick}>bad</button>
    </>
  );
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [total, setTotal] = useState(0);
  const [average, setAverage] = useState(0);
  const [positive, setPositive] = useState(0);

  const handleGoodClick = () => {
    const updatedGood = good + 1;
    const updatedTotal = total + 1;
    setGood(updatedGood);
    setTotal(updatedTotal);
    setAverage(getAverage("good", updatedGood, updatedTotal));
    setPositive(getPositive("good", updatedGood, updatedTotal));
  };

  const handleNeutralClick = () => {
    const updatedNeutral = neutral + 1;
    const updatedTotal = total + 1;
    setNeutral(updatedNeutral);
    setTotal(updatedTotal);
    setAverage(getAverage("neutral", NaN, updatedTotal));
    setPositive(getPositive("neutral", NaN, updatedTotal));
  };

  const handleBadClick = () => {
    const updatedBad = bad + 1;
    const updatedTotal = total + 1;
    setBad(updatedBad);
    setTotal(updatedTotal);
    setAverage(getAverage("bad", updatedBad, updatedTotal));
    setPositive(getPositive("bad", NaN, updatedTotal));
  };

  const getAverage = (type, updatedType, updatedTotal) => {
    let totalScore;
    if (type === "good") {
      totalScore = updatedType - bad;
    } else if (type === "neutral") {
      totalScore = good - bad;
    } else if (type === "bad") {
      totalScore = good - updatedType;
    }
    return totalScore / updatedTotal;
  };

  const getPositive = (type, updatedType, updatedTotal) => {
    if (type === "good") {
      return (updatedType * 100) / updatedTotal;
    } else {
      return (good * 100) / updatedTotal;
    }
  };

  return (
    <div>
      <h1>give feedback</h1>
      <Button
        handleGoodClick={handleGoodClick}
        handleNeutralClick={handleNeutralClick}
        handleBadClick={handleBadClick}
      />
      <h1>statistics</h1>
      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
        total={total}
        average={average}
        positive={positive}
      />
    </div>
  );
};

export default App;
