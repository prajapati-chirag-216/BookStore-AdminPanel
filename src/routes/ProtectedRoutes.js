import React, { useLayoutEffect } from "react";
import {
  Navigate,
  Outlet,
  redirect,
  useLoaderData,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { fetchAdminProfile } from "../utils/api";
import { uiActions } from "../store/ui-slice";
import store from "../store";
import { ROLES } from "../utils/variables";
import { SNACKBAR_DETAILS } from "../utils/variables";
import { useDispatch } from "react-redux";

const ProtectedRoutes = (props) => {
  const navigate = useNavigate();
  const loaderData = useLoaderData();
  const location = useLocation();
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    if (!loaderData.adminProfile) {
      dispatch(uiActions.setSnackBar({ ...SNACKBAR_DETAILS.ON_UNAUTHORIZED }));
      navigate("/auth", { replace: true });
    } else {
      const pathname = location.pathname;
      if (
        pathname.endsWith("/admin") &&
        loaderData.adminProfile.role === ROLES.EMPLOYEE
      ) {
        dispatch(
          uiActions.setSnackBar({ ...SNACKBAR_DETAILS.ON_INVALID_ACCESS })
        );
        navigate("/auth", { replace: true });
      }
    }
  }, []);

  return loaderData.adminProfile ? (
    <Outlet />
  ) : (
    <Navigate to={props.destination} replace />
  );
};

export async function loader() {
  let res;
  try {
    const adminProfile = await fetchAdminProfile();
    res = { adminProfile };
  } catch (err) {
    res = { error: err };
    store.dispatch(
      uiActions.setSnackBar({ ...SNACKBAR_DETAILS.ON_INVALID_ACCESS })
    );
    return redirect("/auth");
  }
  return res;
}
export default ProtectedRoutes;
