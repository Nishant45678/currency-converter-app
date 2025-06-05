import React from "react";
import "./index.css";
const Label = ({ htmlFor, children, ...rest }) => {
  return (
    <label htmlFor={htmlFor} {...rest}>
      {children}
    </label>
  );
};

export default Label;
