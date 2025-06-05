import React, { useEffect, useMemo, useState } from "react";
import "./index.css";
import { Heart } from "../../assets/icons/";
import useFavouriteStore from "../../stores/useFavouriteStore";
import useAlertStore from "../../stores/useAlertStore";
import { debounce } from "lodash";
import axios from "axios"

const Dashboard = () => {
  const [message,setMessage] = useState({type:"",message:""})
  const [isLoading,setIsLoading] = useState(false)
  const favourites = useFavouriteStore((state) => state.favourites);
  const setFavourites = useFavouriteStore((state) => state.setter);
  const dislike = useFavouriteStore((state) => state.dislike);

  const alerts = useAlertStore((state) => state.alerts);
  const setAlerts = useAlertStore(state=>state.setter)
  const debouncedDislike = useMemo(
    () =>
      debounce((id) => {
        setIsLoading(true)
        try {
          const req = axios.delete(`http://localhost:4000/favourites/${id}`)
          const msg = req.data.message;
          setMessage({type:"success",message:msg})
          dislike(id);
        } catch (error) {
          const errMsg = error.response?.data?.message
          setMessage({type:"error",message:errMsg})
        }finally{
          setIsLoading(false)
        }
      }, 300),
    [dislike]
  );
  const handleUnlike = (id) => {
    debouncedDislike(id);
  };

  useEffect(()=>{
    (async ()=>{try {
      const req1 = await axios.get("http://localhost:4000/favorites",{withCredentials:true})
      if(req1.status ===200){
        setFavourites(req1.data.data)
      }
      const req2 = await axios.get("http://localhost:4000/alerts",{withCredentials:true})
      if(req2.status===200){
        setAlerts(req2.data.data)
      }
    } catch (error) {
      console.log(error)
    }})();
  },[])
  return (
    <div className="dashboard-wrapper">
      <div className="favourites">
        <h3>Your liked currencies:</h3>
        <table>
          <thead>
            <tr>
              <th>from</th>
              <th>to</th>
              <th>date</th>
              <th>originalAmount</th>
              <th>convertedAmount</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {favourites.length > 0 ? (
              favourites.map((fav) => (
                <tr key={fav._id}>
                  <td>{fav.from}</td>
                  <td>{fav.to}</td>
                  <td>{fav.date}</td>
                  <td>{fav.amount}</td>
                  <td>{fav.camount}</td>
                  <td>
                    {
                      <button className="icons"
                        onClick={() => {
                          handleUnlike(fav._id);
                        }}
                      >
                        <Heart isFavourite={true} size={25} />
                      </button>
                    }
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6}>No liked currency pairs,</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="notifications">
        <h3>Your set alerts:</h3>
        <table>
          <thead>
            <tr>
              <th>from</th>
              <th>to</th>
              <th>codition</th>
              <th>threshold</th>
              <th>Want Daily Updates</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert) => (
              <tr key={alert.id}>
                <td>{alert.from}</td>
                <td>{alert.to}</td>
                <td>{alert.condition}</td>
                <td>{alert.threshold}</td>
                <td>{alert.wantDailyUpdates ? "yes" : "no"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
