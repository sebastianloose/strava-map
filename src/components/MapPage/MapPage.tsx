import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

import styles from "./MapPage.module.scss";
import "mapbox-gl/dist/mapbox-gl.css";
import Sidebar from "./components/Sidebar";
import MapService from "./service/map";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMap, faMountain } from "@fortawesome/free-solid-svg-icons";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const mapStyles = [
  "mapbox://styles/mapbox/outdoors-v12",
  "mapbox://styles/mapbox/dark-v11",
  "mapbox://styles/mapbox/satellite-streets-v12",
];

const cameraPitches = [0, 45, 60];

const MapPage = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  let mapStyleIndex = 0;
  let cameraPitchIndex = 0;

  useEffect(() => {
    if (mapContainer == null) return;
    MapService.initializeMap(mapContainer);
  }, [mapContainer.current]);

  return (
    <div className={styles.mapContainer} ref={mapContainer}>
      <Sidebar />
      <div className={styles.controlRow}>
        <div
          className={styles.controlBox}
          onClick={() => {
            mapStyleIndex = (mapStyleIndex + 1) % mapStyles.length;
            MapService.setMapStyle(mapStyles[mapStyleIndex]);
          }}
        >
          <FontAwesomeIcon icon={faMap} className={styles.icon} />
        </div>
        <div
          className={styles.controlBox}
          onClick={() => {
            cameraPitchIndex = (cameraPitchIndex + 1) % cameraPitches.length;
            MapService.setCameraPitch(cameraPitches[cameraPitchIndex]);
          }}
        >
          <FontAwesomeIcon icon={faMountain} className={styles.icon} />
        </div>
      </div>
    </div>
  );
};

export default MapPage;
