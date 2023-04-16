import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./StatsItem.module.scss";

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

export default StatsItem;
