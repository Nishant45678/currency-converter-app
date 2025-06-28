import React, { useState } from "react";
import Card from "../../components/Card/index.jsx";
import useUtil from "../../stores/useUtil.js";
import "./index.css";
import { useNavigate } from "react-router-dom";
const Visualization = () => {
  const navigate = useNavigate();
  const currencies = useUtil((state) => state.currencies);
  const [currency, setCurrency] = useState({
    base: "",
    date: new Date(),
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrency((pre) => ({
      ...pre,
      [name]: value,
    }));
  };

  const linkTObase = () => {
    if (currency.base)
      navigate(
        `/visualization/current?currency=${currency.base}&date=${
          new Date(currency.date).toISOString().split("T")[0]
        }`
      );
  };
  return (
    <form className="form__wrapper">
      <Card title="Visualize">
        <div>
          <label htmlFor="visualize__base-and-date">
            Analyze single currency
          </label>
          <div className="visualize__base-and-date-wrapper">
            <select
              name="base"
              id="visualize__base-and-date"
              value={currency.base}
              onChange={handleChange}
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
            <input type="date" name="date" id="date" onChange={handleChange} />
            <button type="button" onClick={linkTObase}>
              {" "}
              Go{" "}
            </button>
          </div>
        </div>
      </Card>
    </form>
  );
};

export default Visualization;
