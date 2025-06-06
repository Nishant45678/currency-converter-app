import React from "react";
import useUtil from "../stores/useUtil";

const Header = () => {
  const { header } = useUtil();
  return <div>{header}</div>;
};

export default Header;
