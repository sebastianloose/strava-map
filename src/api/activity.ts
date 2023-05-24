import axios, { isAxiosError } from "axios";
import tokenService from "../service/token";
import Activity from "../types/Activity";
import ActivityDetailed from "../types/ActivityDetailedRoute";
import polyline from "@mapbox/polyline";

const baseUrl = import.meta.env.VITE_API_URL;

const getAuthHeader = () => ({
  Authorization: "Bearer " + tokenService.getToken(),
});

const decodePolyline = (data: string) =>
  polyline.decode(data).map(([x, y]) => [y, x]) as [number, number][];

const getActivities = async () => {
  try {
    const response = await axios.get(`${baseUrl}/activities`, {
      headers: getAuthHeader(),
    });
    const activities = response.data as Activity[];
    activities.forEach((a) => {
      a.route = decodePolyline(a.polylineRoute);
    });
    return activities;
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
    const details = response.data as ActivityDetailed;
    details.route = decodePolyline(details.polylineRoute);
    return details;
  } catch (error) {
    if (isAxiosError(error) && error?.response?.status == 400) {
      tokenService.clearToken();
      window.location.reload();
    }
  }
  return null;
};

export default { getActivities, getActivity };
