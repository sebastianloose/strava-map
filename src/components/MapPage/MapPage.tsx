import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

import styles from "./MapPage.module.scss";
import "mapbox-gl/dist/mapbox-gl.css";
import Sidebar from "./components/Sidebar";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const MapPage = () => {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapContainer == null) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [11.5755, 48.1372],
      zoom: 2,
    });

    map.on("load", () => {
      map.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.terrain-rgb",
      });

      map.setTerrain({
        source: "mapbox-dem",
        exaggeration: 1.5,
      });

      map.setPadding({
        left: 350,
        top: 0,
        bottom: 0,
        right: 0,
      });
    });
  }, [mapContainer.current]);

  return (
    <div className={styles.mapContainer} ref={mapContainer}>
      <Sidebar />
    </div>
  );
};

export default MapPage;
