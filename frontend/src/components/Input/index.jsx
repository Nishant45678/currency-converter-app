import React from "react";
import "./index.css";

const Input = ({ id, name, type="text", placeholder="", value, onChange, ...rest }) => {
  return (
    <input
      id={id}
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      {...rest}
    />
  );
};

export default Input;
