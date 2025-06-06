import React, { useState } from "react";
import { Card, Label, Input } from "../../components";
import { Cross, UserEdit } from "../../assets/icons";
import "./index.css";
import userStore from "../../stores/useUserStore";
import axios from "axios";

const ProfilePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const user = userStore((state) => state.user);
  const login = userStore((state) => state.login);

  const logout = userStore((state) => state.logout);
  const [wantEdit, setWantEdit] = useState(false);
  const [data, setData] = useState({
    username: user.username,
    email: user.email,
    oldPassword: "",
    newPassword: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((pre) => ({ ...pre, [name]: value }));
  };

  const handleWantEdit = (e) => {
    e.preventDefault();
    setWantEdit((pre) => !pre);
    if (!wantEdit) {
      setData({
        username: user.username,
        email: user.email,
        oldPassword: "",
        newPassword: "",
      });
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const req = await axios.get("http://localhost:4000/logout", {
        withCredentials: true,
      });
      if (req.status === 200) {
        const msg = (await req.data.message) || "Logout successfully";
        setMessage({ type: "success", text: msg });
        logout();
      }
    } catch (error) {
      const errMsg =
        (await error?.response?.data.message) ||
        "Something went wrong while logging out.";
      setMessage({ type: "error", text: errMsg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const req = await axios.put("http://localhost:4000/profile", data, {
        withCredentials: true,
      });
      if (req.status === 200) {
        const msg = req.data.message;
        setMessage({
          type: "success",
          text: msg || "Profile updated successfully.",
        });
        login(req.data.user);
      }
    } catch (error) {
      const errmsg = error?.response?.data.message || "something went wrong";
      setMessage({ type: "error", text: errmsg });
    } finally {
      setIsLoading(false);
      setData((pre) => ({ ...pre, oldPassword: "", newPassword: "" }));
    }
  };
  return (
    <div className="form__wrapper">
      <Card title={"Your Profile"}>
        <form onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="profile__username">Your username: </Label>
            <Input
              type="text"
              id="profile__username"
              name="username"
              disabled={!wantEdit}
              value={data.username}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="profile__email">Your email: </Label>
            <Input
              type="email"
              id="profile__email"
              name="email"
              disabled={!wantEdit}
              value={data.email}
              onChange={handleChange}
            />
          </div>
          {wantEdit ? (
            <>
              <div>
                <Label htmlFor="profile__old-password">
                  Your old password:{" "}
                </Label>
                <Input
                  type="password"
                  id="profile__old-password"
                  name="oldPassword"
                  disabled={!wantEdit}
                  value={data.oldPassword}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="profile__new-password">
                  Your new password:{" "}
                </Label>
                <Input
                  type="password"
                  id="profile__new-password"
                  name="newPassword"
                  disabled={!wantEdit}
                  value={data.newPassword}
                  onChange={handleChange}
                />
              </div>
            </>
          ) : null}
          <div className="profile__action-wrapper">
            <button className="icons" onClick={handleWantEdit}>
              {wantEdit ? <Cross /> : <UserEdit />}
            </button>
            {wantEdit ? (
              <Input
                type="submit"
                value={isLoading ? "submiting" : "submit"}
                disabled={isLoading}
              />
            ) : null}
            <button onClick={handleLogout} type="button" disabled={isLoading}>
              logout
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ProfilePage;
