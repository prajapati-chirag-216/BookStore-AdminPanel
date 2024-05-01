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
    dispatchPassword({
      type: "USER_INPUT",
      value: event.target.value.trimStart(),
    });
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
  const validatePasswordHandler = () =>
    dispatchPassword({ type: "INPUT_BLUR" });

  const { isValid: nameIsValid } = nameState;
  const { isValid: emailIsValid } = emailState;
  const { isValid: passwordIsValid } = passwordState;

  useEffect(() => {
    const timer = setTimeout(() => {
      setFormIsValid(nameIsValid && emailIsValid && passwordIsValid);
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
    if (!passwordIsValid) {
      passwordRef.current.focus();
    }
    if (!emailIsValid) {
      emailRef.current.focus();
    }
    if (!nameIsValid) {
      nameRef.current.focus();
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
    >
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
      {/*  we need to check for password as well */}
      <div className={classes["row-inp"]}>
        <Input
          ref={passwordRef}
          type="password"
          placeholder="Password"
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
