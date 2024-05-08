// we will continue this for image ...

import React, {
  Suspense,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import classes from "./index.module.css";
import Input from "../../Input";
import Select from "../../Select";
import Button from "../../Button";
import {
  nameReducer,
  descriptionReducer,
  numberReducer,
} from "../../../reducers";
import {
  addProduct,
  getAllCategories,
  getProduct,
  updateProduct,
} from "../../../utils/api";
import { Await, useLoaderData } from "react-router-dom";
import { useDispatch } from "react-redux";
import { uiActions } from "../../../store/ui-slice";
import {
  ACTIONS,
  OPERATIONS,
  SNACKBAR_DETAILS,
  VALIDATION_MESSAGES,
} from "../../../utils/variables";
import { validateFile } from "../../../utils/function";
import { Close } from "@mui/icons-material";

const STATUS_LIST = [
  { id: "status_1", name: "Available" },
  { id: "status_2", name: "Not-Available" },
];

function Form(props) {
  const dispatch = useDispatch();
  const loaderData = useLoaderData();

  const bookNameRef = useRef(null);
  const authorNameRef = useRef(null);
  const priceRef = useRef(null);
  const quantityRef = useRef(null);
  const descriptionRef = useRef(null);
  const statusRef = useRef(null);
  const categoryRef = useRef(null);
  const imageRef = useRef(null);

  const [formIsValid, setFormIsValid] = useState(false);
  const [imageState, setImageState] = useState({
    value: "",
    isValid: null,
  });

  const [bookNameState, dispatchBookName] = useReducer(nameReducer, {
    value: "",
    isValid: null,
  });
  const [descriptionState, dispatchDescription] = useReducer(
    descriptionReducer,
    {
      value: "",
      isValid: null,
    }
  );
  const [authorNameState, dispatchAuthorName] = useReducer(nameReducer, {
    value: "",
    isValid: null,
  });
  const [priceState, dispatchPrice] = useReducer(numberReducer, {
    value: "",
    isValid: null,
  });
  const [quantityState, dispatchQuantity] = useReducer(numberReducer, {
    value: "",
    isValid: null,
  });

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
        // we are double checking so that next time it won't call function if it finds first value to false
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
    } else if (props.action == ACTIONS.UPDATE) {
      setImageState({ value: "", isValid: null });
    } else {
      setImageState({ value: name, isValid: false });
    }
  };

  const bookNameChangeHandler = (event) => {
    dispatchBookName({
      type: "USER_INPUT",
      value: event.target.value.trimStart(),
    });
  };
  const authorNameChangeHandler = (event) => {
    dispatchAuthorName({
      type: "USER_INPUT",
      value: event.target.value.trimStart(),
    });
  };
  const descriptionChangeHandler = (event) => {
    dispatchDescription({
      type: "USER_INPUT",
      value: event.target.value.trimStart(),
    });
  };
  const priceChangeHandler = (event) => {
    dispatchPrice({
      type: "USER_INPUT",
      value: event.target.value.trim(),
    });
  };
  const quantityChangeHandler = (event) => {
    dispatchQuantity({
      type: "USER_INPUT",
      value: event.target.value.trim(),
    });
  };

  const fillFormHandler = async () => {
    const data = await getProduct(props.selectedId);
    dispatchBookName({
      type: "USER_INPUT",
      value: data.bookName,
    });
    dispatchAuthorName({
      type: "USER_INPUT",
      value: data.authorName,
    });
    dispatchDescription({
      type: "USER_INPUT",
      value: data.description,
    });
    dispatchPrice({
      type: "USER_INPUT",
      value: data.price.toString(),
    });
    dispatchQuantity({
      type: "USER_INPUT",
      value: data.quantity.toString(),
    });

    if (data.status.toLowerCase() == "not-available") {
      statusRef.current.setValue(1);
    }

    // this will find category with same name and assign it's index to select value
    loaderData.map((category, index) => {
      if (category.name.toLowerCase() == data.category.name.toLowerCase()) {
        categoryRef.current.setValue(index);
      }
    });
  };

  // this will run on input gets out from focus
  const validateBookNameHandler = () =>
    dispatchBookName({ type: "INPUT_BLUR" });
  const validateAuthorNameHandler = () =>
    dispatchAuthorName({ type: "INPUT_BLUR" });
  const validateDescriptionHandler = () =>
    dispatchDescription({ type: "INPUT_BLUR" });
  const validatePriceHandler = () => dispatchPrice({ type: "INPUT_BLUR" });
  const validateQuantityHandler = () =>
    dispatchQuantity({ type: "INPUT_BLUR" });

  const { isValid: bookNameIsValid } = bookNameState;
  const { isValid: authorNameIsValid } = authorNameState;
  const { isValid: descriptionIsValid } = descriptionState;
  const { isValid: priceIsValid } = priceState;
  const { isValid: quantityIsValid } = quantityState;
  const { isValid: imageIsValid } = imageState;
  useEffect(() => {
    // this will check for image validity only if add action is performed
    const timer = setTimeout(() => {
      // here we are allowing empty image input for update mode
      const imageValidity =
        props.action == ACTIONS.UPDATE ? imageIsValid != false : imageIsValid;
      setFormIsValid(
        bookNameIsValid &&
          authorNameIsValid &&
          descriptionIsValid &&
          priceIsValid &&
          quantityIsValid &&
          imageValidity
      );
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [
    bookNameIsValid,
    authorNameIsValid,
    descriptionIsValid,
    priceIsValid,
    quantityIsValid,
    imageIsValid,
  ]);

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
    if (!descriptionIsValid) {
      descriptionRef.current.onInvalid();
    }
    if (!quantityIsValid) {
      quantityRef.current.onInvalid();
    }
    if (!priceIsValid) {
      priceRef.current.onInvalid();
    }
    if (!authorNameIsValid) {
      authorNameRef.current.onInvalid();
    }
    if (!bookNameIsValid) {
      bookNameRef.current.onInvalid();
    }
  };
  const submitFormHandler = async (event) => {
    event.preventDefault();
    const productData = {
      bookName: bookNameState.value,
      authorName: authorNameState.value,
      description: descriptionState.value,
      price: priceState.value,
      quantity: quantityState.value,
      images: imageRef.current.files,
      status: statusRef.current.value,
      category: categoryRef.current.id,
    };
    props.onModalClose();
    if (props.action == ACTIONS.DEFAULT) {
      dispatch(
        uiActions.setOperationState({ status: true, activity: OPERATIONS.ADD })
      );
      try {
        await addProduct(productData);

        dispatch(uiActions.setSnackBar({ ...SNACKBAR_DETAILS.ON_ADD_ITEM }));
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
      const filteredProductData = Object.fromEntries(
        Object.entries(productData).filter(
          ([key, value]) =>
            (key !== "images" && value) ||
            (key === "images" && value.length > 0)
        )
      );
      dispatch(
        uiActions.setOperationState({
          status: true,
          activity: OPERATIONS.UPDATE,
        })
      );
      try {
        await updateProduct(props.selectedId, filteredProductData);
        dispatch(uiActions.setSnackBar({ ...SNACKBAR_DETAILS.ON_UPDATE_ITEM }));
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
    }
  };
  return (
    <form
      className={classes["form"]}
      onSubmit={formIsValid ? submitFormHandler : validateFormHandler}
      method="post"
    >
      {/* This is just for validations, added here other wise it will push specific input tag to down */}
      {(bookNameIsValid == false || authorNameIsValid == false) && (
        <div className={classes["row-inp"]}>
          <div>
            {bookNameIsValid == false && (
              <span className={classes["invalid-txt"]}>
                {VALIDATION_MESSAGES.NAME}
              </span>
            )}
          </div>
          <div>
            {authorNameIsValid == false && (
              <span className={classes["invalid-txt"]}>
                {VALIDATION_MESSAGES.NAME}
              </span>
            )}
          </div>
        </div>
      )}
      <div className={classes["row-inp"]}>
        <Input
          ref={bookNameRef}
          type="text"
          placeholder="Book name"
          onChange={bookNameChangeHandler}
          onBlur={validateBookNameHandler}
          name="bookName"
          value={bookNameState.value}
          isValid={bookNameIsValid}
        />
        <Input
          ref={authorNameRef}
          type="text"
          placeholder="Author name"
          onChange={authorNameChangeHandler}
          onBlur={validateAuthorNameHandler}
          name="authorName"
          value={authorNameState.value}
          isValid={authorNameIsValid}
        />
      </div>

      {/* This is just for validations, added here other wise it will push specific input tag to down */}
      {(priceIsValid == false || quantityIsValid == false) && (
        <div className={classes["row-inp"]}>
          <div>
            {priceIsValid == false && (
              <span className={classes["invalid-txt"]}>
                {VALIDATION_MESSAGES.NUMBER}
              </span>
            )}
          </div>
          <div>
            {quantityIsValid == false && (
              <span className={classes["invalid-txt"]}>
                {VALIDATION_MESSAGES.NUMBER}
              </span>
            )}
          </div>
        </div>
      )}
      <div className={classes["row-inp"]}>
        <Input
          ref={priceRef}
          type="number"
          onChange={priceChangeHandler}
          onBlur={validatePriceHandler}
          placeholder="Price"
          name="price"
          value={priceState.value}
          isValid={priceIsValid}
        />
        <Input
          ref={quantityRef}
          type="number"
          onChange={quantityChangeHandler}
          onBlur={validateQuantityHandler}
          placeholder="Quantity"
          name="quantity"
          value={quantityState.value}
          isValid={quantityIsValid}
        />
      </div>

      {descriptionIsValid == false && (
        <span className={classes["invalid-txt"]}>
          {VALIDATION_MESSAGES.DESCRIPTION}
        </span>
      )}
      <Input
        ref={descriptionRef}
        type="text"
        placeholder="Description"
        onChange={descriptionChangeHandler}
        onBlur={validateDescriptionHandler}
        name="description"
        value={descriptionState.value}
        isValid={descriptionIsValid}
      />

      {/* we need to check for image as well */}
      {imageIsValid == false && (
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
          multiple={true}
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
      <div className={classes["row-inp"]}>
        <Suspense>
          <Await resolve={loaderData}>
            {(categoryList) => (
              <Select
                ref={categoryRef}
                placeholder="category"
                name="category"
                options={categoryList}
              />
            )}
          </Await>
        </Suspense>
        <Select
          ref={statusRef}
          placeholder="status"
          name="status"
          options={STATUS_LIST}
        />
      </div>
      <Button className="btn-large">Submit</Button>
    </form>
  );
}
export async function loader() {
  let categoryList = [];
  try {
    const categoryData = await getAllCategories();
    categoryList = categoryData.map((category) => {
      return { id: category._id, name: category.name };
    });
  } catch (err) {
    throw err;
  }
  return categoryList;
}
export default Form;
