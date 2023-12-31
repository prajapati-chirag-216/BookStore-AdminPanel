import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoadingBar from "react-top-loading-bar";
import { STATUS } from "../../../utils/variables";
import { uiActions } from "../../../store/ui-slice";
import classes from "./index.module.css";

const BasicLoadingBar = () => {
  const loadingRef = useRef(null);
  const dispatch = useDispatch();

  const isLoadingBar = useSelector((state) => state.ui.isLoadingBar);

  useEffect(() => {
    if (isLoadingBar.status === STATUS.LOAD) {
      loadingRef.current.staticStart();
      loadingRef.current.continuousStart();
    } else if (isLoadingBar.status === STATUS.COMPLETE) {
      loadingRef.current.complete();
      dispatch(uiActions.setIsLoadingBar({ status: STATUS.DEFAULT }));
    }
  }, [isLoadingBar, dispatch]);

  return (
    <div className={classes["loading-bar"]}>
      <LoadingBar
        color="var(--color-black)"
        ref={loadingRef}
        style={{ height: "5px" }}
      />
    </div>
  );
};

export default BasicLoadingBar;
