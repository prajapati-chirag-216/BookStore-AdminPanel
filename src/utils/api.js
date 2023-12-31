import AxiosInstance from "./AxiosInstance";
import { uploadToCloud } from "./function";

export async function signupAdmin(adminData) {
  const config = {
    method: "POST",
    url: `/admin/signup`,
    data: adminData,
    withCredentials: true,
  };
  const response = await AxiosInstance(config);
  return response;
}

export async function fetchAdminProfile() {
  try {
    const config = {
      url: `/admin/profile`,
      withCredentials: true,
    };
    const response = await AxiosInstance(config);
    return response;
  } catch (err) {
    throw err;
  }
}

export async function loginAdmin(adminData) {
  const config = {
    method: "POST",
    url: `/admin/login`,
    data: adminData,
    withCredentials: true,
  };
  const response = await AxiosInstance(config);
  return response;
}

export async function logoutAdmin() {
  const config = {
    method: "POST",
    url: `/admin/logout`,
    withCredentials: true,
  };
  const response = await AxiosInstance(config);
  return response;
}

export const getAllAdmins = async () => {
  const config = {
    url: `/getAllAdmins`,
    withCredentials: true,
  };
  const response = await AxiosInstance(config);
  return response;
};

export async function forgotPassword(adminData) {
  const config = {
    method: "POST",
    url: `/admin/forgotPassword`,
    data: adminData,
  };
  const response = await AxiosInstance(config);
  return response;
}

export async function resetPassword(adminData) {
  const config = {
    method: "POST",
    url: `/admin/resetPassword/${adminData.id}`,
    data: { password: adminData.password },
  };
  const response = await AxiosInstance(config);
  return response;
}

export async function deleteUser(id) {
  const config = {
    method: "DELETE",
    url: `/deleteUser/${id}`,
    withCredentials: true,
  };
  const response = await AxiosInstance(config);
  return response;
}

export const getAllProducts = async () => {
  const config = {
    url: `/getAllproducts`,
    withCredentials: true,
  };
  const response = await AxiosInstance(config);
  return response;
};

export const addProduct = async (productData) => {
  try {
    const result = Object.keys(productData.images).map(async (key) => {
      return await uploadToCloud(productData.images[key]);
    });
    const imageLinks = await Promise.all(result);
    productData.images = imageLinks;
    const config = {
      method: "POST",
      url: `/addproduct`,
      data: productData,
      withCredentials: true,
    };
    const response = await AxiosInstance(config);
    return response;
  } catch (err) {
    throw err;
  }
};

export const deleteProduct = async (id) => {
  const config = {
    method: "DELETE",
    url: `/deleteproduct/${id}`,
    withCredentials: true,
  };
  const response = await AxiosInstance(config);
  return response;
};

export const updateProduct = async (id, product) => {
  const { images, ...productData } = product;
  try {
    if (images) {
      const result = Object.keys(images).map(async (key) => {
        return await uploadToCloud(images[key]);
      });
      const imageLinks = await Promise.all(result);
      productData.images = imageLinks;
    }
    const config = {
      method: "PATCH",
      url: `/updateproduct/${id}`,
      data: productData,
      withCredentials: true,
    };
    const response = await AxiosInstance(config);
    return response;
  } catch (err) {
    throw err;
  }
};
export async function addCategory(catData) {
  try {
    const imageLink = await uploadToCloud(catData.image);
    catData.image = imageLink;
    const config = {
      method: "POST",
      url: `/addCategory`,
      data: catData,
      withCredentials: true,
    };
    const response = await AxiosInstance(config);
    return response;
  } catch (err) {
    throw err;
  }
}

export const updateCategory = async (id, categoryData) => {
  const { image, ...newCategoryData } = categoryData;
  try {
    if (categoryData.image) {
      const imageLink = await uploadToCloud(image);
      newCategoryData.image = imageLink;
    }
    const config = {
      method: "PATCH",
      url: `/updatecategory/${id}`,
      data: newCategoryData,
      withCredentials: true,
    };
    const response = await AxiosInstance(config);
    return response;
  } catch (err) {
    throw err;
  }
};

export const getAllCategories = async () => {
  const config = {
    url: `/getAllCategories`,
    withCredentials: true,
  };
  const response = await AxiosInstance(config);
  return response;
};

export const deleteCategory = async (id) => {
  const config = {
    method: "DELETE",
    url: `/deleteCategory/${id}`,
    withCredentials: true,
  };
  const response = await AxiosInstance(config);
  return response;
};

export const getAllOrders = async () => {
  const config = {
    url: `/getAllOrders`,
    withCredentials: true,
  };
  const response = await AxiosInstance(config);
  return response;
};

export const updateOrder = async (updateId, updateObj) => {
  try {
    const config = {
      method: "PATCH",
      url: `/updateOrderStatus/${updateId}`,
      data: updateObj,
      withCredentials: true,
    };
    const response = await AxiosInstance(config);
    return response;
  } catch (err) {
    throw err;
  }
};

export const getOrderById = async (id) => {
  const config = {
    url: `/getOrder/${id}`,
    withCredentials: true,
  };
  const response = await AxiosInstance(config);
  return response;
};

export const deleteOrder = async (id) => {
  const config = {
    method: "DELETE",
    url: `/deleteOrder/${id}`,
    withCredentials: true,
  };
  const response = await AxiosInstance(config);
  return response;
};

export const getTodaysOrders = async () => {
  const config = {
    url: `/getTodaysOrders`,
    withCredentials: true,
  };
  const response = await AxiosInstance(config);
  return response;
};

export const getAllUsers = async () => {
  const config = {
    url: `/getAllUsers`,
    withCredentials: true,
  };
  const response = await AxiosInstance(config);
  return response;
};

export const getAccessToken = async () => {
  try {
    const config = {
      url: "/admin/getAccessToken",
      withCredentials: true,
    };
    const response = await AxiosInstance(config);
    return response;
  } catch (err) {
    throw err;
  }
};

export const getAdmins = async () => {
  const config = {
    url: `/getAllAdmins`,
    withCredentials: true,
  };
  const response = await AxiosInstance(config);
  return response;
};

export async function addAdmin(adminData) {
  const config = {
    method: "POST",
    url: `/admin/addAdmin`,
    data: adminData,
    withCredentials: true,
  };
  const response = await AxiosInstance(config);
  return response;
}

export const deleteAdmin = async (id) => {
  const config = {
    method: "DELETE",
    url: `/deleteAdmin/${id}`,
    withCredentials: true,
  };
  const response = await AxiosInstance(config);
  return response;
};

export const updateAdmin = async (id, adminData) => {
  try {
    const config = {
      method: "PATCH",
      url: `/updateAdmin/${id}`,
      data: adminData,
      withCredentials: true,
    };
    const response = await AxiosInstance(config);
    return response;
  } catch (err) {
    throw err;
  }
};
