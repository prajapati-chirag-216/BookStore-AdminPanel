export const ROLES = {
  ADMIN: "ADMIN",
  EMPLOYEE: "EMPLOYEE",
};
export const ROLES_LIST = [
  { id: "role_1", name: ROLES.EMPLOYEE.toLowerCase() },
  { id: "role_2", name: ROLES.ADMIN.toLowerCase() },
];
export const ORDER_STATUS_LIST = [
  { id: "1", name: "Pending" },
  { id: "2", name: "Shipped" },
  { id: "3", name: "Reaching" },
];

export const STATUS = {
  DEFAULT: "NONE",
  LOAD: "LOAD",
  COMPLETE: "COMPLETE",
};

export const ACTIONS = {
  DEFAULT: "ADD",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
};
export const OPERATIONS = {
  DEFAULT: "None",
  FETCH: "Fetching..",
  ADD: "Adding..",
  UPDATE: "Updating..",
  DELETE: "Deleting..",
};
export const SNACKBAR_SEVERITY = {
  DEFAULT: "default",
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
};
export const SNACKBAR_DETAILS = {
  ON_DEFAULT: {
    status: true,
    severity: SNACKBAR_SEVERITY.INFO,
    message: "No changes Performed!",
  },

  ON_SIGNED_UP: {
    status: true,
    severity: SNACKBAR_SEVERITY.SUCCESS,
    message: "Welcome To Book Store!",
  },
  ON_LOGGED_IN: {
    status: true,
    severity: SNACKBAR_SEVERITY.SUCCESS,
    message: "Succesfully Logged In",
  },
  ON_LOGGED_OUT: {
    status: true,
    severity: SNACKBAR_SEVERITY.SUCCESS,
    message: "Succesfully Logged Out",
  },
  ON_ERROR: {
    status: true,
    severity: SNACKBAR_SEVERITY.ERROR,
    message: "Somthing Went Wrong",
  },
  ON_UNAUTHORIZED: {
    status: true,
    severity: SNACKBAR_SEVERITY.WARNING,
    message: "You need to login to your account",
  },
  ON_INVALID_ACCESS: {
    status: true,
    severity: SNACKBAR_SEVERITY.WARNING,
    message: "Unauthorized Access!",
  },
  ON_EMPTY_CART: {
    status: true,
    severity: SNACKBAR_SEVERITY.INFO,
    message: "Your cart is empty",
  },
  ON_ORDER_PLACED: {
    status: true,
    severity: SNACKBAR_SEVERITY.SUCCESS,
    message: "Order confirmed!",
  },
  ON_ORDER_CANCLED: {
    status: true,
    severity: SNACKBAR_SEVERITY.ERROR,
    message:
      "Oops! Something went wrong while processing your order. Please try again.",
  },
  ON_DELETE_ORDER: {
    status: true,
    severity: SNACKBAR_SEVERITY.SUCCESS,
    message: "Order Deleted",
  },
  ON_UPDATE_ORDER: {
    status: true,
    severity: SNACKBAR_SEVERITY.SUCCESS,
    message: "Order Updated",
  },

  ON_NOT_AVAILABLE: {
    status: true,
    severity: SNACKBAR_SEVERITY.INFO,
    message:
      "Oops! Some items are unavailable. Please remove them and proceed.",
  },

  ON_ADD_ITEM: {
    status: true,
    severity: SNACKBAR_SEVERITY.SUCCESS,
    message: "Item Added",
  },
  ON_UPDATE_ITEM: {
    status: true,
    severity: SNACKBAR_SEVERITY.SUCCESS,
    message: "Item Updated",
  },
  ON_DELETE_ITEM: {
    status: true,
    severity: SNACKBAR_SEVERITY.SUCCESS,
    message: "Item Deleted",
  },

  ON_DELETE_USER: {
    status: true,
    severity: SNACKBAR_SEVERITY.SUCCESS,
    message: "User Deleted",
  },

  ON_ADD_ADMIN: {
    status: true,
    severity: SNACKBAR_SEVERITY.SUCCESS,
    message: "Admin Added",
  },
  ON_UPDATE_ADMIN: {
    status: true,
    severity: SNACKBAR_SEVERITY.SUCCESS,
    message: "Admin Updated",
  },
  ON_DELETE_ADMIN: {
    status: true,
    severity: SNACKBAR_SEVERITY.SUCCESS,
    message: "Admin Deleted",
  },

  ON_ADD_CATEGORY: {
    status: true,
    severity: SNACKBAR_SEVERITY.SUCCESS,
    message: "Category Added",
  },
  ON_UPDATE_CATEGORY: {
    status: true,
    severity: SNACKBAR_SEVERITY.SUCCESS,
    message: "Category Updated",
  },
  ON_DELETE_CATEGORY: {
    status: true,
    severity: SNACKBAR_SEVERITY.SUCCESS,
    message: "Category Deleted",
  },

  ON_ADD_EMPLOYEE: {
    status: true,
    severity: SNACKBAR_SEVERITY.SUCCESS,
    message: "Employee Added",
  },
  ON_UPDATE_EMPLOYEE: {
    status: true,
    severity: SNACKBAR_SEVERITY.SUCCESS,
    message: "Employee Updated",
  },
  ON_DELETE_EMPLOYEE: {
    status: true,
    severity: SNACKBAR_SEVERITY.SUCCESS,
    message: "Emplyee Deleted",
  },

  ON_DUPLICATE_CREDENTIALS: {
    status: true,
    severity: SNACKBAR_SEVERITY.WARNING,
    message: "Email already in use. Try another or log in.",
  },
};

