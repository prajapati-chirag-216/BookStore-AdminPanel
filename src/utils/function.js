import { getAccessToken } from "../utils/api";

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
