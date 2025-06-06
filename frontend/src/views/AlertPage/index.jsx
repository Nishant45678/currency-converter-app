import React, { useEffect, useState } from "react";
import { Card, Input, Label } from "../../components";
import "./index.css";
import alertStore from "../../stores/useAlertStore";
import axios from "axios";

const AlertPage = () => {
  const [message, setMessage] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const addAlert = alertStore((state) => state.addAlert);
  const [alert, setAlert] = useState({
    from: "",
    to: "",
    condition: "",
    threshold: 0,
    wantDailyUpdates: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const req = await axios.post("http://localhost:4000/alerts", alert, {
        withCredentials: true,
      });
      if (req.status === 200) {
        const msg = req.data.message;
        setMessage({ type: "success", message: msg||"Alert added successfully" });
        if (alert.from && alert.to && alert.condition && alert.threshold)
          addAlert(alert);
        setAlert({
          from: "",
          to: "",
          condition: "",
          threshold: 0,
          wantDailyUpdates: false,
        });
      }
    } catch (error) {
      const errMsg = error.response?.data?.message;
      setMessage({ type: "error", message: errMsg||"Something went wrong while setting Alert" });
    } finally {
      setIsLoading(false);

    }
    // console.log(alert);
  };
  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setAlert((pre) => ({
      ...pre,
      [name]: type === "checkbox" ? checked : type === "number" ? +value : value,
    }));
  };

  useEffect(() => {
    console.log(message);
  }, [message]);
  return (
    <div className="form__wrapper">
      <Card title={"Set Alert"}>
        <form onSubmit={handleSubmit}>
          <div className="alert__form-currency">
            <div>
              <Label htmlFor="from">From:</Label>
              <select
                name="from"
                id="alert__currency"
                value={alert.from}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="usd">usd</option>
              </select>
            </div>
            <div>
              <Label htmlFor="to">To:</Label>
              <select
                name="to"
                id="alert__to"
                value={alert.to}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="inr">inr</option>
              </select>
            </div>
          </div>
          <div className="alert__set-condition">
            <div className="alert__unit">1 usd</div>
            <div className="alert__condition-wrapper">
              <select
                name="condition"
                id="alert__condition"
                value={alert.condition}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="<">&lt;</option>
                <option value=">">&gt;</option>
                <option value="=">=</option>
              </select>
            </div>
            <div className="alert__threshold-wrapper">
              <Label htmlFor="threshold">Enter your threshold: </Label>
              <Input
                type="number"
                name="threshold"
                id="alert__threshold"
                placeholder="inr"
                value={+alert.threshold}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div>
            <Input
              id="wantDailyUpdates"
              name="wantDailyUpdates"
              type="checkbox"
              checked={alert.wantDailyUpdates}
              onChange={handleChange}
            />
            <Label htmlFor="wantDailyUpdates">wantDailyUpdates</Label>
          </div>
          <Input
            type="submit"
            value={isLoading ? "Setting alert" : "Set alert"}
            disabled={isLoading}
          />
        </form>
      </Card>
    </div>
  );
};

export default AlertPage;
