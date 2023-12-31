import { formateData, formateDate } from "../utils/function";

export const nameReducer = (state, action) => {
  let newVal, startsWithNumber;

  if (action.value !== undefined) {
    newVal = action.value;
    newVal = newVal.replace(/[^a-zA-Z0-9\s]+/g, "");
    startsWithNumber = /^\d/.test(newVal);
  }
  if (action.type === "INPUT_FETCH") {
    return {
      value: newVal,
      isValid:
        newVal.trim().length == 0
          ? null
          : newVal.trim().length > 5 &&
            newVal.trim().length <= 30 &&
            !startsWithNumber,
    };
  }
  if (action.type === "USER_INPUT") {
    return {
      value: newVal,
      isValid:
        newVal.trim().length > 5 &&
        newVal.trim().length <= 30 &&
        !startsWithNumber,
    };
  }
  if (action.type === "INPUT_BLUR") {
    return {
      value: state.value.trim(),
      isValid: state.value.trim().length > 5 && state.value.trim().length <= 30,
    };
  }
  return { value: "", isValid: null };
};

export const emailReducer = (state, action) => {
  if (action.type === "INPUT_FETCH") {
    return {
      value: action.value.trim(),
      isValid:
        action.value.trim().length == 0
          ? null
          : action.value.trim().includes("@"),
    };
  }
  if (action.type === "USER_INPUT") {
    return {
      value: action.value.trim(),
      isValid:
        action.value.trim().includes("@") &&
        action.value.trim().endsWith("gmail.com"),
    };
  }
  if (action.type === "INPUT_BLUR") {
    return {
      value: state.value.trim(),
      isValid:
        state.value.trim().includes("@") &&
        state.value.trim().endsWith("gmail.com"),
    };
  }
  return { value: "", isValid: null };
};

export const passwordReducer = (state, action) => {
  if (action.type === "INPUT_FETCH") {
    return {
      value: action.value.trim(),
      isValid:
        action.value.trim().length == 0
          ? null
          : action.value.trim().length >= 6 &&
            action.value.trim().length <= 10 &&
            !action.value.trim().toLowerCase().includes("password"),
    };
  }
  if (action.type === "USER_INPUT") {
    return {
      value: action.value,
      isValid:
        action.value.trim().length >= 6 &&
        action.value.trim().length <= 10 &&
        !action.value.trim().toLowerCase().includes("password"),
    };
  }
  if (action.type === "INPUT_BLUR") {
    return {
      value: state.value,
      isValid:
        state.value.trim().length >= 6 &&
        state.value.trim().length <= 10 &&
        !state.value.trim().toLowerCase().includes("password"),
    };
  }
  return { value: "", isValid: null };
};

export const phoneNoReducer = (state, action) => {
  if (action.type === "INPUT_FETCH") {
    const formattedPhoneNumber = formateData(action.value, "-", 10);
    return {
      value: formattedPhoneNumber,
      isValid:
        action.value.trim().length == 0
          ? null
          : formattedPhoneNumber.length === 12,
    };
  }
  if (action.type === "USER_INPUT") {
    const formattedPhoneNumber = formateData(action.value, "-", 10);
    return {
      value: formattedPhoneNumber,
      isValid: formattedPhoneNumber.length === 12,
    };
  }
  if (action.type === "INPUT_BLUR") {
    return {
      value: state.value,
      isValid: state.value.length === 12,
    };
  }
  return { value: "", isValid: null };
};

export const numberReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return {
      value: action.value,
      isValid: action.value >= 1 && !action.value.startsWith(0),
    };
  }
  if (action.type === "INPUT_BLUR") {
    return {
      value: state.value,
      isValid: state.value >= 1 && !state.value.startsWith(0),
    };
  }
  return { value: 0, isValid: null };
};

export const generalReducer = (state, action) => {
  let newVal;

  if (action.value !== undefined) {
    newVal = action.value;

    newVal = newVal.replace(/\d/g, "");
  }

  if (action.type === "INPUT_FETCH") {
    return {
      value: newVal,
      isValid:
        newVal.length == 0 ? null : newVal.length > 3 && newVal.length < 300,
    };
  }
  if (action.type === "USER_INPUT") {
    return {
      value: newVal,
      isValid: newVal.length > 3 && newVal.length < 300,
    };
  }
  if (action.type === "INPUT_BLUR") {
    return {
      value: state.value,
      isValid: state.value.length > 3 && state.value.length < 300,
    };
  }
  return { value: "", isValid: null };
};

