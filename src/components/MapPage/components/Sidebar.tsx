import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../service/appState";
import styles from "./Sidebar.module.scss";
import stravaConnect from "../../../assets/strava-branding/connect.svg";
import stravaFooter from "../../../assets/strava-branding/footer.svg";

import activityApi from "../../../api/activity";
import Activity from "../../../types/Activity";
import polyline from "@mapbox/polyline";
import mapboxgl from "mapbox-gl";
import ActivityRow from "./ActivityRow";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import AggregatedStats from "./AggregatedStats";
import FilterSetting from "./FilterSetting";
import ActivityFilter from "../../../types/ActivityFilter";
import ActivityService from "../../../service/activity";

interface Props {
  map: mapboxgl.Map | null | undefined;
}

type SortParameter =
  | "start_date"
  | "distance"
  | "total_elevation_gain"
  | "average_watts";

type SortDirection = "asc" | "desc";

const sortActivities = (
  activities: Activity[],
  parameter: SortParameter,
  direction: SortDirection
) =>
  activities.sort((a, b) => {
    const d = direction == "asc" ? 1 : -1;
    if (typeof a[parameter] == "number") {
      return ((a[parameter] as number) - (b[parameter] as number)) * d;
    }
    return a[parameter].toString().localeCompare(b[parameter].toString()) * d;
  });

const Sidebar = ({ map }: Props) => {
  const user = useContext(UserContext);

  const [activities, setActivities] = useState<Activity[]>([]);
  const [focusedActivity, setFocusedActivity] = useState<Activity | null>(null);
  const [sortParameter, setSortParameter] =
    useState<SortParameter>("start_date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [activityFilter, setActivityFilter] = useState<ActivityFilter[]>([]);

  useEffect(() => {
    if (focusedActivity) {
      focusActivity(focusedActivity);
    }
  }, [focusedActivity]);

  useEffect(() => {
    setActivities([
      ...sortActivities(activities, sortParameter, sortDirection),
    ]);
  }, [sortParameter, sortDirection]);

  if (user == null) {
    return (
      <div className={styles.container}>
        <h1>
          Strava Map<span className="accentFont">.</span>
        </h1>
        <p className={styles.subheader}>
          Easily track all your Strava activities in one place. See your runs,
          rides, hikes, and more on a single map - try it now!
        </p>

        <div className={styles.loginContainer}>
          <p className={styles.connectStravaLabel}>
            To get started, log in with Strava
          </p>
          <a
            href={`${import.meta.env.VITE_API_URL}/oauth-login`}
            className="link"
          >
            <img src={stravaConnect} />
          </a>
        </div>
        <div className={styles.footerRow}>
          <a
            href="https://github.com/sebastianloose"
            target="_blank"
            className="link"
          >
            GitHub
          </a>
          <p className={styles.spacer}>•</p>
          <img src={stravaFooter} className={styles.stravaFooter} />
        </div>
      </div>
    );
  }

  const createActivityFilter = (activities: Activity[]) => {
    const types = [...new Set(activities.map((a) => a.type))];
    console.log(activities);
    return types.map(
      (type) =>
        ({
          icon: ActivityService.getActivityTypeIcon(type),
          type: type,
          active: true,
        } as ActivityFilter)
    );
  };

  const fetchActivities = async () => {
    const rawActivities = await activityApi.getActivities();

    let bounds: mapboxgl.LngLatBounds | null = null;
    let mappedActivities = rawActivities.map((a) => {
      a.map.points = polyline.decode(a.map.summary_polyline).map(([x, y]) => {
        const reversed = [y, x] as [number, number];
        if (bounds == null) {
          bounds = new mapboxgl.LngLatBounds(reversed, reversed);
        } else {
          bounds.extend(reversed);
        }
        return reversed;
      });
      return a;
    });

    mappedActivities = sortActivities(
      mappedActivities,
      sortParameter,
      sortDirection
    );

    mappedActivities.forEach((a) => {
      map?.addSource(a.id.toString(), {
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
        id: a.id.toString(),
        type: "line",
        source: a.id.toString(),
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
      map?.on("click", a.id.toString(), () => {
        setFocusedActivity(a);
      });
    });

    if (bounds) {
      map?.fitBounds(bounds, {
        padding: 30,
      });
    }

    setActivities(mappedActivities);
    setSortParameter(sortParameter);
    setActivityFilter(createActivityFilter(mappedActivities));
  };

  const colorActivity = (
    id: string,
    color: string,
    opacity: number,
    width: number
  ) => {
    map?.setPaintProperty(id, "line-color", color);
    map?.setPaintProperty(id, "line-opacity", opacity);
    map?.setPaintProperty(id, "line-width", width);
  };

  const focusActivity = (activity: Activity) => {
    let bounds: mapboxgl.LngLatBounds | null = null;

    activity.map.points.forEach((point) => {
      if (!bounds) {
        bounds = new mapboxgl.LngLatBounds(point, point);
      } else {
        bounds.extend(point);
      }
    });

    if (bounds) {
      map?.fitBounds(bounds, {
        padding: 30,
      });
    }

    activities.forEach((a) => {
      if (a.id == activity.id) return;
      const id = a.id.toString();
      colorActivity(id, "#999999", 1, 4);
    });

    const id = activity.id.toString();
    colorActivity(id, "#fc4c02", 1, 6);
    map?.moveLayer(id);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Strava Map<span className="accentFont">.</span>
      </h1>
      <div className={styles.filterContainer}>
        <div className={styles.sortContainer}>
          <p>Sort by:</p>
          <select
            value={sortParameter}
            onChange={(e) => setSortParameter(e.target.value as SortParameter)}
          >
            <option value="start_date">Date</option>
            <option value="elapsed_time">Duration</option>
            <option value="distance">Distance</option>
            <option value="total_elevation_gain">Elevation</option>
            <option value="average_watts">Power</option>
          </select>
          <div
            className={styles.sortIcon}
            onClick={() =>
              setSortDirection(sortDirection == "asc" ? "desc" : "asc")
            }
          >
            <FontAwesomeIcon
              icon={sortDirection == "asc" ? faArrowUp : faArrowDown}
            />
          </div>
        </div>
        <FilterSetting filter={activityFilter} setFilter={setActivityFilter} />
        <AggregatedStats activities={activities} />
      </div>

      <div className={styles.contentContainer}>
        {activities.length == 0 ? (
          <div onClick={fetchActivities}>Load</div>
        ) : (
          activities.map((a) => (
            <ActivityRow
              key={a.id}
              activity={a}
              focused={a.id == focusedActivity?.id}
              onClick={() => setFocusedActivity(a)}
            />
          ))
        )}
      </div>
      <div className={styles.footerRow}>
        <a
          href="https://github.com/sebastianloose"
          target="_blank"
          className="link"
        >
          GitHub
        </a>
        <p className={styles.spacer}>•</p>
        <img src={stravaFooter} className={styles.stravaFooter} />
      </div>
    </div>
  );
};

export default Sidebar;
