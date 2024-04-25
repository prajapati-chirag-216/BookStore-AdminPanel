import React, { useState, useEffect, Fragment } from "react";
import Main from "../Main";
import { getAllUsers, deleteUser, searchUser } from "../../utils/api";
import {
  ACTIONS,
  OPERATIONS,
  SNACKBAR_DETAILS,
  USER_COLUMNS,
} from "../../utils/variables";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../../store/ui-slice";
import { DeleteForever as DeleteForeverIcon } from "@mui/icons-material";

const iconStyle = {
  fontSize: "2.2rem",
  cursor: "pointer",
  transition: "all .1s",
  padding: ".7rem",
  boxSizing: "content-box",
  borderRadius: ".5rem",
  "&:hover": {
    backgroundColor: "#0001",
  },
  "&:active": {
    scale: ".95",
  },
};

function Users() {
  const [rowData, setRowData] = useState([]);
  const operationState = useSelector((state) => state.ui.operationState);

  const dispatch = useDispatch();

  const structureRows = (userData) => {
    const data = userData.map((data) => ({
      id: data._id,
      name: data.name,
      email: data.email,
      createdAt: `${new Date(data.createdAt).toLocaleDateString()}
      ,
      ${new Date(data.updatedAt).getHours()}:${new Date(
        data.updatedAt
      ).getMinutes()}`,
      updatedAt: `${new Date(data.createdAt).toLocaleDateString()}
        ,
        ${new Date(data.updatedAt).getHours()}:${new Date(
        data.updatedAt
      ).getMinutes()}`,
      delete: (
        <DeleteForeverIcon
          sx={{
            ...iconStyle,
            color: "red",
          }}
          onClick={deleteUserHandler.bind(null, data._id)}
        />
      ),
    }));
    return data;
  };
  const fetchUserDataHandler = async () => {
    const userData = await getAllUsers();
    const data = structureRows(userData);
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
      const data = structureRows(res);
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
      console.log("Came");
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
        searchHolder="Search user id.."
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
