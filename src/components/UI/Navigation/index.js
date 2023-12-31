import React, { useEffect } from "react";
import classes from "./index.module.css";
import {
  AdminPanelSettingsRounded as AdminPanelIcon,
  PeopleRounded as UsersIcon,
  CategoryRounded as CategoryIcon,
  FilterFramesRounded as OrderIcon,
  AutoStoriesRounded as ProductIcon,
  AccountCircle as ProfileIcon,
  LanguageRounded as LogoIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";

import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { logoutAdmin } from "../../../utils/api";
import { useDispatch } from "react-redux";
import { uiActions } from "../../../store/ui-slice";
import { SNACKBAR_DETAILS, STATUS } from "../../../utils/variables";

const PAGES = ["/home", "/admin", "/users", "/category", "/products"];

function Navigation() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const pathName = location.pathname;

  const logoutHandler = async () => {
    dispatch(uiActions.setIsLoadingBar({ status: STATUS.LOAD }));
    try {
      await logoutAdmin();
      dispatch(uiActions.setSnackBar({ ...SNACKBAR_DETAILS.ON_LOGGED_OUT }));
      navigate("/auth", { replace: true });
    } catch (err) {
      dispatch(uiActions.setSnackBar({ ...SNACKBAR_DETAILS.ON_ERROR }));
    }
  };

  useEffect(() => {
    const element = document.getElementsByClassName(classes["icon-container"]);
    PAGES.forEach((path, index) => {
      if (path == pathName) {
        element[index].classList.add(classes["active-page"]);
      } else {
        element[index].classList.remove(classes["active-page"]);
      }
    });
  }, [pathName]);

  const navigateHandler = () => {
    navigate("/auth");
  };
  return (
    <nav className={classes["nav-container"]}>
      <div className={classes["nav-bar"]}>
        <LogoIcon onClick={navigateHandler} />
        <h1>Admin Panel</h1>
        <LogoutIcon onClick={logoutHandler} />
      </div>
      <div className={classes["icons-container"]}>
        <NavLink className={classes["icon-container"]} to="/home">
          <OrderIcon />
          <span className={classes["icon-hidden"]}>Orders</span>
        </NavLink>
        <NavLink className={classes["icon-container"]} to="/admin">
          <AdminPanelIcon />
          <span className={classes["icon-hidden"]}>Admin</span>
        </NavLink>
        <NavLink className={classes["icon-container"]} to="/users">
          <UsersIcon />
          <span className={classes["icon-hidden"]}>Users</span>
        </NavLink>
        <NavLink className={classes["icon-container"]} to="/category">
          <CategoryIcon />
          <span className={classes["icon-hidden"]}>Category</span>
        </NavLink>
        <NavLink className={classes["icon-container"]} to="/products">
          <ProductIcon />
          <span className={classes["icon-hidden"]}>Products</span>
        </NavLink>
      </div>
    </nav>
  );
}

export default Navigation;
