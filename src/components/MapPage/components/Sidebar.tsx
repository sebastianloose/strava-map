import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../service/appState";
import styles from "./Sidebar.module.scss";
import stravaConnect from "../../../assets/strava-branding/connect.svg";
import stravaFooter from "../../../assets/strava-branding/footer.svg";

import activityApi from "../../../api/activity";
import Activity from "../../../types/Activity";
import polyline from "@mapbox/polyline";
import mapboxgl from "mapbox-gl";

type Props = {
  map: mapboxgl.Map | null | undefined;
};

const Sidebar = ({ map }: Props) => {
  const user = useContext(UserContext);

  const [activities, setActivities] = useState<Activity[]>([]);

  if (user == null) {
    return (
      <div className={styles.container}>
        <h1>
          Strava Map<span className="accentFont">.</span>
        </h1>
        <p className={styles.subheader}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo, cum
          commodi veritatis eveniet id qui saepe dolore eius architecto.
        </p>

        <div className={styles.contentContainer}>
          <p className={styles.connectStravaLabel}>
            To get started, log in with Strava
          </p>
          <a href="http://localhost:8080/oauth-login" className="link">
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

  const fetchActivities = async () => {
    const rawActivities = await activityApi.getActivities();

    let bounds: mapboxgl.LngLatBounds | null = null;
    const mappedActivities = rawActivities.map((a) => {
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

    mappedActivities.forEach((a) => {
      map?.on("load", () => console.log("loading"));
      console.log("adding " + a.name);

      console.log(a.map.points);
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
      console.log(map?.getLayer(a.id.toString()));
      map?.on("click", a.id.toString(), () => {
        console.log(`Click on route: ${a.name}`);
      });
    });

    if (bounds) {
      map?.fitBounds(bounds, {
        padding: 30,
      });
    }

    setActivities(mappedActivities);
  };

  return (
    <div className={styles.container}>
      <h1>
        Strava Map<span className="accentFont">.</span>
      </h1>
      <p className={styles.subheader}>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo, cum
        commodi veritatis eveniet id qui saepe dolore eius architecto.
      </p>

      <div className={styles.contentContainer}>
        {activities.length == 0 ? (
          <div onClick={fetchActivities}>Load</div>
        ) : (
          activities.map((a) => (
            <p>
              {a.name} - {Math.round(a.distance / 1000)}km
            </p>
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
