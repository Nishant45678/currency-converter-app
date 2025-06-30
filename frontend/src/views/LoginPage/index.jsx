import React, { useEffect, useState } from "react";
import { Card, Input, Label } from "../../components";
import "./index.css";
import useUserStore from "../../stores/useUserStore";
import axios from "axios";
import { toast } from "react-toastify";

const LoginPage = () => {
  const login = useUserStore((state) => state.login);
  const [userDetail, setUserDetail] = useState({
    name: "",
    password: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetail((prv) => ({ ...prv, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const req = await axios.post(
        "/api/login",
        {
          username: userDetail.name,
          password: userDetail.password,
        },
        {
          withCredentials: true,
        }
      );
      if (req.status === 200) {
        const msg = req.data.message||"Login successfully";
        const user = req.data.user;
        setMessage({ type: "success", text: msg });
        login(user);
      }
    } catch (error) {
      const errMsg = error.response?.data?.message||"Something went wrong";
      setMessage({ type: "error", text: errMsg });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if(!message.text) return;
    else if(message.type === "error") {
      toast.error(message.text)
      setMessage({type:"",text:""})
    }
    else if(message.type === "success") {
      toast.success(message.text)
      setMessage({type:"",text:""})
    }
  }, [message]);

  return (
    <div className="form__wrapper">
      <Card title={"Login"}>
        <form onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="name"> Enter your username :</Label>
            <Input
              id="username"
              name="name"
              type="text"
              placeholder="eg. user@123"
              value={userDetail.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="password"> Enter your password :</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="******"
              value={userDetail.password}
              onChange={handleChange}
              required
            />
          </div>
          <input
            type="submit"
            disabled={isLoading}
            value={isLoading ? "logging in..." : "log in"}
          />
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
