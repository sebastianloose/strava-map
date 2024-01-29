import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../service/appState";
import styles from "./Sidebar.module.scss";
import stravaConnect from "../../../assets/strava-branding/connect.svg";
import stravaFooter from "../../../assets/strava-branding/footer.svg";

import activityApi from "../../../api/activity";
import Activity from "../../../types/Activity";
import ActivityRow from "./ActivityRow";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import AggregatedStats from "./AggregatedStats";
import FilterSetting from "./FilterSetting";
import ActivityFilter from "../../../types/ActivityFilter";
import ActivityService from "../service/activity";
import MapService from "../service/map";

type SortParameter =
  | "startDate"
  | "distance"
  | "totalElevationGain"
  | "averageWatts";

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

const getActiveActivities = (activities: Activity[]) => {
  return activities.filter((a) => a.visible);
};

const filterActivities = (
  activities: Activity[],
  activityFilter: ActivityFilter[]
) => {
  const activeActivityTypes = activityFilter
    .filter((a) => a.active)
    .map((a) => a.type);
  activities.forEach((a) => {
    a.visible = activeActivityTypes.includes(a.type);
  });
  return [...activities];
};

const Sidebar = () => {
  const user = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [focusedActivity, setFocusedActivity] = useState<Activity | null>(null);
  const [sortParameter, setSortParameter] =
    useState<SortParameter>("startDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [activityFilter, setActivityFilter] = useState<ActivityFilter[]>([]);

  const createActivityFilter = (activities: Activity[]) => {
    const types = [...new Set(activities.map((a) => a.type))];
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
    setLoading(true);
    let activities = await activityApi.getActivities();

    activities = sortActivities(activities, sortParameter, sortDirection);

    MapService.renderActivities(activities, setFocusedActivity);
    MapService.zoomToActivityBounds(activities);

    setActivityFilter(createActivityFilter(activities));
    setActivities(activities);
    setLoading(false);

    MapService.setMapStyleLoadListener(() => {
      MapService.renderActivities(activities, setFocusedActivity);
      setActivityFilter(createActivityFilter(activities));
      MapService.zoomToActivityBounds(activities);
      setActivities(activities);
    });
  };

  useEffect(() => {
    if (focusedActivity) {
      MapService.zoomToActivityBounds([focusedActivity]);
      MapService.focusActivity(focusedActivity, activities);
      if (!focusedActivity.isDetailedRoute) {
        (async () => {
          const details = await activityApi.getActivity(focusedActivity.id);
          if (details) {
            focusedActivity.route = details.route;
            focusedActivity.isDetailedRoute = true;
            MapService.updateActivityPoints(focusedActivity, details.route);
          }
        })();
      }
    } else {
      MapService.zoomToActivityBounds(getActiveActivities(activities));
      MapService.colorActivityHeatmap(activities);
    }
  }, [focusedActivity]);

  useEffect(() => {
    setActivities([
      ...sortActivities(activities, sortParameter, sortDirection),
    ]);
  }, [sortParameter, sortDirection]);

  useEffect(() => {
    setActivities(filterActivities(activities, activityFilter));
  }, [activityFilter]);

  useEffect(() => {
    MapService.toggleActivityVisibility(activities);
  }, [activities]);

  useEffect(() => {
    if (user != null) {
      fetchActivities();
    }
  }, [user]);

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
            href="https://github.com/sebastianloose/strava-map"
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

  if (loading) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>
          Strava Map<span className="accentFont">.</span>
        </h1>
        <div></div>

        <div className={styles.loadingContainer}>
          <p>Loading</p>
        </div>
        <div className={styles.footerRow}>
          <a
            href="https://github.com/sebastianloose/strava-map"
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
        <AggregatedStats activities={getActiveActivities(activities)} />
      </div>

      <div className={styles.contentContainer}>
        {activities.length == 0 ? (
          <p>Loading</p>
        ) : (
          getActiveActivities(activities).map((a) => (
            <ActivityRow
              key={a.id}
              activity={a}
              focused={a.id == focusedActivity?.id}
              onClick={() => {
                setFocusedActivity(focusedActivity == a ? null : a);
              }}
            />
          ))
        )}
      </div>
      <div className={styles.footerRow}>
        <a
          href="https://github.com/sebastianloose/strava-map"
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
