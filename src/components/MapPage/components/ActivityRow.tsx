import { useEffect, useRef } from "react";
import StatsItem from "./StatsItem";
import styles from "./ActivityRow.module.scss";
import Activity from "../../../types/ActivitySummary";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowTrendUp,
  faArrowsLeftRight,
  faBolt,
  faStopwatch,
} from "@fortawesome/free-solid-svg-icons";
import ActivityService from "../service/activity";

const getActivityIcon = (activityType: string) => {
  return (
    <FontAwesomeIcon icon={ActivityService.getActivityTypeIcon(activityType)} />
  );
};

const getFormattedDate = (date: string) => {
  const d = new Date(Date.parse(date));
  const day = `0${d.getDate()}`.slice(-2);
  const month = `0${d.getMonth() + 1}`.slice(-2);
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
};

interface ActivityRowProps {
  activity: Activity;
  focused: boolean;
  onClick: () => void;
}

const ActivityRow = ({ activity, focused, onClick }: ActivityRowProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (focused && ref) {
      ref.current!.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [focused]);

  return (
    <div
      className={focused ? styles.containerActive : styles.container}
      onClick={onClick}
      ref={ref}
    >
      <div className={styles.iconContainer}>
        {getActivityIcon(activity.type)}
      </div>
      <div className={styles.contentColumn}>
        <div className={styles.titleRow}>
          <p className={styles.title}>{activity.name}</p>
          <p>{getFormattedDate(activity.start_date)}</p>
        </div>
        <div className={styles.statsRow}>
          <StatsItem
            icon={faStopwatch}
            label={new Date(activity.elapsed_time * 1000)
              .toISOString()
              .substring(11, 16)}
          />
          <StatsItem
            icon={faArrowsLeftRight}
            label={`${Math.round(activity.distance / 10) / 100} km`}
          />
          <StatsItem
            icon={faArrowTrendUp}
            label={`${activity.total_elevation_gain} m`}
          />
          <StatsItem icon={faBolt} label={`${activity.average_watts} W`} />
        </div>
      </div>
    </div>
  );
};

export default ActivityRow;
