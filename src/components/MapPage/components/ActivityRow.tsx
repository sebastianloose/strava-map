import styles from "./ActivityRow.module.scss";
import Activity from "../../../types/Activity";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  IconDefinition,
  faArrowTrendUp,
  faArrowsLeftRight,
  faBolt,
  faPerson,
  faPersonBiking,
  faPersonHiking,
  faPersonRunning,
  faPersonSkiing,
  faPersonSnowboarding,
  faSailboat,
  faStopwatch,
} from "@fortawesome/free-solid-svg-icons";

interface StatsItemProps {
  icon: IconDefinition;
  label: string;
}

const StatsItem = ({ icon, label }: StatsItemProps) => {
  return (
    <div className={styles.statsItem}>
      <FontAwesomeIcon icon={icon} className={styles.statsIcon} />
      <p>{label}</p>
    </div>
  );
};

const getActivityIcon = (activityType: string) => {
  const icons: { [key: string]: IconDefinition } = {
    Ride: faPersonBiking,
    Run: faPersonRunning,
    Hike: faPersonHiking,
    Rowing: faSailboat,
    Snowboard: faPersonSnowboarding,
    Ski: faPersonSkiing,
  };
  const icon = icons[activityType] || faPerson;
  return <FontAwesomeIcon icon={icon} />;
};

interface ActivityRowProps {
  activity: Activity;
  focused: boolean;
  onClick: () => void;
}

const ActivityRow = ({ activity, focused, onClick }: ActivityRowProps) => {
  const getFormattedDate = (date: string) => {
    const d = new Date(Date.parse(date));
    const day = `0${d.getDate()}`.slice(-2);
    const month = `0${d.getMonth() + 1}`.slice(-2);
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  };

  return (
    <div
      className={focused ? styles.containerActive : styles.container}
      onClick={onClick}
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
