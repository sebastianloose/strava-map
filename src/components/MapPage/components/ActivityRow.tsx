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
  faPersonRunning,
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

interface ActivityRowProps {
  activity: Activity;
  focused: boolean;
  onClick: () => void;
}

const ActivityRow = ({ activity, onClick }: ActivityRowProps) => {
  const getActivityIcon = (activityType: string) => {
    let icon;
    switch (activityType) {
      case "Ride":
        icon = faPersonBiking;
        break;
      case "Run":
        icon = faPersonRunning;
        break;
      default:
        icon = faPerson;
    }
    return <FontAwesomeIcon icon={icon} />;
  };

  return (
    <div className={styles.container} onClick={onClick}>
      <div className={styles.iconContainer}>
        {getActivityIcon(activity.type)}
      </div>
      <div>
        <p className={styles.title}>{activity.name}</p>
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
