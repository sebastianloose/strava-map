import {
  IconDefinition,
  faPerson,
  faPersonBiking,
  faPersonHiking,
  faPersonRunning,
  faPersonSkiing,
  faPersonSnowboarding,
  faSailboat,
} from "@fortawesome/free-solid-svg-icons";

const getActivityTypeIcon = (type: string) => {
  const icons: { [key: string]: IconDefinition } = {
    Ride: faPersonBiking,
    Run: faPersonRunning,
    Hike: faPersonHiking,
    Rowing: faSailboat,
    Snowboard: faPersonSnowboarding,
    Ski: faPersonSkiing,
  };
  return icons[type] || faPerson;
};

export default { getActivityTypeIcon };
