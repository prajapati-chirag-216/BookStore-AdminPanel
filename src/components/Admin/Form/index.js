import React, { useEffect, useReducer, useRef, useState } from "react";
import classes from "./index.module.css";
import Input from "../../Input";
import Select from "../../Select";
import Button from "../../Button";
import { nameReducer, emailReducer, passwordReducer } from "../../../reducers";
import {
  ACTIONS,
  OPERATIONS,
  ROLES,
  ROLES_LIST,
  SNACKBAR_DETAILS,
  VALIDATION_MESSAGES,
} from "../../../utils/variables";
import { uiActions } from "../../../store/ui-slice";
import { addAdmin, getAdmin, getAdmins, updateAdmin } from "../../../utils/api";
import { useDispatch } from "react-redux";

function Form(props) {
  const dispatch = useDispatch();

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const roleRef = useRef(null);

  const [formIsValid, setFormIsValid] = useState(false);

  const [nameState, dispatchName] = useReducer(nameReducer, {
    value: "",
    isValid: null,
  });
  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: null,
  });
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: "",
    isValid: null,
  });
  const nameChangeHandler = (event) => {
    dispatchName({
      type: "USER_INPUT",
      value: event.target.value.trim(),
    });
  };
  const emailChangeHandler = (event) => {
    dispatchEmail({
      type: "USER_INPUT",
      value: event.target.value.trim(),
    });
  };
  const passwordChangeHandler = (event) => {
    if (props.action == ACTIONS.UPDATE && event.target.value == "") {
      // it will return default state (because passed without type)
      dispatchPassword({
        type: "DEFAULT",
        value: "",
      });
    } else {
      dispatchPassword({
        type: "USER_INPUT",
        value: event.target.value.trimStart(),
      });
    }
  };

  const fillFormHandler = async () => {
    const data = await getAdmin(props.selectedId);
    dispatchName({
      type: "USER_INPUT",
      value: data.name,
    });
    dispatchEmail({
      type: "USER_INPUT",
      value: data.email,
    });
    // this will find category with same name and assign it's index to select value
    if (data.role.toLowerCase() == ROLES.ADMIN.toLowerCase()) {
      roleRef.current.setValue(1);
    }
  };

  // this will run on input gets out from focus
  const validateNameHandler = () => dispatchName({ type: "INPUT_BLUR" });
  const validateEmailHandler = () => dispatchEmail({ type: "INPUT_BLUR" });
  const validatePasswordHandler = () => {
    if (props.action == ACTIONS.UPDATE && passwordState.value == "") {
      // it will return default state (because passed without type)
      dispatchPassword({ type: "DEFAULT" });
    } else {
      dispatchPassword({ type: "INPUT_BLUR" });
    }
  };

  const { isValid: nameIsValid } = nameState;
  const { isValid: emailIsValid } = emailState;
  const { isValid: passwordIsValid } = passwordState;

  useEffect(() => {
    const passwordValidity =
      props.action == ACTIONS.UPDATE
        ? passwordIsValid != false
        : passwordIsValid;
    const timer = setTimeout(() => {
      setFormIsValid(nameIsValid && emailIsValid && passwordValidity);
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [nameIsValid, emailIsValid, passwordIsValid]);

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

    // here we are using this logic for all feilds so that it's isValid became false instead of null
    if (!passwordIsValid) {
      if (
        (props.action == ACTIONS.UPDATE && passwordState.value != "") ||
        props.action == ACTIONS.DEFAULT
      ) {
        passwordRef.current.onInvalid();
      }
    }
    if (!emailIsValid) {
      emailRef.current.onInvalid();
    }
    if (!nameIsValid) {
      nameRef.current.onInvalid();
    }
  };
  const submitFormHandler = async (event) => {
    event.preventDefault();
    const adminData = {
      name: nameState.value,
      password: passwordState.value,
      email: emailState.value,
      role: roleRef.current.value,
    };
    props.onModalClose();
    if (props.action == ACTIONS.DEFAULT) {
      dispatch(
        uiActions.setOperationState({ status: true, activity: OPERATIONS.ADD })
      );
      try {
        await addAdmin(adminData);
        dispatch(
          uiActions.setSnackBar(
            adminData?.role.toUpperCase() == ROLES.ADMIN
              ? { ...SNACKBAR_DETAILS.ON_ADD_ADMIN }
              : { ...SNACKBAR_DETAILS.ON_ADD_EMPLOYEE }
          )
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
      const filteredAdminData = Object.fromEntries(
        Object.entries(adminData).filter(([_, value]) => value !== "" && value)
      );
      if (Object.keys(filteredAdminData).length > 0) {
        dispatch(
          uiActions.setOperationState({
            status: true,
            activity: OPERATIONS.UPDATE,
          })
        );
        try {
          await updateAdmin(props.selectedId, filteredAdminData);
          dispatch(
            uiActions.setSnackBar(
              filteredAdminData?.role?.toUpperCase() == ROLES.ADMIN
                ? { ...SNACKBAR_DETAILS.ON_UPDATE_ADMIN }
                : { ...SNACKBAR_DETAILS.ON_UPDATE_EMPLOYEE }
            )
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
    >
      {nameIsValid == false && (
        <span className={classes["invalid-txt"]}>
          {VALIDATION_MESSAGES.NAME}
        </span>
      )}
      <Input
        ref={nameRef}
        type="text"
        onChange={nameChangeHandler}
        onBlur={validateNameHandler}
        placeholder="Name"
        name="name"
        value={nameState.value}
        isValid={nameIsValid}
      />

      {emailIsValid == false && (
        <span className={classes["invalid-txt"]}>
          {VALIDATION_MESSAGES.EMAIL}
        </span>
      )}
      <Input
        ref={emailRef}
        type="text"
        onChange={emailChangeHandler}
        onBlur={validateEmailHandler}
        placeholder="Email"
        name="email"
        value={emailState.value}
        isValid={emailIsValid}
      />

      {/* validation for password 
      used another div so that ui not get's breaked */}
      {/* This is just for validations, added here other wise it will push specific input tag to down */}
      {passwordIsValid == false && (
        <div className={classes["row-inp"]}>
          <div>
            {passwordIsValid == false && (
              <span className={classes["invalid-txt"]}>
                {VALIDATION_MESSAGES.PASSWORD}
              </span>
            )}
          </div>
          {/* we can add validation message for selector as well.
              if we were implemented `default select to --no-select--` */}
        </div>
      )}

      {/*  we need to check for password as well */}
      <div className={classes["row-inp"]}>
        <Input
          ref={passwordRef}
          type="password"
          placeholder={
            props.action == ACTIONS.UPDATE
              ? "New Password (Optional) "
              : "Password"
          }
          onChange={passwordChangeHandler}
          onBlur={validatePasswordHandler}
          name="password"
          value={passwordState.value}
          isValid={
            props.action == ACTIONS.DEFAULT
              ? passwordIsValid
              : passwordIsValid || passwordState.value == ""
          }
        />
        <Select
          ref={roleRef}
          placeholder="Role"
          name="role"
          options={ROLES_LIST}
        />
      </div>
      <Button className="btn-large">Submit</Button>
    </form>
  );
}
export default Form;
