import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

export default interface ActivityFilter {
  icon: IconDefinition;
  type: string;
  active: boolean;
}
