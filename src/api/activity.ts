import axios, { isAxiosError } from "axios";
import tokenService from "../service/token";
import Activity from "../types/Activity";

const baseUrl = import.meta.env.VITE_API_URL;

const getAuthHeader = () => ({
  Authorization: "Bearer " + tokenService.getToken(),
});

const getActivities = async () => {
  try {
    const response = await axios.get(`${baseUrl}/activities`, {
      headers: getAuthHeader(),
    });
    return response.data as Activity[];
  } catch (error) {
    if (isAxiosError(error) && error?.response?.status == 400) {
      tokenService.clearToken();
      window.location.reload();
    }
  }
  return [];
};

export default { getActivities };
