import styles from "./FilterSetting.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ActivityFilter from "../../../types/ActivityFilter";

interface ActivityItemProps {
  item: ActivityFilter;
  onClick: () => void;
}

const ActivityItem = ({ item, onClick }: ActivityItemProps) => {
  return (
    <div
      className={[
        styles.activityItem,
        item.active ? "" : styles.activityItemPassiv,
      ].join(" ")}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={item.icon} className={styles.icon} />
      <p>{item.type}</p>
    </div>
  );
};

interface FilterSettingProps {
  filter: ActivityFilter[];
  setFilter: (activities: ActivityFilter[]) => void;
}

const FilterSetting = ({ filter, setFilter }: FilterSettingProps) => {
  const updateFilter = (item: ActivityFilter) => {
    item.active = !item.active;
    setFilter([...filter]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleRow}>
        <p className={styles.title}></p>
      </div>
      <div className={styles.contentRow}>
        {filter.map((item) => (
          <ActivityItem item={item} onClick={() => updateFilter(item)} />
        ))}
      </div>
    </div>
  );
};

export default FilterSetting;
