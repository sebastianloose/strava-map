import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

import styles from "./MapPage.module.scss";
import "mapbox-gl/dist/mapbox-gl.css";
import Sidebar from "./components/Sidebar";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const MapPage = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>();

  useEffect(() => {
    if (mapContainer == null) return;

    const mapBox = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [11.5755, 48.1372],
      zoom: 2,
    });

    mapBox.on("load", () => {
      map?.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.terrain-rgb",
      });

      mapBox.setTerrain({
        source: "mapbox-dem",
        exaggeration: 1.5,
      });

      mapBox.setPadding({
        left: 350,
        top: 0,
        bottom: 0,
        right: 0,
      });
    });

    setMap(mapBox);
  }, [mapContainer.current]);

  return (
    <div className={styles.mapContainer} ref={mapContainer}>
      <Sidebar map={map} />
      <div className={styles.controlRow}>
        <div
          className={styles.controlBox}
          onClick={() => map?.setStyle("mapbox://styles/mapbox/dark-v11")}
        >
          M
        </div>
      </div>
    </div>
  );
};

export default MapPage;
