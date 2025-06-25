import React, { useEffect, useState } from "react";
import { Card, Input, Label } from "../../components";
import axios from "axios";

const SignUp = () => {
  const [message,setMessage] = useState({type:"",text:""})
  const [isLoading,setIsLoading] = useState(false)
  const [user, setUser] = useState({
    email: "",
    username: "",
    password: "",
    cpassword: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prv) => ({ ...prv, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    try {
      if (user.password === user.cpassword) {
        const req = await axios.post("http://localhost:4000/api/signup", {
          email: user.email,
          username: user.username,
          password: user.password,
        });
        
        if (req.status === 201)
          setMessage({type:"success",text:req.data.message||"Sign up successfully"})
      }
    } catch (error) {
      const errMsg = error?.response?.data.message || "Something went wrong."
      setMessage({type:"error",text:errMsg})
    }
    finally{
      setIsLoading(false)
    }
  };
  useEffect(()=>{
    console.log(message)
  },[message])

  return (
    <div className="form__wrapper">
      <Card title={"Sign up"}>
        <form onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="email"> Enter your email :</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="eg. user@gmail.com"
              value={user.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="username"> Enter your username :</Label>
            <Input
              id="username"
              name="username"
              placeholder="eg. user@123"
              value={user.username}
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
              value={user.password}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="cpassword"> confirm password :</Label>
            <Input
              id="cpassword"
              name="cpassword"
              type="password"
              placeholder="******"
              value={user.cpassword}
              onChange={handleChange}
              required
            />
          </div>
          <input type="submit" value={isLoading?"signing up...":"sign up"} disabled={isLoading} />
        </form>
      </Card>
    </div>
  );
};

export default SignUp;
