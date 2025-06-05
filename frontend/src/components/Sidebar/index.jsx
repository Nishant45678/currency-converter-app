import React from "react";
import "./index.css";
import { NavLink } from "react-router-dom";
const Sidebar = () => {
  const links = [
    { name: "Home", path: "/" },
    { name: "Login ", path: "/login" },
    { name: "Sign up", path: "/signup" },
    { name: "Alerts", path: "/alerts" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Profile", path: "/profile" },
  ];

  return (
    <>
      <nav className="sidebar">
        <h2 className="sidebar__title">Currency converter</h2>
        <ul className="sidebar__list">
          {links.map((link) => (
            <li key={link.path} className="sidebar__item">
              <NavLink to={link.path} className="sidebar__link" end>
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default Sidebar;
