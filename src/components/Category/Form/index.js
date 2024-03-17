import React, { useEffect, useReducer, useRef, useState } from "react";
import classes from "./index.module.css";
import Input from "../../Input";
import Button from "../../Button";
import { nameReducer } from "../../../reducers";
import { addCategory, updateCategory } from "../../../utils/api";
import {
  ACTIONS,
  OPERATIONS,
  SNACKBAR_DETAILS,
} from "../../../utils/variables";
import { useDispatch } from "react-redux";
import { uiActions } from "../../../store/ui-slice";

function Form(props) {
  const categoryNameRef = useRef(null);
  const imageRef = useRef(null);
  const dispatch = useDispatch();

  const [formIsValid, setFormIsValid] = useState(false);
  const [imageName, setImageName] = useState(null);

  const [categoryNameState, dispatchCategoryName] = useReducer(nameReducer, {
    value: "",
    isValid: null,
  });

  const categoryNameChangeHandler = (event) => {
    dispatchCategoryName({
      type: "USER_INPUT",
      value: event.target.value.trimStart(),
    });
  };

  const imageChangeHandler = (event) => {
    let name = "";
    const files = event.target.files;
    if (files[0]) {
      Object.keys(files).forEach((key, index) => {
        if (index < files.length) {
          name += files[key].name + ", ";
        }
      });
    }
    name = name.slice(0, -2);
    setImageName(name);
  };
  // this will run on input gets out from focus
  const validateCategoryNameHandler = () =>
    dispatchCategoryName({ type: "INPUT_BLUR" });

  const { isValid: categoryNameIsValid } = categoryNameState;
  const imageIsValid = imageName !== "" && imageName !== null;
  useEffect(() => {
    const timer = setTimeout(() => {
      setFormIsValid(categoryNameIsValid && imageIsValid);
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [categoryNameIsValid, imageIsValid]);

  const validateFormHandler = async (event) => {
    event.preventDefault();
    if (!categoryNameIsValid) {
      categoryNameRef.current.focus();
    }
    if (imageName == null) {
      setImageName("");
    }
  };

  const submitFormHandler = async (event) => {
    event.preventDefault();
    const categoryData = {
      name: categoryNameState.value,
      image: imageRef.current.files[0],
    };
    props.onModalClose();
    if (props.action == ACTIONS.DEFAULT) {
      dispatch(
        uiActions.setOperationState({ status: true, activity: OPERATIONS.ADD })
      );
      try {
        await addCategory(categoryData);
        dispatch(
          uiActions.setSnackBar({ ...SNACKBAR_DETAILS.ON_ADD_CATEGORY })
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
    } else if (props.action == ACTIONS.UPDATE) {
      const filteredCategoryData = Object.fromEntries(
        Object.entries(categoryData).filter(
          ([_, value]) => value !== "" && value
        )
      );
      if (Object.keys(filteredCategoryData).length > 0) {
        dispatch(
          uiActions.setOperationState({
            status: true,
            activity: OPERATIONS.UPDATE,
          })
        );
        try {
          await updateCategory(props.selectedId, filteredCategoryData);
          dispatch(
            uiActions.setSnackBar({ ...SNACKBAR_DETAILS.ON_UPDATE_CATEGORY })
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
      } else {
        dispatch(uiActions.setSnackBar({ ...SNACKBAR_DETAILS.ON_DEFAULT }));
      }
    }
  };
  return (
    <form
      className={classes["form"]}
      onSubmit={
        formIsValid || props.action == ACTIONS.UPDATE
          ? submitFormHandler
          : validateFormHandler
      }
      method="post"
      id="myForm"
    >
      <Input
        ref={categoryNameRef}
        type="text"
        placeholder="Name"
        onChange={categoryNameChangeHandler}
        onBlur={validateCategoryNameHandler}
        isValid={categoryNameIsValid}
        name="categoryName"
        value={categoryNameState.value}
      />
      <Input
        ref={imageRef}
        type="file"
        placeholder="Add image"
        onChange={imageChangeHandler}
        name="images"
        label={imageName}
        isValid={imageName !== "" || props.action == ACTIONS.UPDATE}
        multiple={false}
      />
      <Button className="btn-large">Submit</Button>
    </form>
  );
}
export default Form;
