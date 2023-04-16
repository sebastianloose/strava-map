import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

import styles from "./MapPage.module.scss";
import "mapbox-gl/dist/mapbox-gl.css";
import Sidebar from "./components/Sidebar";
import MapService from "./service/map";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const mapStyles = [
  "mapbox://styles/mapbox/outdoors-v12",
  "mapbox://styles/mapbox/dark-v11",
  "mapbox://styles/mapbox/satellite-streets-v12",
];

const MapPage = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  let mapStyleIndex = 0;

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
          M
        </div>
      </div>
    </div>
  );
};

export default MapPage;
