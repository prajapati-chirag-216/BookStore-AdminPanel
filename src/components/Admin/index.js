import React, { Fragment, useEffect, useState } from "react";
import Main from "../Main";
import Modal from "../Modal";
import Form from "./Form";
import { deleteAdmin, getAllAdmins, getAllCategories } from "../../utils/api";
import {
  ACTIONS,
  ADMIN_COLUMNS,
  OPERATIONS,
  SNACKBAR_DETAILS,
} from "../../utils/variables";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../../store/ui-slice";
import {
  BorderColor as BorderColorIcon,
  DeleteForever as DeleteForeverIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

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

function Admin() {
  const [isOpen, setIsOpen] = useState(false);
  const [action, setAction] = useState(ACTIONS.DEFAULT);
  const [rowData, setRowData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const operationState = useSelector((state) => state.ui.operationState);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const openModalHandler = () => {
    setIsOpen(true);
  };
  const closeModalHandler = () => {
    setIsOpen(false);
    setAction(ACTIONS.DEFAULT);
  };
  const fetchAdminDataHandler = async () => {
    try {
      const adminData = await getAllAdmins();
      const data =
        adminData &&
        adminData.map((data) => ({
          id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
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
          update: (
            <BorderColorIcon
              sx={{
                ...iconStyle,
                color: "var(--primary-color-dark)",
              }}
              onClick={updateAdminHandler.bind(null, data._id)}
            />
          ),
          delete: (
            <DeleteForeverIcon
              sx={{
                ...iconStyle,
                color: "red",
              }}
              onClick={deleteAdminHandler.bind(null, data._id)}
            />
          ),
        }));
      return data;
    } catch (err) {
      return navigate("/auth", { replace: true });
    }
  };
  const updateAdminHandler = async (id) => {
    openModalHandler();
    setAction(ACTIONS.UPDATE);
    setSelectedId(id);
  };
  const deleteAdminHandler = async (id) => {
    dispatch(
      uiActions.setOperationState({
        status: true,
        activity: OPERATIONS.DELETE,
      })
    );
    try {
      await deleteAdmin(id);
      dispatch(uiActions.setSnackBar({ ...SNACKBAR_DETAILS.ON_DELETE_ADMIN }));
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
      dispatch(
        uiActions.setOperationState({
          status: false,
          activity: OPERATIONS.FETCH,
        })
      );
    }
  };
  useEffect(() => {
    // This will admin Data when admin comes to this route
    dispatch(
      uiActions.setOperationState({
        status: true,
        activity: OPERATIONS.FETCH,
      })
    );
    // fetchAdminDataHandler().then((data) => {
    //   setRowData(data || []);
    //   dispatch(
    //     uiActions.setOperationState({
    //       status: false,
    //       activity: OPERATIONS.DEFAULT,
    //     })
    //   );
    // });
  }, []);

  useEffect(() => {
    // This will fetch Data when user perfoms any operations (Add,Update,Delete)
    if (operationState.status && operationState.activity == OPERATIONS.FETCH) {
      fetchAdminDataHandler().then((data) => {
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
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onClose={closeModalHandler}
          text={action == ACTIONS.DEFAULT ? "Add admin" : "Update admin"}
        >
          <Form
            selectedId={selectedId}
            action={action}
            onModalClose={closeModalHandler}
          />
        </Modal>
      )}
      <Main
        searchHolder="Search admin id.."
        title="admins"
        for="admin"
        columns={ADMIN_COLUMNS}
        rowData={rowData}
        onUpdate={updateAdminHandler}
        onDelete={deleteAdminHandler}
        onModalOpen={openModalHandler}
        showForm={true}
      />
    </Fragment>
  );
}
export default Admin;
