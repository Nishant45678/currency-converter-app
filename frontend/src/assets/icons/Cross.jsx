import React, { useState } from "react";

const Cross = ({size=25}) => {
  const [hover,setHover]= useState(false)
  return (
    <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 384 512"
    fill={hover ? "blue" : "transparent"}
      stroke="blue"
      strokeWidth="20"
      role="img"
      width={size}
      height={size}
      style={{
        transition: "all 0.2s ease-in",
        transform: hover ? "scale(1.2)" : "scale(1)",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}>
      <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
    </svg>
  );
};

export default Cross;
