import React, { Fragment, useEffect, useState } from "react";
import Main from "../Main";
import Modal from "../Modal";
import Form from "./Form";
import { useDispatch, useSelector } from "react-redux";
import {
  ACTIONS,
  OPERATIONS,
  PRODUCT_COLUMNS,
  SNACKBAR_DETAILS,
} from "../../utils/variables";
import { uiActions } from "../../store/ui-slice";
import { deleteProduct, getAllProducts, searchProduct } from "../../utils/api";

import { createProductRows } from "../../utils/function";

function Product() {
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

  const fetchProductDataHandler = async () => {
    const productData = await getAllProducts();
    // this function accepts data, onUpdate and onDelete function
    const data = createProductRows(
      productData,
      updateProductHandler,
      deleteProductHandler
    );
    return data;
  };
  const updateProductHandler = async (id) => {
    openModalHandler();
    setAction(ACTIONS.UPDATE);
    setSelectedId(id);
  };
  const deleteProductHandler = async (id) => {
    dispatch(
      uiActions.setOperationState({
        status: true,
        activity: OPERATIONS.DELETE,
      })
    );
    try {
      await deleteProduct(id);
      dispatch(uiActions.setSnackBar(SNACKBAR_DETAILS.ON_DELETE_ITEM));
    } catch (err) {
      if (err?.response?.status == 500) {
        dispatch(uiActions.setSnackBar(SNACKBAR_DETAILS.ON_ERROR));
      }
    }
    dispatch(
      uiActions.setOperationState({
        status: false,
        activity: OPERATIONS.FETCH,
      })
    );
  };

  const searchProductHandler = async (searchName) => {
    if (searchName !== "") {
      const res = await searchProduct(searchName);
      // this function accepts data, onUpdate and onDelete function
      const data = createProductRows(
        res,
        updateProductHandler,
        deleteProductHandler
      );
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
  }, []);

  useEffect(() => {
    // This will fetch Data when user perfoms any operations (Add,Update,Delete)
    if (operationState.status && operationState.activity == OPERATIONS.FETCH) {
      fetchProductDataHandler().then((data) => {
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
          text={action == ACTIONS.DEFAULT ? "Add product" : "Update product"}
        >
          <Form
            selectedId={selectedId}
            action={action}
            onModalClose={closeModalHandler}
          />
        </Modal>
      )}
      <Main
        searchHolder="Search book name.."
        title="products"
        onModalOpen={openModalHandler}
        showForm={true}
        for="product"
        columns={PRODUCT_COLUMNS}
        rowData={rowData}
        onUpdate={updateProductHandler}
        onDelete={deleteProductHandler}
        onSearch={searchProductHandler}
      />
    </Fragment>
  );
}

export default Product;
