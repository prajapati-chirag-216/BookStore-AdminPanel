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
  updateProduct,
} from "../../../utils/api";
import { Await, useLoaderData } from "react-router-dom";
import { useDispatch } from "react-redux";
import { uiActions } from "../../../store/ui-slice";
import {
  ACTIONS,
  OPERATIONS,
  SNACKBAR_DETAILS,
} from "../../../utils/variables";

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
  const [imageName, setImageName] = useState(null);

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
  const imageIsValid = imageName !== "" && imageName !== null;
  useEffect(() => {
    const timer = setTimeout(() => {
      setFormIsValid(
        bookNameIsValid &&
          authorNameIsValid &&
          descriptionIsValid &&
          priceIsValid &&
          quantityIsValid &&
          imageIsValid
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

  const validateFormHandler = async (event) => {
    event.preventDefault();
    if (imageName == null) {
      setImageName("");
    }
    if (!descriptionIsValid) {
      descriptionRef.current.focus();
    }
    if (!quantityIsValid) {
      quantityRef.current.focus();
    }
    if (!priceIsValid) {
      priceRef.current.focus();
    }
    if (!authorNameIsValid) {
      authorNameRef.current.focus();
    }
    if (!bookNameIsValid) {
      bookNameRef.current.focus();
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
        dispatch(
          uiActions.setOperationState({
            status: true,
            activity: OPERATIONS.FETCH,
          })
        );
        dispatch(uiActions.setSnackBar({ ...SNACKBAR_DETAILS.ON_ADD_ITEM }));
      } catch (err) {
        if (err?.response?.status == 500) {
          dispatch(uiActions.setSnackBar(SNACKBAR_DETAILS.ON_ERROR));
        }
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
    >
      <div className={classes["row-inp"]}>
        <Input
          ref={bookNameRef}
          type="text"
          placeholder="Book name"
          onChange={bookNameChangeHandler}
          onBlur={validateBookNameHandler}
          name="bookName"
          value={bookNameState.value}
          isValid={
            props.action == ACTIONS.DEFAULT
              ? bookNameIsValid
              : bookNameIsValid || bookNameState.value == ""
          }
        />
        <Input
          ref={authorNameRef}
          type="text"
          placeholder="Author name"
          onChange={authorNameChangeHandler}
          onBlur={validateAuthorNameHandler}
          name="authorName"
          value={authorNameState.value}
          isValid={
            props.action == ACTIONS.DEFAULT
              ? authorNameIsValid
              : authorNameIsValid || authorNameState.value == ""
          }
        />
      </div>
      <div className={classes["row-inp"]}>
        <Input
          ref={priceRef}
          type="number"
          onChange={priceChangeHandler}
          onBlur={validatePriceHandler}
          placeholder="Price"
          name="price"
          value={priceState.value}
          isValid={
            props.action == ACTIONS.DEFAULT
              ? priceIsValid
              : priceIsValid || priceState.value == ""
          }
        />
        <Input
          ref={quantityRef}
          type="number"
          onChange={quantityChangeHandler}
          onBlur={validateQuantityHandler}
          placeholder="Quantity"
          name="quantity"
          value={quantityState.value}
          isValid={
            props.action == ACTIONS.DEFAULT
              ? quantityIsValid
              : quantityIsValid || quantityState.value == ""
          }
        />
      </div>
      <Input
        ref={descriptionRef}
        type="text"
        placeholder="Description"
        onChange={descriptionChangeHandler}
        onBlur={validateDescriptionHandler}
        name="description"
        value={descriptionState.value}
        isValid={
          props.action == ACTIONS.DEFAULT
            ? descriptionIsValid
            : descriptionIsValid || descriptionState.value == ""
        }
      />

      <Input
        ref={imageRef}
        type="file"
        placeholder="Add image"
        onChange={imageChangeHandler}
        name="images"
        label={imageName}
        isValid={imageName !== "" || props.action == ACTIONS.UPDATE}
        value={imageRef?.current?.files || ""}
        multiple={true}
      />
      <div className={classes["row-inp"]} style={{ marginBottom: "2rem" }}>
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
