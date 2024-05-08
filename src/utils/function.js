import { getAccessToken } from "../utils/api";

//// we need this icons and styles for creating rows ////
import {
  BorderColor as BorderColorIcon,
  DeleteForever as DeleteForeverIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { ICON_STYLE } from "./variables";
import { Fragment } from "react";
/////////////////////////////////////////////////////////

export const genrateAccessToken = async () => {
  const response = await getAccessToken();
  return response;
};

export const uploadToCloud = async (image) => {
  const formData = new FormData();
  formData.append("file", image);
  formData.append("upload_preset", "AddImage");
  formData.append("cloud_name", "dzpuekeql");

  const result = await fetch(
    "https://api.cloudinary.com/v1_1/dzpuekeql/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );
  const data = await result.json();
  return data.secure_url;
};

export const formateData = (value, formateWith, validLength) => {
  let data = value.replace(/\s/g, "").replace(/\D/g, "");

  let formattedData = "";

  for (let i = 0; i < data.length; i++) {
    formattedData += data[i];
    if ((i + 1) % 4 === 0 && i !== data.length - 1) {
      formattedData += formateWith;
    }
  }

  if (data.length > validLength) {
    data = data.slice(0, validLength - 1);
    formattedData = formattedData.slice(0, validLength + 2);
  }
  return formattedData;
};

export const formateDate = (value) => {
  let extractedDate = value.replace(/\s/g, "").replace(/\D/g, "");

  let tempDate = "";

  for (let i = 0; i < extractedDate.length; i++) {
    tempDate += extractedDate[i];
    if (tempDate.length === 2) {
      tempDate += "/";
    }
  }
  if (tempDate.length > 5) {
    tempDate = tempDate.slice(0, 5);
  }
  let newDate = tempDate.split("/");
  let isValid = newDate[0] !== "00" && +newDate[0] <= 12 && +newDate[1] > 23; // letter we will change to currunt time
  return { tempDate, isValid };
};

export const validateFile = (file) => {
  const allowedExtensions = ["jpg", "jpeg", "png"];
  const fileNameParts = file.name.split(".");
  const fileExtension = fileNameParts[fileNameParts.length - 1].toLowerCase();
  return allowedExtensions.includes(fileExtension);
};

// this will accept `categoryData`, `onUpdate` and `onDelete` functions for updating or deleting category
// and return filled rows of table with data
export const createCategoryRows = (categoryData, onUpdate, onDelete) => {
  const data = categoryData.map((data) => ({
    id: data._id,
    name: data.name,
    image: (
      <img
        width="40px"
        height="40px"
        style={{ objectFit: "cover", borderRadius: "3px" }}
        src={data.image}
      />
    ),
    createdAt: `${new Date(data.createdAt).toLocaleDateString()}
    ,
    ${new Date(data.updatedAt).getHours()}:${new Date(
      data.updatedAt
    ).getMinutes()}`,
    updatedAt: `${new Date(data.createdAt).toLocaleDateString()}
      ,
      ${new Date(data.updatedAt).getHours()}:${new Date(
      data.updatedAt
    ).getMinutes()}`,
    update: (
      <BorderColorIcon
        sx={{
          ...ICON_STYLE,
          color: "var(--primary-color-dark)",
        }}
        onClick={onUpdate.bind(null, data._id)}
      />
    ),
    delete: (
      <DeleteForeverIcon
        sx={{
          ...ICON_STYLE,
          color: "red",
        }}
        onClick={onDelete.bind(null, data._id)}
      />
    ),
  }));
  return data;
};

// this will accept `adminData`, `onUpdate` and `onDelete` functions for updating or deleting admin
// and return filled rows of table with data
export const createAdminRows = (adminData, onUpdate, onDelete) => {
  const data = adminData.map((data) => ({
    id: data._id,
    name: data.name,
    email: data.email,
    role: data.role,
    createdAt: `${new Date(data.createdAt).toLocaleDateString()}
    ,
    ${new Date(data.updatedAt).getHours()}:${new Date(
      data.updatedAt
    ).getMinutes()}`,
    updatedAt: `${new Date(data.createdAt).toLocaleDateString()}
      ,
      ${new Date(data.updatedAt).getHours()}:${new Date(
      data.updatedAt
    ).getMinutes()}`,
    update: (
      <BorderColorIcon
        sx={{
          ...ICON_STYLE,
          color: "var(--primary-color-dark)",
        }}
        onClick={onUpdate.bind(null, data._id)}
      />
    ),
    delete: (
      <DeleteForeverIcon
        sx={{
          ...ICON_STYLE,
          color: "red",
        }}
        onClick={onDelete.bind(null, data._id)}
      />
    ),
  }));
  return data;
};

// this will accept `orderData`, `onUpdate` and `onDelete` functions for updating or deleting order
// and return filled rows of table with data
export const createOrderRows = (orderData, onUpdate, onDelete) => {
  const data = orderData.map((data) => ({
    id: data._id,
    products: data.orderedItems
      .map((item) => item.productId.bookName + " x " + item.quantity)
      .join(" , "),
    bill: data.totalPrice,
    deliveryStatus: data.deliveryStatus,
    customer: data.shippingAddress.userName,
    email: data.contactInformation.email,
    phone: data.contactInformation.phoneNo,
    address: data.shippingAddress.address,
    createdAt: `${new Date(data.createdAt).toLocaleDateString()}
    ,
    ${new Date(data.updatedAt).getHours()}:${new Date(
      data.updatedAt
    ).getMinutes()}`,
    updatedAt: `${new Date(data.createdAt).toLocaleDateString()}
      ,
      ${new Date(data.updatedAt).getHours()}:${new Date(
      data.updatedAt
    ).getMinutes()}`,
    update: (
      <BorderColorIcon
        sx={{
          ...ICON_STYLE,
          color: "var(--primary-color-dark)",
        }}
        onClick={onUpdate.bind(null, data._id)}
      />
    ),
    delete: (
      <DeleteForeverIcon
        sx={{
          ...ICON_STYLE,
          color: "red",
        }}
        onClick={onDelete.bind(null, data._id)}
      />
    ),
  }));
  return data;
};

// this will accept `productData`, `onUpdate` and `onDelete` functions for updating or deleting product
// and return filled rows of table with data
export const createProductRows = (productData, onUpdate, onDelete) => {
  const data = productData.map((data) => ({
    id: data._id,
    category: data.category.name,
    bookName: data.bookName,
    price: data.price,
    quantity: data.quantity,
    authorName: data.authorName,
    description: data.description.slice(0, 30) + "..",
    images: (
      <Fragment>
        {data.images.map((image, index) => (
          <img
            key={index}
            width="40px"
            height="40px"
            style={{
              objectFit: "cover",
              borderRadius: "3px",
              marginRight: index !== data.images.length - 1 ? ".5rem" : "0",
            }}
            src={image}
          />
        ))}
      </Fragment>
    ),
    status:
      data.status.toLowerCase() == "available" ? (
        <CheckIcon color="success" sx={{ fontSize: "2.5rem" }} />
      ) : (
        <CloseIcon color="error" sx={{ fontSize: "2.5rem" }} />
      ),
    createdAt: `${new Date(data.createdAt).toLocaleDateString()}
    ,
    ${new Date(data.updatedAt).getHours()}:${new Date(
      data.updatedAt
    ).getMinutes()}`,
    updatedAt: `${new Date(data.createdAt).toLocaleDateString()}
      ,
      ${new Date(data.updatedAt).getHours()}:${new Date(
      data.updatedAt
    ).getMinutes()}`,
    update: (
      <BorderColorIcon
        color="success"
        sx={{
          ...ICON_STYLE,
          color: "var(--primary-color-dark)",
        }}
        onClick={onUpdate.bind(null, data._id)}
      />
    ),
    delete: (
      <DeleteForeverIcon
        sx={{
          ...ICON_STYLE,
          color: "red",
        }}
        onClick={onDelete.bind(null, data._id)}
      />
    ),
  }));
  return data;
};

// this will accept `userData`, `onUpdate` and `onDelete` functions for updating or deleting user
// and return filled rows of table with data
export const createUserRows = (userData, onDelete) => {
  const data = userData.map((data) => ({
    id: data._id,
    name: data.name,
    email: data.email,
    createdAt: `${new Date(data.createdAt).toLocaleDateString()}
    ,
    ${new Date(data.updatedAt).getHours()}:${new Date(
      data.updatedAt
    ).getMinutes()}`,
    updatedAt: `${new Date(data.createdAt).toLocaleDateString()}
      ,
      ${new Date(data.updatedAt).getHours()}:${new Date(
      data.updatedAt
    ).getMinutes()}`,
    delete: (
      <DeleteForeverIcon
        sx={{
          ...ICON_STYLE,
          color: "red",
        }}
        onClick={onDelete.bind(null, data._id)}
      />
    ),
  }));
  return data;
};
