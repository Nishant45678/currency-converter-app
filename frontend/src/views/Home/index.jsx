import React, { useEffect, useState } from "react";
import { Card, Input, Label } from "../../components";
import { Heart } from "../../assets/icons/";
import "./index.css";
import useFavouriteStore from "../../stores/useFavouriteStore";
import axios from "axios"
const Home = () => {
  const toggleLike = useFavouriteStore((state) => state.toggleLike);
  const favourites = useFavouriteStore((state) => state.favourites);

  const [message,setMessage] = useState({type:"",message:""})
  const [isLoading,setIsLoading] = useState(false)

  const [currency, setCurrency] = useState({
    from: "",
    to: "",
    amount: 1,
    camount: 100,
    date: new Date().toJSON().slice(0, 10),
  });
  const [isFavourite, setIsFavourite] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrency((prv) => ({ ...prv, [name]: value }));
  };
  const handleIsFavourite = () => {
    if (currency.camount !== 1) {
      setIsFavourite((pre) => !pre);
      setIsLoading(true)
      try {
        const req = axios.post("http://localhost:4000/favorites",{
          from:currency.from,
          to: currency.to,
          originalAmount: currency.amount,
          convertedAmount:currency.camount,
          date:currency.date
        },{withCredentials:true}) 
        setMessage({type:"success",message:req.data?.message||"Added to favourites list"})
        toggleLike(currency);
      } catch (error) {
        setMessage({type:"error",message:error.response?.data?.message})
        
      }finally{
        setIsLoading(false)
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true)
    try {
      const req = axios.post("http://localhost:4000/currency/convert",{
        from:currency.from,
        to:currency.to,
        amount : currency.amount,
        date: currency.date
      })
      if(req.status ===  200){
        setMessage({type:"success",message:"amount converted successfully"})
        const converted = req.data.convertedAmount;
        setCurrency(pre=>({
          ...pre,camount:converted
        }))
      }
    } catch (error) {
      
      setMessage({type:"error",message:error.response?.data.message})
    }
    finally{
      setIsLoading(false)
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
    console.log(message)
  }, [favourites, currency,message]);

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
                <option value="USD">USD</option>
              </select>
            </div>

            <div className="form__amount">
              <Label htmlFor="amount">Enter your amount:</Label>
              <Input
                name="amount"
                id="home__fromValue"
                type="Number"
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
                <option value="INR">INR</option>
              </select>
            </div>

            <div className="form__amount">
              <Label htmlFor="camount">converted amount:</Label>
              <Input
                name="camount"
                id="home__toValue"
                value={currency.camount}
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
            <Input type="submit" value={isLoading?"Converting":"Convert"}/>
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
