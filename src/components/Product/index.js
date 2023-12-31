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
import { deleteProduct, getAllProducts } from "../../utils/api";
import {
  BorderColor as BorderColorIcon,
  DeleteForever as DeleteForeverIcon,
} from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";

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
    const data = productData.map((data) => ({
      id: data._id,
      category: data.category.name,
      bookName: data.bookName,
      price: data.price,
      quantity: data.quantity,
      authorName: data.authorName,
      description: data.description.slice(0, 30) + "..",
      images: (
        <Fragment>
          {data.images.map((image, index) => (
            <img
              key={index}
              width="40px"
              height="40px"
              style={{
                objectFit: "cover",
                borderRadius: "3px",
                marginRight: index !== data.images.length - 1 ? ".5rem" : "0",
              }}
              src={image}
            />
          ))}
        </Fragment>
      ),
      status:
        data.status.toLowerCase() == "available" ? (
          <CheckIcon color="success" sx={{ fontSize: "2.5rem" }} />
        ) : (
          <CloseIcon color="error" sx={{ fontSize: "2.5rem" }} />
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
          color="success"
          sx={{
            ...iconStyle,
            color: "var(--primary-color-dark)",
          }}
          onClick={updateProductHandler.bind(null, data._id)}
        />
      ),
      delete: (
        <DeleteForeverIcon
          sx={{
            ...iconStyle,
            color: "red",
          }}
          onClick={deleteProductHandler.bind(null, data._id)}
        />
      ),
    }));
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
      const data = await deleteProduct(id);

      dispatch(uiActions.setSnackBar(SNACKBAR_DETAILS.ON_DELETE_ITEM));
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
        searchHolder="Search by id.."
        title="products"
        onModalOpen={openModalHandler}
        showForm={true}
        for="product"
        columns={PRODUCT_COLUMNS}
        rowData={rowData}
        onUpdate={updateProductHandler}
        onDelete={deleteProductHandler}
      />
    </Fragment>
  );
}

export default Product;
