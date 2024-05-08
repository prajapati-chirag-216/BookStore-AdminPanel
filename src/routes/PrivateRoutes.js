import React from "react";
import { Navigate, redirect, useLoaderData } from "react-router-dom";
import { fetchAdminProfile } from "../utils/api";

const PrivateRoutes = (props) => {
  const loaderData = useLoaderData();

  return loaderData.adminProfile ? (
    <Navigate to={props.destination} replace />
  ) : (
    <Navigate to="/auth" replace />
  );
};

export async function loader() {
  let res;
  try {
    const adminProfile = await fetchAdminProfile();
    res = { adminProfile };
  } catch (err) {
    return redirect("/auth");
  }
  return res;
}
export default PrivateRoutes;
