import mapboxgl from "mapbox-gl";
import Activity from "../../../types/Activity";
import activity from "./activity";

let map: mapboxgl.Map | null;

const initializeMap = (ref: React.RefObject<HTMLDivElement>) => {
  map = new mapboxgl.Map({
    container: ref.current!,
    style: "mapbox://styles/mapbox/outdoors-v12",
    center: [11.5755, 48.1372],
    zoom: 2,
  });

  map.on("load", () => {
    map?.addSource("mapbox-dem", {
      type: "raster-dem",
      url: "mapbox://mapbox.terrain-rgb",
    });

    map?.setTerrain({
      source: "mapbox-dem",
      exaggeration: 1.5,
    });

    map?.setPadding({
      left: 350,
      top: 0,
      bottom: 0,
      right: 0,
    });
  });
};

const getActivityId = (activity: Activity) => `activity-${activity.id}`;

const renderActivities = (
  activities: Activity[],
  onActivityClick: (a: Activity) => void
) => {
  activities.forEach((a) => {
    const id = getActivityId(a);
    if (map?.getLayer(id)) {
      map?.removeLayer(id);
    }
    if (map?.getSource(id)) {
      map?.removeSource(id);
    }

    map?.addSource(id, {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: a.map.points,
        },
      },
    });
    map?.addLayer({
      id: id,
      type: "line",
      source: id,
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#E15554",
        "line-opacity": 0.35,
        "line-width": 4,
      },
    });
    map?.on("click", id, () => {
      onActivityClick(a);
    });
  });
};

const toggleActivityVisibility = (activities: Activity[]) => {
  activities.forEach((a) => {
    map?.setLayoutProperty(
      getActivityId(a),
      "visibility",
      a.active ? "visible" : "none"
    );
  });
};

const zoomToActivityBounds = (activities: Activity[]) => {
  let bounds: mapboxgl.LngLatBounds | null = null;

  activities.forEach((activity) =>
    activity.map.points.forEach((point) => {
      if (!bounds) {
        bounds = new mapboxgl.LngLatBounds(point, point);
      } else {
        bounds.extend(point);
      }
    })
  );

  if (bounds) {
    map?.fitBounds(bounds, {
      padding: 30,
    });
  }
};

const colorActivity = (
  activity: Activity,
  color: string,
  opacity: number,
  width: number
) => {
  const id = getActivityId(activity);
  map?.setPaintProperty(id, "line-color", color);
  map?.setPaintProperty(id, "line-opacity", opacity);
  map?.setPaintProperty(id, "line-width", width);
};

const colorActivityHeatmap = (activities: Activity[]) => {
  activities.forEach((a) => colorActivity(a, "#E15554", 0.35, 4));
};

const focusActivity = (focusedActivity: Activity, activities: Activity[]) => {
  activities.forEach((a) => {
    if (a.id == focusedActivity.id) return;
    colorActivity(a, "#999999", 1, 4);
  });

  colorActivity(focusedActivity, "#fc4c02", 1, 4);
  const id = getActivityId(focusedActivity);
  map?.moveLayer(id);
};

export default {
  initializeMap,
  renderActivities,
  zoomToActivityBounds,
  focusActivity,
  colorActivityHeatmap,
  toggleActivityVisibility,
};
