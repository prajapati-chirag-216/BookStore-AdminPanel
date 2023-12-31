import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./ui-slice";
import productReducer from "./product-slice";
const store = configureStore({
  reducer: {
    ui: uiReducer,
    product: productReducer,
  },
});
export default store;