export const pinCodeReducer = (state, action) => {
  let newVal;

  if (action.value !== undefined) {
    newVal = action.value;

    newVal = newVal.replace(/\D/g, "");
  }

  if (action.type === "INPUT_FETCH") {
    return {
      value: newVal,
      isValid: newVal.length == 0 ? null : newVal.length === 6,
    };
  }
  if (action.type === "USER_INPUT") {
    if (newVal.length === 7) {
      return { value: state.value.trim(), isValid: true };
    }
    return {
      value: newVal,
      isValid: newVal.length === 6,
    };
  }
  if (action.type === "INPUT_BLUR") {
    return {
      value: state.value.trim(),
      isValid: state.value.trim().length === 6,
    };
  }
  return { value: "", isValid: null };
};

export const cardNoReducer = (state, action) => {
  if (action.type === "INPUT_FETCH") {
    const formattedCardNumber = formateData(action.value, " ", 12);
    return {
      value: action.value.trim(),
      isValid:
        action.value.trim().length == 0
          ? null
          : formattedCardNumber.length === 14,
    };
  }
  if (action.type === "USER_INPUT") {
    const formattedCardNumber = formateData(action.value, " ", 12);
    return {
      value: formattedCardNumber,
      isValid: formattedCardNumber.length === 14,
    };
  }
  if (action.type === "INPUT_BLUR") {
    return {
      value: state.value,
      isValid: state.value.length === 14,
    };
  }
  return { value: "", isValid: null };
};

export const cvvReducer = (state, action) => {
  let newVal;

  if (action.value !== undefined) {
    newVal = action.value;

    newVal = newVal.replace(/\s/g, "").replace(/\D/g, "");
  }

  if (action.type === "INPUT_FETCH") {
    return {
      value: newVal,
      isValid:
        newVal.length == 0 ? null : newVal.length >= 3 && newVal.length <= 4,
    };
  }
  if (action.type === "USER_INPUT") {
    if (action.value.trim().length === 5) {
      return { value: state.value.trim(), isValid: true };
    }
    return {
      value: newVal,
      isValid: newVal.length >= 3 && newVal.length <= 4,
    };
  }
  if (action.type === "INPUT_BLUR") {
    return {
      value: state.value.trim(),
      isValid: state.value.trim().length >= 3 && state.value.trim().length <= 4,
    };
  }
  return { value: "", isValid: null };
};

export const expiryDateReducer = (state, action) => {
  if (action.type === "INPUT_FETCH") {
    const { tempDate, isValid } = formateDate(action.value);
    return {
      value: tempDate,
      isValid: action.value.trim().length == 0 ? null : isValid,
    };
  }
  if (action.type === "USER_INPUT") {
    const { tempDate, isValid } = formateDate(action.value);
    return {
      value: tempDate,
      isValid: isValid,
    };
  }
  if (action.type === "INPUT_BLUR") {
    let newDate = state.value.split("/");

    let isValid = newDate[0] !== "00" && +newDate[0] <= 12 && +newDate[1] > 23;

    isValid = isValid && newDate.join("").length === 4;
    return {
      value: state.value,
      isValid: isValid,
    };
  }
  return { value: "", isValid: null };
};

export const descriptionReducer = (state, action) => {
  if (action.type === "INPUT_FETCH") {
    return {
      value: action.value,
      isValid:
        action.value.trim().length == 0
          ? null
          : action.value.length >= 40 && action.value.length <= 400,
    };
  }
  if (action.type === "USER_INPUT") {
    return {
      value:
        action.value.startsWith(" ") || action.value.endsWith("  ")
          ? action.value.trim() + " "
          : action.value,
      isValid: action.value.length >= 40 && action.value.length <= 400,
    };
  }
  if (action.type === "INPUT_BLUR") {
    return {
      value: state.value,
      isValid: state.value.length >= 40 && state.value.length <= 400,
    };
  }
  return { value: "", isValid: null };
};