export const STEP_LABELS_ORDER_STATUS = ["Pending", "Shipped", "Reaching"];

export const ADMIN_COLUMNS = [
  { id: "id", label: "Id", minWidth: 100 },
  { id: "name", label: "Name", minWidth: 100 },
  { id: "email", label: "Email", minWidth: 150 },
  { id: "role", label: "Role", minWidth: 50 },
  {
    id: "createdAt",
    label: "CreatedAt",
    minWidth: 100,
    align: "center",
  },
  {
    id: "updatedAt",
    label: "UpdatedAt",
    minWidth: 100,
    align: "center",
  },
  {
    id: "update",
    label: "Update",
    minWidth: 50,
    align: "center",
  },
  {
    id: "delete",
    label: "Delete",
    minWidth: 50,
    align: "right",
  },
];

export const CATEGORY_COLUMNS = [
  { id: "id", label: "Id", minWidth: 150 },
  { id: "name", label: "Name", minWidth: 150 },
  { id: "image", label: "Image", minWidth: 50, align: "center" },
  {
    id: "createdAt",
    label: "CreatedAt",
    minWidth: 150,
    align: "center",
  },
  {
    id: "updatedAt",
    label: "UpdatedAt",
    minWidth: 150,
    align: "center",
  },
  {
    id: "update",
    label: "Update",
    minWidth: 50,
    align: "center",
  },
  {
    id: "delete",
    label: "Delete",
    minWidth: 50,
    align: "right",
  },
];

export const ORDER_COLUMNS = [
  {
    id: "id",
    label: "TransactionId",
    minWidth: 80,
    align: "left",
  },
  { id: "products", label: "products", minWidth: 80 },
  {
    id: "bill",
    label: "Bill",
    minWidth: 80,
    align: "left",
  },
  {
    id: "deliveryStatus",
    label: "deliveryStatus",
    minWidth: 80,
    align: "left",
  },
  {
    id: "customer",
    label: "Customer",
    minWidth: 80,
    align: "left",
  },
  {
    id: "email",
    label: "Email",
    minWidth: 80,
    align: "left",
  },
  {
    id: "phone",
    label: "Phone",
    minWidth: 80,
    align: "left",
  },
  {
    id: "address",
    label: "Address",
    minWidth: 80,
    align: "left",
  },
  {
    id: "createdAt",
    label: "createdAt",
    minWidth: 80,
    align: "left",
  },
  {
    id: "updatedAt",
    label: "updatedAt",
    minWidth: 80,
    align: "left",
  },
  {
    id: "update",
    label: "Update",
    minWidth: 80,
    align: "center",
  },
  {
    id: "delete",
    label: "Delete",
    minWidth: 80,
    align: "center",
  },
];

export const PRODUCT_COLUMNS = [
  { id: "id", label: "Id", minWidth: 100 },
  { id: "category", label: "Category", minWidth: 100 },
  { id: "bookName", label: "BookName", minWidth: 100 },
  { id: "authorName", label: "AuthorName", minWidth: 100 },
  { id: "description", label: "Description", minWidth: 170 },
  {
    id: "price",
    label: <span>Price (&#8377;)</span>,
    minWidth: 110,
    align: "center",
  },
  {
    id: "quantity",
    label: "Quantity",
    minWidth: 100,
    align: "center",
  },
  { id: "images", label: "Images", minWidth: 100, align: "center" },
  { id: "status", label: "Status", minWidth: 50, align: "center" },
  {
    id: "createdAt",
    label: "CreatedAt",
    minWidth: 100,
    align: "center",
  },
  {
    id: "updatedAt",
    label: "UpdatedAt",
    minWidth: 100,
    align: "center",
  },
  {
    id: "update",
    label: "Update",
    minWidth: 50,
    align: "center",
  },
  {
    id: "delete",
    label: "Delete",
    minWidth: 50,
    align: "right",
  },
];
export const USER_COLUMNS = [
  { id: "id", label: "Id", minWidth: 150 },
  { id: "name", label: "Name", minWidth: 150 },
  { id: "email", label: "Email", minWidth: 150 },
  {
    id: "createdAt",
    label: "CreatedAt",
    minWidth: 150,
    align: "center",
  },
  {
    id: "updatedAt",
    label: "UpdatedAt",
    minWidth: 150,
    align: "center",
  },
  {
    id: "delete",
    label: "Delete",
    minWidth: 50,
    align: "right",
  },
];
