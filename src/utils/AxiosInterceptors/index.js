import { redirect } from "react-router-dom";
import store from "../../store";
import { uiActions } from "../../store/ui-slice";
import axios from "../axios";
import { genrateAccessToken } from "../function";
import { SNACKBAR_DETAILS, SNACKBAR_SEVERITY } from "../variables";

axios.interceptors.request.use(
  (request) => {
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalConfig = error.config;
    if (error.response?.status === 403 && !originalConfig._retry) {
      originalConfig._retry = true;
      await genrateAccessToken();
      return axios(originalConfig);
    } else if (
      error.response?.status === 500 &&
      error.response?.data?.message === "invalid signature"
    ) {
      return redirect("/auth");
    } else if (
      error.response?.status === 401 ||
      error.response?.status === 400 ||
      error.response?.status === 440
    ) {
      store.dispatch(
        uiActions.setSnackBar({
          status: true,
          message:
            error.response?.data?.message ||
            error.response?.data ||
            "Somthing Went Wrong",
          severity: SNACKBAR_SEVERITY.WARNING,
        })
      );
    }
    return Promise.reject(error);
  }
);
