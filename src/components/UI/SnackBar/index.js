import React, { Fragment, useEffect } from "react";
import { SnackbarProvider, useSnackbar } from "notistack";
import { useSelector } from "react-redux";

function MyApp() {
  const { enqueueSnackbar } = useSnackbar();
  const snackBar = useSelector((state) => state.ui.snackBar);

  useEffect(() => {
    if (snackBar.status) {
      enqueueSnackbar(snackBar.message, { variant: snackBar.severity });
    }
  }, [snackBar]);

  return <Fragment></Fragment>;
}

function SnackBar() {
  return (
    <SnackbarProvider
      maxSnack={3}
      style={{
        fontSize: "1.8rem",
        letterSpacing: "1px",
        textTransform: "capitalize",
      }}
    >
      <MyApp />
    </SnackbarProvider>
  );
}
export default SnackBar;
