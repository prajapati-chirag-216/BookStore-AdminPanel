import axios from "../axios";
import "../AxiosInterceptors";

const AxiosInstance = async (config) => {
  try {
    const response = await axios({
      method: config.method || "GET",
      url: config.url,
      data: config.data || null,
      withCredentials: config.withCredentials || false,
    });
    return response.data;
  } catch (err) {
    throw err;
  }
};
export default AxiosInstance;
