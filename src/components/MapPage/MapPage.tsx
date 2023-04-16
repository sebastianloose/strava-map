import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

import styles from "./MapPage.module.scss";
import "mapbox-gl/dist/mapbox-gl.css";
import Sidebar from "./components/Sidebar";
import MapService from "./service/map";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const MapPage = () => {
  const mapContainer = useRef<HTMLDivElement>(null);

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
          onClick={() =>
            //  map?.setStyle("mapbox://styles/mapbox/dark-v11")
            console.log("toggle")
          }
        >
          M
        </div>
      </div>
    </div>
  );
};

export default MapPage;
