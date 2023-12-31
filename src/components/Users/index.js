import React, { useState, useEffect, Fragment } from "react";
import Main from "../Main";
import { getAllUsers, deleteUser } from "../../utils/api";
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
  const [isOpen, setIsOpen] = useState(false);
  const [action, setAction] = useState(ACTIONS.DEFAULT);
  const [rowData, setRowData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const operationState = useSelector((state) => state.ui.operationState);

  const dispatch = useDispatch();
  const openModalHandler = () => {
    setIsOpen(true);
  };
  const closeModalHandler = () => {
    setIsOpen(false);
    setAction(ACTIONS.DEFAULT);
  };
  const fetchUserDataHandler = async () => {
    const userData = await getAllUsers();
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
  const updateUserHandler = async (id) => {
    openModalHandler();
    setAction(ACTIONS.UPDATE);
    setSelectedId(id);
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
        searchHolder="Search user id.."
        title="users"
        for="user"
        columns={USER_COLUMNS}
        rowData={rowData}
        onUpdate={updateUserHandler}
        onDelete={deleteUserHandler}
        onModalOpen={openModalHandler}
      />
    </Fragment>
  );
}
export default Users;
