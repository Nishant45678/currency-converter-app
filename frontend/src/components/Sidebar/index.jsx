import React from "react";
import "./index.css";
import { NavLink } from "react-router-dom";
import useUtil from "../../stores/useUtil"
const Sidebar = () => {
  const setHeader = useUtil((state)=> state.setHeader);
  const links = [
    { name: "Home", path: "/",requireLogin:false },
    { name: "Login ", path: "/login" ,requireLogin:false},
    { name: "Sign up", path: "/signup",requireLogin:false },
    { name: "Alerts", path: "/alerts",requireLogin:true },
    { name: "Dashboard", path: "/dashboard",requireLogin:true },
    { name: "Profile", path: "/profile",requireLogin:true },
  ];

  const handleClick = (heading,requireLogin)=>{
    setHeader(heading,requireLogin)
  }
  return (
    <>
      <nav className="sidebar">
        <h2 className="sidebar__title">Currency converter</h2>
        <ul className="sidebar__list">
          {links.map((link) => (
            <li key={link.path} className="sidebar__item">
              <NavLink to={link.path} onClick={()=>handleClick(link.name,link.requireLogin)} className="sidebar__link" end>
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
