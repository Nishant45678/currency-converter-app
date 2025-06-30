import React, { useEffect, useMemo, useState } from "react";
import "./index.css";
import { Heart } from "../../assets/icons/";
import useFavouriteStore from "../../stores/useFavouriteStore";
import useAlertStore from "../../stores/useAlertStore";
import { debounce } from "lodash";
import axios from "axios";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);
  const favourites = useFavouriteStore((state) => state.favourites);
  const setFavourites = useFavouriteStore((state) => state.setter);
  const dislike = useFavouriteStore((state) => state.dislike);

  const alerts = useAlertStore((state) => state.alerts);
  const setAlerts = useAlertStore((state) => state.setter);
  const debouncedDislike = useMemo(
    () =>
      debounce(async (id) => {
        setIsLoading(true);
        try {
          const req = await axios.delete(
            `/api/favorites/${id}`,
            { withCredentials: true }
          );
          const msg = req.data.message || "Removed from favourites list";
          setMessage({ type: "success", text: msg });
          dislike(id);
        } catch (error) {
          const errMsg =
            error.response?.data?.message || "Something went wrong";
          setMessage({ type: "error", text: errMsg });
        } finally {
          setIsLoading(false);
        }
        return () => {
          debouncedDislike.cancel();
        };
      }, 300),
    [dislike]
  );
  const handleUnlike = (id) => {
    debouncedDislike(id);
  };

  useEffect(() => {
    (async () => {
      try {
        const req1 = await axios.get("/api/favorites", {
          withCredentials: true,
        });
        if (req1.status === 200) {
          setFavourites(req1.data.data);
        }
        const req2 = await axios.get("/api/alerts", {
          withCredentials: true,
        });
        if (req2.status === 200) {
          setAlerts(req2.data.data);
        }
      } catch (error) {
        setMessage({type:"error",text:error?.response?.data.message})
      } finally {
        setIsLoading(false);
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
            {!isLoading?favourites.length > 0 ? (
              favourites.map((fav) => (
                <tr key={fav._id}>
                  <td>{fav.from}</td>
                  <td>{fav.to}</td>
                  <td>{fav.date.split("T")[0]}</td>
                  <td>{fav.amount || fav.originalAmount}</td>
                  <td>{fav.camount || fav.convertedAmount}</td>
                  <td>
                    {
                      <button
                        className="icons"
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
            ):(
             <tr>
                <td colSpan={6}>Loading...</td>
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
            {!isLoading?alerts.length > 0 ? (
              alerts.map((alert) => (
                <tr key={alert._id}>
                  <td>{alert.from}</td>
                  <td>{alert.to}</td>
                  <td>{alert.condition}</td>
                  <td>{alert.threshold}</td>
                  <td>{alert.wantDailyUpdates ? "yes" : "no"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>No Alerts found</td>
              </tr>
            ):(
              <tr>
                <td colSpan={6}>Loading...</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
