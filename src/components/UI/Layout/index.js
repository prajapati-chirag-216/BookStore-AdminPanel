import React from "react";
import classes from "./index.module.css";
import { Outlet } from "react-router-dom";
import Navigation from "../Navigation";

function Layout() {
  return (
    <div className={classes["main-container"]}>
      <Navigation />
      <hr className={classes["divider"]}></hr>
      <Outlet />
    </div>
  );
}

export default Layout;
