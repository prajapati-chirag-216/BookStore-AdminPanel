// import React from "react";
// import classes from "./index.module.css";
// import Input from "../../Input";
// import Select from "../../Select";
// import Button from "../../Button";
// function Form(props) {
//   return (
//     <form className={classes["form"]}>
//       <Input type="text" required={true} placeholder="Name" />
//       <Input type="email" required={true} placeholder="email" />
//       <div className={classes["row-inp"]} style={{ marginBottom: "2rem" }}>
//         <Input type="password" required={true} placeholder="password" />
//         <Select placeholder="Role" options={ROLES_LIST} />
//       </div>
//       <Button className="btn-large">Submit</Button>
//     </form>
//   );
// }

// export default Form;

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
import { addAdmin, updateAdmin } from "../../../utils/api";
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
      const filteredAdminData = Object.fromEntries(
        Object.entries(adminData).filter(([_, value]) => value !== "" && value)
      );
      if (filteredAdminData.length > 0) {
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
    >
      <Input
        ref={nameRef}
        type="text"
        onChange={nameChangeHandler}
        onBlur={validateNameHandler}
        placeholder="Name"
        name="name"
        value={nameState.value}
        isValid={
          props.action == ACTIONS.DEFAULT
            ? nameIsValid
            : nameIsValid || nameState.value == ""
        }
      />

      <Input
        ref={emailRef}
        type="text"
        onChange={emailChangeHandler}
        onBlur={validateEmailHandler}
        placeholder="Email"
        name="email"
        value={emailState.value}
        isValid={
          props.action == ACTIONS.DEFAULT
            ? emailIsValid
            : emailIsValid || emailState.value == ""
        }
      />
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
