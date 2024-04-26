import React, { Fragment, useEffect, useState } from "react";
import Main from "../Main";
import Modal from "../Modal";
import Form from "./Form";
import { deleteOrder, getAllOrders, searchOrder } from "../../utils/api";
import {
  ACTIONS,
  ICON_STYLE,
  OPERATIONS,
  ORDER_COLUMNS,
  SNACKBAR_DETAILS,
  STATUS,
} from "../../utils/variables";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../../store/ui-slice";
import {
  BorderColor as BorderColorIcon,
  DeleteForever as DeleteForeverIcon,
} from "@mui/icons-material";

function Order() {
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
  const structureRows = (orderData) => {
    const data = orderData.map((data) => ({
      id: data._id,
      products: data.orderedItems
        .map((item) => item.productId.bookName + " x " + item.quantity)
        .join(" , "),
      bill: data.totalPrice,
      deliveryStatus: data.deliveryStatus,
      customer: data.shippingAddress.userName,
      email: data.contactInformation.email,
      phone: data.contactInformation.phoneNo,
      address: data.shippingAddress.address,
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
          onClick={updateOrderHandler.bind(null, data._id)}
        />
      ),
      delete: (
        <DeleteForeverIcon
          sx={{
            ...ICON_STYLE,
            color: "red",
          }}
          onClick={deleteOrderHandler.bind(null, data._id)}
        />
      ),
    }));
    return data;
  };
  const fetchOrderDataHandler = async () => {
    const orderData = await getAllOrders();
    const data = structureRows(orderData);
    return data;
  };
  const updateOrderHandler = async (id) => {
    openModalHandler();
    setAction(ACTIONS.UPDATE);
    setSelectedId(id);
  };
  const deleteOrderHandler = async (id) => {
    dispatch(
      uiActions.setOperationState({
        status: true,
        activity: OPERATIONS.DELETE,
      })
    );
    try {
      await deleteOrder(id);
      dispatch(uiActions.setSnackBar({ ...SNACKBAR_DETAILS.ON_DELETE_ORDER }));
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

  const searchOrderHandler = async (searchId) => {
    if (searchId !== "") {
      dispatch(uiActions.setIsLoadingBar({ status: STATUS.LOAD }));
      const res = await searchOrder(searchId);
      if (res?.isInValidId) {
        dispatch(
          uiActions.setSnackBar({ ...SNACKBAR_DETAILS.ON_INVALID_SEARCH_ID })
        );
      } else {
        const data = structureRows(res);
        setRowData(data);
      }
      dispatch(uiActions.setIsLoadingBar({ status: STATUS.COMPLETE }));
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
    fetchOrderDataHandler().then((data) => {
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
      fetchOrderDataHandler().then((data) => {
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
        <Modal isOpen={isOpen} onClose={closeModalHandler} text="Update order">
          <Form
            selectedId={selectedId}
            action={action}
            onModalClose={closeModalHandler}
          />
        </Modal>
      )}

      <Main
        searchHolder="Search trasaction id.."
        title="orders"
        onModalOpen={openModalHandler}
        for="order"
        columns={ORDER_COLUMNS}
        rowData={rowData}
        onUpdate={updateOrderHandler}
        onDelete={deleteOrderHandler}
        onSearch={searchOrderHandler}
      />
    </Fragment>
  );
}
export default Order;
