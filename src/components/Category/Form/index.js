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
  const validateFile = (file) => {
    const allowedExtensions = ["jpg", "jpeg", "png"];
    const fileExtension = file.name.split(".").pop().toLowerCase();

    return allowedExtensions.includes(fileExtension);
  };

  const imageChangeHandler = (event) => {
    let name = "";
    const files = event.target.files;

    let isValid = true;
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        if (!validateFile(files[i])) {
          isValid = false;
          break;
        }
      }

      if (!isValid) {
        alert("Please upload only jpg, jpeg, or png files.");
        event.target.value = null;
        setImageName("");
        return;
      }

      Object.keys(files).forEach((key, index) => {
        if (index < files.length) {
          name += files[key].name + ", ";
        }
      });
      name = name.slice(0, -2);
    }
    name = name.slice(0, -2);
    setImageName(name);
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
  const imageIsValid = imageName !== "" && imageName !== null;

  // this useEffect is for form validation
  useEffect(() => {
    const timer = setTimeout(() => {
      // this will check for image validity only if add action is performed
      setFormIsValid(
        categoryNameIsValid && (props.action == ACTIONS.UPDATE || imageIsValid)
      );
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
      } catch (err) {
        if (err?.response?.status == 500) {
          dispatch(uiActions.setSnackBar(SNACKBAR_DETAILS.ON_ERROR));
        }
      }
      dispatch(
        uiActions.setOperationState({
          status: true,
          activity: OPERATIONS.FETCH,
        })
      );
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
        } catch (err) {
          if (err?.response?.status == 500) {
            dispatch(uiActions.setSnackBar(SNACKBAR_DETAILS.ON_ERROR));
          }
        }
        dispatch(
          uiActions.setOperationState({
            status: true,
            activity: OPERATIONS.FETCH,
          })
        );
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
