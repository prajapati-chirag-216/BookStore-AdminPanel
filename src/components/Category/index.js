import React, { Fragment, useEffect, useState } from "react";
import Main from "../Main";
import Modal from "../Modal";
import Form from "./Form";
import {
  deleteCategory,
  getAllCategories,
  searchCategory,
} from "../../utils/api";
import {
  ACTIONS,
  CATEGORY_COLUMNS,
  ICON_STYLE,
  OPERATIONS,
  SNACKBAR_DETAILS,
} from "../../utils/variables";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../../store/ui-slice";
import {
  BorderColor as BorderColorIcon,
  DeleteForever as DeleteForeverIcon,
} from "@mui/icons-material";

function Category() {
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

  const structureRows = (categoryData) => {
    const data = categoryData.map((data) => ({
      id: data._id,
      name: data.name,
      image: (
        <img
          width="40px"
          height="40px"
          style={{ objectFit: "cover", borderRadius: "3px" }}
          src={data.image}
        />
      ),
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
            ...ICON_STYLE,
            color: "var(--primary-color-dark)",
          }}
          onClick={updateCategoryHandler.bind(null, data._id)}
        />
      ),
      delete: (
        <DeleteForeverIcon
          sx={{
            ...ICON_STYLE,
            color: "red",
          }}
          onClick={deleteCategoryHandler.bind(null, data._id)}
        />
      ),
    }));
    return data;
  };

  const fetchCategoryDataHandler = async () => {
    const categoryData = await getAllCategories();
    const data = structureRows(categoryData);
    return data;
  };
  const updateCategoryHandler = async (id) => {
    openModalHandler();
    setAction(ACTIONS.UPDATE);
    setSelectedId(id);
  };
  const deleteCategoryHandler = async (id) => {
    dispatch(
      uiActions.setOperationState({
        status: true,
        activity: OPERATIONS.DELETE,
      })
    );
    try {
      await deleteCategory(id);
      dispatch(
        uiActions.setSnackBar({ ...SNACKBAR_DETAILS.ON_DELETE_CATEGORY })
      );
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
  const searchCategoryHandler = async (searchName) => {
    if (searchName !== "") {
      const res = await searchCategory(searchName);
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
    // This will fetch Data when user comes to this route
    dispatch(
      uiActions.setOperationState({
        status: true,
        activity: OPERATIONS.FETCH,
      })
    );
    fetchCategoryDataHandler().then((data) => {
      setRowData(data);
      dispatch(
        uiActions.setOperationState({
          status: false,
          activity: OPERATIONS.DEFAULT,
        })
      );
    });
  }, []);

  useEffect(() => {
    // This will fetch Data when user perfoms any operations (Add,Update,Delete)
    if (operationState.status && operationState.activity == OPERATIONS.FETCH) {
      fetchCategoryDataHandler().then((data) => {
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
          text={action == ACTIONS.DEFAULT ? "Add category" : "Update category"}
        >
          <Form
            selectedId={selectedId}
            action={action}
            onModalClose={closeModalHandler}
          />
        </Modal>
      )}
      <Main
        searchHolder="Search name.."
        title="categories"
        onModalOpen={openModalHandler}
        showForm={true}
        for="category"
        columns={CATEGORY_COLUMNS}
        rowData={rowData}
        onUpdate={updateCategoryHandler}
        onDelete={deleteCategoryHandler}
        onSearch={searchCategoryHandler}
      />
    </Fragment>
  );
}
export default Category;
