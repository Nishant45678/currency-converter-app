import React, { useState } from "react";
import Card from "../../components/Card/index.jsx";
import useUtil from "../../stores/useUtil.js";
import "./index.css";
import { useNavigate } from "react-router-dom";
const Visualization = () => {
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);
  const navigate = useNavigate();
  const currencies = useUtil((state) => state.currencies);
  const [baseAndDate, setBaseAndDate] = useState({
    base: "USD",
    date: today.toISOString().split("T")[0],
  });
  const [trendData, setTrendDate] = useState({
    fromCurrency: "USD",
    toCurrency: "INR",
    fromDate: oneYearAgo.toISOString().split("T")[0],
    toDate: today.toISOString().split("T")[0],
  });
  const handleCurrentChange = (e) => {
    const { name, value } = e.target;
    setBaseAndDate((pre) => ({
      ...pre,
      [name]: value,
    }));
  };
  const handleTrendChange = (e) => {
    const { name, value } = e.target;
    setTrendDate((pre) => ({
      ...pre,
      [name]: value,
    }));
  };

  const linkToCurrent = () => {
    if (baseAndDate.base)
      navigate(
        `/visualization/current?currency=${baseAndDate.base}&date=${
          new Date(baseAndDate.date).toISOString().split("T")[0]
        }`
      );
  };
  const linkToTrend = () => {
    if (baseAndDate.base)
      navigate(
        `/visualization/trend?base=${trendData.fromCurrency}&symbol=${
          trendData.toCurrency
        }&fromDate=${
          new Date(trendData.fromDate).toISOString().split("T")[0]
        }&toDate=${new Date(trendData.toDate).toISOString().split("T")[0]}`
      );
  };
  return (
    <form className="form__wrapper">
      <Card maxWidth={700} title="Visualize">
        <div className="visualization__section">
          <h4>Analyze single currency over multiple currencies</h4>
          <div className="visualize__base-and-date-wrapper">
            <div>
              <label htmlFor="visualize__base-and-date">base currency:</label>
              <select
                name="base"
                id="visualize__base-and-date"
                value={baseAndDate.base}
                onChange={handleCurrentChange}
              >
                <option value="">Select</option>
                {currencies
                  ? Object.keys(currencies).map((i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))
                  : null}
              </select>
            </div>
            <div>
              <label htmlFor="date">select date:</label>
              <input
                type="date"
                name="date"
                value={baseAndDate.date}
                id="date"
                onChange={handleCurrentChange}
              />
            </div>
            <div>
              <button type="button" onClick={linkToCurrent}>
                Go
              </button>
            </div>
          </div>
        </div>
        <div className="visualization__section">
          <h4>Analyze currency trend </h4>
          <div className="visualize__base-and-date-wrapper">
            <div>
              <label htmlFor="fromCurrency">from currency:</label>
              <select
                name="fromCurrency"
                id="fromCurrency"
                value={trendData.fromCurrency}
                onChange={handleTrendChange}
              >
                <option value="">select</option>
                {currencies
                  ? Object.keys(currencies).map((i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))
                  : null}
              </select>
            </div>

            <div>
              <label htmlFor="toCurrency">to currency:</label>
              <select
                name="toCurrency"
                id="toCurrency"
                value={trendData.toCurrency}
                onChange={handleTrendChange}
              >
                <option value="">select</option>
                {currencies
                  ? Object.keys(currencies).map((i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))
                  : null}
              </select>
            </div>

            <div>
              <label htmlFor="fromDate">from date:</label>
              <input
                type="date"
                name="fromDate"
                id="fromDate"
                value={trendData.fromDate}
                onChange={handleTrendChange}
              />
            </div>
            <div>
              <label htmlFor="toDate">to date:</label>
              <input
                type="date"
                name="toDate"
                id="toDate"
                value={trendData.toDate}
                onChange={handleTrendChange}
              />
            </div>

            <div>
              <button type="button" onClick={linkToTrend}>
                Go
              </button>
            </div>
          </div>
        </div>
      </Card>
    </form>
  );
};

export default Visualization;
