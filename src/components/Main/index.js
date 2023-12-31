import React, { Fragment, useEffect, useState } from "react";
import SearchBox from "../UI/SearchBox";
import classes from "./index.module.css";
import Table from "../Tabel";
import Button from "../Button";
import { useSelector } from "react-redux";
import { CircularProgress } from "@mui/material";

function Main(props) {
  const operationState = useSelector((state) => state.ui.operationState);
  return (
    <div className={classes["main-container"]}>
      <h1 className={classes["container-heading"]}>
        {props.title || "Orders"}
      </h1>
      <div className={classes["container-ctrl"]}>
        <SearchBox placeHolder={props.searchHolder || "Search here"} />
        {props.showForm && (
          <Button
            className="btn-small"
            onClick={props.onModalOpen || null}
            disabled={operationState.status}
          >
            {operationState.status && (
              <CircularProgress
                size={32}
                thickness={4.5}
                sx={{ color: "var(--teritiary-color)", marginRight: "2rem" }}
              />
            )}

            {operationState.status ? (
              operationState.activity
            ) : (
              <Fragment>
                <i style={{ fontSize: "var(--large-font-size)" }}>&#x2b;</i>
                Add {props.for}
              </Fragment>
            )}
          </Button>
        )}
      </div>
      <Table
        columns={props.columns}
        rows={props.rowData || []}
        onUpdate={props.onUpdate}
        onDelete={props.onDelete}
      />
    </div>
  );
}

export default Main;
