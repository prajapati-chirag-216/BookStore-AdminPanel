import React, { useEffect, useState } from "react";
import classes from "./index.module.css";
import { fetchAdminProfile } from "../../utils/api";
import { ROLES } from "../../utils/variables";
import { useLocation } from "react-router-dom";

function Button(props) {
  const [isDisabled, setIsDisabled] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;
  useEffect(() => {
    (async () => {
      const data = await fetchAdminProfile();
      if (data?.role) {
        const role = data.role.toUpperCase();
        if (ROLES[role] !== ROLES.ADMIN && pathname != "/auth") {
          setIsDisabled(true);
        }
      }
    })();
  }, []);
  return (
    <button
      className={`${classes["btn"]} ${classes[props.className]} ${
        props.varient == "outline" && classes["btn-outline"]
      } ${isDisabled ? classes["btn-disabled"] : ""}`}
      onClick={props.onClick}
      onSubmit={props.onSubmit}
      disabled={isDisabled || props.disabled}
    >
      {props.children}
    </button>
  );
}

export default Button;
