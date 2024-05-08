// we will continue this for image ...

import React, { useEffect, useReducer, useRef, useState } from "react";
import classes from "./index.module.css";
import Input from "../../Input";
import Button from "../../Button";
import { nameReducer } from "../../../reducers";
import { addCategory, getCategory, updateCategory } from "../../../utils/api";
import {
  ACTIONS,
  OPERATIONS,
  SNACKBAR_DETAILS,
  VALIDATION_MESSAGES,
} from "../../../utils/variables";
import { useDispatch } from "react-redux";
import { uiActions } from "../../../store/ui-slice";
import { validateFile } from "../../../utils/function";
import { Close } from "@mui/icons-material";

function Form(props) {
  const categoryNameRef = useRef(null);
  const imageRef = useRef(null);
  const dispatch = useDispatch();

  const [formIsValid, setFormIsValid] = useState(false);
  const [imageState, setImageState] = useState({
    value: "",
    isValid: null,
  });

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

  // const imageChangeHandler = (event) => {
  //   let name = "";
  //   const files = event.target.files;

  //   let isValid = true;
  //   if (files.length > 0) {
  //     for (let i = 0; i < files.length; i++) {
  //       if (!validateFile(files[i])) {
  //         isValid = false;
  //         break;
  //       }
  //     }

  //     if (!isValid) {
  //       event.target.value = null;
  //       setImageName("");
  //       return;
  //     }

  //     Object.keys(files).forEach((key, index) => {
  //       if (index < files.length) {
  //         name += files[key].name + ", ";
  //       }
  //     });
  //     name = name.slice(0, -2);
  //   }
  //   name = name.slice(0, -2);
  //   setImageName(name);
  // };
  const clearImagesHandler = () => {
    if (props.action == ACTIONS.UPDATE) {
      setImageState({ value: "", isValid: null });
    } else {
      setImageState({ value: "", isValid: false });
    }
  };
  const imageChangeHandler = (event) => {
    let name = "";
    const files = event.target.files;

    if (files.length > 0) {
      let isValid = true;

      for (let i = 0; i < files.length; i++) {
        name += files[i].name + ", ";
        // we are ouble checking so that next time it won't call function if it finds first value to false
        // we are not breaking loop for dusplaying names
        if (isValid && !validateFile(files[i])) {
          isValid = false;
        }
      }

      name = name.slice(0, -2);
      if (!isValid) {
        event.target.value = null;
        setImageState({ value: name, isValid: false });
        return;
      }
      setImageState({ value: name, isValid: true });
      return;
    }
    setImageState({ value: name, isValid: false });
  };

  const fillFormHandler = async () => {
    const data = await getCategory(props.selectedId);
    dispatchCategoryName({
      type: "USER_INPUT",
      value: data.name,
    });
  };

  // this will run on input gets out from focus
  const validateCategoryNameHandler = () =>
    dispatchCategoryName({ type: "INPUT_BLUR" });

  const { isValid: categoryNameIsValid } = categoryNameState;
  const { isValid: imageIsValid } = imageState;

  // this useEffect is for form validation
  useEffect(() => {
    const timer = setTimeout(() => {
      // this will check for image validity only if add action is performed
      const imageValidity =
        props.action == ACTIONS.UPDATE ? imageIsValid != false : imageIsValid;
      setFormIsValid(categoryNameIsValid && imageValidity);
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [categoryNameIsValid, imageIsValid]);

  // this useEffect is for form filling when user click on update button
  useEffect(() => {
    if (props.action == ACTIONS.UPDATE) {
      (async () => {
        await fillFormHandler();
      })();
    }
  }, [props.action, props.selectedId]);

  const validateFormHandler = async (event) => {
    event.preventDefault();
    // here we are using if else so that it will focus all invalid feilds and
    // move to next invalid feild meanwhile prevoius fields get's unfocused
    // and validateHandler will run for that feild and make isvalid to false instead of null

    // here we are using this logic so that it's isValid became false instead of null
    if (!imageIsValid) {
      if (props.action == ACTIONS.DEFAULT) {
        setImageState({
          value: imageState.value,
          isValid: false,
        });
      }
    }
    if (!categoryNameIsValid) {
      // here we are using this logic so that it's isValid became false instead of null
      categoryNameRef.current.onInvalid();
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
        dispatch(
          uiActions.setOperationState({
            status: false,
            activity: OPERATIONS.FETCH,
          })
        );
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
          dispatch(
            uiActions.setOperationState({
              status: false,
              activity: OPERATIONS.FETCH,
            })
          );
        }
      } else {
        dispatch(uiActions.setSnackBar({ ...SNACKBAR_DETAILS.ON_DEFAULT }));
      }
    }
  };
  return (
    <form
      className={classes["form"]}
      onSubmit={formIsValid ? submitFormHandler : validateFormHandler}
      method="post"
      id="myForm"
    >
      {categoryNameIsValid == false && (
        <span className={classes["invalid-txt"]}>
          {VALIDATION_MESSAGES.NAME}
        </span>
      )}
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
      {/* we need to check for image as well */}
      {imageIsValid == false && props.action == ACTIONS.DEFAULT && (
        <span className={classes["invalid-txt"]}>
          {VALIDATION_MESSAGES.IMAGE}
        </span>
      )}
      <div style={{ position: "relative" }}>
        <Input
          ref={imageRef}
          type="file"
          placeholder={
            props.action == ACTIONS.UPDATE
              ? "Add New Image (Optional) "
              : "Add Image"
          }
          onChange={imageChangeHandler}
          name="images"
          label={imageState.value}
          isValid={imageIsValid}
          value={imageRef?.current?.files || ""}
          multiple={false}
        />
        {imageState.value != "" && (
          <Close
            sx={{
              cursor: "pointer",
              position: "absolute",
              right: "1rem",
              top: "1.5rem",
              fontSize: "2rem",
              color: "var(--primary-font-color)",
            }}
            onClick={clearImagesHandler}
          />
        )}
      </div>
      <Button className="btn-large">Submit</Button>
    </form>
  );
}
export default Form;
