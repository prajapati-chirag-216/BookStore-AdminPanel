import React, { useRef } from "react";
import classes from "./index.module.css";
import Select from "../../Select";
import Button from "../../Button";
import { updateOrder } from "../../../utils/api";
import { useDispatch } from "react-redux";
import { uiActions } from "../../../store/ui-slice";
import {
  ACTIONS,
  OPERATIONS,
  SNACKBAR_DETAILS,
  ORDER_STATUS_LIST,
} from "../../../utils/variables";

function Form(props) {
  const dispatch = useDispatch();

  const statusRef = useRef(null);

  const submitFormHandler = async (event) => {
    event.preventDefault();
    const orderData = {
      deliveryStatus: statusRef.current.value,
    };
    props.onModalClose();
    if (props.action == ACTIONS.UPDATE) {
      dispatch(
        uiActions.setOperationState({
          status: true,
          activity: OPERATIONS.UPDATE,
        })
      );
      try {
        await updateOrder(props.selectedId, orderData);
        dispatch(
          uiActions.setSnackBar({ ...SNACKBAR_DETAILS.ON_UPDATE_ORDER })
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
      }
    }
  };
  return (
    <form
      className={classes["form"]}
      onSubmit={submitFormHandler}
      method="post"
    >
      <Select
        ref={statusRef}
        placeholder="status"
        name="status"
        options={ORDER_STATUS_LIST}
      />
      <Button className="btn-large">Submit</Button>
    </form>
  );
}

export default Form;
