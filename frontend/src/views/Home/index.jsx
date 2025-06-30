import React, { useEffect, useState } from "react";
import { Card, Input, Label } from "../../components";
import { Heart } from "../../assets/icons/";
import "./index.css";
import useFavouriteStore from "../../stores/useFavouriteStore";
import axios from "axios";
import useUtil from "../../stores/useUtil";
import userStore from "../../stores/useUserStore";
import { toast } from "react-toastify";
const Home = () => {
  const login = userStore((state) => state.login);

  const toggleLike = useFavouriteStore((state) => state.toggleLike);
  const favourites = useFavouriteStore((state) => state.favourites);

  const [message, setMessage] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);

  const currencies = useUtil((state) => state.currencies);
  const setCurrencies = useUtil((state) => state.setCurrencies);

  const [currency, setCurrency] = useState({
    from: "",
    to: "",
    amount: 1,
    camount: null,
    date: new Date().toJSON().slice(0, 10),
  });
  const [isFavourite, setIsFavourite] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrency((prv) => ({ ...prv, [name]: value }));
  };
  const handleIsFavourite = async () => {
    if (currency.camount >= 0) {
      setIsLoading(true);
      try {
        const req = await axios.post(
          "/api/favorites",
          {
            from: currency.from,
            to: currency.to,
            originalAmount: currency.amount,
            convertedAmount: currency.camount,
            date: currency.date,
          },
          { withCredentials: true }
        );
        if (req.status === 200) {
          setIsFavourite((pre) => !pre);
          setMessage({
            type: "success",
            text: req.data?.message || "Added to favourites list",
          });
          toggleLike(currency);
        }
      } catch (error) {
        setMessage({
          type: "error",
          text: error.response?.data?.message || "Something went Wrong.",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const req = await axios.post("/api/convert", {
        from: currency.from,
        to: currency.to,
        amount: currency.amount,
        date: currency.date,
      });
      if (req.status === 200) {
        const converted = req.data.convertedAmount;
        setCurrency((pre) => ({
          ...pre,
          camount: converted,
        }));
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data.message || "Something went wrong.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const found = favourites.some(
      (fav) =>
        fav.from === currency.from &&
        fav.to === currency.to &&
        fav.amount === currency.amount &&
        fav.date === currency.date
    );
    setIsFavourite(found);
  }, [favourites, currency]);

  useEffect(() => {
    (async () => {
      try {
        const data = await axios.get("/api/currencies");
        if (data.status === 200) setCurrencies(data.data.data);
      } catch (error) {
        setMessage({type:"error",text:error?.response?.data.message})
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const isLoggedin = await axios.get("/api/profile", {
          withCredentials: true,
        });
        if (isLoggedin.status === 200) {
          login(isLoggedin.data);
        }
      } catch (error) {
        if(error.status===401){
          console.log(error.response?.data.message)
        }
      }
    })();
  }, []);

  useEffect(()=>{
  if(!message.type) return;
  else if(message.type === "error"){
    toast.error(message.text)
    setMessage({type:"",text:""})
  }
  else if(message.type === "success"){
    toast.success(message.text)
    setMessage({type:"",text:""})
  }
  },[message])

  return (
    <div className="form__wrapper">
      <Card title={"converter"}>
        <form onSubmit={handleSubmit}>
          <div className="form__from">
            <div className="form__currency">
              <Label htmlFor="from"> From :</Label>
              <select
                name="from"
                id="home__from"
                value={currency.from}
                onChange={handleChange}
                required
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

            <div className="form__amount">
              <Label htmlFor="amount">Enter your amount:</Label>
              <Input
                name="amount"
                id="home__fromValue"
                min="0"
                type="number"
                value={currency.amount}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form__to">
            <div className="form__currency">
              <Label htmlFor="to"> To :</Label>
              <select
                name="to"
                id="home__to"
                value={currency.to}
                onChange={handleChange}
                required
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

            <div className="form__amount">
              <Label htmlFor="camount">converted amount:</Label>
              <Input
                name="camount"
                id="home__toValue"
                value={currency.camount ?? ""}
                type="number"
                disabled
              />
            </div>
          </div>
          <div>
            <Input
              type="date"
              name="date"
              value={currency.date}
              onChange={handleChange}
            />
          </div>
          <div className="form__action">
            <Input
              type="submit"
              value={isLoading ? "Converting" : "Convert"}
              disabled={isLoading}
            />
            <button type="button" className="icons" onClick={handleIsFavourite}>
              <div>
                <Heart isFavourite={isFavourite} />
              </div>
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Home;
