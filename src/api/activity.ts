import axios, { isAxiosError } from "axios";
import tokenService from "../service/token";
import Activity from "../types/ActivitySummary";
import ActivityDetailed from "../types/ActivityDetailed";

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

const getActivity = async (activityId: number) => {
  try {
    const response = await axios.get(`${baseUrl}/activity/${activityId}`, {
      headers: getAuthHeader(),
    });
    return response.data as ActivityDetailed;
  } catch (error) {
    if (isAxiosError(error) && error?.response?.status == 400) {
      tokenService.clearToken();
      window.location.reload();
    }
  }
  return null;
};

export default { getActivities, getActivity };
