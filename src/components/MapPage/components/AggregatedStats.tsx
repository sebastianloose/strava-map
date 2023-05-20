import StatsItem from "./StatsItem";
import {
  faArrowTrendUp,
  faArrowsLeftRight,
  faStopwatch,
} from "@fortawesome/free-solid-svg-icons";
import Activity from "../../../types/ActivitySummary";
import styles from "./AggregatedStats.module.scss";

interface AggregatedStatsProps {
  activities: Activity[];
}

const AggregatedStats = ({ activities }: AggregatedStatsProps) => {
  const distance = Math.round(
    activities.reduce((sum, { distance }) => sum + distance, 0) / 1000
  );

  const elevation = activities.reduce(
    (sum, { total_elevation_gain }) => sum + total_elevation_gain,
    0
  );

  const getTime = () => {
    const seconds = activities.reduce(
      (sum, { elapsed_time }) => sum + elapsed_time,
      0
    );

    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);

    const formattedHours = `0${hours}`.slice(-2);
    const formattedMinutes = `0${minutes}`.slice(-2);

    return `${days}d ${formattedHours}:${formattedMinutes}`;
  };

  return (
    <div className={styles.container}>
      <p className={styles.title}></p>
      <div className={styles.row}>
        <StatsItem icon={faStopwatch} label={`${getTime()}`} />
        <StatsItem icon={faArrowsLeftRight} label={`${distance} km`} />
        <StatsItem icon={faArrowTrendUp} label={`${elevation} m`} />
      </div>
    </div>
  );
};

export default AggregatedStats;
