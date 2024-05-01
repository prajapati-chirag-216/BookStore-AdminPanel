import React, { useState, useEffect, Fragment } from "react";
import Main from "../Main";
import { getAllUsers, deleteUser, searchUser } from "../../utils/api";
import {
  OPERATIONS,
  SNACKBAR_DETAILS,
  USER_COLUMNS,
} from "../../utils/variables";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../../store/ui-slice";
import { createUserRows } from "../../utils/function";

function Users() {
  const [rowData, setRowData] = useState([]);
  const operationState = useSelector((state) => state.ui.operationState);

  const dispatch = useDispatch();

  const fetchUserDataHandler = async () => {
    const userData = await getAllUsers();
    // this function accepts data and onDelete function
    const data = createUserRows(userData, deleteUserHandler);
    return data;
  };

  const deleteUserHandler = async (id) => {
    dispatch(
      uiActions.setOperationState({
        status: true,
        activity: OPERATIONS.DELETE,
      })
    );
    try {
      await deleteUser(id);
      dispatch(uiActions.setSnackBar(SNACKBAR_DETAILS.ON_DELETE_USER));
      dispatch(
        uiActions.setOperationState({
          status: true,
          activity: OPERATIONS.FETCH,
        })
      );
    } catch (err) {
      if (err?.response?.status == 500) {
        dispatch(uiActions.setSnackBar(SNACKBAR_DETAILS.ON_ERROR));
      }
    }
  };

  const searchUserHandler = async (searchEmail) => {
    if (searchEmail != "") {
      const res = await searchUser(searchEmail);
      // this function accepts data and onDelete function
      const data = createUserRows(res, deleteUserHandler);
      setRowData(data);
    } else {
      dispatch(
        uiActions.setOperationState({
          status: true,
          activity: OPERATIONS.FETCH,
        })
      );
    }
  };

  useEffect(() => {
    // This will user Data when user comes to this route
    dispatch(
      uiActions.setOperationState({
        status: true,
        activity: OPERATIONS.FETCH,
      })
    );
  }, []);

  useEffect(() => {
    // This will fetch Data when user perfoms any operations (Add,Update,Delete)
    if (operationState.status && operationState.activity == OPERATIONS.FETCH) {
      fetchUserDataHandler().then((data) => {
        setRowData(data);
        dispatch(
          uiActions.setOperationState({
            status: false,
            activity: OPERATIONS.DEFAULT,
          })
        );
      });
    }
  }, [operationState]);

  return (
    <Fragment>
      <Main
        searchHolder="Search email.."
        title="users"
        for="user"
        columns={USER_COLUMNS}
        rowData={rowData}
        onSearch={searchUserHandler}
        onDelete={deleteUserHandler}
      />
    </Fragment>
  );
}
export default Users;
