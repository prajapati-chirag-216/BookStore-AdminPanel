import { createSlice } from "@reduxjs/toolkit";
import { OPERATIONS, SNACKBAR_SEVERITY, STATUS } from "../utils/variables";
const initialState = {
  isLoadingBar: { status: STATUS.DEFAULT },
  operationState: { status: false, activity: OPERATIONS.DEFAULT },
  snackBar: {
    status: false,
    message: "",
    severity: SNACKBAR_SEVERITY.DEFAULT,
  },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setOperationState(state, action) {
      state.operationState.status = action.payload.status;
      state.operationState.activity = action.payload.activity;
    },
    setIsLoadingBar(state, action) {
      state.isLoadingBar = action.payload;
    },
    setSnackBar(state, action) {
      state.snackBar = action.payload;
    },
  },
});

export const uiActions = uiSlice.actions;

export default uiSlice.reducer;
