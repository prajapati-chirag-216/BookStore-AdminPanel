import React, { useEffect, useState } from "react";
import classes from "./index.module.css";
import Signin from "../../components/Auth/Signin";
import { useDispatch } from "react-redux";
import { uiActions } from "../../store/ui-slice";
import { STATUS } from "../../utils/variables";

function Auth() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(uiActions.setIsLoadingBar({ status: STATUS.COMPLETE }));
  }, []);

  return (
    <div className={classes["auth-container"]}>
      <h1 className={classes["container-heading"]}>Book Store</h1>
      <div className={classes["signin-container"]}>
        <Signin />
      </div>
    </div>
  );
}

export default Auth;
