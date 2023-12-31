// import React, { Fragment } from "react";
// import Main from "../Main";
// import classes from "./index.module.css";

// function Home() {
//   return (
//     <Fragment>
//       <Main
//         searchHolder="Search trasaction id.."
//         title="orders"
//         showForm={false}
//       />
//     </Fragment>
//   );
// }

// export default Home;

import React, { Fragment, useEffect, useState } from "react";
import Main from "../Main";
import Modal from "../Modal";
import Form from "./Form";
import { deleteOrder, getAllOrders } from "../../utils/api";
import {
  ACTIONS,
  OPERATIONS,
  ORDER_COLUMNS,
  SNACKBAR_DETAILS,
} from "../../utils/variables";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../../store/ui-slice";
import {
  BorderColor as BorderColorIcon,
  DeleteForever as DeleteForeverIcon,
} from "@mui/icons-material";

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

const columns = [
  {
    id: "id",
    label: "TransactionId",
    minWidth: 80,
    align: "left",
  },
  { id: "products", label: "products", minWidth: 80 },
  {
    id: "bill",
    label: "Bill",
    minWidth: 80,
    align: "left",
  },
  {
    id: "deliveryStatus",
    label: "deliveryStatus",
    minWidth: 80,
    align: "left",
  },
  {
    id: "customer",
    label: "Customer",
    minWidth: 80,
    align: "left",
  },
  {
    id: "email",
    label: "Email",
    minWidth: 80,
    align: "left",
  },
  {
    id: "phone",
    label: "Phone",
    minWidth: 80,
    align: "left",
  },
  {
    id: "address",
    label: "Address",
    minWidth: 80,
    align: "left",
  },
  {
    id: "createdAt",
    label: "createdAt",
    minWidth: 80,
    align: "left",
  },
  {
    id: "updatedAt",
    label: "updatedAt",
    minWidth: 80,
    align: "left",
  },
  {
    id: "update",
    label: "Update",
    minWidth: 80,
    align: "center",
  },
  {
    id: "delete",
    label: "Delete",
    minWidth: 80,
    align: "center",
  },
];

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
  const fetchOrderDataHandler = async () => {
    const orderData = await getAllOrders();

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
            ...iconStyle,
            color: "var(--primary-color-dark)",
          }}
          onClick={updateOrderHandler.bind(null, data._id)}
        />
      ),
      delete: (
        <DeleteForeverIcon
          sx={{
            ...iconStyle,
            color: "red",
          }}
          onClick={deleteOrderHandler.bind(null, data._id)}
        />
      ),
    }));
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
      />
    </Fragment>
  );
}
export default Order;
